# Secrets Module Outputs

output "secret_ids" {
  description = "Map of secret names to their Secret Manager IDs"
  value = {
    for k, v in google_secret_manager_secret.secrets : k => v.secret_id
  }
}

output "secret_names" {
  description = "List of secret names"
  value       = keys(var.secrets)
}

output "secret_versions" {
  description = "Map of secret names to their latest version names"
  value = {
    for k, v in google_secret_manager_secret_version.secret_versions : k => v.name
  }
}

output "instructions" {
  description = "Instructions for updating secret values"
  value = <<-EOT
    
    To update secret values, use the following commands:
    
    # Update a secret value:
    echo -n "your-secret-value" | gcloud secrets versions add ${var.environment}-SECRET_NAME --data-file=-
    
    # List all secrets:
    gcloud secrets list --filter="labels.environment=${var.environment}"
    
    # View secret metadata:
    gcloud secrets describe ${var.environment}-SECRET_NAME
    
    # Access a secret value:
    gcloud secrets versions access latest --secret="${var.environment}-SECRET_NAME"
    
  EOT
}
