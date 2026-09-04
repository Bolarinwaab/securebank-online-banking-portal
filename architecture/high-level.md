# High-Level Google Cloud Architecture

```mermaid
flowchart LR
  U[Customers / Web & Mobile] --> DNS[Cloud DNS]
  DNS --> LB[Global HTTPS Load Balancer]
  LB --> ARMOR[Cloud Armor]
  ARMOR --> RUN[Cloud Run / GKE Services]
  RUN --> ID[Identity Platform + IAM]
  RUN --> SP[Cloud Spanner / Cloud SQL]
  RUN --> PUB[Pub/Sub]
  PUB --> WORK[Workers / Notifications]
  PUB --> BQ[BigQuery Analytics]
  RUN --> SM[Secret Manager]
  RUN --> OBS[Cloud Logging / Monitoring / Trace]
  RUN --> GCS[Cloud Storage]
  LB --> DR[Secondary Region Services]
```

## Design principles

- Global HTTPS edge terminates and protects customer traffic.
- Cloud Armor provides WAF/DDoS policy enforcement at the edge.
- Stateless application services can scale horizontally.
- Transactional data is separated from analytics workloads.
- Pub/Sub decouples notifications, audit/event processing and analytics ingestion.
- Secrets are retrieved from Secret Manager rather than source control.
- Monitoring, logs and traces provide operational evidence.
- Secondary-region capacity supports continuity and controlled failover.
