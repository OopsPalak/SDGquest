from datetime import datetime, timezone

from flask import Blueprint, g, jsonify, request

from .security import audit_event, authenticated, get_supabase, resource_error, roles_required, validate_avatar


api_bp = Blueprint("api", __name__)


@api_bp.get("/auth/me")
@authenticated
def current_profile():
    return jsonify(g.profile)


@api_bp.get("/profile")
@authenticated
def student_profile():
    return jsonify(g.profile)


@api_bp.patch("/profile")
@roles_required("student")
def update_student_profile():
    body = request.get_json(silent=True)
    if not isinstance(body, dict) or set(body) - {"avatar"}:
        return jsonify({"error": "Only avatar configuration can be updated here."}), 400
    avatar = body.get("avatar")
    if not validate_avatar(avatar) or "icon" in avatar:
        return jsonify({"error": "Invalid avatar configuration."}), 400
    try:
        result = get_supabase(admin=True).table("profiles").update({"avatar": avatar}).eq("id", g.user.id).execute()
        audit_event(g.user.id, "avatar_updated")
        return jsonify(result.data[0])
    except Exception as error:
        return resource_error(error)


@api_bp.get("/profile/invite-code")
@roles_required("student")
def student_invite_code():
    try:
        result = get_supabase(admin=True).table("profiles").select("child_invite_code").eq("id", g.user.id).single().execute()
        return jsonify({"inviteCode": result.data["child_invite_code"]})
    except Exception as error:
        return resource_error(error)


@api_bp.get("/missions")
@authenticated
def list_missions():
    try:
        admin = get_supabase(admin=True)
        if g.profile["role"] == "teacher":
            public_missions = admin.table("missions").select("*").eq("is_published", True).is_("class_id", "null").order("created_at", desc=True).execute().data or []
            owned_missions = admin.table("missions").select("*").eq("is_published", True).eq("created_by", g.user.id).order("created_at", desc=True).execute().data or []
            return jsonify(public_missions + owned_missions)
        if g.profile["role"] == "student":
            student_ids = [g.user.id]
        else:
            links = admin.table("parent_child_links").select("student_id").eq("parent_id", g.user.id).execute().data or []
            student_ids = [link["student_id"] for link in links]
        memberships = admin.table("class_students").select("class_id").in_("student_id", student_ids).execute().data if student_ids else []
        class_ids = list({membership["class_id"] for membership in memberships or []})
        public_missions = admin.table("missions").select("*").eq("is_published", True).is_("class_id", "null").order("created_at", desc=True).execute().data or []
        class_missions = admin.table("missions").select("*").eq("is_published", True).in_("class_id", class_ids).order("created_at", desc=True).execute().data if class_ids else []
        return jsonify(public_missions + (class_missions or []))
    except Exception as error:
        return resource_error(error)


@api_bp.post("/missions")
@roles_required("teacher")
def create_mission():
    body = request.get_json(silent=True)
    allowed = {"title", "description", "sdg_number", "xp_reward", "badge_name", "class_id"}
    if not isinstance(body, dict) or set(body) - allowed:
        return jsonify({"error": "Invalid mission fields."}), 400
    title = body.get("title")
    if not isinstance(title, str) or not 1 <= len(title.strip()) <= 120:
        return jsonify({"error": "Mission title must be between 1 and 120 characters."}), 400
    try:
        reward = int(body.get("xp_reward", 50))
        sdg_number = int(body.get("sdg_number"))
        if not 1 <= reward <= 100 or not 1 <= sdg_number <= 17:
            raise ValueError
    except (TypeError, ValueError):
        return jsonify({"error": "Mission SDG and reward are outside the allowed range."}), 400
    try:
        admin = get_supabase(admin=True)
        class_id = body.get("class_id")
        if class_id:
            owned = admin.table("classes").select("id").eq("id", class_id).eq("teacher_id", g.user.id).maybe_single().execute().data
            if not owned:
                return jsonify({"error": "Class not found."}), 404
        data = {
            "created_by": g.user.id,
            "title": title.strip(),
            "description": str(body.get("description", ""))[:2000],
            "sdg_number": sdg_number,
            "xp_reward": reward,
            "badge_name": str(body.get("badge_name", ""))[:100],
            "class_id": class_id,
            "is_published": True,
        }
        saved = admin.table("missions").insert(data).execute().data[0]
        audit_event(g.user.id, "mission_created", {"mission_id": saved["id"]})
        return jsonify(saved), 201
    except Exception as error:
        return resource_error(error)


