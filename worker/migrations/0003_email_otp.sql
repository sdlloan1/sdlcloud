CREATE TABLE IF NOT EXISTS email_otps (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL,
  "purpose" TEXT NOT NULL,
  "code_hash" TEXT NOT NULL,
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "used_at" TEXT,
  "expires_at" TEXT NOT NULL,
  "created_at" TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_email_otps_lookup ON email_otps(lower("email"), "purpose", "created_at");
