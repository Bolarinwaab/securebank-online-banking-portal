resource "google_cloud_run_v2_service" "api" {
  count    = var.enable_cloud_run ? 1 : 0
  name     = "securebank-api-${var.environment}"
  location = var.region

  template {
    service_account = google_service_account.app.email
    containers {
      image = var.app_image
      ports { container_port = 8080 }
      resources { limits = { cpu = "1", memory = "512Mi" } }
    }
  }
}

resource "google_cloud_run_v2_service_iam_member" "public_invoker" {
  count    = var.enable_cloud_run ? 1 : 0
  name     = google_cloud_run_v2_service.api[0].name
  location = var.region
  role     = "roles/run.invoker"
  member   = "allUsers"
}