@api_bp.get("/submissions")
@roles_required("teacher")
def list_submissions():
    try:
        admin = get_supabase(admin=True)
        class_rows = admin.table("classes").select("id").eq("teacher_id", g.user.id).execute().data or []
        class_ids = [row["id"] for row in class_rows]
        if not class_ids:
            return jsonify([])
        students = admin.table("class_students").select("student_id").in_("class_id", class_ids).execute().data or []
        student_ids = list({row["student_id"] for row in students})
        if not student_ids:
            return jsonify([])
        result = admin.table("submissions").select("*").in_("student_id", student_ids).order("created_at", desc=True).execute()
        profile_rows = admin.table("profiles").select("id, name").eq("email_verified", True).in_("id", student_ids).execute().data or []
        names = {row["id"]: row["name"] for row in profile_rows}
        verified_student_ids = {row["id"] for row in profile_rows}
        formatted = []
        for row in result.data or []:
            if row["student_id"] not in verified_student_ids:
                continue
            item = {**row, "childName": names.get(row["student_id"], "Student")}
            item["reviewStatus"] = row["status"]
            item["status"] = "approved" if row["status"] == "approved" else "rejected" if row["status"] == "rejected" else "needs_resubmission" if row["status"] == "needs_resubmission" else "pending"
            if row.get("evidence_path"):
                signed = admin.storage.from_("mission-evidence").create_signed_url(row["evidence_path"], 120)
                item["mediaUrl"] = signed.get("signedURL")
            item.pop("evidence_path", None)
            item.pop("content_sha256", None)
            item.pop("perceptual_hash", None)
            formatted.append(item)
        return jsonify(formatted)
    except Exception as error:
        return resource_error(error)


@api_bp.get("/submissions/<submission_id>")
@roles_required("student", "teacher", "parent")
def get_submission(submission_id):
    try:
        admin = get_supabase(admin=True)
        submission = admin.table("submissions").select("*").eq("id", submission_id).maybe_single().execute().data
        if not submission:
            return jsonify({"error": "Submission not found."}), 404
        student_id = submission["student_id"]
        allowed = g.profile["role"] == "student" and student_id == g.user.id
        if g.profile["role"] == "teacher":
            verified = admin.table("profiles").select("id").eq("id", student_id).eq("email_verified", True).maybe_single().execute().data
            memberships = admin.table("class_students").select("class_id").eq("student_id", student_id).execute().data or []
            class_ids = list({item["class_id"] for item in memberships})
            owned = admin.table("classes").select("id").eq("teacher_id", g.user.id).in_("id", class_ids).execute().data if class_ids else []
            allowed = bool(verified and owned)
        elif g.profile["role"] == "parent":
            linked = admin.table("parent_child_links").select("student_id").eq("parent_id", g.user.id).eq("student_id", student_id).maybe_single().execute().data
            verified = admin.table("profiles").select("id").eq("id", student_id).eq("email_verified", True).maybe_single().execute().data
            allowed = bool(linked and verified and submission["status"] == "approved")
        if not allowed:
            return jsonify({"error": "Submission not found."}), 404
        if submission.get("evidence_path"):
            signed = admin.storage.from_("mission-evidence").create_signed_url(submission["evidence_path"], 120)
            submission["evidenceUrl"] = signed.get("signedURL")
        submission.pop("evidence_path", None)
        submission.pop("content_sha256", None)
        submission.pop("perceptual_hash", None)
        return jsonify(submission)
    except Exception as error:
        return resource_error(error)


