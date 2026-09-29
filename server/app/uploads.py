import hashlib
import io
import json
import os
import uuid
from pathlib import PurePath

import imagehash
import requests
from flask import Blueprint, current_app, g, jsonify, request
from PIL import Image, UnidentifiedImageError

from . import limiter
from .image_authenticity import ImageAuthenticityService
from .security import audit_event, get_supabase, resource_error, roles_required


uploads_bp = Blueprint("uploads", __name__)
ALLOWED_IMAGE_FORMATS = {"JPEG": "image/jpeg", "PNG": "image/png", "WEBP": "image/webp"}
ALLOWED_FRAMES = {"none", "water", "forest", "sun", "earth"}
ALLOWED_STICKERS = {"💧", "🐟", "🦋", "♻️", "🌍", "☀️", "❤️", "⭐", "🌱", "🌳"}
MAX_IMAGE_BYTES = 6 * 1024 * 1024
MAX_IMAGE_PIXELS = 20_000_000
IMAGE_EXTENSIONS = {"JPEG": {".jpg", ".jpeg"}, "PNG": {".png"}, "WEBP": {".webp"}}


def normalize_image(image_bytes):
    try:
        with Image.open(io.BytesIO(image_bytes)) as image:
            image.verify()
        with Image.open(io.BytesIO(image_bytes)) as image:
            if image.format not in ALLOWED_IMAGE_FORMATS or image.width * image.height > MAX_IMAGE_PIXELS:
                raise ValueError("Unsupported image format or dimensions.")
            original_format = image.format
            dimensions = {"width": image.width, "height": image.height}
            metadata_present = bool(image.info or image.getexif())
            image.load()
            normalized = image.convert("RGB") if original_format == "JPEG" else image.copy()
            output = io.BytesIO()
            normalized.save(output, format=original_format, optimize=True)
            clean_bytes = output.getvalue()
            perceptual_hash = str(imagehash.phash(normalized))
    except (UnidentifiedImageError, OSError, Image.DecompressionBombError) as error:
        raise ValueError("The uploaded file is not a valid supported image.") from error
    return clean_bytes, original_format, dimensions, metadata_present, perceptual_hash


def image_metadata_matches(filename, mimetype, image_format):
    extension = PurePath(filename or "").suffix.lower()
    return extension in IMAGE_EXTENSIONS[image_format] and mimetype == ALLOWED_IMAGE_FORMATS[image_format]


def _screen_image(image_bytes, content_hash, perceptual_hash):
    signals = {"content_sha256": content_hash, "perceptual_hash": perceptual_hash, "malware_scan": "not_configured"}
    duplicate = False
    admin = get_supabase(admin=True)
    duplicates = admin.table("submissions").select("id, perceptual_hash").eq("content_sha256", content_hash).limit(1).execute().data or []
    if duplicates:
        duplicate = True
        signals["exact_duplicate"] = True
    else:
        previous = admin.table("submissions").select("id, perceptual_hash").not_.is_("perceptual_hash", "null").limit(500).execute().data or []
        for submission in previous:
            try:
                if (int(perceptual_hash, 16) ^ int(submission["perceptual_hash"], 16)).bit_count() <= 5:
                    duplicate = True
                    signals["near_duplicate_submission_id"] = submission["id"]
                    break
            except (TypeError, ValueError):
                continue

    malware_url = current_app.config.get("MALWARE_SCAN_API_URL") or os.getenv("MALWARE_SCAN_API_URL")
    if malware_url:
        response = requests.post(malware_url, files={"file": ("evidence", image_bytes)}, timeout=10)
        if response.status_code != 200 or response.json().get("clean") is not True:
            raise ValueError("Image did not pass the security scan.")
        signals["malware_scan"] = "clean"

    authenticity = ImageAuthenticityService().analyze(image_bytes, duplicate=duplicate)
    signals["authenticity"] = authenticity
    return signals, authenticity["status"]


