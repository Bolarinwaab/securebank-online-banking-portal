# 8. Network Design

## Network characteristics

| Service | Exposure | HTTP | TCP | UDP | Multi-region |
|---|---|---:|---:|---:|---:|
| Web UI | Internet-facing | Yes | No | No | Yes |
| API Gateway | Internet-facing | Yes | No | No | Yes |
| Auth Service | Internal behind gateway | Yes | No | No | Yes |
| Accounts Service | Internal | Yes | No | No | Yes |
| Transactions Service | Internal | Yes | No | No | Yes |
| Databases | Internal only | No/public access | Service-specific | No | Yes |

Use private subnets/VPC controls for backend services. Expose only the edge/load-balancing layer to the public internet. Apply least-privilege firewall rules and service-to-service identity.

## Traffic flow

`Client → Cloud DNS → Global HTTPS Load Balancer → Cloud Armor → API Gateway/Ingress → internal services → private data stores`.
