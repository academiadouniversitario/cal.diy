-- Headless bootstrap of a fresh cal.diy API v2 stack (no web app involved).
-- Idempotent. Run with psql variables:
--
--   psql "$DATABASE_URL" \
--     -v admin_email="'agenda@example.com'" \
--     -v api_key_body="'<hex, e.g. openssl rand -hex 24>'" \
--     -v oauth_client_secret="'<e.g. au_secret_$(openssl rand -hex 16)>'" \
--     -v google_credentials="'{\"client_id\":\"...\",\"client_secret\":\"...\",\"redirect_uris\":[...]}'" \
--     -f bootstrap.sql
--
-- The full API key to use in Authorization headers is "cal_" || :api_key_body —
-- the database stores ONLY sha256(api_key_body) (no cal_ prefix, hex).
--
-- After this: create managed users via
--   POST /v2/oauth-clients/au-platform-client/users
--   (Authorization: Bearer cal_<api_key_body>, x-cal-secret-key: <oauth_client_secret>)

BEGIN;

-- 1. Admin user (role ADMIN = isSystemAdmin for the API guards). uuid has a
--    Prisma-level default only — the column is NOT NULL with no DB default.
INSERT INTO users (uuid, username, name, email, "emailVerified", role, "completedOnboarding", "timeZone", "weekStart")
SELECT gen_random_uuid(), 'au-admin', 'AU Admin', :admin_email, now(), 'ADMIN', true, 'America/Sao_Paulo', 'Monday'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = :admin_email);

-- 2. API key for the admin (hashedKey = sha256 hex of the body WITHOUT the cal_ prefix).
INSERT INTO "ApiKey" (id, "userId", note, "expiresAt", "hashedKey")
SELECT gen_random_uuid()::text, u.id, 'bootstrap admin key', NULL,
       encode(sha256(:api_key_body::bytea), 'hex')
FROM users u
WHERE u.email = :admin_email
  AND NOT EXISTS (SELECT 1 FROM "ApiKey" WHERE "hashedKey" = encode(sha256(:api_key_body::bytea), 'hex'));

-- 3. google-calendar App keys. The App catalog is pre-populated by the cal seed, so
--    this is an UPSERT of the credentials. The API requires the FLATTENED shape
--    ({client_id,...}); the Google console download wraps it in {"web":{...}} —
--    accept either and flatten here.
INSERT INTO "App" (slug, "dirName", keys, categories, "updatedAt", enabled)
VALUES (
  'google-calendar', 'googlecalendar',
  CASE
    WHEN :google_credentials::jsonb ? 'web' THEN jsonb_build_object(
      'client_id', :google_credentials::jsonb->'web'->>'client_id',
      'client_secret', :google_credentials::jsonb->'web'->>'client_secret',
      'redirect_uris', :google_credentials::jsonb->'web'->'redirect_uris'
    )
    ELSE :google_credentials::jsonb
  END,
  '{calendar}', now(), true
)
ON CONFLICT (slug) DO UPDATE SET keys = EXCLUDED.keys, enabled = true, "updatedAt" = now();

-- 4. Platform organization (Team) — owner of the OAuth client.
INSERT INTO "Team" (name, slug, "isPlatform", "isOrganization", "createdAt")
SELECT 'AU Platform', 'au-platform', true, true, now()
WHERE NOT EXISTS (SELECT 1 FROM "Team" WHERE slug = 'au-platform');

-- 5. Admin joins the platform org (membership + profile).
INSERT INTO "Membership" ("teamId", "userId", role, accepted, "createdAt", "updatedAt")
SELECT t.id, u.id, 'OWNER', true, now(), now()
FROM "Team" t, users u
WHERE t.slug = 'au-platform' AND u.email = :admin_email
  AND NOT EXISTS (SELECT 1 FROM "Membership" m WHERE m."teamId" = t.id AND m."userId" = u.id);

INSERT INTO "Profile" (uid, "userId", "organizationId", username, "createdAt", "updatedAt")
SELECT gen_random_uuid()::text, u.id, t.id, 'au-admin', now(), now()
FROM "Team" t, users u
WHERE t.slug = 'au-platform' AND u.email = :admin_email
  AND NOT EXISTS (SELECT 1 FROM "Profile" p WHERE p."userId" = u.id AND p."organizationId" = t.id);

-- 6. OAuth client for managed users (secret compared in PLAINTEXT by the API;
--    permissions 1023 = all bits of packages/platform/constants/permissions.ts).
INSERT INTO "PlatformOAuthClient" (id, name, secret, permissions, "organizationId", "redirectUris",
                                   "areCalendarEventsEnabled", "areDefaultEventTypesEnabled", "areEmailsEnabled")
SELECT 'au-platform-client', 'AU ATS', :oauth_client_secret, 1023, t.id, '{}', true, true, false
FROM "Team" t
WHERE t.slug = 'au-platform'
  AND NOT EXISTS (SELECT 1 FROM "PlatformOAuthClient" WHERE id = 'au-platform-client');

COMMIT;

SELECT 'admin user' AS item, id::text AS value FROM users WHERE email = :admin_email
UNION ALL
SELECT 'platform team', id::text FROM "Team" WHERE slug = 'au-platform'
UNION ALL
SELECT 'oauth client', id FROM "PlatformOAuthClient" WHERE id = 'au-platform-client';