@api_bp.post("/submissions/<submission_id>/review")
@roles_required("teacher")
def review_submission(submission_id):
    body = request.get_json(silent=True)
    status = body.get("status") if isinstance(body, dict) else None
    comment = body.get("comment", "") if isinstance(body, dict) else ""
    if status not in {"approved", "rejected", "needs_resubmission"} or not isinstance(comment, str) or len(comment) > 1000:
        return jsonify({"error": "Invalid review decision."}), 400
    try:
        admin = get_supabase(admin=True)
        submission = admin.table("submissions").select("id, student_id, mission_id, status").eq("id", submission_id).maybe_single().execute().data
        if not submission:
            return jsonify({"error": "Submission not found."}), 404
        membership = admin.table("class_students").select("class_id").eq("student_id", submission["student_id"]).execute().data or []
        student = admin.table("profiles").select("id").eq("id", submission["student_id"]).eq("email_verified", True).maybe_single().execute().data
        class_ids = list({item["class_id"] for item in membership})
        owned = admin.table("classes").select("id").eq("teacher_id", g.user.id).in_("id", class_ids).execute().data if class_ids else []
        if not owned or not student:
            return jsonify({"error": "Submission not found."}), 404
        if submission["status"] in {"approved", "rejected"}:
            return jsonify({"error": "This submission has already been reviewed."}), 409
        decision = admin.rpc("review_submission", {
            "target_submission_id": submission_id,
            "reviewer_id": g.user.id,
            "new_status": status,
            "new_comment": comment.strip(),
        }).execute().data
        audit_event(g.user.id, "submission_reviewed", {"submission_id": submission_id, "status": status})
        return jsonify(decision)
    except Exception as error:
        return resource_error(error)


@api_bp.get("/student/progress")
@roles_required("student")
def student_progress():
    try:
        admin = get_supabase(admin=True)
        badges = admin.table("user_badges").select("badge_id, awarded_at").eq("user_id", g.user.id).execute().data or []
        pages = admin.table("book_pages").select("id, mission_id, sdg_number, title, caption, created_at").eq("user_id", g.user.id).order("created_at", desc=True).execute().data or []
        sdgs = admin.table("sdg_progress").select("sdg_number, progress, updated_at").eq("user_id", g.user.id).execute().data or []
        planet = admin.table("virtual_planet_progress").select("progress, updated_at").eq("user_id", g.user.id).maybe_single().execute().data
        attempts = admin.table("quiz_attempts").select("id, quiz_id, score, total, created_at").eq("user_id", g.user.id).order("created_at", desc=True).execute().data or []
        submissions = admin.table("submissions").select("mission_id, status, xp_awarded, created_at").eq("student_id", g.user.id).order("created_at", desc=True).execute().data or []
        xp_transactions = admin.table("xp_transactions").select("amount, source, reference_id, created_at").eq("user_id", g.user.id).order("created_at", desc=True).execute().data or []
        return jsonify({"profile": g.profile, "badges": badges, "bookPages": pages, "sdgs": sdgs, "planet": planet, "quizAttempts": attempts, "missions": submissions, "xpTransactions": xp_transactions})
    except Exception as error:
        return resource_error(error)


@api_bp.get("/student/book-pages")
@roles_required("student")
def student_book_pages():
    try:
        admin = get_supabase(admin=True)
        pages = admin.table("book_pages").select("*").eq("user_id", g.user.id).order("created_at", desc=True).execute().data or []
        submissions = admin.table("submissions").select("id, evidence_path, xp_awarded").in_("id", [page["submission_id"] for page in pages if page.get("submission_id")]).execute().data if pages else []
        evidence_by_submission = {submission["id"]: submission for submission in submissions or []}
        formatted = []
        for page in pages:
            entry = {
                **page,
                "sdgId": page["sdg_number"],
                "sdgNumber": page["sdg_number"],
                "frame": page["frame_id"],
                "badgeName": page["badge_name"],
                "badgeIcon": page["badge_icon"],
                "author": g.profile["name"],
                "type": "photo",
            }
            evidence = evidence_by_submission.get(page.get("submission_id"))
            if evidence:
                entry["xpEarned"] = evidence["xp_awarded"]
                if evidence.get("evidence_path"):
                    signed = admin.storage.from_("mission-evidence").create_signed_url(evidence["evidence_path"], 120)
                    entry["mediaUrl"] = signed.get("signedURL")
            formatted.append(entry)
        return jsonify(formatted)
    except Exception as error:
        return resource_error(error)


@api_bp.get("/student/xp-transactions")
@roles_required("student")
def student_xp_transactions():
    try:
        rows = get_supabase(admin=True).table("xp_transactions").select("amount, source, reference_id, created_at").eq("user_id", g.user.id).order("created_at", desc=True).execute().data or []
        return jsonify(rows)
    except Exception as error:
        return resource_error(error)


