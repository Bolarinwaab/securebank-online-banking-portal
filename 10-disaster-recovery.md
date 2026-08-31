# 10. Disaster Recovery

## Regional disaster scenario

If the primary region becomes unavailable, traffic should be routed to a secondary region with the required application services and data availability.

| Scenario | RPO | RTO | Priority |
|---|---:|---:|---|
| Regional outage | Near-zero to minutes depending on data tier | < 30 minutes | Critical |
| Transactions database failure | 0 data loss target for committed transactions | < 5 minutes | Critical |
| Customer database corruption | Defined backup point | < 1 hour | High |
| Accidental application deployment | Last known-good release | < 15 minutes | High |
| Accidental deletion of non-critical analytics data | 24 hours | < 4 hours | Medium |

## Resource recovery plan

| Resource | Backup strategy | Location | Recovery procedure |
|---|---|---|---|
| Transaction data | Replication + backups | Multi-region strategy | Failover according to database runbook |
| Customer data | Automated backups | Multi-region Cloud Storage where applicable | Restore/point-in-time recovery |
| Object documents | Versioning + lifecycle + backups | Multi-region Cloud Storage | Restore object/version |
| Application artifacts | Immutable CI/CD artifacts | Artifact Registry | Redeploy known-good release |
| Configuration/secrets | Versioned managed configuration | Secret Manager | Restore approved version |
