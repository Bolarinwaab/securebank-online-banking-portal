# Infrastructure blueprint

This folder intentionally contains a deployment blueprint rather than production infrastructure. Before deploying, define the target region(s), compliance requirements, identity provider, database sizing, VPC ranges, DNS, certificates, observability retention, and budget.

Recommended deployment path:

1. Create a dedicated Google Cloud project.
2. Configure VPC/networking and private service access.
3. Configure Identity Platform/IAM and Secret Manager.
4. Deploy services to Cloud Run or GKE across zones/regions.
5. Put a global HTTPS load balancer and Cloud Armor at the edge.
6. Configure Cloud Spanner/Cloud SQL and backups according to the approved data model.
7. Configure Pub/Sub for asynchronous events.
8. Configure BigQuery for analytics.
9. Add Cloud Monitoring dashboards, alerts, logs, traces, and SLOs.
10. Test regional failover and restoration before production approval.
