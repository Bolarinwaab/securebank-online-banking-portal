# Deployment Runbook

## Demo

```bash
cd app
npm test
npm start
```

Open `http://localhost:8080`.

## Production blueprint

1. Create an approved GCP project and billing budget.
2. Configure identity, APIs, networking and secrets.
3. Review Terraform variables and security policy rules.
4. Run `terraform fmt -check` and `terraform validate`.
5. Run `terraform plan` and obtain change approval.
6. Apply through the approved CI/CD environment.
7. Verify health, logs, metrics, security controls and SLOs.
8. Execute smoke tests and rollback validation.

No production credentials are stored in this repository.