@api_bp.post("/student/quiz-attempts")
@roles_required("student")
def save_quiz_attempt():
    body = request.get_json(silent=True)
    quiz_id = body.get("quizId") if isinstance(body, dict) else None
    answers = body.get("answers") if isinstance(body, dict) else None
    if not isinstance(quiz_id, str) or not 1 <= len(quiz_id) <= 100 or not isinstance(answers, dict) or len(answers) > 100:
        return jsonify({"error": "Invalid quiz attempt."}), 400
    try:
        result = get_supabase(admin=True).rpc("submit_quiz_attempt", {
            "target_quiz_id": quiz_id,
            "attempt_user_id": g.user.id,
            "submitted_answers": answers,
        }).execute().data
        audit_event(g.user.id, "quiz_attempted", {"quiz_id": quiz_id, "score": result["score"], "total": result["total"]})
        return jsonify(result), 201
    except Exception as error:
        return resource_error(error)


@api_bp.get("/teacher")
@roles_required("teacher")
def teacher_dashboard():
    try:
        admin = get_supabase(admin=True)
        classes = admin.table("classes").select("id, name, invite_code, created_at").eq("teacher_id", g.user.id).execute().data or []
        class_ids = [row["id"] for row in classes]
        memberships = admin.table("class_students").select("student_id").in_("class_id", class_ids).execute().data if class_ids else []
        students = admin.table("profiles").select("id, name, grade, avatar, xp, level, streak").eq("email_verified", True).in_("id", list({row["student_id"] for row in memberships})).execute().data if memberships else []
        student_ids = [student["id"] for student in students]
        badges = admin.table("user_badges").select("user_id, badge_id").in_("user_id", student_ids).execute().data if student_ids else []
        badges_by_student = {}
        for badge in badges or []:
            badges_by_student.setdefault(badge["user_id"], []).append(badge["badge_id"])
        pages = admin.table("book_pages").select("user_id").in_("user_id", student_ids).execute().data if student_ids else []
        page_counts = {}
        for page in pages or []:
            page_counts[page["user_id"]] = page_counts.get(page["user_id"], 0) + 1
        formatted_students = [{
            **student,
            "avatarIcon": (student.get("avatar") or {}).get("icon", "🧒"),
            "bookPages": page_counts.get(student["id"], 0),
            "badges": badges_by_student.get(student["id"], []),
        } for student in students]
        total_pages = sum(page_counts.values())
        completed = admin.table("submissions").select("id, status").in_("student_id", student_ids).execute().data if student_ids else []
        completion = round(100 * sum(1 for item in completed or [] if item["status"] == "approved") / len(completed)) if completed else 0
        return jsonify({
            "name": g.profile["name"],
            "className": classes[0]["name"] if classes else "No class yet",
            "classes": classes,
            "students": formatted_students,
            "totalStudents": len(formatted_students),
            "completionRate": completion,
            "totalBookPages": total_pages,
        })
    except Exception as error:
        return resource_error(error)


@api_bp.post("/teacher/classes")
@roles_required("teacher")
def create_class():
    body = request.get_json(silent=True)
    name = body.get("name") if isinstance(body, dict) else None
    if not isinstance(name, str) or not 1 <= len(name.strip()) <= 120:
        return jsonify({"error": "Enter a class name between 1 and 120 characters."}), 400
    try:
        saved = get_supabase(admin=True).table("classes").insert({"teacher_id": g.user.id, "name": name.strip()}).execute().data[0]
        audit_event(g.user.id, "class_created", {"class_id": saved["id"]})
        return jsonify(saved), 201
    except Exception as error:
        return resource_error(error)


@api_bp.patch("/teacher/classes/<class_id>")
@roles_required("teacher")
def update_class(class_id):
    body = request.get_json(silent=True)
    name = body.get("name") if isinstance(body, dict) and set(body) == {"name"} else None
    if not isinstance(name, str) or not 1 <= len(name.strip()) <= 120:
        return jsonify({"error": "Enter a valid class name."}), 400
    try:
        admin = get_supabase(admin=True)
        saved = admin.table("classes").update({"name": name.strip()}).eq("id", class_id).eq("teacher_id", g.user.id).execute().data
        if not saved:
            return jsonify({"error": "Class not found."}), 404
        audit_event(g.user.id, "class_updated", {"class_id": class_id})
        return jsonify(saved[0])
    except Exception as error:
        return resource_error(error)


