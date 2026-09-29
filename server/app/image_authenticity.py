import os

import requests
from flask import current_app


class ImageAuthenticityService:
    def analyze(self, image_bytes, duplicate=False):
        if duplicate:
            return {
                "status": "suspicious",
                "confidence": 0.99,
                "reason": "This image matches a previous mission submission and needs human review.",
            }

        detector_url = current_app.config.get("IMAGE_SCREENING_API_URL") or os.getenv("IMAGE_SCREENING_API_URL")
        detector_key = current_app.config.get("IMAGE_SCREENING_API_KEY") or os.getenv("IMAGE_SCREENING_API_KEY")
        if not detector_url or not detector_key:
            return {
                "status": "review_required",
                "confidence": None,
                "reason": "No image authenticity detector is configured; teacher review is required.",
            }

        response = requests.post(
            detector_url,
            files={"file": ("evidence", image_bytes, "application/octet-stream")},
            headers={"Authorization": f"Bearer {detector_key}"},
            timeout=15,
        )
        response.raise_for_status()
        result = response.json()
        confidence = result.get("confidence")
        label = result.get("label")
        if not isinstance(confidence, (int, float)) or not 0 <= confidence <= 1 or not isinstance(label, str):
            raise ValueError("Configured image detector returned an invalid response")

        normalized_label = label.lower()
        generated_signal = normalized_label in {"ai_generated", "synthetic", "likely_ai_generated"}
        authentic_signal = normalized_label in {"likely_authentic", "authentic", "real"}
        if generated_signal and confidence >= 0.8:
            status = "suspicious"
            reason = "Detector raised a signal for teacher review."
        elif authentic_signal and confidence >= 0.6:
            status = "likely_authentic"
            reason = "Detector found no strong manipulation signal; teacher approval is still required."
        else:
            status = "review_required"
            reason = "Detector result is inconclusive; teacher review is required."
        return {"status": status, "confidence": float(confidence), "reason": reason}