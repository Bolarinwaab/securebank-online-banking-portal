# Production Cutover Plan

## Phase 1 — persistence

Introduce a repository interface behind the banking domain service. Implement PostgreSQL repositories using parameterized SQL and explicit transaction boundaries. Run schema migrations in staging and validate transfer invariants.

## Phase 2 — identity

Integrate the approved identity provider and MFA/token service. Remove demo OTPs and credentials. Enforce customer-to-resource authorization at the service layer.

## Phase 3 — payment adapter

Implement a contract-tested adapter for the approved Nigerian payment rail. Keep external calls outside the core DB transaction and use durable states plus reconciliation.

## Phase 4 — operations

Enable maker/checker approvals for privileged operations, fraud/AML screening, monitoring, alerting, reconciliation and controlled reversal procedures.

## Phase 5 — security and resilience

Complete SAST/SCA/secret/container/DAST testing, penetration testing, load testing, backup restoration and regional disaster-recovery exercises.

## Phase 6 — release governance

Obtain business, security, operations, legal/compliance and risk approvals. Define RTO/RPO and SLO targets. Release through a controlled CI/CD pipeline with rollback capability.

No production cutover should occur until the applicable regulatory, security and payment-network requirements have been satisfied.
