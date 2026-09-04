# Production Upgrade Index

- `database/` — PostgreSQL schema, controls and synthetic seed data
- `docker-compose.yml` — local PostgreSQL + API topology
- `infrastructure/terraform/database.tf` — Cloud SQL regional HA/PITR blueprint
- `docs/architecture/production-architecture.md` — target production architecture
- `docs/architecture/database-transaction-pattern.md` — financial consistency and idempotency pattern
- `docs/architecture/production-components.md` — component catalogue
- `docs/architecture/production-cutover.md` — enterprise cutover sequence
- `docs/operations/production-readiness-checklist.md` — production release gates

The public application remains a safe synthetic sandbox. Real-money processing requires regulated enterprise integration and approval.
