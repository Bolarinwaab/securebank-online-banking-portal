# Business Case

## Problem
Digital banking platforms must combine customer experience with strong security, high availability, auditable transactions and operational recovery.

## Options
1. Single-region monolith — lowest initial complexity, weakest isolation/resilience.
2. Managed cloud services — recommended balance of scalability, security controls and operational efficiency.
3. Full Kubernetes platform — highest flexibility but highest platform overhead.

## Recommendation
Use managed services first, with Cloud Run for stateless APIs and Spanner/Cloud SQL selected through workload analysis. Add GKE only when its capabilities justify its operating cost.

## Benefits
Faster delivery, service isolation, observable operations, asynchronous integration, repeatable infrastructure and documented recovery.

## Costs/risks
Multi-region data, security tooling, observability and managed databases increase cost; architecture must therefore use budgets, quotas and capacity reviews.
