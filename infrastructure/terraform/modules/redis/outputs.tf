# Redis Module Outputs

output "instance_id" {
  description = "ID of the Redis instance"
  value       = google_redis_instance.cache.id
}

output "instance_name" {
  description = "Name of the Redis instance"
  value       = google_redis_instance.cache.name
}

output "host" {
  description = "Hostname or IP address of the Redis instance"
  value       = google_redis_instance.cache.host
}

output "port" {
  description = "Port of the Redis instance"
  value       = google_redis_instance.cache.port
}

output "current_location_id" {
  description = "Current location ID of the Redis instance"
  value       = google_redis_instance.cache.current_location_id
}

output "redis_version" {
  description = "Redis version"
  value       = google_redis_instance.cache.redis_version
}

output "auth_string" {
  description = "Redis AUTH string (if authentication is enabled)"
  value       = var.auth_enabled ? google_redis_instance.cache.auth_string : null
  sensitive   = true
}

output "connection_string" {
  description = "Redis connection string"
  value       = "redis://${google_redis_instance.cache.host}:${google_redis_instance.cache.port}"
}

output "persistence_iam_identity" {
  description = "Cloud IAM identity used for persistence"
  value       = google_redis_instance.cache.persistence_iam_identity
}
