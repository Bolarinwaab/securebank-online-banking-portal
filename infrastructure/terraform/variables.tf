variable "project_id" { type = string; description = "GCP project ID supplied by the deployment environment." }
variable "region" { type = string; default = "us-central1" }
variable "secondary_region" { type = string; default = "us-east1" }
variable "environment" { type = string; default = "portfolio" }
variable "network_cidr" { type = string; default = "10.40.0.0/16" }
variable "app_image" { type = string; default = "us-docker.pkg.dev/PROJECT_ID/securebank/app:latest" }
variable "enable_cloud_run" { type = bool; default = false }
variable "enable_monitoring" { type = bool; default = false }
