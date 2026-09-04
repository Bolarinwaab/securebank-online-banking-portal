# Risk Register

Scale: Probability and impact are 1–5; score = probability × impact.

| ID | Risk | P | I | Score | Response | Trigger |
|---|---|---:|---:|---:|---|---|
| RR-01 | Identity/IAM error | 3 | 5 | 15 | Preventive policy review + automated checks | Unauthorized access signal |
| RR-02 | Data consistency defect | 2 | 5 | 10 | Domain review + reconciliation tests | Reconciliation mismatch |
| RR-03 | Regional outage | 3 | 5 | 15 | Warm secondary + failover test | Regional health degradation |
| RR-04 | Dependency vulnerability | 3 | 4 | 12 | Dependabot + CI audit + patch SLA | High/critical CVE |
| RR-05 | Scope growth | 4 | 3 | 12 | Formal change control | Unapproved requirement |
| RR-06 | Cloud cost overrun | 3 | 4 | 12 | Budgets, alerts, sizing gates | Spend threshold breached |
