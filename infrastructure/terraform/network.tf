resource "google_compute_network" "securebank" {
  count                   = var.enable_production_resources ? 1 : 0
  name                    = "${var.service_name}-${var.environment}-vpc"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "primary" {
  count                    = var.enable_production_resources ? 1 : 0
  name                     = "${var.service_name}-${var.environment}-${var.region}"
  ip_cidr_range            = var.vpc_cidr
  region                   = var.region
  network                  = google_compute_network.securebank[0].id
  private_ip_google_access = true
}

resource "google_compute_router" "primary" {
  count   = var.enable_production_resources ? 1 : 0
  name    = "${var.service_name}-${var.environment}-router"
  region  = var.region
  network = google_compute_network.securebank[0].id
}

resource "google_compute_router_nat" "primary" {
  count                              = var.enable_production_resources ? 1 : 0
  name                               = "${var.service_name}-${var.environment}-nat"
  router                             = google_compute_router.primary[0].name
  region                             = var.region
  nat_ip_allocate_option              = "AUTO_ONLY"
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"
}