@api_bp.delete("/teacher/classes/<class_id>")
@roles_required("teacher")
def delete_class(class_id):
    try:
        admin = get_supabase(admin=True)
        owned = admin.table("classes").select("id").eq("id", class_id).eq("teacher_id", g.user.id).maybe_single().execute().data
        if not owned:
            return jsonify({"error": "Class not found."}), 404
        members = admin.table("class_students").select("student_id").eq("class_id", class_id).limit(1).execute().data or []
        if members:
            return jsonify({"error": "Remove all students before deleting this class."}), 409
        admin.table("classes").delete().eq("id", class_id).eq("teacher_id", g.user.id).execute()
        audit_event(g.user.id, "class_deleted", {"class_id": class_id})
        return "", 204
    except Exception as error:
        return resource_error(error)


@api_bp.post("/teacher/classes/<class_id>/students")
@roles_required("teacher")
def add_student_to_class(class_id):
    body = request.get_json(silent=True)
    student_id = body.get("studentId") if isinstance(body, dict) else None
    if not isinstance(student_id, str) or len(student_id) > 80:
        return jsonify({"error": "A valid student account is required."}), 400
    try:
        admin = get_supabase(admin=True)
        owned = admin.table("classes").select("id").eq("id", class_id).eq("teacher_id", g.user.id).maybe_single().execute().data
        student = admin.table("profiles").select("id").eq("id", student_id).eq("role", "student").eq("email_verified", True).maybe_single().execute().data
        if not owned or not student:
            return jsonify({"error": "Class or student not found."}), 404
        saved = admin.table("class_students").upsert({"class_id": class_id, "student_id": student_id}).execute().data[0]
        audit_event(g.user.id, "student_assigned_to_class", {"class_id": class_id, "student_id": student_id})
        return jsonify(saved), 201
    except Exception as error:
        return resource_error(error)


@api_bp.get("/teacher/classes/<class_id>/quiz-performance")
@roles_required("teacher")
def class_quiz_performance(class_id):
    try:
        admin = get_supabase(admin=True)
        owned = admin.table("classes").select("id").eq("id", class_id).eq("teacher_id", g.user.id).maybe_single().execute().data
        if not owned:
            return jsonify({"error": "Class not found."}), 404
        members = admin.table("class_students").select("student_id").eq("class_id", class_id).execute().data or []
        ids = [row["student_id"] for row in members]
        verified = admin.table("profiles").select("id").eq("email_verified", True).in_("id", ids).execute().data if ids else []
        ids = [row["id"] for row in verified or []]
        attempts = admin.table("quiz_attempts").select("user_id, quiz_id, score, total, created_at").in_("user_id", ids).order("created_at", desc=True).execute().data if ids else []
        return jsonify(attempts or [])
    except Exception as error:
        return resource_error(error)


@api_bp.get("/teacher/classes/<class_id>/students/<student_id>/progress")
@roles_required("teacher")
def teacher_student_progress(class_id, student_id):
    try:
        admin = get_supabase(admin=True)
        owned = admin.table("classes").select("id").eq("id", class_id).eq("teacher_id", g.user.id).maybe_single().execute().data
        enrolled = admin.table("class_students").select("student_id").eq("class_id", class_id).eq("student_id", student_id).maybe_single().execute().data
        if not owned or not enrolled:
            return jsonify({"error": "Student not found."}), 404
        profile = admin.table("profiles").select("id, name, grade, avatar, xp, level, streak").eq("id", student_id).eq("email_verified", True).maybe_single().execute().data
        if not profile:
            return jsonify({"error": "Student not found."}), 404
        badges = admin.table("user_badges").select("badge_id, awarded_at").eq("user_id", student_id).execute().data or []
        sdgs = admin.table("sdg_progress").select("sdg_number, progress, updated_at").eq("user_id", student_id).execute().data or []
        attempts = admin.table("quiz_attempts").select("quiz_id, score, total, created_at").eq("user_id", student_id).order("created_at", desc=True).execute().data or []
        xp_transactions = admin.table("xp_transactions").select("amount, source, reference_id, created_at").eq("user_id", student_id).order("created_at", desc=True).execute().data or []
        return jsonify({"profile": profile, "badges": badges, "sdgs": sdgs, "quizAttempts": attempts, "xpTransactions": xp_transactions})
    except Exception as error:
        return resource_error(error)


@api_bp.get("/parent")
@roles_required("parent")
def parent_dashboard():
    try:
        admin = get_supabase(admin=True)
        links = admin.table("parent_child_links").select("student_id").eq("parent_id", g.user.id).execute().data or []
        child_ids = [link["student_id"] for link in links]
        children = admin.table("profiles").select("id, name, grade, avatar, xp, level, streak").eq("email_verified", True).in_("id", child_ids).execute().data if child_ids else []
        return jsonify({"children": children or []})
    except Exception as error:
        return resource_error(error)


