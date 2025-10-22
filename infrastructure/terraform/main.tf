# Main Terraform configuration that orchestrates all modules
# This file should be used in environment-specific directories

locals {
  common_labels = merge(
    var.labels,
    {
      project     = var.project_name
      environment = var.environment
      managed_by  = "terraform"
    }
  )
}

# Networking Module
module "networking" {
  source = "../../modules/networking"

  project_id   = var.project_id
  region       = var.region
  environment  = var.environment
  network_name = "${var.project_name}-${var.environment}-vpc"
  
  subnet_cidr    = var.subnet_cidr
  pods_cidr      = var.pods_cidr
  services_cidr  = var.services_cidr
  
  labels = local.common_labels
}

# GKE Cluster Module
module "gke" {
  source = "../../modules/gke"
  
  project_id   = var.project_id
  region       = var.region
  environment  = var.environment
  
  cluster_name = var.gke_cluster_name
  network_name = module.networking.network_name
  subnet_name  = module.networking.subnet_name
  
  node_count   = var.gke_node_count
  machine_type = var.gke_machine_type
  disk_size_gb = var.gke_disk_size_gb
  
  min_nodes = var.gke_min_nodes
  max_nodes = var.gke_max_nodes
  
  enable_preemptible_nodes = var.enable_preemptible_nodes
  
  labels = local.common_labels
  
  depends_on = [module.networking]
}

# Cloud SQL - Shared Database (auth-service + user-service)
module "cloud_sql_shared" {
  source = "../../modules/cloud-sql"
  
  project_id  = var.project_id
  region      = var.region
  environment = var.environment
  
  instance_name     = "${var.project_name}-${var.environment}-shared-db"
  database_name     = "shared_user_db"
  database_version  = "MYSQL_8_0"
  
  tier               = var.cloudsql_tier
  availability_type  = var.cloudsql_availability_type
  disk_size_gb       = var.cloudsql_disk_size_gb
  backup_enabled     = var.cloudsql_backup_enabled
  
  network_self_link = module.networking.network_self_link
  
  labels = local.common_labels
  
  depends_on = [module.networking]
}

# Cloud SQL - Customer Service Database
module "cloud_sql_customer" {
  source = "../../modules/cloud-sql"
  
  project_id  = var.project_id
  region      = var.region
  environment = var.environment
  
  instance_name     = "${var.project_name}-${var.environment}-customer-db"
  database_name     = "customer_db"
  database_version  = "MYSQL_8_0"
  
  tier               = var.cloudsql_tier
  availability_type  = var.cloudsql_availability_type
  disk_size_gb       = var.cloudsql_disk_size_gb
  backup_enabled     = var.cloudsql_backup_enabled
  
  network_self_link = module.networking.network_self_link
  
  labels = local.common_labels
  
  depends_on = [module.networking]
}

# Cloud SQL - Carrier Service Database
module "cloud_sql_carrier" {
  source = "../../modules/cloud-sql"
  
  project_id  = var.project_id
  region      = var.region
  environment = var.environment
  
  instance_name     = "${var.project_name}-${var.environment}-carrier-db"
  database_name     = "carrier_db"
  database_version  = "MYSQL_8_0"
  
  tier               = var.cloudsql_tier
  availability_type  = var.cloudsql_availability_type
  disk_size_gb       = var.cloudsql_disk_size_gb
  backup_enabled     = var.cloudsql_backup_enabled
  
  network_self_link = module.networking.network_self_link
  
  labels = local.common_labels
  
  depends_on = [module.networking]
}

# Cloud SQL - Pricing Service Database
module "cloud_sql_pricing" {
  source = "../../modules/cloud-sql"
  
  project_id  = var.project_id
  region      = var.region
  environment = var.environment
  
  instance_name     = "${var.project_name}-${var.environment}-pricing-db"
  database_name     = "pricing_db"
  database_version  = "MYSQL_8_0"
  
  tier               = var.cloudsql_tier
  availability_type  = var.cloudsql_availability_type
  disk_size_gb       = var.cloudsql_disk_size_gb
  backup_enabled     = var.cloudsql_backup_enabled
  
  network_self_link = module.networking.network_self_link
  
  labels = local.common_labels
  
  depends_on = [module.networking]
}

# Redis (Memorystore) Module
module "redis" {
  source = "../../modules/redis"
  
  project_id  = var.project_id
  region      = var.region
  environment = var.environment
  
  instance_name   = "${var.project_name}-${var.environment}-redis"
  memory_size_gb  = var.redis_memory_size_gb
  tier            = var.redis_tier
  
  network_self_link = module.networking.network_self_link
  
  labels = local.common_labels
  
  depends_on = [module.networking]
}

# Secret Manager Module (if enabled)
module "secrets" {
  count  = var.enable_secret_manager ? 1 : 0
  source = "../../modules/secrets"
  
  project_id  = var.project_id
  environment = var.environment
  
  secrets = {
    # Database passwords
    "shared-db-password"   = "Password for shared MySQL database"
    "customer-db-password" = "Password for customer MySQL database"
    "carrier-db-password"  = "Password for carrier MySQL database"
    "pricing-db-password"  = "Password for pricing MySQL database"
    
    # Redis password
    "redis-password" = "Password for Redis instance"
    
    # JWT secrets
    "jwt-secret"         = "JWT signing secret"
    "jwt-refresh-secret" = "JWT refresh token secret"
    
    # API keys
    "auth-api-key"        = "Auth service API key"
    "user-api-key"        = "User service API key"
    "customer-api-key"    = "Customer service API key"
    "carrier-api-key"     = "Carrier service API key"
    "pricing-api-key"     = "Pricing service API key"
    "translation-api-key" = "Translation service API key"
  }
  
  labels = local.common_labels
}
