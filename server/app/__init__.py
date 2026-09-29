import os
from urllib.parse import urlsplit

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    get_remote_address,
    default_limits=["300 per hour"],
)
load_dotenv()


def create_app(test_config=None):
    app = Flask(__name__)
    app.config.from_mapping(
        MAX_CONTENT_LENGTH=8 * 1024 * 1024,
        FRONTEND_URL=os.getenv("FRONTEND_URL", "http://localhost:5173"),
        SUPABASE_URL=os.getenv("SUPABASE_URL", ""),
        SUPABASE_ANON_KEY=os.getenv("SUPABASE_ANON_KEY", ""),
        SUPABASE_SERVICE_ROLE_KEY=os.getenv("SUPABASE_SERVICE_ROLE_KEY", ""),
        RATELIMIT_STORAGE_URI=os.getenv("RATELIMIT_STORAGE_URI", "memory://"),
        APP_ENV=os.getenv("APP_ENV", "development"),
    )
    if test_config:
        app.config.update(test_config)

    frontend = urlsplit(app.config["FRONTEND_URL"])
    if (
        frontend.scheme not in {"http", "https"}
        or not frontend.netloc
        or frontend.path not in {"", "/"}
        or frontend.query
        or frontend.fragment
        or frontend.username
        or "*" in app.config["FRONTEND_URL"]
    ):
        raise ValueError("FRONTEND_URL must be a single exact frontend origin")
    if app.config["APP_ENV"] == "production" and frontend.scheme != "https":
        raise ValueError("FRONTEND_URL must use HTTPS in production")

    CORS(app, resources={r"/api/*": {"origins": [app.config["FRONTEND_URL"]]}})
    limiter.init_app(app)

    @app.after_request
    def apply_security_headers(response):
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Referrer-Policy"] = "no-referrer"
        response.headers["X-Frame-Options"] = "DENY"
        if request.path.startswith("/api/"):
            response.headers["Cache-Control"] = "no-store"
        return response

    from .auth import auth_bp
    from .resources import api_bp
    from .uploads import uploads_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(api_bp, url_prefix="/api")
    app.register_blueprint(uploads_bp, url_prefix="/api")

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok"})

    @app.errorhandler(413)
    def request_too_large(_error):
        return jsonify({"error": "Request exceeds the allowed size."}), 413

    @app.errorhandler(429)
    def rate_limit_exceeded(_error):
        return jsonify({"error": "Too many requests. Please try again later."}), 429

    @app.errorhandler(404)
    def not_found(_error):
        return jsonify({"error": "Resource not found."}), 404

    @app.errorhandler(500)
    def internal_error(_error):
        app.logger.exception("Unhandled API error")
        return jsonify({"error": "An unexpected error occurred."}), 500

    return app