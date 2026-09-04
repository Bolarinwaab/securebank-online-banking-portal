# ADR 002: Spanner versus Cloud SQL

**Status:** Decision framework accepted

## Context
Banking transactions require strong consistency, durable storage, backup/recovery and a clear scaling strategy. The right database depends on the final workload, schema and regional consistency requirements.

## Decision
Prefer Cloud Spanner when the approved production workload requires horizontally scalable, strongly consistent relational transactions across regions. Use Cloud SQL when workload size, topology, PostgreSQL compatibility or operational simplicity makes a regional relational database the better fit.

## Consequences
The architecture keeps the storage contract abstract enough to support either managed relational choice. Production selection must be validated against transaction volume, latency, consistency, recovery, cost and compliance requirements.
