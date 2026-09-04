# Network Topology

```mermaid
flowchart TB
 INTERNET[Internet] --> EDGE[Global HTTPS Load Balancer]
 EDGE --> ARM[Cloud Armor]
 ARM --> VPC[VPC]
 VPC --> WEB[Web/API Subnet]
 VPC --> DATA[Private Data Services]
 VPC --> OPS[Observability / Admin Boundary]
 WEB --> RUN[Cloud Run / GKE Services]
 RUN --> PS[Pub/Sub]
 RUN --> DB[Spanner / Cloud SQL]
 RUN --> SM[Secret Manager]
 RUN --> LOG[Cloud Logging / Monitoring]
```

## Segmentation

- Edge traffic is limited to HTTPS.
- Application workloads use managed identities rather than embedded credentials.
- Database services are private and are not exposed directly to the Internet.
- Administrative access is separated from customer traffic and governed by IAM.
- Egress is restricted according to service requirements; production deployments should use explicit firewall and service-control policies.

## Addressing principle

Use non-overlapping RFC1918 ranges selected per environment. The repository intentionally does not prescribe a production CIDR because it depends on enterprise connectivity, peering, VPN and existing network allocations.
