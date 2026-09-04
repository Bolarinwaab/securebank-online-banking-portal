# SecureBank Portfolio Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn SecureBank from a documentation-first blueprint into a recruiter-ready Cloud Architect + Project Manager portfolio with demonstrable application, infrastructure-as-code, security, DevSecOps, operations, DR and delivery governance artifacts.

**Architecture:** Keep the current Google Cloud reference architecture and add implementation-oriented layers around it. The demo application remains explicitly non-production and uses synthetic data; Terraform is modular and safe-by-default; diagrams and PM documents explain the production target without pretending that cloud resources have been provisioned.

**Tech Stack:** Node.js 20+, built-in Node test runner, HTML/CSS/JavaScript, Docker, Terraform >=1.6, Google Cloud reference services, GitHub Actions, Mermaid.

**Spec:** `docs/superpowers/specs/2026-09-04-securebank-portfolio-expansion-design.md`

## Global Constraints

- Never commit credentials, private keys, tokens, service-account JSON, or real customer data.
- Label demo application data and unprovisioned cloud resources honestly.
- Preserve existing API and architecture documentation unless an update improves consistency.
- Prefer least privilege, private networking, encryption, MFA and auditable operations.
- Terraform must default to validation-friendly placeholders/variables rather than attempting unsafe deployment.
- Every application change must have an executable verification path.

---

### Task 1: Repository foundation and developer quality

**Files:**
- Create: `package.json`, `test/server.test.js`, `Dockerfile`, `.dockerignore`, `.github/workflows/securebank-ci.yml`
- Modify: `server.js`

**Interfaces:**
- `GET /health` returns HTTP 200 and `{status:"ok",service:"securebank-api"}`.
- `GET /api/v1/accounts` returns the demo account collection.
- `GET /api/v1/accounts/:id/balance` returns balance data or 404.
- `GET /api/v1/accounts/:id/transactions` returns transaction data or 404.

- [ ] Add a Node package manifest with `npm test` mapped to `node --test` and `npm start` mapped to `node server.js`.
- [ ] Add tests covering health, account retrieval, balance lookup, unknown account handling and transaction retrieval.
- [ ] Refactor the HTTP server so it can be imported by tests without starting a listener automatically, while preserving port 8080 for normal execution.
- [ ] Add a minimal non-root Node container using `node:20-alpine`, expose 8080 and run `npm start`.
- [ ] Add GitHub Actions to run tests, `npm audit --audit-level=high`, build the container and run a smoke check on `/health`.
- [ ] Verify locally with `npm test` and `node --check server.js`.

### Task 2: Professional banking application experience

**Files:**
- Modify: `index.html`
- Create: `public/app.js`, `public/styles.css`

**Interfaces:**
- Browser UI consumes the existing REST endpoints through `API_BASE`.
- UI exposes dashboard, accounts, transaction history, quick actions, security/support cards and a demo transfer interaction without processing real money.

- [ ] Build responsive navigation and dashboard cards for total balance, checking, savings and service health.
- [ ] Load account and transaction data from the API rather than duplicating values in markup.
- [ ] Add accessible transfer, bill-pay and deposit demo flows that clearly state they are simulations.
- [ ] Add customer profile/security panel with MFA status and session notice.
- [ ] Add loading, empty and API-error states.
- [ ] Keep synthetic customer identity and balances clearly marked as portfolio demo data.
- [ ] Verify with the local API and browser smoke test instructions documented in README.

### Task 3: Architecture diagrams and technical decision records

**Files:**
- Create: `architecture/README.md`, `architecture/high-level.md`, `architecture/network-topology.md`, `architecture/data-architecture.md`, `architecture/security-architecture.md`, `architecture/disaster-recovery.md`, `docs/adr/001-cloud-run-and-gke.md`, `docs/adr/002-spanner-vs-cloud-sql.md`, `docs/adr/003-event-driven-integration.md`

**Interfaces:**
- Mermaid diagrams must be renderable by GitHub and reference only documented services.
- ADRs record decision, context, alternatives, trade-offs and consequences.

- [ ] Create a high-level GCP flow from users through global HTTPS load balancing and Cloud Armor to application services, data, messaging, analytics and observability.
- [ ] Create network topology showing VPC, public edge, private application tier, private data services, NAT/egress and regional failover.
- [ ] Create logical data architecture showing transactional data, event streams and analytical data.
- [ ] Create security architecture showing IAM, Identity Platform, Secret Manager, KMS, Cloud Armor, audit logs and monitoring.
- [ ] Create DR architecture showing primary/secondary region strategy, backups, replication, RTO/RPO and failover sequence.
- [ ] Record the major architecture decisions and explicit reasons for them.
- [ ] Verify every diagram's service names match the repository's GCP documentation.

