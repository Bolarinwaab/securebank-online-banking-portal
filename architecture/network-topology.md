# Network Topology

```mermaid
flowchart TB
  Internet((Internet)) --> Edge[Global HTTPS LB + Cloud Armor]
  Edge --> VPC[VPC]
  subgraph RegionA[Primary Region]
    AppA[Private application tier]
    DataA[Private data services]
    NatA[Cloud NAT / controlled egress]
    AppA --> DataA
    AppA --> NatA
  end
  subgraph RegionB[Secondary Region]
    AppB[Warm application tier]
    DataB[Replicated / backed-up data]
    AppB --> DataB
  end
  VPC --> RegionA
  VPC --> RegionB
  Edge --> AppA
  Edge -. failover .-> AppB
```

## Controls

- No database should be directly reachable from the public internet.
- Private Google access is enabled for workloads that need Google APIs.
- Egress is controlled through NAT and explicit firewall policies.
- Administrative access uses identity-aware, auditable paths rather than exposed SSH.
- Region boundaries are treated as failure domains.
