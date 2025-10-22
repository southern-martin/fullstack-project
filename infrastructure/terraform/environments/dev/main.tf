# Development Environment - Terraform Configuration

# This file uses the shared modules to create the development infrastructure

terraform {
  required_version = ">= 1.5.0"
  
  # Backend configuration for storing state in Google Cloud Storage
  # Uncomment after creating the GCS bucket
  # backend "gcs" {
  #   bucket = "your-project-terraform-state"
  #   prefix = "terraform/dev"
  # }
}

# Include the main configuration from parent directory
module "infrastructure" {
  source = "../.."
  
  # Project Configuration
  project_id   = var.project_id
  region       = var.region
  environment  = var.environment
  project_name = var.project_name
  
  # Network Configuration
  network_name   = var.network_name
  subnet_cidr    = var.subnet_cidr
  pods_cidr      = var.pods_cidr
  services_cidr  = var.services_cidr
  
  # GKE Configuration
  gke_cluster_name         = var.gke_cluster_name
  gke_node_count           = var.gke_node_count
  gke_machine_type         = var.gke_machine_type
  gke_disk_size_gb         = var.gke_disk_size_gb
  gke_min_nodes            = var.gke_min_nodes
  gke_max_nodes            = var.gke_max_nodes
  enable_preemptible_nodes = var.enable_preemptible_nodes
  
  # Cloud SQL Configuration
  cloudsql_tier               = var.cloudsql_tier
  cloudsql_availability_type  = var.cloudsql_availability_type
  cloudsql_disk_size_gb       = var.cloudsql_disk_size_gb
  cloudsql_backup_enabled     = var.cloudsql_backup_enabled
  
  # Redis Configuration
  redis_memory_size_gb = var.redis_memory_size_gb
  redis_tier           = var.redis_tier
  
  # Feature Flags
  enable_secret_manager = var.enable_secret_manager
  enable_monitoring     = var.enable_monitoring
  
  # Labels
  labels = var.labels
}
