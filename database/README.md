# SecureBank Database

This directory contains the PostgreSQL reference model for the production architecture.

## Layers

- `migrations/001_initial_banking_schema.sql` — core relational schema
- `seed/001_demo_data.sql` — synthetic local-only customer/account data

## Key controls

- UUID primary keys
- unique customer/account/transfer identifiers
- `NUMERIC(19,2)` for monetary values
- immutable-style ledger entries
- transfer state machine
- idempotency keys and request hashes
- customer-scoped beneficiary records
- audit/security records
- account versioning for concurrency control
- transfer ledger control view for reconciliation checks

For real production use, database migrations must run through a controlled migration service and all credentials must be supplied through the approved secret-management platform.
