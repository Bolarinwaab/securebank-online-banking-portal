# Production Architecture Upgrade Plan

## Goal
Move SecureBank from a functional in-memory banking demo toward a production-architecture reference implementation while keeping all data synthetic and all external payment integrations simulated.

## Workstreams

1. **Persistence** — PostgreSQL schema for customers, users, accounts, beneficiaries, transfers, immutable ledger entries, audit logs and idempotency keys.
2. **Financial integrity** — transactional debit/credit pattern, account locking, optimistic versioning, unique references and idempotency.
3. **Platform** — Cloud SQL regional HA, private connectivity, backups/PITR, Secret Manager and Cloud Run service identities.
4. **Asynchronous processing** — Pub/Sub event model for notifications, analytics and external payment adapters.
5. **Security** — least privilege, WAF, MFA, object-level authorization, secret scanning, dependency scanning and API security testing.
6. **Operations** — reconciliation, monitoring, SLOs, incident response and disaster recovery.
7. **Delivery governance** — production readiness gates and architecture decision records.

## Exit criteria

- Database schema is versioned and reproducible.
- Financial invariants and idempotency are explicitly documented.
- Local Docker stack can represent the target database topology.
- Cloud deployment blueprint covers relational persistence and secrets.
- Production readiness checklist identifies all controls still requiring regulated enterprise integration.
- No live bank credentials, customer data or payment-rail credentials are stored in the repository.
