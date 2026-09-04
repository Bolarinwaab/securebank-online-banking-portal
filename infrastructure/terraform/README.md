# Terraform Infrastructure Blueprint

This directory is an implementation-oriented Google Cloud blueprint. `enable_production_resources` defaults to `false`, so the configuration is intended to be reviewed and validated before any billable resources are created.

## Workflow

```bash
cd infrastructure/terraform
terraform fmt -recursive
terraform init
terraform validate
terraform plan -var-file=terraform.tfvars
```

Set `enable_production_resources=true` only after the target project, IAM model, network ranges, database design, DNS, certificates, observability retention and budget have been approved.

## Guardrails

- Never commit `terraform.tfvars` containing secrets.
- Review the plan before applying.
- Use a protected remote state backend for shared environments.
- Prefer workload identity/federated authentication over long-lived service-account keys.
- Apply environment-specific policies through CI/CD rather than ad-hoc local deployment.
