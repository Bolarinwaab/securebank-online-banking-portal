variable "db_tier" {
  description = "Cloud SQL machine tier for the target environment."
  type        = string
  default     = "db-custom-2-7680"
}

variable "db_name" {
  type    = string
  default = "securebank"
}

resource "google_sql_database_instance" "banking" {
  name             = "securebank-postgres"
  database_version = "POSTGRES_16"
  region           = var.region
  deletion_protection = true

  settings {
    tier              = var.db_tier
    availability_type = "REGIONAL"
    disk_type         = "PD_SSD"
    disk_size         = 50
    disk_autoresize   = true
    backup_configuration {
      enabled                        = true
      point_in_time_recovery_enabled = true
      retained_backups               = 14
      transaction_log_retention_days = 7
    }

    ip_configuration {
      ipv4_enabled = false
    }

    insights_config {
      query_insights_enabled  = true
      query_string_length     = 1024
      record_application_tags  = true
      record_client_address    = false
    }
  }
}

resource "google_sql_database" "banking" {
  name     = var.db_name
  instance = google_sql_database_instance.banking.name
}

output "cloud_sql_connection_name" {
  value = google_sql_database_instance.banking.connection_name
}
