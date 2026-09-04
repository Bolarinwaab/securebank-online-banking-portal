# SecureBank Online Banking Portal

![Portfolio](https://img.shields.io/badge/portfolio-Cloud%20Architect%20%2B%20Technical%20PM-blue)
![Cloud](https://img.shields.io/badge/cloud-Google%20Cloud-4285F4)
![Security](https://img.shields.io/badge/security-DevSecOps-green)
![Banking](https://img.shields.io/badge/banking-Nigerian%20sandbox-orange)
![Database](https://img.shields.io/badge/database-PostgreSQL-336791)

## Executive summary

SecureBank is a functional portfolio implementation of a Nigerian digital-banking platform. It demonstrates customer authentication, NGN accounts, balances, transaction history, beneficiary verification, intra-bank and inter-bank transfers, transfer limits, authorization, fees, reversals, bill-payment simulation, audit events and operations reporting. The application now supports a **real PostgreSQL persistence runtime** while retaining the original in-memory implementation as a lightweight model/reference mode.

> **Important:** This is an independently implemented portfolio sandbox using synthetic data. It is not an Access Bank product, does not connect to Access Bank or any other bank, does not process real money, and is not a production banking or regulatory-certified system.

## Access Bank-informed business context

The product journeys are informed by publicly documented Access Bank online-banking capabilities: accounts, transaction history, beneficiaries, transfers to other banks, bills, statements and token-based transaction authorization. Public Access Bank material also describes beneficiary name enquiry and reversal handling for failed electronic transfers. These public references are used only as product requirements context; no confidential/internal Access Bank material is reproduced.

## Functional banking experience

```text
Login → Session → Accounts → Beneficiary verification → Transfer review
                                      ↓
                              Authorization / OTP
                                      ↓
                      Validation → PostgreSQL transaction
                                      ↓
                Row lock → Debit → Ledger entry → Credit
                                      ↓
                     Idempotency → Audit → Response
```

### Customer features

- Secure demo session authentication
- Customer profile and MFA status
- NGN savings and current accounts
- Available and ledger balances
- Transaction history
- Beneficiary/name-enquiry simulation
- Intra-bank transfers with atomic source debit and destination credit
- Inter-bank transfer simulation with fee and reference
- Daily transfer limit and insufficient-funds controls
- Failed-transfer reversal simulation
- PostgreSQL-backed bill-payment transaction
- Notifications
- Responsive banking dashboard

### Production-oriented persistence controls

- PostgreSQL connection pooling
- Parameterized SQL queries
- Atomic database transactions
- `SELECT ... FOR UPDATE` row locking for balance mutation
- Double-entry ledger records for transfers
- Persisted idempotency keys and request hashing
- Balance/version increments for concurrency control
- Audit records with correlation IDs
- PostgreSQL health endpoint
- Docker Compose PostgreSQL runtime
- GitHub Actions PostgreSQL integration environment

## Architecture

```mermaid
flowchart LR
 User[Customer] --> Edge[Global HTTPS + Cloud Armor]
 Edge --> App[Cloud Run API]
 App --> Auth[Identity Platform / IAM]
 App --> PG[(PostgreSQL / Cloud SQL)]
 App --> Cache[Memorystore]
 App --> Events[Pub/Sub]
 Events --> Workers[Cloud Run Workers]
 Workers --> PG
 Events --> Analytics[BigQuery]
 App --> Secrets[Secret Manager]
 App --> Obs[Monitoring / Logging / Trace]
```

## Implemented vs blueprint

| Area | Status |
|---|---|
| Nigerian digital banking UI | **Implemented sandbox** |
| Authentication/session | **Implemented sandbox** |
| Accounts/balances | **Implemented with PostgreSQL mode** |
| Beneficiary verification | **Implemented simulation** |
| Intra/inter-bank transfers | **Implemented with PostgreSQL transaction layer** |
| Fees/limits/reversals | **Implemented domain logic** |
| Bill payments | **Implemented with PostgreSQL mode** |
| Audit/operations APIs | **Implemented** |
| PostgreSQL schema/repository | **Implemented** |
| Atomic ledger transaction processing | **Implemented** |
| Idempotency | **Implemented** |
| Docker PostgreSQL runtime | **Implemented** |
| PostgreSQL CI integration | **Implemented workflow** |
| Automated banking domain tests | **Implemented** |
| GitHub Actions security/CI | **Implemented workflow** |
| Architecture diagrams/ADRs | **Implemented documentation** |
| Terraform Cloud SQL | **Parameterized blueprint** |
| Cloud Run/GCP production deployment | **Blueprint** |
| Enterprise identity/HSM/payment rails | **Blueprint / integration boundary** |
| Multi-region failover | **Design + test procedure** |
| Real banking integrations | **Out of scope** |

## Run the PostgreSQL application

```bash
docker compose up --build
```

The stack initializes PostgreSQL from `database/migrations/001_initial_banking_schema.sql` and `database/seed/001_demo_data.sql`, then starts the API with `PERSISTENCE=postgres`.

- API: `http://localhost:8080`
- Health: `http://localhost:8080/health`
- PostgreSQL: `localhost:5432`

For direct Node execution:

```bash
cd app
npm install
PERSISTENCE=postgres DATABASE_URL=postgresql://securebank:securebank_local_only@localhost:5432/securebank npm start
```

The synthetic PostgreSQL demo user is `alex.morgan` and the local-only demo password is `PORTFOLIO_ONLY`. Never reuse it outside this portfolio sandbox.

## Original model/reference mode

The original implementation remains available as the memory-backed domain model. It can be started without PostgreSQL:

```bash
cd app
npm install
PERSISTENCE=memory npm start
```

This mode is useful for demonstrations and unit testing without infrastructure. The PostgreSQL mode is the main implementation path for the production-architecture portfolio.

## Repository map

### Architecture
- `architecture/diagrams/` — high-level, network, data, security and DR views
- `architecture/decisions/` — architecture decision records
- `docs/architecture/production-architecture.md` — target production architecture
- `docs/architecture/database-transaction-pattern.md` — transaction consistency pattern
- `docs/architecture/production-components.md` — production component catalogue
- `docs/architecture/production-cutover.md` — migration/cutover plan

### Database
- `database/migrations/001_initial_banking_schema.sql` — PostgreSQL schema
- `database/seed/001_demo_data.sql` — synthetic local seed
- `database/README.md` — database operating notes
- `app/src/postgres-repository.js` — PostgreSQL runtime repository
- `app/src/postgres-repository.test.js` — PostgreSQL repository tests

### Infrastructure
- `infrastructure/terraform/` — parameterized GCP blueprint
- `docker-compose.yml` — local PostgreSQL + API runtime

### Application
- `app/server.js` — HTTP API and persistence-mode selection
- `app/src/banking.js` — original in-memory banking domain model
- `app/public/index.html` — responsive customer dashboard

### Delivery
- `.github/workflows/` — CI/security automation
- `docs/project-management/` — charter, business case, WBS, roadmap, RAID, risks, communications and change control
- `docs/operations/` — deployment, incident, backup/restore, DR and PostgreSQL runtime procedures
- `docs/portfolio/` — outcomes, competencies and screenshot guidance

## Professional positioning

This project demonstrates the combined perspective of a **Cloud Architect and Technical Project Manager**: translating banking business journeys into architecture, APIs, security controls, reliability objectives, database consistency, delivery governance and an executable software demonstration.

## Data and security boundary

All customer names, account numbers, balances, credentials and transactions are synthetic. Do not enter real banking information. Production implementation would require regulated-bank sponsorship, approved payment-network integrations, strong customer authentication, HSM/token controls, KYC/AML processes, fraud controls, privacy controls, penetration testing, independent security review, reconciliation and applicable Nigerian regulatory compliance.

## License

See `LICENSE`.
