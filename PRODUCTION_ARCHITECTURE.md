# Production Architecture Upgrade

SecureBank now includes a production-architecture reference layer covering:

- PostgreSQL/Cloud SQL relational banking model
- immutable ledger entries and financial invariants
- idempotency and duplicate-request protection
- transaction consistency and concurrency controls
- Cloud SQL regional HA, backups and PITR blueprint
- Dockerized local database environment
- Pub/Sub asynchronous processing model
- Secret Manager and least-privilege service identity model
- Cloud Armor/WAF edge protection
- audit logging, observability and reconciliation patterns
- production readiness and regulated-integration gates

Start with `docs/architecture/production-architecture.md`, `docs/architecture/database-transaction-pattern.md`, `database/README.md` and `docs/operations/production-readiness-checklist.md`.

This is a portfolio architecture and synthetic sandbox. It is not authorized to process real customer funds.
