# Disaster Recovery Test Plan

## Scenario
Primary region becomes unavailable during normal customer traffic.

## Exercise
1. Record baseline availability, RPO and RTO.
2. Declare a controlled regional incident.
3. Fail traffic to the recovery path or restore the recovery environment.
4. Validate authentication, account reads and transaction integrity.
5. Confirm event processing and observability.
6. Measure recovery time and any data gap.
7. Restore normal routing.
8. Document defects, owners and corrective actions.

## Evidence
Capture timestamps, test results, monitoring screenshots/links, recovery logs, observed RTO/RPO and action items. This portfolio repository documents the procedure; it does not claim that a production failover has been executed.
