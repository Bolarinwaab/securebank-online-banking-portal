# 5. REST API Design

| Service | Collection/resource | Methods |
|---|---|---|
| Auth | `/auth/login` | POST |
| Auth | `/auth/logout` | POST |
| Customer | `/customers/{customerId}` | GET, PATCH |
| Accounts | `/accounts` | GET, POST |
| Accounts | `/accounts/{accountId}` | GET |
| Accounts | `/accounts/{accountId}/balance` | GET |
| Transactions | `/accounts/{accountId}/transactions` | GET |
| Transactions | `/accounts/{accountId}/deposit` | POST |
| Transactions | `/accounts/{accountId}/withdraw` | POST |
| Transactions | `/transfers` | POST |
| Notifications | `/notifications` | GET |
| Audit | `/audit-events` | POST/internal |

See `api/openapi.yaml` for an initial machine-readable contract.
