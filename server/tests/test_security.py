import io
from types import SimpleNamespace

import pytest
from PIL import Image

from server.app import create_app
from server.app import security
from server.app import resources
from server.app.auth import _profile_fields
from server.app.image_authenticity import ImageAuthenticityService
from server.app.security import validate_avatar, validate_email, validate_password
from server.app.uploads import image_metadata_matches, normalize_image


def test_email_and_password_validation():
    assert validate_email("student@example.org")
    assert not validate_email("person@gmail")
    assert not validate_email("not an email")
    assert validate_password("EcoQuest9")
    assert not validate_password("ecoquest9")
    assert not validate_password("ECOQUEST")
    assert not validate_password("Eco9")


def test_private_api_requires_bearer_token():
    app = create_app({"TESTING": True})
    response = app.test_client().get("/api/profile")
    assert response.status_code == 401


def test_role_route_does_not_accept_missing_token():
    app = create_app({"TESTING": True})
    response = app.test_client().get("/api/teacher")
    assert response.status_code == 401


class FakeQuery:
    def __init__(self, result):
        self.result = result
        self.filters = {}

    def select(self, *_args):
        return self

    def eq(self, *_args):
        self.filters[_args[0]] = _args[1]
        return self

    def maybe_single(self):
        return self

    def execute(self):
        if isinstance(self.result, dict) and any(self.result.get(key) != value for key, value in self.filters.items()):
            return SimpleNamespace(data=None)
        return SimpleNamespace(data=self.result)


class FakeAuth:
    def __init__(self, confirmed=True, valid=True):
        self.confirmed = confirmed
        self.valid = valid

    def get_user(self, _token):
        if not self.valid:
            raise ValueError("invalid token")
        user = SimpleNamespace(id="user-1", email_confirmed_at="confirmed" if self.confirmed else None)
        return SimpleNamespace(user=user)


class FakeClient:
    def __init__(self, profile, confirmed=True, valid=True):
        self.auth = FakeAuth(confirmed, valid)
        self.profile = profile

    def table(self, _table):
        result = self.profile if _table == "profiles" else []
        return FakeQuery(result)


@pytest.mark.parametrize(
    ("role", "confirmed", "valid", "expected"),
    [
        ("student", True, True, 403),
        ("teacher", True, True, 200),
        ("teacher", False, True, 403),
        ("teacher", True, False, 401),
    ],
)
def test_teacher_route_enforces_role_verification_and_token(monkeypatch, role, confirmed, valid, expected):
    app = create_app({"TESTING": True})
    profile = {"id": "user-1", "name": "Test User", "role": role}
    anon = FakeClient(profile, confirmed=confirmed, valid=valid)
    admin = FakeClient(profile)
    fake_factory = lambda admin=False, **_kwargs: admin_client if admin else anon
    monkeypatch.setattr(security, "get_supabase", fake_factory)
    monkeypatch.setattr(resources, "get_supabase", fake_factory)
    admin_client = admin
    response = app.test_client().get("/api/teacher", headers={"Authorization": "Bearer test-token"})
    assert response.status_code == expected


def test_image_decoder_accepts_png_and_rejects_forged_bytes():
    image = Image.new("RGB", (8, 8), color="green")
    encoded = io.BytesIO()
    image.save(encoded, format="PNG")
    clean, image_format, dimensions, _metadata, perceptual_hash = normalize_image(encoded.getvalue())
    assert clean.startswith(b"\x89PNG\r\n\x1a\n")
    assert image_format == "PNG"
    assert dimensions == {"width": 8, "height": 8}
    assert len(perceptual_hash) == 16
    with pytest.raises(ValueError):
        normalize_image(b"<script>alert(1)</script>")


def test_image_extension_and_mime_must_match_decoded_format():
    assert image_metadata_matches("drawing.png", "image/png", "PNG")
    assert image_metadata_matches("photo.jpeg", "image/jpeg", "JPEG")
    assert not image_metadata_matches("photo.exe", "image/png", "PNG")
    assert not image_metadata_matches("photo.png", "image/jpeg", "PNG")


