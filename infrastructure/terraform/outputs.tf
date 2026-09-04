output "vpc_name" {
  description = "Created VPC name when production resources are enabled."
  value       = try(google_compute_network.securebank[0].name, null)
}

output "cloud_run_service" {
  description = "Created Cloud Run service name when production resources are enabled."
  value       = try(google_cloud_run_v2_service.api[0].name, null)
}

output "cloud_run_uri" {
  description = "Cloud Run URI when production resources are enabled."
  value       = try(google_cloud_run_v2_service.api[0].uri, null)
}
