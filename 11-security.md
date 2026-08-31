# 11. Security Model

## Defense in depth

1. **Identity** — managed identity provider, MFA, strong session controls.
2. **Authorization** — least-privilege IAM and application RBAC.
3. **Network** — private VPC services, restrictive firewall rules, controlled ingress/egress.
4. **Edge protection** — HTTPS everywhere, Cloud Armor/WAF, rate limiting.
5. **Data protection** — encryption at rest and in transit; managed keys where required.
6. **Secrets** — Secret Manager; never commit credentials to Git.
7. **Auditability** — centralized logging and immutable financial/security audit events.
8. **Application security** — input validation, parameterized queries, CSRF protection where relevant, dependency scanning, secure headers, and regular penetration testing.
9. **Operational security** — security monitoring, alerts, vulnerability management, and controlled deployment approvals.

## Example firewall posture

- Allow public HTTPS only through the global load-balancing edge.
- Allow backend traffic only from approved service identities/network paths.
- Deny unnecessary inbound traffic by default.
- Restrict administrative access to approved secure paths.
