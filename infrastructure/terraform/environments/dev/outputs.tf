# Development Environment Outputs
# These pass through from the module outputs

output "project_id" {
  description = "GCP Project ID"
  value       = module.infrastructure.project_id
}

output "region" {
  description = "GCP Region"
  value       = module.infrastructure.region
}

output "environment" {
  description = "Environment name"
  value       = module.infrastructure.environment
}

output "gke_cluster_name" {
  description = "GKE cluster name"
  value       = module.infrastructure.gke_cluster_name
}

output "gke_kubectl_config" {
  description = "kubectl configuration command"
  value       = module.infrastructure.gke_kubectl_config
}

output "cloudsql_connection_names" {
  description = "Cloud SQL connection names"
  value = {
    shared   = module.infrastructure.cloudsql_shared_connection_name
    customer = module.infrastructure.cloudsql_customer_instance_name
    carrier  = module.infrastructure.cloudsql_carrier_instance_name
    pricing  = module.infrastructure.cloudsql_pricing_instance_name
  }
}

output "redis_connection" {
  description = "Redis connection details"
  value = {
    host = module.infrastructure.redis_host
    port = module.infrastructure.redis_port
  }
}

output "quick_commands" {
  description = "Quick reference commands"
  value       = module.infrastructure.quick_commands
}
