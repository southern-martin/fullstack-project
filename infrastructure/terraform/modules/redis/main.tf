# Redis (Memorystore) Module

# Redis Instance
resource "google_redis_instance" "cache" {
  name               = var.instance_name
  project            = var.project_id
  region             = var.region
  tier               = var.tier
  memory_size_gb     = var.memory_size_gb
  redis_version      = var.redis_version
  display_name       = "${var.instance_name} (${var.environment})"
  
  # Network configuration
  authorized_network = var.network_self_link
  connect_mode       = "PRIVATE_SERVICE_ACCESS"
  
  # Redis configuration
  redis_configs = merge(
    var.redis_configs,
    {
      maxmemory-policy = var.maxmemory_policy
    }
  )
  
  # Maintenance policy
  maintenance_policy {
    weekly_maintenance_window {
      day = "SUNDAY"
      start_time {
        hours   = 3
        minutes = 0
        seconds = 0
        nanos   = 0
      }
    }
  }
  
  # Labels
  labels = var.labels
  
  # Persistence (for STANDARD_HA tier)
  persistence_config {
    persistence_mode    = var.tier == "STANDARD_HA" ? var.persistence_mode : "DISABLED"
    rdb_snapshot_period = var.tier == "STANDARD_HA" && var.persistence_mode != "DISABLED" ? var.rdb_snapshot_period : null
  }
  
  # High availability (for STANDARD_HA tier)
  replica_count        = var.tier == "STANDARD_HA" ? var.replica_count : null
  read_replicas_mode   = var.tier == "STANDARD_HA" ? var.read_replicas_mode : null
  
  # Transit encryption
  transit_encryption_mode = var.transit_encryption_mode
  
  # Authentication
  auth_enabled = var.auth_enabled
}

# Generate auth string if authentication is enabled
resource "random_password" "redis_auth" {
  count = var.auth_enabled ? 1 : 0
  
  length  = 32
  special = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}
