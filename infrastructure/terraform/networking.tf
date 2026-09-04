resource "google_compute_network" "securebank" {
  name                    = "securebank-${var.environment}"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "app" {
  name          = "securebank-app-${var.environment}"
  ip_cidr_range = cidrsubnet(var.network_cidr, 8, 1)
  region        = var.region
  network       = google_compute_network.securebank.id
}

resource "google_compute_subnetwork" "data" {
  name          = "securebank-data-${var.environment}"
  ip_cidr_range = cidrsubnet(var.network_cidr, 8, 2)
  region        = var.region
  network       = google_compute_network.securebank.id
}
