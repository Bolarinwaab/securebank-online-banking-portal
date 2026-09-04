-- SecureBank reconciliation controls v2
-- Synthetic portfolio database only.

DROP VIEW IF EXISTS transfer_ledger_control;

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
    WHEN t.status = 'COMPLETED' AND t.destination_bank_code = '044'
      THEN COALESCE(SUM(CASE WHEN l.entry_type = 'DEBIT' THEN l.amount ELSE 0 END), 0) = t.amount + t.fee
       AND COALESCE(SUM(CASE WHEN l.entry_type = 'CREDIT' THEN l.amount ELSE 0 END), 0) = t.amount
    WHEN t.status = 'COMPLETED'
      THEN COALESCE(SUM(CASE WHEN l.entry_type = 'DEBIT' THEN l.amount ELSE 0 END), 0) = t.amount + t.fee
    WHEN t.status = 'REVERSED'
      THEN COALESCE(SUM(CASE WHEN l.entry_type = 'DEBIT' THEN l.amount ELSE 0 END), 0) = t.amount + t.fee
       AND COALESCE(SUM(CASE WHEN l.entry_type = 'CREDIT' THEN l.amount ELSE 0 END), 0) = t.amount + t.fee
    ELSE TRUE
  END AS balanced
FROM transfers t
LEFT JOIN ledger_entries l ON l.transaction_ref = t.reference OR l.transaction_ref = t.reference || '-REV'
GROUP BY t.reference, t.status, t.amount, t.fee, t.destination_bank_code;

CREATE INDEX IF NOT EXISTS idx_idempotency_expires ON idempotency_keys(expires_at);
CREATE INDEX IF NOT EXISTS idx_transfers_status_created ON transfers(status, created_at DESC);

COMMENT ON VIEW transfer_ledger_control IS 'Reconciliation control for synthetic transfer ledger movements; distinguishes internal, external and reversed flows.';
