resource "google_monitoring_alert_policy" "api_availability" {
  count        = var.enable_production_resources ? 1 : 0
  display_name = "${var.service_name} availability"
  combiner     = "OR"

  conditions {
    display_name = "API error ratio signal"
    condition_threshold {
      filter          = "resource.type=\"cloud_run_revision\" AND metric.type=\"run.googleapis.com/request_count\""
      comparison      = "COMPARISON_GT"
      threshold_value = 0
      duration        = "300s"
      aggregations {
        alignment_period   = "60s"
        per_series_aligner = "ALIGN_RATE"
      }
    }
  }

  documentation { content = "Review API health, request errors, latency and recent deployments before escalation." }
}
