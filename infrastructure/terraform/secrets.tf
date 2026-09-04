resource "google_secret_manager_secret" "database_password" {
  secret_id = "securebank-db-password-${var.environment}"
  replication { auto {} }
}

# Secret values are intentionally not managed by Terraform in this portfolio.
# Populate the secret through an approved secret-management process.