def test_avatar_payload_is_allowlisted():
    assert validate_avatar({"skin": "#FFD1A4", "outfit": "eco_tee"})
    assert not validate_avatar({"skin": "url(javascript:alert(1))"})
    assert not validate_avatar({"role": "teacher"})


def test_teacher_registration_requires_invitation():
    with pytest.raises(ValueError, match="teacher invitation code"):
        _profile_fields({"name": "Teacher", "className": "Class 4A"}, "teacher")
    profile = _profile_fields({
        "name": "Teacher",
        "className": "Class 4A",
        "teacherInviteCode": "one-time-code-value",
    }, "teacher")
    assert profile["role"] == "teacher"
    assert profile["_teacher_invite_code"] == "one-time-code-value"


def test_image_authenticity_without_provider_requires_review():
    app = create_app({
        "TESTING": True,
        "IMAGE_SCREENING_API_URL": "",
        "IMAGE_SCREENING_API_KEY": "",
    })
    with app.app_context():
        result = ImageAuthenticityService().analyze(b"validated image bytes")
        duplicate = ImageAuthenticityService().analyze(b"validated image bytes", duplicate=True)
    assert result["status"] == "review_required"
    assert result["confidence"] is None
    assert duplicate["status"] == "suspicious"
    assert "matches a previous" in duplicate["reason"]


def test_teacher_self_registration_is_rejected_before_auth_creation():
    app = create_app({"TESTING": True})
    response = app.test_client().post("/api/auth/register", json={
        "email": "teacher@example.org",
        "password": "StrongPassword9",
        "role": "teacher",
        "name": "Teacher",
        "className": "Class 4A",
    })
    assert response.status_code == 400
    assert "invitation code" in response.json["error"]
    assert "password" not in response.get_data(as_text=True).lower()


def test_student_cannot_change_xp_or_approve_submission(monkeypatch):
    app = create_app({"TESTING": True})
    profile = {"id": "user-1", "name": "Student", "role": "student"}
    anon = FakeClient(profile)
    admin = FakeClient(profile)
    fake_factory = lambda admin=False, **_kwargs: admin_client if admin else anon
    monkeypatch.setattr(security, "get_supabase", fake_factory)
    monkeypatch.setattr(resources, "get_supabase", fake_factory)
    admin_client = admin
    client = app.test_client()
    headers = {"Authorization": "Bearer test-token"}
    changed = client.patch("/api/profile", headers=headers, json={"xp": 1000})
    approved = client.post("/api/submissions/sub-1/review", headers=headers, json={"status": "approved"})
    assert changed.status_code == 400
    assert approved.status_code == 403


def test_parent_cannot_access_unlinked_child(monkeypatch):
    app = create_app({"TESTING": True})
    profile = {"id": "user-1", "name": "Parent", "role": "parent"}
    anon = FakeClient(profile)
    admin = FakeClient(profile)
    fake_factory = lambda admin=False, **_kwargs: admin_client if admin else anon
    monkeypatch.setattr(security, "get_supabase", fake_factory)
    monkeypatch.setattr(resources, "get_supabase", fake_factory)
    admin_client = admin
    response = app.test_client().get(
        "/api/parent/children/other-student/progress",
        headers={"Authorization": "Bearer test-token"},
    )
    assert response.status_code == 404


def test_cors_is_limited_to_exact_frontend_origin():
    app = create_app({"TESTING": True, "FRONTEND_URL": "https://quest.example"})
    client = app.test_client()
    allowed = client.get("/api/health", headers={"Origin": "https://quest.example"})
    blocked = client.get("/api/health", headers={"Origin": "https://attacker.example"})
    assert allowed.headers["Access-Control-Allow-Origin"] == "https://quest.example"
    assert "Access-Control-Allow-Origin" not in blocked.headers
    assert blocked.headers["X-Content-Type-Options"] == "nosniff"


def test_wildcard_frontend_origin_is_rejected():
    with pytest.raises(ValueError, match="exact frontend origin"):
        create_app({"TESTING": True, "FRONTEND_URL": "*"})