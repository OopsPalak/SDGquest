import hashlib

from flask import Blueprint, current_app, jsonify, request

from . import limiter
from .security import audit_event, get_supabase, validate_avatar, validate_email, validate_password


auth_bp = Blueprint("auth", __name__)
ALLOWED_ROLES = {"student", "teacher", "parent"}


def _json_body():
    body = request.get_json(silent=True)
    return body if isinstance(body, dict) else {}


def _profile_fields(body, role):
    name = body.get("name", "").strip() if isinstance(body.get("name"), str) else ""
    if not 1 <= len(name) <= 100:
        raise ValueError("Enter a name between 1 and 100 characters.")
    profile = {"name": name, "role": role}
    if role == "student":
        grade = body.get("grade")
        if not isinstance(grade, str) or grade not in {"Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5"}:
            raise ValueError("Choose a valid grade.")
        profile["grade"] = grade
        avatar = body.get("avatar", {})
        if not validate_avatar(avatar) or set(avatar) - {"icon"}:
            raise ValueError("Choose a valid avatar.")
        profile["avatar"] = avatar
        class_invite = body.get("classInviteCode", "").strip() if isinstance(body.get("classInviteCode"), str) else ""
        if class_invite and not 8 <= len(class_invite) <= 80:
            raise ValueError("Enter a valid classroom invitation code.")
        if class_invite:
            profile["_class_invite_code"] = class_invite
    elif role == "teacher":
        class_name = body.get("className", "").strip() if isinstance(body.get("className"), str) else ""
        if not 1 <= len(class_name) <= 120:
            raise ValueError("Enter a valid class name.")
        teacher_invite = body.get("teacherInviteCode", "").strip() if isinstance(body.get("teacherInviteCode"), str) else ""
        if not 16 <= len(teacher_invite) <= 128:
            raise ValueError("A valid teacher invitation code is required.")
        profile["class_name"] = class_name
        profile["_teacher_invite_code"] = teacher_invite
    else:
        invite_code = body.get("childInviteCode", "").strip() if isinstance(body.get("childInviteCode"), str) else ""
        if not 8 <= len(invite_code) <= 80:
            raise ValueError("A valid child invitation code is required to link an account.")
        profile["_child_invite_code"] = invite_code
    return profile


@auth_bp.post("/register")
@limiter.limit("5 per hour")
def register():
    body = _json_body()
    email = body.get("email", "").strip().lower() if isinstance(body.get("email"), str) else ""
    password = body.get("password")
    role = body.get("role")
    if not validate_email(email):
        return jsonify({"error": "Enter a valid email address."}), 400
    if not validate_password(password):
        return jsonify({"error": "Password must be at least 8 characters with uppercase, lowercase, and a number."}), 400
    if not isinstance(role, str) or role not in ALLOWED_ROLES:
        return jsonify({"error": "Choose a valid account role."}), 400
    created_user_id = None
    try:
        profile = _profile_fields(body, role)
    except ValueError as error:
        return jsonify({"error": str(error)}), 400

    try:
        invite_code = profile.pop("_child_invite_code", None)
        class_invite_code = profile.pop("_class_invite_code", None)
        teacher_invite_code = profile.pop("_teacher_invite_code", None)
        profile["full_name"] = profile["name"]
        profile["email"] = email
        admin = get_supabase(admin=True) if invite_code else None
        if invite_code:
            child = admin.table("profiles").select("id").eq("child_invite_code", invite_code).eq("role", "student").maybe_single().execute().data
            if not child:
                return jsonify({"error": "The invitation code is not valid."}), 400
        if class_invite_code:
            admin = get_supabase(admin=True)
            classroom = admin.table("classes").select("id").eq("invite_code", class_invite_code).maybe_single().execute().data
            if not classroom:
                return jsonify({"error": "The classroom invitation code is not valid."}), 400
        if teacher_invite_code:
            admin = get_supabase(admin=True)
            consumed = admin.rpc("consume_teacher_invite", {
                "invite_code_hash": hashlib.sha256(teacher_invite_code.encode("utf-8")).hexdigest(),
            }).execute().data
            if consumed is not True:
                return jsonify({"error": "The teacher invitation code is invalid or already used."}), 403
        response = get_supabase(isolated_auth=True).auth.sign_up({
            "email": email,
            "password": password,
            "options": {"data": {"name": profile["name"]}},
        })
        user = response.user
        identities = getattr(user, "identities", None) if user else None
        if not user or identities == []:
            return jsonify({"message": "If the account can be created, check your email for a verification link."}), 201
        created_user_id = user.id
        if user:
            profile["id"] = user.id
            get_supabase(admin=True).table("profiles").upsert(profile, on_conflict="id").execute()
            if invite_code:
                admin.table("parent_child_links").insert({"parent_id": user.id, "student_id": child["id"]}).execute()
            if class_invite_code:
                admin.table("class_students").insert({"class_id": classroom["id"], "student_id": user.id}).execute()
            if role == "teacher":
                admin = get_supabase(admin=True)
                admin.table("classes").insert({"teacher_id": user.id, "name": profile["class_name"]}).execute()
            audit_event(user.id, "account_registered", {"role": role})
        return jsonify({"message": "Check your email for a verification link."}), 201
    except Exception:
        if created_user_id:
            try:
                get_supabase(admin=True).auth.admin.delete_user(created_user_id)
            except Exception:
                current_app.logger.warning("Registration cleanup failed")
        current_app.logger.info("Registration failed")
        return jsonify({"error": "Unable to create the account. Check the details or try again later."}), 400


