# SecureBank Portfolio Expansion — Design Specification

**Date:** 2026-09-04  
**Repository:** `Bolarinwaab/securebank-online-banking-portal`  
**Status:** Approved direction; implementation follows review of this specification.

## 1. Objective

Evolve SecureBank from an architecture/documentation foundation into a credible end-to-end Cloud Architect + Technical Project Manager portfolio case study. The repository must demonstrate architecture thinking, delivery governance, infrastructure-as-code, application engineering, DevSecOps, reliability, security, and evidence of implementation without implying that a production banking system has actually been deployed.

## 2. Design principles

1. **Credibility first:** distinguish implemented demo components, infrastructure blueprints, and production recommendations.
2. **Google Cloud aligned:** retain the current Cloud Run/GKE, global HTTPS load balancing, Cloud Armor, Spanner/Cloud SQL, Pub/Sub, BigQuery, Secret Manager, monitoring, SLO and regional-failover direction.
3. **Security by design:** least privilege, secrets management, encryption, secure headers, dependency/container scanning, auditability and explicit banking-data boundaries.
4. **Operational readiness:** health checks, observability, SLOs, incident response, backup/restore and DR testing documentation.
5. **Portfolio readability:** recruiters should understand the business problem, architecture, delivery approach, implementation evidence and the author's role within minutes.
6. **No false production claims:** demo data and simulated workflows remain clearly labeled.

## 3. Target repository structure

```text
securebank-online-banking-portal/
├── architecture/
│   ├── diagrams/
│   │   ├── high-level-architecture.md
│   │   ├── network-topology.md
│   │   ├── data-architecture.md
│   │   ├── security-architecture.md
│   │   └── disaster-recovery.md
│   └── decisions/
│       ├── ADR-001-runtime.md
│       ├── ADR-002-primary-data-store.md
│       ├── ADR-003-event-driven-integration.md
│       └── ADR-004-regional-resilience.md
├── infrastructure/
│   └── terraform/
│       ├── README.md
│       ├── versions.tf
│       ├── variables.tf
│       ├── networking.tf
│       ├── iam.tf
│       ├── cloud-run.tf
│       ├── load-balancer.tf
│       ├── security.tf
│       ├── secrets.tf
│       ├── monitoring.tf
│       └── outputs.tf
├── docs/
│   ├── project-management/
│   │   ├── project-charter.md
│   │   ├── business-case.md
│   │   ├── scope.md
│   │   ├── wbs.md
│   │   ├── roadmap.md
│   │   ├── stakeholder-register.md
│   │   ├── raid-log.md
│   │   ├── risk-register.md
│   │   ├── communications-plan.md
│   │   ├── change-control.md
│   │   └── acceptance-criteria.md
│   ├── operations/
│   │   ├── deployment-runbook.md
│   │   ├── incident-response.md
│   │   ├── backup-restore.md
│   │   └── disaster-recovery-test.md
│   └── portfolio/
│       ├── screenshots.md
│       ├── outcomes.md
│       └── competencies.md
├── app/
│   └── ...
├── tests/
│   └── ...
├── .github/workflows/
│   ├── ci.yml
│   └── security.yml
└── README.md
```

## 4. Architecture workstream

Create diagrams that show the request path from users through global HTTPS load balancing and Cloud Armor to application services, then to transactional storage and asynchronous/event/analytics systems. Network documentation will show VPC segmentation, private connectivity, ingress/egress boundaries, service accounts and observability paths.

Data architecture will separate transactional banking data from analytical workloads. Security architecture will document identity, IAM, secrets, encryption, logging and edge protection. DR architecture will document regional failover assumptions, RPO/RTO targets and restore testing.

## 5. Infrastructure workstream

Terraform will provide a portfolio-grade blueprint rather than silently creating billable production resources. Configuration will use variables, clear resource boundaries, least-privilege service identities, Secret Manager integration, monitoring resources and safe placeholders for project/region/network-specific values.

Where a service cannot be safely made fully deployable without environment-specific values, the code will fail clearly or remain a documented blueprint instead of containing invented credentials, project IDs or secrets.

## 6. Application workstream

The existing demo API and dashboard will be upgraded into a coherent banking demonstration with:

- demo login/authentication boundary;
- account summary;
- transaction history;
- transfer workflow with validation and confirmation;
- customer profile/security area;
- notifications/support state;
- responsive presentation;
- explicit demo-data and non-production warnings.

The application must not process real banking credentials, card data or real customer funds.

## 7. DevSecOps workstream

GitHub Actions will validate the project on push and pull request. The pipeline will include formatting/linting where applicable, automated tests, dependency checks, static/security checks, container scanning where a container exists, and a build validation stage. Deployment steps will be documented separately and require environment configuration rather than embedding secrets.

## 8. Project-management workstream

The PM package will translate the technical design into a realistic delivery model. It will include a business case, charter, scope boundaries, WBS, phased roadmap, stakeholder register, RAID/risk management, communication cadence, change control and acceptance criteria. Documents will map practical delivery controls to PMP/PMI-oriented competencies without claiming a formal PMI endorsement of the artifacts.

## 9. Portfolio workstream

The root README will be redesigned as a recruiter-facing landing page with:

- executive summary;
- business problem and solution;
- architecture overview;
- technology stack;
- security/reliability posture;
- PM delivery approach;
- implementation evidence;
- how to run the demo;
- repository navigation;
- explicit "implemented vs blueprint" legend;
- competencies demonstrated;
- roadmap/future production hardening.

## 10. Acceptance criteria

The expansion is considered complete when:

- architecture documentation and diagrams are internally consistent;
- Terraform is syntactically coherent and clearly parameterized;
- the demo application has coherent account/transaction/transfer experiences;
- tests cover core API behavior and key validation paths;
- CI validates the repository on changes;
- security controls and limitations are documented;
- PM artifacts form a consistent delivery story;
- operations and DR documentation align with the architecture;
- README provides a concise recruiter-friendly narrative and working navigation;
- no secrets or real customer data are committed;
- GitHub history contains clear, reviewable commits and the final main branch contains the approved implementation.

## 11. Verification strategy

Before completion, validate repository structure, markdown links where practical, application tests, Terraform formatting/validation where the environment permits, YAML/workflow syntax, and a final consistency pass across architecture, PM and README claims. Any check that requires unavailable cloud credentials will be reported as a limitation rather than represented as passed.

## 12. Delivery approach

Implementation will proceed in staged commits: architecture and PM foundation, infrastructure blueprint, application improvements, DevSecOps, operations/portfolio documentation, then final verification and merge to `main`. The feature branch is intended to keep the expansion reviewable before it reaches the default branch.
