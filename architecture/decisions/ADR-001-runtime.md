# ADR-001: Managed Runtime

**Decision:** Prefer Cloud Run for stateless services, with GKE retained where workload complexity or platform requirements justify Kubernetes.

**Why:** Cloud Run reduces operational overhead for independently deployable APIs and supports rapid scaling. GKE is an alternative for workloads requiring Kubernetes-native controls.

**Trade-off:** Cloud Run provides less infrastructure-level control; GKE increases operational responsibility.
