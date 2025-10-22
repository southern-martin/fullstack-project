# Common variables used across all environments

variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP region for resources"
  type        = string
  default     = "us-central1"
}

variable "environment" {
  description = "Environment name (dev, staging, production)"
  type        = string
  validation {
    condition     = contains(["dev", "staging", "production"], var.environment)
    error_message = "Environment must be one of: dev, staging, production"
  }
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "fullstack-project"
}

# Networking Variables
variable "network_name" {
  description = "Name of the VPC network"
  type        = string
  default     = "fullstack-vpc"
}

variable "subnet_cidr" {
  description = "CIDR block for the main subnet"
  type        = string
  default     = "10.0.0.0/20"
}

variable "pods_cidr" {
  description = "CIDR block for GKE pods"
  type        = string
  default     = "10.1.0.0/16"
}

variable "services_cidr" {
  description = "CIDR block for GKE services"
  type        = string
  default     = "10.2.0.0/16"
}

# GKE Variables
variable "gke_cluster_name" {
  description = "Name of the GKE cluster"
  type        = string
}

variable "gke_node_count" {
  description = "Number of nodes in the GKE node pool"
  type        = number
  default     = 3
}

variable "gke_machine_type" {
  description = "Machine type for GKE nodes"
  type        = string
  default     = "e2-standard-4"
}

variable "gke_disk_size_gb" {
  description = "Disk size for GKE nodes in GB"
  type        = number
  default     = 100
}

variable "gke_min_nodes" {
  description = "Minimum number of nodes for autoscaling"
  type        = number
  default     = 1
}

variable "gke_max_nodes" {
  description = "Maximum number of nodes for autoscaling"
  type        = number
  default     = 10
}

# Cloud SQL Variables
variable "cloudsql_tier" {
  description = "Machine tier for Cloud SQL instances"
  type        = string
  default     = "db-n1-standard-2"
}

variable "cloudsql_availability_type" {
  description = "Availability type for Cloud SQL (REGIONAL or ZONAL)"
  type        = string
  default     = "REGIONAL"
}

variable "cloudsql_backup_enabled" {
  description = "Enable automated backups for Cloud SQL"
  type        = bool
  default     = true
}

variable "cloudsql_disk_size_gb" {
  description = "Disk size for Cloud SQL instances in GB"
  type        = number
  default     = 20
}

# Redis Variables
variable "redis_memory_size_gb" {
  description = "Memory size for Redis instance in GB"
  type        = number
  default     = 5
}

variable "redis_tier" {
  description = "Tier for Redis instance (BASIC or STANDARD_HA)"
  type        = string
  default     = "STANDARD_HA"
}

# Secret Manager Variables
variable "enable_secret_manager" {
  description = "Enable Google Secret Manager for storing secrets"
  type        = bool
  default     = true
}

# Monitoring Variables
variable "enable_monitoring" {
  description = "Enable Cloud Monitoring and Logging"
  type        = bool
  default     = true
}

# Cost Optimization Variables
variable "enable_preemptible_nodes" {
  description = "Use preemptible VMs for cost savings (dev/staging only)"
  type        = bool
  default     = false
}

# Tags
variable "labels" {
  description = "Labels to apply to all resources"
  type        = map(string)
  default     = {}
}
