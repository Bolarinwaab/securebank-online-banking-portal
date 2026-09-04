# RAID Log

| ID | Type | Item | Owner | Response |
|---|---|---|---|---|
| R-01 | Risk | Identity misconfiguration exposes privileged functions | Security lead | Least privilege + test IAM policies |
| R-02 | Risk | Regional outage affects customer access | SRE | Multi-region failover exercise |
| A-01 | Assumption | Approved cloud regions support required services | Architect | Validate during design gate |
| A-02 | Assumption | Transaction volume fits selected data model | Data lead | Load test before production |
| I-01 | Issue | Demo uses synthetic data | PM | Keep production data out of repo |
| D-01 | Dependency | DNS/certificates and identity provider | Platform lead | Track as readiness dependency |
