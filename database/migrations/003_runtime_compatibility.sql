-- SecureBank runtime compatibility migration.
-- Align transfer status storage with the parameter type inferred by the PostgreSQL runtime query.

ALTER TABLE transfers
  ALTER COLUMN status TYPE TEXT
  USING status::text;

COMMENT ON COLUMN transfers.status IS 'Transfer lifecycle state stored as text for compatibility with parameterized runtime status expressions.';
