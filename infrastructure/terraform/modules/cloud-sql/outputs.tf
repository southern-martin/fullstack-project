# Cloud SQL Module Outputs

output "instance_name" {
  description = "Name of the Cloud SQL instance"
  value       = google_sql_database_instance.instance.name
}

output "instance_id" {
  description = "ID of the Cloud SQL instance"
  value       = google_sql_database_instance.instance.id
}

output "connection_name" {
  description = "Connection name for Cloud SQL Proxy"
  value       = google_sql_database_instance.instance.connection_name
}

output "private_ip_address" {
  description = "Private IP address of the Cloud SQL instance"
  value       = google_sql_database_instance.instance.private_ip_address
}

output "database_name" {
  description = "Name of the database"
  value       = google_sql_database.database.name
}

output "database_user" {
  description = "Database username"
  value       = google_sql_user.user.name
}

output "database_password" {
  description = "Database password"
  value       = random_password.db_password.result
  sensitive   = true
}

output "self_link" {
  description = "Self link of the Cloud SQL instance"
  value       = google_sql_database_instance.instance.self_link
}

output "read_replica_connection_name" {
  description = "Connection name for the read replica (if enabled)"
  value       = var.enable_read_replica ? google_sql_database_instance.read_replica[0].connection_name : null
}

output "read_replica_private_ip" {
  description = "Private IP address of the read replica (if enabled)"
  value       = var.enable_read_replica ? google_sql_database_instance.read_replica[0].private_ip_address : null
}
