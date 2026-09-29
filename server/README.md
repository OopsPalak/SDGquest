# SDG Quest API

The production API is Flask backed by Supabase Auth, PostgreSQL, and private Supabase Storage. The original frontend and demo reference screen remain in `src/`; the live app uses the email-verified authentication flow.

## Local setup

1. Create a Supabase project and enable **Confirm email** under Authentication settings. Add `http://localhost:5173/**` to the allowed redirect URLs.
2. Apply `supabase/migrations/202609290001_initial_schema.sql` with the Supabase SQL editor or Supabase CLI.
3. Copy `.env.example` to `.env` and fill the Supabase URL, public anon key, and server-only service-role key. Keep the service-role key only in `.env` on the backend host.
4. Create the Python environment and install backend dependencies:

   ```powershell
   py -3 -m venv .venv
   .\.venv\Scripts\python -m pip install -r server\requirements.txt
   npm install
   npm run dev
   ```

The Vite server runs at `http://localhost:5173`; Flask listens on `http://localhost:3002`. For a production WSGI process, install the requirements and run `waitress-serve --listen=*:3002 server.wsgi:app` behind an HTTPS reverse proxy.

## Supabase configuration

- Set the project's email confirmation requirement before accepting signups. Configure email delivery and redirect allowlists in Supabase Auth.
- The migration creates a private `mission-evidence` bucket. Storage is accessed by the backend service role and evidence URLs are signed for 120 seconds only after relationship checks.
- `SUPABASE_ANON_KEY` and its `VITE_` counterpart are public project keys; the service-role key is never sent to the browser.
- Teacher signup is invite-only. Generate a long random code, insert its SHA-256 digest into `public.teacher_invites`, then give the raw code only to that teacher; see [API.md](API.md).
- For multiple backend workers, set `RATELIMIT_STORAGE_URI` to a shared Redis URL. The default in-memory limiter is for local development only.
- Optional `MALWARE_SCAN_API_URL` and `IMAGE_SCREENING_API_URL`/`IMAGE_SCREENING_API_KEY` integrations are server-side. AI screening is only a review signal; a configured detector is not proof that an image is authentic.
- Summer-day completion is persisted but awards no XP. Student-asserted day numbers are not trusted evidence; XP is awarded only by server-scored first quiz attempts or authorized mission approval.
- Deploy over HTTPS and configure `FRONTEND_URL` to the exact production origin. Do not use `*` for CORS.

The full route, body, role, response, and error reference is in [API.md](API.md). Every protected route checks the Supabase access token, confirmed email, stored profile role, and relevant class/parent-child relationship. Rewards are issued by database functions and written to an XP transaction ledger; clients cannot set XP, badges, approval state, or scores.

## Verification

Run `py -3 -m pytest server/tests`. These checks cover credential policy and unauthenticated route rejection. Full sign-up, email delivery, role/data isolation, private storage, and review/reward integration tests require a configured Supabase project and are not simulated by the local unit tests.