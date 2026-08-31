# 12. Cost Planning

The workbook calls for estimating costs using the Google Cloud pricing calculator. Exact production cost cannot be responsibly stated without traffic, region, storage, request volume, database sizing, retention, and availability requirements.

## Cost model

| Component | Cost driver | Optimization approach |
|---|---|---|
| Cloud Run/GKE | CPU, memory, requests/nodes | Autoscale; right-size workloads |
| Spanner/Cloud SQL | Compute, storage, replicas | Right-size capacity; review retention |
| Cloud Storage | GB-month + operations + egress | Lifecycle policies and appropriate classes |
| BigQuery | Data processed/storage | Partition/cluster tables; control scans |
| Load balancing | Forwarding rules/data processed | Consolidate where appropriate |
| Cloud Armor | Policies/requests | Tune rules and traffic controls |
| Logging | Ingestion/storage | Sampling, exclusions, retention policy |
| CDN | Egress/cache | Cache static assets effectively |

## Production planning

Run a scenario-based estimate for low, expected, and peak traffic before deployment. Keep infrastructure-as-code and budget alerts in place so cost changes are visible early.
