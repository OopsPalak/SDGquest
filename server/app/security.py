import re
from functools import wraps

from flask import current_app, g, jsonify, request
from supabase import create_client


EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
ROLES = {"student", "teacher", "parent"}
AVATAR_VALUES = {
    "icon": {"👧", "👦", "🧒", "🧑", "🦸"},
    "skin": {"#FFD1A4", "#FFDBAC", "#E0A899", "#9F685B", "#5A3D31"},
    "expression": {"happy", "grin", "wink", "curious"},
    "hairStyle": {"short_curly", "spiky", "ponytail", "wavy", "cap_bangs"},
    "hairColor": {"#2C1A1D", "#6A381F", "#D4A373", "#A83220", "#1B4965"},
    "outfit": {"eco_tee", "water_hoodie", "forest_vest", "solar_jacket", "climate_coat"},
    "accessory": {"none", "eco_backpack", "round_glasses", "cool_shades"},
    "sdgItem": {"none", "water_flask", "nature_sprout", "solar_compass", "recycle_badge"},
}


def validate_email(email):
    return isinstance(email, str) and len(email) <= 254 and EMAIL_PATTERN.fullmatch(email) is not None


def validate_password(password):
    return (
        isinstance(password, str)
        and 8 <= len(password) <= 128
        and re.search(r"[A-Z]", password)
        and re.search(r"[a-z]", password)
        and re.search(r"\d", password)
    )


def validate_avatar(avatar):
    return (
        isinstance(avatar, dict)
        and len(avatar) <= len(AVATAR_VALUES)
        and all(
            isinstance(key, str)
            and key in AVATAR_VALUES
            and isinstance(value, str)
            and value in AVATAR_VALUES[key]
            for key, value in avatar.items()
        )
    )


def get_supabase(admin=False, isolated_auth=False):
    key_name = "SUPABASE_SERVICE_ROLE_KEY" if admin else "SUPABASE_ANON_KEY"
    key = current_app.config.get(key_name)
    url = current_app.config.get("SUPABASE_URL")
    if not url or not key:
        raise RuntimeError("Supabase server configuration is incomplete")
    if isolated_auth:
        return create_client(url, key)
    extension_key = "supabase_admin" if admin else "supabase_anon"
    client = current_app.extensions.get(extension_key)
    if client is None:
        client = create_client(url, key)
        current_app.extensions[extension_key] = client
    return client


def audit_event(actor_id, action, details=None):
    try:
        get_supabase(admin=True).table("audit_logs").insert({
            "actor_id": actor_id,
            "action": action,
            "details": details or {},
        }).execute()
    except Exception:
        current_app.logger.warning("Audit event could not be persisted: %s", action)


def authenticated(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        header = request.headers.get("Authorization", "")
        scheme, _, token = header.partition(" ")
        if scheme.lower() != "bearer" or not token or len(token) > 8192:
            return jsonify({"error": "Authentication required."}), 401

        try:
            user = get_supabase().auth.get_user(token).user
            if not user or not user.email_confirmed_at:
                return jsonify({"error": "Please verify your email before continuing."}), 403
            profile = (
                get_supabase(admin=True)
                .table("profiles")
                .select("id, name, full_name, email, role, grade, class_name, avatar, xp, level, streak")
                .eq("id", user.id)
                .maybe_single()
                .execute()
                .data
            )
            if not profile or profile.get("role") not in ROLES:
                return jsonify({"error": "Account profile is unavailable."}), 403
        except Exception:
            return jsonify({"error": "Invalid or expired access token."}), 401

        g.user = user
        g.profile = profile
        g.access_token = token
        return view(*args, **kwargs)

    return wrapped


def roles_required(*allowed_roles):
    def decorator(view):
        @wraps(view)
        @authenticated
        def wrapped(*args, **kwargs):
            if g.profile["role"] not in allowed_roles:
                return jsonify({"error": "You do not have permission to access this resource."}), 403
            return view(*args, **kwargs)

        return wrapped

    return decorator


def resource_error(error):
    current_app.logger.warning("Supabase resource operation failed: %s", type(error).__name__)
    if getattr(error, "code", None) == "23505":
        return jsonify({"error": "A matching record already exists."}), 409
    return jsonify({"error": "The requested operation could not be completed."}), 500