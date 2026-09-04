locals {
  required_services = [
    "run.googleapis.com",
    "compute.googleapis.com",
    "iam.googleapis.com",
    "secretmanager.googleapis.com",
    "monitoring.googleapis.com",
    "logging.googleapis.com"
  ]
}

resource "google_project_service" "required" {
  for_each           = var.enable_production_resources ? toset(local.required_services) : toset([])
  project            = var.project_id
  service            = each.value
  disable_on_destroy = false
}
