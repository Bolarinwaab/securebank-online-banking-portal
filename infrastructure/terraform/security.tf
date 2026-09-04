resource "google_compute_security_policy" "edge" {
  count = var.enable_production_resources ? 1 : 0
  name  = "${var.service_name}-${var.environment}-edge-policy"

  rule {
    action   = "allow"
    priority = 2147483647
    match { versioned_expr = "SRC_IPS_V1" config { src_ip_ranges = ["*"] } }
    description = "Default allow; tighten with approved WAF/rate rules before production."
  }

  rule {
    action   = "deny(429)"
    priority = 1000
    match { expr { expression = "evaluatePreconfiguredExpr('sqli-stable')" } }
    description = "Block common SQL injection signatures."
  }
}

resource "google_secret_manager_secret" "application" {
  count     = var.enable_production_resources ? 1 : 0
  secret_id = "${var.service_name}-${var.environment}-application"
  replication { auto {} }
}
