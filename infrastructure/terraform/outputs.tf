output "network_name" { value = google_compute_network.securebank.name }
output "app_service_account" { value = google_service_account.app.email }
output "cloud_run_uri" { value = var.enable_cloud_run ? google_cloud_run_v2_service.api[0].uri : null }
output "security_policy" { value = google_compute_security_policy.edge.name }
