# SecureBank Terraform Blueprint

This directory is a parameterized Google Cloud infrastructure blueprint. It is intentionally not a production deployment package.

## Components

- Custom VPC and application/data subnets
- Least-privilege runtime service account
- Optional Cloud Run service
- Cloud Armor security policy foundation
- Secret Manager resource without secret values
- Optional monitoring health check

## Usage

```bash
terraform init
terraform fmt -check
terraform validate
terraform plan -var='project_id=YOUR_PROJECT_ID'
```

Cloud credentials, billing, DNS, certificates, production CIDRs and approved security rules are environment responsibilities and are not committed here.
