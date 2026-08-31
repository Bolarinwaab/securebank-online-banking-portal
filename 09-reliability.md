# 9. Reliable and Scalable Architecture

The workbook emphasizes maintaining frontend availability even when individual services fail and achieving low latency for users in different locations.

## Design measures

- Deploy stateless services across multiple zones.
- Use a global external HTTPS load balancer.
- Use autoscaling Cloud Run/GKE services.
- Keep databases private and deploy with regional/multi-region resilience appropriate to the selected database.
- Use Pub/Sub to decouple asynchronous workloads.
- Use Cloud CDN for cacheable static assets.
- Use health checks and automated instance/service replacement.
- Use Cloud Monitoring and alerting tied to SLOs.
- Apply retries with exponential backoff only where operations are safe to retry.
- Use idempotency keys for financial commands.
