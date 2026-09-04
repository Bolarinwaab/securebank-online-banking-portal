# Production V2 Completion Map

1. Database: PostgreSQL schema + synthetic seed.
2. Financial integrity: ledger, idempotency, locking/versioning pattern.
3. Platform: Cloud SQL regional HA/PITR blueprint + Docker Compose.
4. Security: Secret Manager, least privilege, WAF and OWASP API controls.
5. Reliability: reconciliation, retries, audit and disaster recovery design.
6. Operations: readiness checklist and cutover plan.

The implementation boundary is explicit: live payment rails and real customer funds remain out of scope.