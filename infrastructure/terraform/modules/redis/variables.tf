# Redis Module Variables

variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP region for the Redis instance"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, staging, production)"
  type        = string
}

variable "instance_name" {
  description = "Name of the Redis instance"
  type        = string
}

variable "memory_size_gb" {
  description = "Memory size in GB for Redis instance"
  type        = number
  default     = 5
}

variable "tier" {
  description = "Redis tier (BASIC or STANDARD_HA)"
  type        = string
  default     = "STANDARD_HA"
  
  validation {
    condition     = contains(["BASIC", "STANDARD_HA"], var.tier)
    error_message = "Tier must be either BASIC or STANDARD_HA"
  }
}

variable "redis_version" {
  description = "Redis version"
  type        = string
  default     = "REDIS_7_0"
}

variable "network_self_link" {
  description = "Self link of the VPC network"
  type        = string
}

variable "maxmemory_policy" {
  description = "Maxmemory eviction policy"
  type        = string
  default     = "allkeys-lru"
  
  validation {
    condition = contains([
      "noeviction",
      "allkeys-lru",
      "allkeys-lfu",
      "volatile-lru",
      "volatile-lfu",
      "allkeys-random",
      "volatile-random",
      "volatile-ttl"
    ], var.maxmemory_policy)
    error_message = "Invalid maxmemory policy"
  }
}

variable "redis_configs" {
  description = "Additional Redis configuration parameters"
  type        = map(string)
  default     = {}
}

variable "persistence_mode" {
  description = "Persistence mode (RDB or AOF)"
  type        = string
  default     = "RDB"
  
  validation {
    condition     = contains(["DISABLED", "RDB", "AOF"], var.persistence_mode)
    error_message = "Persistence mode must be DISABLED, RDB, or AOF"
  }
}

variable "rdb_snapshot_period" {
  description = "Snapshot period for RDB persistence"
  type        = string
  default     = "ONE_HOUR"
  
  validation {
    condition = contains([
      "ONE_HOUR",
      "SIX_HOURS",
      "TWELVE_HOURS",
      "TWENTY_FOUR_HOURS"
    ], var.rdb_snapshot_period)
    error_message = "Invalid RDB snapshot period"
  }
}

variable "replica_count" {
  description = "Number of read replicas (for STANDARD_HA tier only)"
  type        = number
  default     = 1
  
  validation {
    condition     = var.replica_count >= 0 && var.replica_count <= 5
    error_message = "Replica count must be between 0 and 5"
  }
}

variable "read_replicas_mode" {
  description = "Read replicas mode (READ_REPLICAS_ENABLED or READ_REPLICAS_DISABLED)"
  type        = string
  default     = "READ_REPLICAS_ENABLED"
  
  validation {
    condition     = contains(["READ_REPLICAS_ENABLED", "READ_REPLICAS_DISABLED"], var.read_replicas_mode)
    error_message = "Read replicas mode must be READ_REPLICAS_ENABLED or READ_REPLICAS_DISABLED"
  }
}

variable "transit_encryption_mode" {
  description = "Transit encryption mode (SERVER_AUTHENTICATION or DISABLED)"
  type        = string
  default     = "DISABLED"
  
  validation {
    condition     = contains(["SERVER_AUTHENTICATION", "DISABLED"], var.transit_encryption_mode)
    error_message = "Transit encryption mode must be SERVER_AUTHENTICATION or DISABLED"
  }
}

variable "auth_enabled" {
  description = "Enable Redis AUTH"
  type        = bool
  default     = true
}

variable "labels" {
  description = "Labels to apply to resources"
  type        = map(string)
  default     = {}
}
