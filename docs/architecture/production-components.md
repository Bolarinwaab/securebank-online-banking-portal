# Production Component Catalogue

| Capability | Target component | Purpose |
|---|---|---|
| Edge | Global HTTPS Load Balancer | Global ingress and TLS termination |
| WAF | Cloud Armor | DDoS and application protection |
| API | Cloud Run | Stateless banking API services |
| Identity | Identity Platform | Customer authentication and MFA integration |
| System of record | Cloud SQL PostgreSQL | Relational banking state and ledger |
| Cache | Memorystore Redis | Rate limits, ephemeral session/cache data |
| Events | Pub/Sub | Durable asynchronous domain events |
| Workers | Cloud Run Jobs/Services | Notifications, reconciliation and background processing |
| Secrets | Secret Manager | Runtime credentials and keys |
| Analytics | BigQuery | Operational and business analytics |
| Observability | Cloud Logging/Monitoring/Trace | Logs, metrics, traces and alerts |
| Supply chain | Artifact Registry + CI/CD | Versioned container artifacts and controlled releases |

The components are a target production topology. The public portfolio demo deliberately remains safe, synthetic and runnable without cloud credentials.
