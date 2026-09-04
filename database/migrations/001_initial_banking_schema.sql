-- SecureBank production-architecture reference schema
-- Synthetic portfolio data only. Never use demo credentials or seed data in production.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_no VARCHAR(20) UNIQUE NOT NULL,
  first_name VARCHAR(80) NOT NULL,
  last_name VARCHAR(80) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(30) UNIQUE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','BLOCKED','CLOSED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  username VARCHAR(80) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(30) NOT NULL DEFAULT 'CUSTOMER' CHECK (role IN ('CUSTOMER','OPS_MAKER','OPS_CHECKER','ADMIN','AUDITOR')),
  mfa_enabled BOOLEAN NOT NULL DEFAULT true,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','LOCKED','DISABLED')),
  failed_login_count INTEGER NOT NULL DEFAULT 0,
  last_login_at TIMESTAMPTZ
);

CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  account_no VARCHAR(20) UNIQUE NOT NULL,
  account_type VARCHAR(20) NOT NULL CHECK (account_type IN ('CURRENT','SAVINGS')),
  currency CHAR(3) NOT NULL DEFAULT 'NGN',
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','DORMANT','BLOCKED','CLOSED')),
  available_balance NUMERIC(19,2) NOT NULL DEFAULT 0 CHECK (available_balance >= 0),
  ledger_balance NUMERIC(19,2) NOT NULL DEFAULT 0 CHECK (ledger_balance >= 0),
  version BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE beneficiaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  bank_code VARCHAR(10) NOT NULL,
  bank_name VARCHAR(120) NOT NULL,
  account_no VARCHAR(20) NOT NULL,
  account_name VARCHAR(160) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE','BLOCKED','PENDING')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(customer_id, bank_code, account_no)
);

CREATE TABLE transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference VARCHAR(40) UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES customers(id),
  source_account_id UUID NOT NULL REFERENCES accounts(id),
  destination_bank_code VARCHAR(10) NOT NULL,
  destination_account_no VARCHAR(20) NOT NULL,
  destination_account_name VARCHAR(160) NOT NULL,
  amount NUMERIC(19,2) NOT NULL CHECK (amount > 0),
  fee NUMERIC(19,2) NOT NULL DEFAULT 0 CHECK (fee >= 0),
  currency CHAR(3) NOT NULL DEFAULT 'NGN',
  status VARCHAR(30) NOT NULL CHECK (status IN ('PENDING','AUTHORIZED','PROCESSING','COMPLETED','FAILED','REVERSED','CANCELLED')),
  idempotency_key VARCHAR(100) UNIQUE NOT NULL,
  failure_code VARCHAR(50),
  failure_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE ledger_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_ref VARCHAR(40) NOT NULL,
  account_id UUID NOT NULL REFERENCES accounts(id),
  entry_type VARCHAR(10) NOT NULL CHECK (entry_type IN ('DEBIT','CREDIT')),
  amount NUMERIC(19,2) NOT NULL CHECK (amount > 0),
  currency CHAR(3) NOT NULL DEFAULT 'NGN',
  balance_after NUMERIC(19,2) NOT NULL CHECK (balance_after >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  resource_id VARCHAR(100),
  outcome VARCHAR(20) NOT NULL CHECK (outcome IN ('SUCCESS','FAILURE','DENIED')),
  correlation_id VARCHAR(100),
  ip_address INET,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE idempotency_keys (
  key VARCHAR(100) PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES customers(id),
  request_hash CHAR(64) NOT NULL,
  response_status INTEGER,
  response_body JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_accounts_customer ON accounts(customer_id);
CREATE INDEX idx_transfers_customer_created ON transfers(customer_id, created_at DESC);
CREATE INDEX idx_ledger_account_created ON ledger_entries(account_id, created_at DESC);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_actor ON audit_logs(actor_user_id, created_at DESC);

-- Financial invariant: every completed transfer must have matching debit/credit entries.
CREATE VIEW transfer_ledger_control AS
SELECT t.reference,
       t.amount,
       COALESCE(SUM(CASE WHEN l.entry_type = 'DEBIT' THEN l.amount ELSE 0 END),0) AS debits,
       COALESCE(SUM(CASE WHEN l.entry_type = 'CREDIT' THEN l.amount ELSE 0 END),0) AS credits
FROM transfers t
LEFT JOIN ledger_entries l ON l.transaction_ref = t.reference
GROUP BY t.reference, t.amount;
