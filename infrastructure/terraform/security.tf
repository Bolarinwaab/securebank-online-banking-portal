resource "google_compute_security_policy" "edge" {
  name = "securebank-edge-${var.environment}"

  rule {
    action   = "allow"
    priority = 2147483647
    match { versioned_expr = "SRC_IPS_V1"; config { src_ip_ranges = ["*"] } }
    description = "Default allow; replace with approved WAF policy before production."
  }

  # Production should add managed/custom WAF rules, rate limits and allow/deny lists.
}
