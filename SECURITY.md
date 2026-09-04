# Security Policy

SecureBank is a portfolio demonstration and must not be used with real banking credentials, customer data, payment-card information or funds.

## Reporting

Do not disclose suspected secrets or vulnerabilities publicly before responsible review. Remove credentials from test environments immediately and rotate any accidentally exposed secret.

## Security baseline

- Least privilege IAM
- Secret Manager for secrets
- TLS in transit and managed encryption at rest
- Cloud Armor at the edge
- Dependency and static security checks in CI
- Audit logging and monitoring
- Tested backup and recovery
