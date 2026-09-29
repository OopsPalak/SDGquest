# SDG Quest API

Base URL in development: `http://localhost:3002`. JSON errors use `{"error":"..."}`; authentication failures are `401`, role/resource failures are `403` or privacy-preserving `404`, validation errors are `400`, duplicate conflicts are `409`, rate limits are `429`, and internal failures are generic `500` responses.

Protected requests use `Authorization: Bearer <Supabase access token>`. Tokens are verified by Supabase Auth, email confirmation is checked, and role/resource relationships are resolved from PostgreSQL. No route accepts a client-supplied XP amount or approval flag.

## Authentication

| Method and path | Auth / role | Request | Result |
| --- | --- | --- | --- |
| `POST /api/auth/register` | Public, rate limited | `{email,password,name,role,...roleFields}`. Student: `grade`, `avatar`, optional `classInviteCode`; teacher: `className`, one-use `teacherInviteCode`; parent: `childInviteCode`. | `201` verification instructions. Requires a valid email and 8+ character password with uppercase, lowercase, and number. Teacher role is assigned only after consuming a server-issued invite. |
| `POST /api/auth/login` | Public, rate limited | `{email,password,role}` | Verified Supabase session tokens and the stored profile. Wrong credentials: `401`; unverified email or mismatched selected role: `403`. |
| `POST /api/auth/logout` | Any verified role | No body | Audit event; client revokes/clears the Supabase session with `supabase.auth.signOut()`. |
| `POST /api/auth/resend-verification` | Public, rate limited | `{email}` | Enumeration-safe verification resend response. |
| `POST /api/auth/forgot-password` | Public, rate limited | `{email}` | Enumeration-safe reset email response. `/api/auth/password-reset` remains an alias. Supabase handles the recovery token; the client updates the password through the verified recovery session. |
| `GET /api/auth/me` | Any verified role | None | Stored profile for the authenticated user. |

## Profiles And Missions

| Method and path | Auth / role | Request | Result |
| --- | --- | --- | --- |
| `GET /api/profile` | Any verified role | None | Own profile only. |
| `PATCH /api/profile` | Student | `{avatar}` with allowlisted avatar options | Updated avatar. Role, email, XP, level, streak, and verification fields are not writable. |
| `GET /api/profile/invite-code` | Student | None | Own parent-link code. |
| `GET /api/missions` | Any verified role | None | Published missions visible to the role, including only assigned class missions. |
| `POST /api/missions` | Teacher | `{title,description,sdg_number,xp_reward,badge_name,class_id?}` | Creates a mission. Reward is validated and stored as trusted mission data; class must belong to the teacher. |
| `POST /api/missions/{id}/submit` | Student | Multipart fields `caption`, `type`, `frame`, `stickers`; image `evidence` for photo/drawing | Submission in `pending`, `likely_authentic`, `suspicious`, or `review_required`. Text-only journal entries need a non-empty caption. |

## Submissions And Uploads

| Method and path | Auth / role | Request | Result |
| --- | --- | --- | --- |
| `POST /api/uploads` or `POST /api/submissions` | Student, rate limited | Multipart `missionId`, optional image `evidence`, `caption`, `type`, `frame`, JSON `stickers` | Securely decoded, normalized, screened submission. `201`; invalid image `400/413`; duplicate active mission submission `409`; unavailable configured screening service `503`. |
| `GET /api/submissions` | Teacher | None | Submissions only from verified students assigned to the teacher's classes. Evidence links expire after 120 seconds. |
| `GET /api/submissions/{id}` | Student owner, associated teacher, or linked parent viewing an approved record | None | Authorized submission only; private evidence is returned as a short-lived signed URL. Unrelated resources return `404`. |
| `POST /api/submissions/{id}/review` | Associated teacher | `{status:"approved"|"needs_resubmission"|"rejected",comment?}` | Review result. `approved` transactionally updates XP/level/streak, XP ledger, badges, SDG/planet progress, and SDG Book. |
| `GET /api/submissions/{id}/evidence-url` | Owner, associated teacher, or linked parent | None | Private signed URL valid for 120 seconds. |

Authenticity screening returns `status`, `confidence`, and `reason`. Without a configured provider, image submissions are marked `review_required`; duplicates are `suspicious`. An AI signal is never conclusive evidence or an automatic punishment. An optional configured detector must accept multipart field `file` and return JSON `{ "label": "ai_generated"|"likely_authentic", "confidence": 0..1 }`. Malware scanning is separately configurable and fails closed when configured but unavailable.

## Student

| Method and path | Auth / role | Result |
| --- | --- | --- |
| `GET /api/student/progress` | Student | Own profile, XP, level, streak, badges, SDG/planet progress, quizzes, mission states, and XP transactions. |
| `GET /api/student/book-pages` | Student | Own approved SDG Book pages with private signed evidence links. |
| `GET /api/student/submissions` | Student | Own mission submissions. |
| `GET /api/student/xp-transactions` | Student | Own append-only XP reward history. |
| `POST /api/student/quiz-attempts` | Student | `{quizId,answers:{questionId:"answerIndex"}}`; backend calculates score and grants one first-attempt reward. |
| `POST /api/student/summer/{day}/complete` | Student | Day `1..30`; records progress only and grants no XP because completion is self-reported. |

## Teacher And Parent

Teacher routes: `GET /api/teacher`; `POST /api/teacher/classes`; `PATCH/DELETE /api/teacher/classes/{classId}`; `POST /api/teacher/classes/{classId}/students`; `GET /api/teacher/classes/{classId}/quiz-performance`; `GET /api/teacher/classes/{classId}/students/{studentId}/progress`. Every class/student lookup is scoped to the authenticated teacher. A class cannot be deleted while students remain enrolled.

Parent routes: `GET /api/parent`; `GET /api/parent/children/{childId}/progress`; `/submissions`; `/book-pages`; `/family-missions`; `POST /api/parent/children/{childId}/family-missions`; and `POST /api/parent/family-missions/{missionId}/complete`. Each child route verifies the stored parent-child link and child email verification. Parent-only family task completion does not grant student XP.

## Teacher Invitations

Teacher signup requires a one-use invitation. An administrator provisions one through the Supabase SQL editor using a generated random code, storing only its SHA-256 digest:

```sql
insert into public.teacher_invites (code_hash)
values (encode(digest('replace-with-a-long-random-one-time-code', 'sha256'), 'hex'));
```

Give the raw code to the intended teacher through a trusted channel. The API atomically consumes the digest; the raw code is never stored. If signup fails after consumption, provision a new code.