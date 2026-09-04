variable "project_id" {
  description = "Google Cloud project ID used for the environment."
  type        = string
}

variable "region" {
  description = "Primary Google Cloud region."
  type        = string
  default     = "us-central1"
}

variable "secondary_region" {
  description = "Secondary region used by the reference DR design."
  type        = string
  default     = "us-east1"
}

variable "environment" {
  description = "Environment name."
  type        = string
  default     = "demo"
  validation {
    condition     = contains(["dev", "test", "staging", "prod", "demo"], var.environment)
    error_message = "environment must be dev, test, staging, prod, or demo."
  }
}

variable "vpc_cidr" {
  description = "Primary subnet CIDR."
  type        = string
  default     = "10.20.0.0/20"
}

variable "service_name" {
  description = "Cloud Run service name."
  type        = string
  default     = "securebank-api"
}

variable "container_image" {
  description = "Container image URI for the application."
  type        = string
  default     = "us-docker.pkg.dev/example/securebank/securebank:latest"
}

variable "enable_production_resources" {
  description = "Create billable/provisioning resources. Keep false for documentation-only validation."
  type        = bool
  default     = false
}