@uploads_bp.post("/submissions")
@uploads_bp.post("/uploads")
@uploads_bp.post("/missions/<mission_id>/submit")
@limiter.limit("10 per hour")
@roles_required("student")
def create_submission(mission_id=None):
    upload = request.files.get("evidence")
    form_mission_id = request.form.get("missionId", "")
    if mission_id and form_mission_id and mission_id != form_mission_id:
        return jsonify({"error": "Mission identifier does not match the route."}), 400
    mission_id = mission_id or form_mission_id
    submission_type = request.form.get("type", "photo")
    caption = request.form.get("caption", "").strip()
    frame = request.form.get("frame", "water")
    try:
        stickers = json.loads(request.form.get("stickers", "[]"))
    except json.JSONDecodeError:
        return jsonify({"error": "Invalid submission presentation."}), 400
    if submission_type not in {"photo", "drawing", "text"} or not mission_id or len(mission_id) > 80 or len(caption) > 2000:
        return jsonify({"error": "A mission and valid evidence are required."}), 400
    if not isinstance(frame, str) or frame not in ALLOWED_FRAMES or not isinstance(stickers, list) or len(stickers) > 5 or any(not isinstance(sticker, str) or sticker not in ALLOWED_STICKERS for sticker in stickers):
        return jsonify({"error": "Invalid submission presentation."}), 400
    if not upload and (submission_type != "text" or not caption):
        return jsonify({"error": "This submission requires an image or written reflection."}), 400
    try:
        mission = get_supabase(admin=True).table("missions").select("id, class_id").eq("id", mission_id).eq("is_published", True).maybe_single().execute().data
        if not mission:
            return jsonify({"error": "Mission not found."}), 404
        if mission["class_id"]:
            assigned = get_supabase(admin=True).table("class_students").select("student_id").eq("class_id", mission["class_id"]).eq("student_id", g.user.id).maybe_single().execute().data
            if not assigned:
                return jsonify({"error": "Mission not found."}), 404
    except Exception as error:
        return resource_error(error)
    if not upload:
        try:
            saved = get_supabase(admin=True).table("submissions").insert({
                "student_id": g.user.id,
                "mission_id": mission_id,
                "caption": caption,
                "status": "pending",
                "presentation": {"frame": frame, "stickers": stickers},
            }).execute().data[0]
            audit_event(g.user.id, "mission_submission_created", {"submission_id": saved["id"], "type": "text"})
            return jsonify({"id": saved["id"], "status": "pending"}), 201
        except Exception as error:
            return resource_error(error)
    image_bytes = upload.stream.read(MAX_IMAGE_BYTES + 1)
    if not image_bytes or len(image_bytes) > MAX_IMAGE_BYTES:
        return jsonify({"error": "Image must be smaller than 6 MB."}), 413
    try:
        clean_bytes, original_format, dimensions, metadata_present, perceptual_hash = normalize_image(image_bytes)
    except ValueError:
        return jsonify({"error": "Only valid JPEG, PNG, or WebP images up to 20 megapixels are allowed."}), 400
    if not image_metadata_matches(upload.filename, upload.mimetype, original_format):
        return jsonify({"error": "Image extension and MIME type must match the decoded image format."}), 400

    content_hash = hashlib.sha256(clean_bytes).hexdigest()
    try:
        signals, review_status = _screen_image(clean_bytes, content_hash, perceptual_hash)
        signals["dimensions"] = dimensions
        signals["metadata_present"] = metadata_present
        signals["metadata_removed"] = True
        extension = {"JPEG": "jpg", "PNG": "png", "WEBP": "webp"}[original_format]
        storage_path = f"{g.user.id}/{uuid.uuid4().hex}.{extension}"
        admin = get_supabase(admin=True)
        admin.storage.from_("mission-evidence").upload(
            storage_path,
            clean_bytes,
            {"content-type": ALLOWED_IMAGE_FORMATS[original_format], "upsert": "false"},
        )
        status = review_status
        try:
            saved = admin.table("submissions").insert({
                "student_id": g.user.id,
                "mission_id": mission_id,
                "submission_type": submission_type,
                "presentation": {"frame": frame, "stickers": stickers},
                "evidence_path": storage_path,
                "caption": caption,
                "status": status,
                "content_sha256": content_hash,
                "perceptual_hash": perceptual_hash,
                "image_screening": signals,
            }).execute().data[0]
        except Exception:
            admin.storage.from_("mission-evidence").remove([storage_path])
            raise
        audit_event(g.user.id, "mission_submission_uploaded", {"submission_id": saved["id"], "status": status})
        return jsonify({"id": saved["id"], "status": status, "screening": signals}), 201
    except requests.RequestException:
        return jsonify({"error": "Image screening is temporarily unavailable."}), 503
    except Exception as error:
        return resource_error(error)


@uploads_bp.get("/submissions/<submission_id>/evidence-url")
@roles_required("student", "teacher", "parent")
def get_evidence_url(submission_id):
    try:
        admin = get_supabase(admin=True)
        submission = admin.table("submissions").select("id, student_id, evidence_path").eq("id", submission_id).maybe_single().execute().data
        if not submission:
            return jsonify({"error": "Submission not found."}), 404
        allowed = submission["student_id"] == g.user.id
        if g.profile["role"] == "teacher":
            verified = admin.table("profiles").select("id").eq("id", submission["student_id"]).eq("email_verified", True).maybe_single().execute().data
            memberships = admin.table("class_students").select("class_id").eq("student_id", submission["student_id"]).execute().data or []
            class_ids = [item["class_id"] for item in memberships]
            allowed = bool(verified and class_ids and admin.table("classes").select("id").eq("teacher_id", g.user.id).in_("id", class_ids).execute().data)
        elif g.profile["role"] == "parent":
            link = admin.table("parent_child_links").select("student_id").eq("parent_id", g.user.id).eq("student_id", submission["student_id"]).maybe_single().execute().data
            verified = admin.table("profiles").select("id").eq("id", submission["student_id"]).eq("email_verified", True).maybe_single().execute().data
            allowed = bool(link and verified)
        if not allowed:
            return jsonify({"error": "Submission not found."}), 404
        signed = admin.storage.from_("mission-evidence").create_signed_url(submission["evidence_path"], 120)
        return jsonify({"url": signed["signedURL"], "expiresIn": 120})
    except Exception as error:
        return resource_error(error)