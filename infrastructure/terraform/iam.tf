resource "google_service_account" "runtime" {
  count        = var.enable_production_resources ? 1 : 0
  account_id   = "securebank-runtime"
  display_name = "SecureBank runtime service identity"
}

resource "google_project_iam_member" "runtime_log_writer" {
  count   = var.enable_production_resources ? 1 : 0
  project = var.project_id
  role    = "roles/logging.logWriter"
  member  = "serviceAccount:${google_service_account.runtime[0].email}"
}

resource "google_project_iam_member" "runtime_metric_writer" {
  count   = var.enable_production_resources ? 1 : 0
  project = var.project_id
  role    = "roles/monitoring.metricWriter"
  member  = "serviceAccount:${google_service_account.runtime[0].email}"
}