@auth_bp.post("/login")
@limiter.limit("10 per minute")
def login():
    body = _json_body()
    email = body.get("email", "").strip().lower() if isinstance(body.get("email"), str) else ""
    password = body.get("password")
    requested_role = body.get("role")
    if not validate_email(email) or not isinstance(password, str) or not password:
        audit_event(None, "login_failed", {"reason": "invalid_input"})
        return jsonify({"error": "Invalid email or password."}), 400
    try:
        response = get_supabase(isolated_auth=True).auth.sign_in_with_password({"email": email, "password": password})
        user = response.user
        if not user or not user.email_confirmed_at:
            audit_event(user.id if user else None, "login_unverified")
            return jsonify({"error": "Please verify your email before continuing."}), 403
        profile = (
            get_supabase(admin=True).table("profiles")
            .select("id, name, full_name, email, role, grade, class_name, avatar, xp, level, streak")
            .eq("id", user.id).maybe_single().execute().data
        )
        if not profile:
            return jsonify({"error": "Account profile is unavailable."}), 403
        if isinstance(requested_role, str) and requested_role in ALLOWED_ROLES and profile["role"] != requested_role:
            return jsonify({"error": "This account does not have the selected role."}), 403
        session = response.session
        if not session:
            return jsonify({"error": "Unable to establish a session."}), 401
        audit_event(user.id, "login")
        return jsonify({
            "session": {
                "access_token": session.access_token,
                "refresh_token": session.refresh_token,
                "token_type": session.token_type,
                "expires_in": session.expires_in,
                "expires_at": session.expires_at,
            },
            "profile": profile,
        })
    except Exception as error:
        error_code = getattr(error, "code", "")
        if error_code == "email_not_confirmed" or "email not confirmed" in str(error).lower():
            audit_event(None, "login_unverified")
            return jsonify({"error": "Please verify your email before continuing."}), 403
        audit_event(None, "login_failed", {"reason": "invalid_credentials"})
        return jsonify({"error": "Invalid email or password."}), 401


@auth_bp.post("/resend-verification")
@limiter.limit("3 per hour")
def resend_verification():
    body = _json_body()
    email = body.get("email", "").strip().lower() if isinstance(body.get("email"), str) else ""
    if not validate_email(email):
        return jsonify({"error": "Enter a valid email address."}), 400
    audit_event(None, "verification_resend_requested")
    try:
        get_supabase(isolated_auth=True).auth.resend({"type": "signup", "email": email})
    except Exception:
        current_app.logger.info("Verification resend request failed")
    return jsonify({"message": "If the account needs verification, a new email has been sent."})


@auth_bp.post("/forgot-password")
@auth_bp.post("/password-reset")
@limiter.limit("3 per hour")
def password_reset():
    body = _json_body()
    email = body.get("email", "").strip().lower() if isinstance(body.get("email"), str) else ""
    if not validate_email(email):
        return jsonify({"error": "Enter a valid email address."}), 400
    audit_event(None, "password_reset_requested")
    try:
        get_supabase(isolated_auth=True).auth.reset_password_email(email, {
            "redirect_to": current_app.config["FRONTEND_URL"],
        })
    except Exception:
        current_app.logger.info("Password reset request failed")
    return jsonify({"message": "If an account exists, password reset instructions have been sent."})