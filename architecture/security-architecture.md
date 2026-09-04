# Security Architecture

```mermaid
flowchart TB
  User[Customer] --> MFA[Identity Platform + MFA]
  User --> Edge[HTTPS LB]
  Edge --> WAF[Cloud Armor]
  WAF --> App[Application Services]
  App --> IAM[Service Accounts / IAM]
  App --> Secrets[Secret Manager]
  App --> KMS[Cloud KMS]
  App --> Data[(Encrypted Data)]
  App --> Audit[Cloud Audit Logs]
  Audit --> SIEM[Security Monitoring / Alerting]
  CI[GitHub Actions] --> Scan[SAST / Dependency / Container Checks]
  Scan --> Deploy[Controlled Deployment]
```

## Security layers

1. Identity: MFA, strong authentication and service identities.
2. Edge: TLS, Cloud Armor and rate/WAF policies.
3. Workload: least-privilege service accounts and hardened containers.
4. Secrets: Secret Manager/KMS; no credentials in source control.
5. Data: encryption, access boundaries, retention and auditability.
6. Supply chain: dependency review, automated tests and image scanning.
7. Detection: audit logs, monitoring, alerts and incident response.
