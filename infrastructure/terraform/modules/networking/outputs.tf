# Networking Module Outputs

output "network_name" {
  description = "Name of the VPC network"
  value       = google_compute_network.vpc.name
}

output "network_id" {
  description = "ID of the VPC network"
  value       = google_compute_network.vpc.id
}

output "network_self_link" {
  description = "Self link of the VPC network"
  value       = google_compute_network.vpc.self_link
}

output "subnet_name" {
  description = "Name of the main subnet"
  value       = google_compute_subnetwork.main.name
}

output "subnet_id" {
  description = "ID of the main subnet"
  value       = google_compute_subnetwork.main.id
}

output "subnet_self_link" {
  description = "Self link of the main subnet"
  value       = google_compute_subnetwork.main.self_link
}

output "subnet_cidr" {
  description = "CIDR block of the main subnet"
  value       = google_compute_subnetwork.main.ip_cidr_range
}

output "pods_cidr" {
  description = "CIDR block for GKE pods"
  value       = google_compute_subnetwork.main.secondary_ip_range[0].ip_cidr_range
}

output "services_cidr" {
  description = "CIDR block for GKE services"
  value       = google_compute_subnetwork.main.secondary_ip_range[1].ip_cidr_range
}

output "router_name" {
  description = "Name of the Cloud Router"
  value       = google_compute_router.router.name
}

output "nat_name" {
  description = "Name of the Cloud NAT"
  value       = google_compute_router_nat.nat.name
}

output "private_vpc_connection" {
  description = "Private VPC connection for Cloud SQL"
  value       = google_service_networking_connection.private_vpc_connection.network
}