@api_bp.get("/parent/children/<child_id>/progress")
@roles_required("parent")
def parent_child_progress(child_id):
    try:
        admin = get_supabase(admin=True)
        linked = admin.table("parent_child_links").select("student_id").eq("parent_id", g.user.id).eq("student_id", child_id).maybe_single().execute().data
        if not linked:
            return jsonify({"error": "Child not found."}), 404
        profile = admin.table("profiles").select("id, name, grade, avatar, xp, level, streak").eq("id", child_id).eq("email_verified", True).maybe_single().execute().data
        if not profile:
            return jsonify({"error": "Child not found."}), 404
        attempts = admin.table("quiz_attempts").select("quiz_id, score, total, created_at").eq("user_id", child_id).order("created_at", desc=True).execute().data or []
        pages = admin.table("book_pages").select("id, mission_id, sdg_number, title, caption, created_at").eq("user_id", child_id).order("created_at", desc=True).execute().data or []
        badges = admin.table("user_badges").select("badge_id, awarded_at").eq("user_id", child_id).execute().data or []
        sdgs = admin.table("sdg_progress").select("sdg_number, progress, updated_at").eq("user_id", child_id).execute().data or []
        planet = admin.table("virtual_planet_progress").select("progress, updated_at").eq("user_id", child_id).maybe_single().execute().data
        xp_transactions = admin.table("xp_transactions").select("amount, source, reference_id, created_at").eq("user_id", child_id).order("created_at", desc=True).execute().data or []
        return jsonify({"profile": profile, "quizAttempts": attempts, "bookPages": pages, "badges": badges, "sdgs": sdgs, "planet": planet, "xpTransactions": xp_transactions})
    except Exception as error:
        return resource_error(error)


@api_bp.get("/parent/children/<child_id>/submissions")
@roles_required("parent")
def parent_child_submissions(child_id):
    try:
        admin = get_supabase(admin=True)
        linked = admin.table("parent_child_links").select("student_id").eq("parent_id", g.user.id).eq("student_id", child_id).maybe_single().execute().data
        verified = admin.table("profiles").select("id").eq("id", child_id).eq("email_verified", True).maybe_single().execute().data
        if not linked or not verified:
            return jsonify({"error": "Child not found."}), 404
        rows = admin.table("submissions").select("id, mission_id, caption, status, review_comment, xp_awarded, created_at").eq("student_id", child_id).eq("status", "approved").order("created_at", desc=True).execute().data or []
        return jsonify(rows)
    except Exception as error:
        return resource_error(error)


@api_bp.get("/parent/children/<child_id>/book-pages")
@roles_required("parent")
def parent_child_book_pages(child_id):
    try:
        admin = get_supabase(admin=True)
        linked = admin.table("parent_child_links").select("student_id").eq("parent_id", g.user.id).eq("student_id", child_id).maybe_single().execute().data
        child = admin.table("profiles").select("id, name").eq("id", child_id).eq("email_verified", True).maybe_single().execute().data
        if not linked or not child:
            return jsonify({"error": "Child not found."}), 404
        pages = admin.table("book_pages").select("id, user_id, submission_id, mission_id, sdg_number, title, caption, frame_id, stickers, xp_earned, badge_name, badge_icon, created_at").eq("user_id", child_id).order("created_at", desc=True).execute().data or []
        submissions = admin.table("submissions").select("id, evidence_path, xp_awarded").in_("id", [page["submission_id"] for page in pages if page.get("submission_id")]).execute().data if pages else []
        evidence_by_submission = {submission["id"]: submission for submission in submissions or []}
        formatted = []
        for page in pages:
            entry = {
                **page,
                "sdgId": page["sdg_number"],
                "sdgNumber": page["sdg_number"],
                "frame": page["frame_id"],
                "xpEarned": page["xp_earned"],
                "badgeName": page["badge_name"],
                "badgeIcon": page["badge_icon"],
                "author": child["name"],
                "type": "photo",
            }
            evidence = evidence_by_submission.get(page.get("submission_id"))
            if evidence:
                entry["xpEarned"] = evidence["xp_awarded"]
                if evidence.get("evidence_path"):
                    signed = admin.storage.from_("mission-evidence").create_signed_url(evidence["evidence_path"], 120)
                    entry["mediaUrl"] = signed.get("signedURL")
            formatted.append(entry)
        return jsonify(formatted)
    except Exception as error:
        return resource_error(error)


