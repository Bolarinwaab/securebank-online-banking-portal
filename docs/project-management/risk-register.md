# Risk Register

Scoring: Probability (P) × Impact (I), each 1–5.

| ID | Risk | P | I | Score | Mitigation |
|---|---|---:|---:|---:|---|
| RR-01 | Security defect reaches release | 2 | 5 | 10 | Automated security gates + review |
| RR-02 | Data loss during regional incident | 2 | 5 | 10 | Replication, backups, restore tests |
| RR-03 | Cloud cost exceeds forecast | 3 | 4 | 12 | Budgets, quotas, right-sizing |
| RR-04 | Scope expands into live banking integration | 3 | 4 | 12 | Change-control gate |
| RR-05 | Dependency vulnerability | 3 | 3 | 9 | npm audit and update cadence |
