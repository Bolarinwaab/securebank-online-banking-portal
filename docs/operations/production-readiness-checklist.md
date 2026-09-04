# Production Readiness Checklist

## Application
- [ ] Replace demo identity with approved Identity Platform/enterprise IdP integration.
- [ ] Enable MFA with a real approved provider.
- [ ] Enforce customer/resource authorization on every object endpoint.
- [ ] Enforce transfer limits by customer/product/risk tier.
- [ ] Use idempotency for every money-moving command.
- [ ] Persist all financial movements as immutable ledger entries.
- [ ] Implement reconciliation against the payment rail.
- [ ] Implement retry + dead-letter handling for asynchronous events.

## Database
- [ ] Use Cloud SQL PostgreSQL with regional high availability.
- [ ] Enable automated backups and point-in-time recovery.
- [ ] Encrypt connections and restrict network access to private paths.
- [ ] Rotate credentials through Secret Manager.
- [ ] Test restore procedures quarterly.
- [ ] Monitor connection saturation, locks, slow queries and storage.

## Security
- [ ] SAST and dependency scanning on every pull request.
- [ ] Secret scanning and container image scanning.
- [ ] DAST/API security testing in staging.
- [ ] Cloud Armor/WAF policy reviewed by security.
- [ ] Least-privilege IAM and separate service identities.
- [ ] Admin access protected by MFA and privileged-access controls.
- [ ] Audit logs retained according to the applicable policy.

## Reliability
- [ ] Define and measure availability, latency and transaction-success SLOs.
- [ ] Load test normal and peak payment volumes.
- [ ] Test duplicate requests, timeouts, retries and partial failures.
- [ ] Execute regional disaster-recovery exercise.
- [ ] Validate RTO/RPO against business requirements.

## Banking integration
- [ ] Complete KYC/customer onboarding controls.
- [ ] Integrate only through approved payment-rail contracts.
- [ ] Add fraud/AML/sanctions screening where required.
- [ ] Validate transaction fees and limits against current product rules.
- [ ] Complete security assessment, penetration testing and regulatory review before any real-money deployment.

**Release decision:** the portfolio repository is production-architecture ready as a design and engineering demonstration; it is not certified or approved to process real customer funds.
