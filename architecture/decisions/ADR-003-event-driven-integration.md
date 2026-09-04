# ADR-003: Event-Driven Integration

**Decision:** Use Pub/Sub for asynchronous notifications, audit/event processing and analytical fan-out.

**Why:** Decoupling reduces synchronous dependencies and supports retryable consumers.

**Trade-off:** Eventual consistency and duplicate delivery require idempotent consumers, correlation IDs and clear event schemas.