@api_bp.get("/student/submissions")
@roles_required("student")
def student_submissions():
    try:
        rows = get_supabase(admin=True).table("submissions").select("id, mission_id, caption, status, review_comment, xp_awarded, created_at").eq("student_id", g.user.id).order("created_at", desc=True).execute().data or []
        return jsonify(rows)
    except Exception as error:
        return resource_error(error)


@api_bp.post("/student/summer/<int:day>/complete")
@roles_required("student")
def complete_summer_day(day):
    if not 1 <= day <= 30:
        return jsonify({"error": "Summer adventure day is outside the allowed range."}), 400
    try:
        result = get_supabase(admin=True).rpc("complete_summer_day", {
            "attempt_user_id": g.user.id,
            "summer_day": day,
        }).execute().data
        return jsonify(result)
    except Exception as error:
        return resource_error(error)


@api_bp.get("/student/summer")
@roles_required("student")
def student_summer_progress():
    try:
        rows = get_supabase(admin=True).table("summer_completions").select("day, completed_at").eq("user_id", g.user.id).order("day").execute().data or []
        days = [row["day"] for row in rows]
        return jsonify({
            "completedDays": days,
            "totalDays": 30,
            "currentDay": min(30, max(days, default=0) + 1),
        })
    except Exception as error:
        return resource_error(error)


@api_bp.post("/auth/logout")
@authenticated
def logout_audit():
    audit_event(g.user.id, "logout")
    return jsonify({"message": "Signed out."})


@api_bp.get("/parent/children/<child_id>/family-missions")
@roles_required("parent")
def list_family_missions(child_id):
    try:
        admin = get_supabase(admin=True)
        linked = admin.table("parent_child_links").select("student_id").eq("parent_id", g.user.id).eq("student_id", child_id).maybe_single().execute().data
        if not linked:
            return jsonify({"error": "Child not found."}), 404
        result = admin.table("family_missions").select("id, title, description, status, created_at, completed_at").eq("parent_id", g.user.id).eq("student_id", child_id).order("created_at", desc=True).execute()
        return jsonify(result.data or [])
    except Exception as error:
        return resource_error(error)


@api_bp.post("/parent/children/<child_id>/family-missions")
@roles_required("parent")
def create_family_mission(child_id):
    body = request.get_json(silent=True)
    title = body.get("title") if isinstance(body, dict) else None
    description = body.get("description", "") if isinstance(body, dict) else ""
    if not isinstance(title, str) or not 1 <= len(title.strip()) <= 120 or not isinstance(description, str) or len(description) > 1000:
        return jsonify({"error": "Invalid family mission details."}), 400
    try:
        admin = get_supabase(admin=True)
        linked = admin.table("parent_child_links").select("student_id").eq("parent_id", g.user.id).eq("student_id", child_id).maybe_single().execute().data
        if not linked:
            return jsonify({"error": "Child not found."}), 404
        saved = admin.table("family_missions").insert({
            "parent_id": g.user.id,
            "student_id": child_id,
            "title": title.strip(),
            "description": description.strip(),
        }).execute().data[0]
        audit_event(g.user.id, "family_mission_created", {"family_mission_id": saved["id"]})
        return jsonify(saved), 201
    except Exception as error:
        return resource_error(error)


@api_bp.post("/parent/family-missions/<mission_id>/complete")
@roles_required("parent")
def complete_family_mission(mission_id):
    try:
        admin = get_supabase(admin=True)
        mission = admin.table("family_missions").select("id, student_id, status").eq("id", mission_id).eq("parent_id", g.user.id).maybe_single().execute().data
        if not mission:
            return jsonify({"error": "Family mission not found."}), 404
        linked = admin.table("parent_child_links").select("student_id").eq("parent_id", g.user.id).eq("student_id", mission["student_id"]).maybe_single().execute().data
        if not linked:
            return jsonify({"error": "Family mission not found."}), 404
        saved = admin.table("family_missions").update({"status": "completed", "completed_at": datetime.now(timezone.utc).isoformat()}).eq("id", mission_id).eq("parent_id", g.user.id).execute().data[0]
        audit_event(g.user.id, "family_mission_completed", {"family_mission_id": mission_id})
        return jsonify(saved)
    except Exception as error:
        return resource_error(error)