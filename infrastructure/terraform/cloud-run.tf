resource "google_cloud_run_v2_service" "api" {
  count    = var.enable_production_resources ? 1 : 0
  name     = var.service_name
  location = var.region

  template {
    service_account = google_service_account.runtime[0].email
    containers {
      image = var.container_image
      ports { container_port = 8080 }
      resources {
        limits = { cpu = "1", memory = "512Mi" }
      }
    }
    scaling { max_instance_count = 10 }
  }

  depends_on = [google_project_service.required]
}

resource "google_cloud_run_v2_service_iam_member" "public_demo_invoker" {
  count    = var.enable_production_resources && var.environment == "demo" ? 1 : 0
  name     = google_cloud_run_v2_service.api[0].name
  location = var.region
  role     = "roles/run.invoker"
  member   = "allUsers"
}
