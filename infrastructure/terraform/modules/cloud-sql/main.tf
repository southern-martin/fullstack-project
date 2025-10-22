# Cloud SQL Module for MySQL Databases

# Random password generator for database
resource "random_password" "db_password" {
  length  = 32
  special = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

# Cloud SQL Instance
resource "google_sql_database_instance" "instance" {
  name             = var.instance_name
  project          = var.project_id
  region           = var.region
  database_version = var.database_version
  
  settings {
    tier              = var.tier
    availability_type = var.availability_type
    disk_size         = var.disk_size_gb
    disk_type         = "PD_SSD"
    disk_autoresize   = true
    
    # Backup configuration
    backup_configuration {
      enabled                        = var.backup_enabled
      start_time                     = "03:00"
      point_in_time_recovery_enabled = var.point_in_time_recovery
      transaction_log_retention_days = 7
      
      backup_retention_settings {
        retained_backups = var.backup_retention_count
        retention_unit   = "COUNT"
      }
    }
    
    # IP configuration for private IP
    ip_configuration {
      ipv4_enabled                                  = false
      private_network                               = var.network_self_link
      enable_private_path_for_google_cloud_services = true
    }
    
    # Maintenance window
    maintenance_window {
      day          = 7  # Sunday
      hour         = 3  # 3 AM
      update_track = "stable"
    }
    
    # Insights configuration
    insights_config {
      query_insights_enabled  = true
      query_string_length     = 1024
      record_application_tags = false
      record_client_address   = false
    }
    
    # Database flags
    dynamic "database_flags" {
      for_each = var.database_flags
      content {
        name  = database_flags.key
        value = database_flags.value
      }
    }
    
    # User labels
    user_labels = var.labels
  }
  
  deletion_protection = var.deletion_protection
  
  # Depends on private VPC connection
  depends_on = [var.network_self_link]
}

# Database
resource "google_sql_database" "database" {
  name     = var.database_name
  project  = var.project_id
  instance = google_sql_database_instance.instance.name
  charset  = "utf8mb4"
  collation = "utf8mb4_unicode_ci"
}

# Database User
resource "google_sql_user" "user" {
  name     = var.database_user
  project  = var.project_id
  instance = google_sql_database_instance.instance.name
  password = random_password.db_password.result
}

# Additional read replica (optional, for production)
resource "google_sql_database_instance" "read_replica" {
  count = var.enable_read_replica ? 1 : 0
  
  name                 = "${var.instance_name}-replica"
  project              = var.project_id
  region               = var.replica_region != "" ? var.replica_region : var.region
  database_version     = var.database_version
  master_instance_name = google_sql_database_instance.instance.name
  
  replica_configuration {
    failover_target = false
  }
  
  settings {
    tier              = var.tier
    availability_type = "ZONAL"
    disk_size         = var.disk_size_gb
    disk_type         = "PD_SSD"
    disk_autoresize   = true
    
    ip_configuration {
      ipv4_enabled                                  = false
      private_network                               = var.network_self_link
      enable_private_path_for_google_cloud_services = true
    }
    
    user_labels = merge(
      var.labels,
      {
        replica = "true"
      }
    )
  }
  
  deletion_protection = var.deletion_protection
}
