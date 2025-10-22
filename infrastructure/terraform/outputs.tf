# Outputs for the infrastructure

output "project_id" {
  description = "GCP Project ID"
  value       = var.project_id
}

output "region" {
  description = "GCP Region"
  value       = var.region
}

output "environment" {
  description = "Environment name"
  value       = var.environment
}

# Networking Outputs
output "network_name" {
  description = "VPC network name"
  value       = module.networking.network_name
}

output "network_self_link" {
  description = "VPC network self link"
  value       = module.networking.network_self_link
}

output "subnet_name" {
  description = "Subnet name"
  value       = module.networking.subnet_name
}

# GKE Outputs
output "gke_cluster_name" {
  description = "GKE cluster name"
  value       = module.gke.cluster_name
}

output "gke_cluster_endpoint" {
  description = "GKE cluster endpoint"
  value       = module.gke.endpoint
  sensitive   = true
}

output "gke_cluster_ca_certificate" {
  description = "GKE cluster CA certificate"
  value       = module.gke.ca_certificate
  sensitive   = true
}

output "gke_kubectl_config" {
  description = "kubectl configuration command"
  value       = "gcloud container clusters get-credentials ${module.gke.cluster_name} --region ${var.region} --project ${var.project_id}"
}

# Cloud SQL Outputs
output "cloudsql_shared_instance_name" {
  description = "Shared Cloud SQL instance name"
  value       = module.cloud_sql_shared.instance_name
}

output "cloudsql_shared_connection_name" {
  description = "Shared Cloud SQL connection name"
  value       = module.cloud_sql_shared.connection_name
}

output "cloudsql_shared_private_ip" {
  description = "Shared Cloud SQL private IP address"
  value       = module.cloud_sql_shared.private_ip_address
}

output "cloudsql_customer_instance_name" {
  description = "Customer Cloud SQL instance name"
  value       = module.cloud_sql_customer.instance_name
}

output "cloudsql_carrier_instance_name" {
  description = "Carrier Cloud SQL instance name"
  value       = module.cloud_sql_carrier.instance_name
}

output "cloudsql_pricing_instance_name" {
  description = "Pricing Cloud SQL instance name"
  value       = module.cloud_sql_pricing.instance_name
}

# Redis Outputs
output "redis_instance_id" {
  description = "Redis instance ID"
  value       = module.redis.instance_id
}

output "redis_host" {
  description = "Redis host address"
  value       = module.redis.host
}

output "redis_port" {
  description = "Redis port"
  value       = module.redis.port
}

# Secret Manager Outputs
output "secret_manager_enabled" {
  description = "Whether Secret Manager is enabled"
  value       = var.enable_secret_manager
}

# Quick Reference Commands
output "quick_commands" {
  description = "Quick reference commands for managing the infrastructure"
  value = <<-EOT
    
    # Connect to GKE cluster:
    ${module.gke.kubectl_config_command}
    
    # View cluster info:
    kubectl cluster-info
    
    # Connect to Cloud SQL (using Cloud SQL Proxy):
    cloud_sql_proxy -instances=${module.cloud_sql_shared.connection_name}=tcp:3306
    
    # View Redis connection info:
    Host: ${module.redis.host}
    Port: ${module.redis.port}
    
    # Deploy to cluster:
    kubectl apply -f ../kubernetes/
    
  EOT
}
