resource "google_monitoring_uptime_check_config" "health" {
  count        = var.enable_monitoring ? 1 : 0
  display_name = "SecureBank API health"
  timeout      = "10s"
  period       = "60s"
  http_check { path = "/health"; port = 443; use_ssl = true }
  monitored_resource { type = "uptime_url"; labels = { host = "example.invalid" } }
}

# Replace example.invalid with the approved production endpoint before apply.
