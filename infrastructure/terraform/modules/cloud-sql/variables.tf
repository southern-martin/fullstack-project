# Cloud SQL Module Variables

variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP region for the Cloud SQL instance"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, staging, production)"
  type        = string
}

variable "instance_name" {
  description = "Name of the Cloud SQL instance"
  type        = string
}

variable "database_name" {
  description = "Name of the database to create"
  type        = string
}

variable "database_version" {
  description = "MySQL version (e.g., MYSQL_8_0)"
  type        = string
  default     = "MYSQL_8_0"
}

variable "database_user" {
  description = "Name of the database user"
  type        = string
  default     = "appuser"
}

variable "tier" {
  description = "Machine tier for the Cloud SQL instance"
  type        = string
  default     = "db-n1-standard-2"
}

variable "availability_type" {
  description = "Availability type (REGIONAL or ZONAL)"
  type        = string
  default     = "REGIONAL"
  
  validation {
    condition     = contains(["REGIONAL", "ZONAL"], var.availability_type)
    error_message = "Availability type must be either REGIONAL or ZONAL"
  }
}

variable "disk_size_gb" {
  description = "Disk size in GB"
  type        = number
  default     = 20
}

variable "backup_enabled" {
  description = "Enable automated backups"
  type        = bool
  default     = true
}

variable "point_in_time_recovery" {
  description = "Enable point-in-time recovery"
  type        = bool
  default     = true
}

variable "backup_retention_count" {
  description = "Number of backups to retain"
  type        = number
  default     = 7
}

variable "network_self_link" {
  description = "Self link of the VPC network for private IP"
  type        = string
}

variable "database_flags" {
  description = "Database flags to set on the instance"
  type        = map(string)
  default = {
    max_connections         = "1000"
    slow_query_log          = "on"
    long_query_time         = "2"
    log_bin_trust_function_creators = "on"
  }
}

variable "deletion_protection" {
  description = "Enable deletion protection"
  type        = bool
  default     = true
}

variable "enable_read_replica" {
  description = "Create a read replica for the instance"
  type        = bool
  default     = false
}

variable "replica_region" {
  description = "Region for read replica (defaults to same region as primary)"
  type        = string
  default     = ""
}

variable "labels" {
  description = "Labels to apply to resources"
  type        = map(string)
  default     = {}
}
