# ADR 003: Event-driven integration with Pub/Sub

**Status:** Accepted

## Context
Notifications, audit processing and analytics should not block critical customer requests, and consumers may need independent scaling or replay.

## Decision
Use Pub/Sub for asynchronous business and audit events. APIs publish durable events after the transaction boundary; independent workers consume notification, audit and analytics workloads.

## Consequences
The architecture gains loose coupling and replayable processing, but must explicitly manage idempotency, ordering requirements, dead-letter handling, observability and eventual consistency.
