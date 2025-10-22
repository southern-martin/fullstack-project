# Development Environment Variables
# These inherit from the root variables.tf but can be overridden

variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP region"
  type        = string
  default     = "us-central1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "fullstack-project"
}

variable "network_name" {
  description = "VPC network name"
  type        = string
  default     = "fullstack-vpc"
}

variable "subnet_cidr" {
  description = "Subnet CIDR"
  type        = string
  default     = "10.10.0.0/20"
}

variable "pods_cidr" {
  description = "GKE pods CIDR"
  type        = string
  default     = "10.11.0.0/16"
}

variable "services_cidr" {
  description = "GKE services CIDR"
  type        = string
  default     = "10.12.0.0/16"
}

variable "gke_cluster_name" {
  description = "GKE cluster name"
  type        = string
  default     = "fullstack-dev-gke"
}

variable "gke_node_count" {
  description = "GKE node count"
  type        = number
  default     = 2
}

variable "gke_machine_type" {
  description = "GKE machine type"
  type        = string
  default     = "e2-standard-2"
}

variable "gke_disk_size_gb" {
  description = "GKE disk size"
  type        = number
  default     = 50
}

variable "gke_min_nodes" {
  description = "GKE minimum nodes"
  type        = number
  default     = 1
}

variable "gke_max_nodes" {
  description = "GKE maximum nodes"
  type        = number
  default     = 3
}

variable "enable_preemptible_nodes" {
  description = "Use preemptible nodes"
  type        = bool
  default     = true
}

variable "cloudsql_tier" {
  description = "Cloud SQL tier"
  type        = string
  default     = "db-n1-standard-1"
}

variable "cloudsql_availability_type" {
  description = "Cloud SQL availability"
  type        = string
  default     = "ZONAL"
}

variable "cloudsql_disk_size_gb" {
  description = "Cloud SQL disk size"
  type        = number
  default     = 10
}

variable "cloudsql_backup_enabled" {
  description = "Enable Cloud SQL backups"
  type        = bool
  default     = true
}

variable "redis_memory_size_gb" {
  description = "Redis memory size"
  type        = number
  default     = 1
}

variable "redis_tier" {
  description = "Redis tier"
  type        = string
  default     = "BASIC"
}

variable "enable_secret_manager" {
  description = "Enable Secret Manager"
  type        = bool
  default     = true
}

variable "enable_monitoring" {
  description = "Enable monitoring"
  type        = bool
  default     = true
}

variable "labels" {
  description = "Resource labels"
  type        = map(string)
  default = {
    team        = "engineering"
    cost_center = "development"
    created_by  = "terraform"
  }
}
