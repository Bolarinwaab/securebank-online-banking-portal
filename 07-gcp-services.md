# 7. Google Cloud Storage and Data Services

| Workload | Recommended Google Cloud service |
|---|---|
| Core accounts and transactions | Cloud Spanner |
| Customer relational data | Cloud SQL or Cloud Spanner |
| Static assets/statements/backups | Cloud Storage |
| Analytics | BigQuery |
| Event transport | Pub/Sub |
| Secrets | Secret Manager |
| Cache (if required) | Memorystore |
| Application runtime | Cloud Run or GKE |

Cloud Spanner is a strong candidate for a globally scalable transactional banking data model. Cloud SQL can be appropriate for less globally distributed relational workloads. The final selection should follow workload, regulatory, latency, and cost requirements.
