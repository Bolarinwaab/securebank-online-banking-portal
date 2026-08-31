# 4. Microservices Design

## Services

- **Auth Service** — authentication/session/token concerns.
- **Customer Service** — profile and customer metadata.
- **Accounts Service** — account details, balances, account status.
- **Transactions Service** — deposits, withdrawals, transfers, transaction history.
- **Notification Service** — email/SMS/push notification events.
- **Analytics Service** — aggregates operational and customer activity for analytics.
- **Audit Service** — immutable security and financial activity audit events.

## Communication

Synchronous customer requests use HTTPS REST APIs. Non-blocking workflows such as notifications, analytics events, and audit fan-out can use Pub/Sub. Financial state changes should be idempotent and protected against duplicate processing.
