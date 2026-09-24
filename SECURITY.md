# FinTrack security notes

## Trust boundaries

FinTrack is a static Vue application. It has no application server or custom API
routes. Authentication, rate limiting, and database access are provided by
Supabase. Vercel serves the static application and its security headers.

The browser receives only the Supabase project URL and public publishable key.
Never use a secret key, service-role key, database password, or access token in a
`VITE_*` variable. Vite exposes those variables to every visitor.

## Data access

`supabase/schema.sql` enables row-level security and defines explicit
SELECT, INSERT, UPDATE, and DELETE policies scoped to `auth.uid() = user_id`.
Anonymous access is revoked. The payload has structural and size constraints.

The app renders user text through Vue interpolation and does not use
`v-html`, `innerHTML`, dynamic code execution, or raw SQL. Supabase's client
uses parameterized PostgREST requests. New records accept only known account
types, transaction types, category colors/icons, valid dates, finite monetary
values, and bounded plain-text fields.

## Operational checks

- Keep email confirmation enabled.
- Set Supabase Site URL and redirect URLs to the deployed HTTPS origin.
- Review Supabase Authentication → Rate Limits after changing traffic or email
  providers. Client-side cooldowns are not a substitute for server enforcement.
- Rerun `supabase/schema.sql` after schema updates.
- Update the exact Supabase origin in `vercel.json` if the project changes;
  the Content Security Policy intentionally does not allow arbitrary origins.
- Run `npm run check` and `npm run audit:prod` before each deployment.
- Rotate or revoke a credential immediately if a secret is committed. Rewriting
  Git history does not invalidate an already exposed credential.

Report a vulnerability privately to the repository owner rather than opening an
issue containing account data or credentials.
