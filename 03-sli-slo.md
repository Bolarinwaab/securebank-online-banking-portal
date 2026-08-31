# 3. SLIs and SLOs

The workbook asks each user story to have measurable service-level objectives and indicators. The following are proposed portfolio targets; they should be validated against actual business and regulatory requirements before production use.

| User story | SLO | SLI |
|---|---|---|
| Balance inquiry | 99.95% successful availability per month | Successful HTTP responses / total balance requests |
| Balance inquiry | 95% complete under 300 ms | Time-to-last-byte for balance GET requests |
| Transfer | 99.99% successful transaction-processing availability | Successful transfer requests / total transfer requests |
| Transfer | 99% complete under 1 second | Transaction API latency |
| Transaction history | 99.95% availability | Successful history requests / total history requests |
| Authentication | 99.99% availability | Successful authentication requests / total authentication requests |

## Error budget

SLOs should be paired with an error budget. If reliability consumes too much of the budget, release velocity should be reduced until reliability is restored.
