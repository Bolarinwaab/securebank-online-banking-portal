# SecureBank Architecture

These diagrams describe the intended Google Cloud production architecture while the included Node.js application remains a local/synthetic-data portfolio demo.

| Diagram | Purpose |
|---|---|
| [High-level](high-level.md) | End-to-end request, data and event flow |
| [Network topology](network-topology.md) | VPC, edge, private tiers and regional design |
| [Data architecture](data-architecture.md) | Transactional, event and analytics data |
| [Security architecture](security-architecture.md) | Identity, secrets, edge, audit and detection |
| [Disaster recovery](disaster-recovery.md) | Multi-region resilience and restoration |

The design favors managed services, least privilege, private networking, defense in depth and explicit operational ownership.
