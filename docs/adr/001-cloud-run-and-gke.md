# ADR 001: Cloud Run with GKE as a strategic option

**Status:** Accepted for reference architecture

## Context
SecureBank needs elastic stateless services, strong deployment automation and a path for workloads whose operational needs exceed a fully managed request platform.

## Decision
Use Cloud Run as the default application compute target for independently deployable stateless services. Retain GKE as the strategic option for workloads requiring Kubernetes-specific scheduling, sidecars, custom networking or platform control.

## Alternatives
- GKE-only: greater control but higher platform-operating overhead.
- Compute Engine: flexible but more infrastructure management.
- Cloud Run-first: lower operational burden and strong fit for the portfolio demo.

## Consequences
Cloud Run simplifies autoscaling and deployment. Workloads that later need Kubernetes-specific features can be moved to GKE behind the same edge and service contracts.
