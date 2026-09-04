-- SecureBank runtime compatibility migration.
-- Align transfer status storage with the parameter type inferred by the PostgreSQL runtime query.

DROP VIEW IF EXISTS transfer_ledger_control;

ALTER TABLE transfers
  ALTER COLUMN status TYPE TEXT
  USING status::text;

CREATE VIEW transfer_ledger_control AS
SELECT
  t.reference,
  t.status,
  t.amount,
  t.fee,
  t.amount + t.fee AS expected_debit,
  COALESCE(SUM(CASE WHEN l.entry_type = 'DEBIT' THEN l.amount ELSE 0 END), 0) AS actual_debit,
  COALESCE(SUM(CASE WHEN l.entry_type = 'CREDIT' THEN l.amount ELSE 0 END), 0) AS actual_credit,
  CASE
    WHEN t.status = 'COMPLETED'
      THEN COALESCE(SUM(CASE WHEN l.entry_type = 'DEBIT' THEN l.amount ELSE 0 END), 0) = t.amount + t.fee
       AND COALESCE(SUM(CASE WHEN l.entry_type = 'CREDIT' THEN l.amount ELSE 0 END), 0) IN (0, t.amount)
    WHEN t.status = 'REVERSED'
      THEN COALESCE(SUM(CASE WHEN l.entry_type = 'DEBIT' THEN l.amount ELSE 0 END), 0) = t.amount + t.fee
       AND COALESCE(SUM(CASE WHEN l.entry_type = 'CREDIT' THEN l.amount ELSE 0 END), 0) = t.amount + t.fee
    ELSE TRUE
  END AS balanced
FROM transfers t
LEFT JOIN ledger_entries l ON l.transaction_ref = t.reference OR l.transaction_ref = t.reference || '-REV'
GROUP BY t.reference, t.status, t.amount, t.fee;

COMMENT ON COLUMN transfers.status IS 'Transfer lifecycle state stored as text for compatibility with parameterized runtime status expressions.';