### Task 4: Terraform infrastructure blueprint

**Files:**
- Create: `infrastructure/terraform/versions.tf`, `variables.tf`, `main.tf`, `outputs.tf`, `network.tf`, `iam.tf`, `cloud-run.tf`, `security.tf`, `monitoring.tf`, `terraform.tfvars.example`, `README.md`

**Interfaces:**
- Inputs include `project_id`, `region`, `secondary_region`, `environment`, `vpc_cidr`, `service_name` and `enable_production_resources`.
- Outputs include VPC name, service name and documented endpoints when resources are provisioned.

- [ ] Define Terraform and Google provider constraints.
- [ ] Define reusable variables with validation for environment and CIDR inputs.
- [ ] Create VPC and regional subnets with private Google access and controlled egress.
- [ ] Define service-account/IAM roles using least privilege.
- [ ] Define Cloud Run service configuration with no plaintext secrets.
- [ ] Define Cloud Armor/security policy and monitoring resources behind an explicit production-resource flag.
- [ ] Add example variables and a README explaining `terraform fmt`, `terraform validate`, plan review and deployment prerequisites.
- [ ] Verify with `terraform fmt -check -recursive` and `terraform validate` where the installed provider is available.

### Task 5: Project management and governance portfolio

**Files:**
- Create: `docs/project-management/project-charter.md`, `business-case.md`, `scope-management.md`, `wbs.md`, `roadmap.md`, `stakeholder-register.md`, `raid-log.md`, `risk-register.md`, `communication-plan.md`, `change-control.md`, `acceptance-criteria.md`, `quality-management.md`

**Interfaces:**
- All artifacts describe one consistent SecureBank program, scope, milestones, risks and governance model.

- [ ] Define business problem, measurable objectives, assumptions, constraints, budget approach and success criteria.
- [ ] Create WBS covering discovery, architecture, application, cloud infrastructure, security, testing, migration/readiness and handover.
- [ ] Create a phased roadmap with discovery, design, build, test, security validation, DR test and go-live readiness.
- [ ] Define stakeholder influence/interest, communication cadence and escalation path.
- [ ] Populate realistic RAID and risk examples with probability, impact, owner, response and trigger.
- [ ] Define change request flow, approval authority and acceptance criteria.
- [ ] Map quality controls to architecture, code, security, performance, resilience and operational readiness.

### Task 6: DevSecOps, operations and resilience evidence

**Files:**
- Create: `.github/dependabot.yml`, `ops/runbook.md`, `ops/incident-response.md`, `ops/backup-restore.md`, `ops/dr-test-plan.md`, `ops/observability.md`, `security/threat-model.md`, `security/security-controls.md`
- Modify: `.github/workflows/securebank-ci.yml`

**Interfaces:**
- CI produces test/build/security evidence without requiring cloud credentials.
- Operational documents align with the SLI/SLO and DR targets already described in the repository.

- [ ] Add dependency update automation and security-oriented CI checks.
- [ ] Document deployment promotion, rollback, health checks and incident triage.
- [ ] Document backup/restore verification and DR failover exercises.
- [ ] Define metrics, logs, traces, alerts and SLO error-budget response.
- [ ] Create a threat model covering identity, API abuse, injection, secrets, data exposure, supply chain and denial-of-service risks.
- [ ] Map security controls to preventive, detective and corrective categories.

### Task 7: Portfolio README, navigation and final verification

**Files:**
- Modify: `README.md`
- Create: `docs/portfolio/case-study.md`, `docs/portfolio/my-role.md`, `docs/portfolio/competency-matrix.md`, `docs/portfolio/demo-guide.md`, `docs/portfolio/recruiter-summary.md`, `screenshots/README.md`

**Interfaces:**
- README is the entry point and links to every major deliverable.
- Portfolio documents distinguish implemented demo functionality from target production architecture.

- [ ] Rewrite README as a recruiter-facing case study with architecture summary, repository map, quick start, security posture, SLOs, DR, IaC, PM artifacts and demo instructions.
- [ ] Document the architect/project-manager role and map evidence to Cloud Architect, Solutions Architect, DevOps and PMP-oriented competencies.
- [ ] Add a demo guide with exact local commands and API examples.
- [ ] Add a screenshot capture checklist rather than inventing production screenshots.
- [ ] Run application tests, syntax checks, Terraform formatting/validation where available, and repository consistency checks.
- [ ] Compare the feature branch with `main`, create a pull request, review the diff, and merge after verification.
