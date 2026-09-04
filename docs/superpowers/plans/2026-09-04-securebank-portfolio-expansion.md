# SecureBank Portfolio Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Turn SecureBank into a credible end-to-end Cloud Architect + Technical Project Manager portfolio case study with an executable demo, parameterized GCP/Terraform blueprint, DevSecOps controls, operations documentation, and PM artifacts.

**Architecture:** Preserve the Google Cloud reference architecture while clearly separating demo implementation from production blueprint. The application remains safe demo software using synthetic data; infrastructure is parameterized and does not embed credentials or project-specific secrets.

**Tech Stack:** Node.js HTTP API, HTML/CSS/JavaScript demo UI, OpenAPI, Terraform, Google Cloud reference services, GitHub Actions, Markdown documentation.

**Spec:** docs/superpowers/specs/2026-09-04-securebank-portfolio-expansion-design.md

## Global Constraints

- No real banking credentials, card data, customer data, or funds.
- No hard-coded secrets, credentials, project IDs, or private keys.
- Google Cloud architecture remains Cloud Run/GKE, global HTTPS load balancing, Cloud Armor, Spanner/Cloud SQL, Pub/Sub, BigQuery, Secret Manager and Cloud Monitoring oriented.
- Terraform is a safe parameterized blueprint unless environment values are supplied.
- Implemented demo features must be distinguished from production recommendations.
- Final verification must not claim cloud deployment validation without cloud credentials.

---

### Task 1: Architecture and decision records

**Files:** Create architecture/diagrams/high-level-architecture.md, network-topology.md, data-architecture.md, security-architecture.md, disaster-recovery.md and architecture/decisions/ADR-001-runtime.md through ADR-004-regional-resilience.md.

- [ ] Document request flow, network segmentation, data separation, security boundaries and DR assumptions.
- [ ] Add Mermaid diagrams that render in GitHub Markdown.
- [ ] Record decisions, alternatives, consequences and operational implications.
- [ ] Commit architecture foundation.

### Task 2: Terraform blueprint

**Files:** Create infrastructure/terraform/README.md, versions.tf, variables.tf, networking.tf, iam.tf, cloud-run.tf, load-balancer.tf, security.tf, secrets.tf, monitoring.tf, outputs.tf.

- [ ] Define Terraform/provider constraints and variables.
- [ ] Define parameterized VPC/subnet and service identities.
- [ ] Define Cloud Run, edge security, Secret Manager and monitoring blueprint resources.
- [ ] Keep resources safe to inspect without credentials.
- [ ] Document initialization/plan/apply commands and required environment variables.
- [ ] Commit infrastructure foundation.

### Task 3: Demo application

**Files:** Modify server.js and index.html; create app/package.json, app/server.js, app/public/index.html, app/README.md and tests/server.test.js.

- [ ] Implement account, transaction, profile and transfer demo endpoints with validation.
- [ ] Ensure transfer is demonstrative and does not persist real funds.
- [ ] Add responsive dashboard sections for balances, transactions, transfer confirmation, security and notifications.
- [ ] Add automated Node tests for health, account lookup, transactions, validation and transfer simulation.
- [ ] Commit application upgrade.

### Task 4: DevSecOps

**Files:** Create .github/workflows/ci.yml, .github/workflows/security.yml, .github/dependabot.yml, SECURITY.md and .dockerignore/Dockerfile where applicable.

- [ ] Run Node tests and repository structure validation.
- [ ] Add dependency audit and static checks.
- [ ] Add container build/scanning workflow without publishing secrets.
- [ ] Document deployment gates and secret handling.
- [ ] Commit DevSecOps controls.

### Task 5: Project management package

**Files:** Create docs/project-management/project-charter.md, business-case.md, scope.md, wbs.md, roadmap.md, stakeholder-register.md, raid-log.md, risk-register.md, communications-plan.md, change-control.md and acceptance-criteria.md.

- [ ] Define business outcomes, scope, assumptions, milestones and governance.
- [ ] Add WBS, roadmap, stakeholder matrix, RAID and risk scoring.
- [ ] Define communications and change-control cadence.
- [ ] Define testable acceptance criteria.
- [ ] Commit PM package.

### Task 6: Operations and portfolio evidence

**Files:** Create docs/operations/deployment-runbook.md, incident-response.md, backup-restore.md, disaster-recovery-test.md, docs/portfolio/screenshots.md, outcomes.md and competencies.md.

- [ ] Document deployment, rollback, incident response, backup/restore and DR exercises.
- [ ] Explain evidence available from the demo and repository.
- [ ] Map Cloud Architect, DevSecOps and PMP-oriented competencies to artifacts.
- [ ] Commit operations/portfolio package.

### Task 7: Recruiter-facing README and final verification

**Files:** Modify README.md and add supporting repository documentation as needed.

- [ ] Add executive summary, architecture, technology stack, security/reliability posture, PM approach, run instructions and navigation.
- [ ] Add implemented-vs-blueprint legend.
- [ ] Validate Markdown/YAML/Terraform structure where available.
- [ ] Run application tests.
- [ ] Review claims for accuracy and remove production overstatement.
- [ ] Merge approved implementation into main.
