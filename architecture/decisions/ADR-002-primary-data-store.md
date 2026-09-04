# ADR-002: Primary Data Store

**Decision:** Use Cloud Spanner for high-scale, strongly consistent multi-region transactional requirements; use Cloud SQL when relational compatibility and simpler operational economics are more appropriate.

**Why:** Banking-style workloads prioritize consistency, availability and auditable transaction semantics.

**Trade-off:** Spanner can cost and operate differently from conventional relational databases; final selection depends on workload and business constraints.
