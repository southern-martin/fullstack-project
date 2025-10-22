# Secret Manager Module

# Create secrets in Google Secret Manager
resource "google_secret_manager_secret" "secrets" {
  for_each = var.secrets
  
  secret_id = "${var.environment}-${each.key}"
  project   = var.project_id
  
  labels = merge(
    var.labels,
    {
      secret_name = each.key
    }
  )
  
  replication {
    automatic = true
  }
}

# Create initial secret versions with placeholder values
# In production, these should be updated with actual values via gcloud or console
resource "google_secret_manager_secret_version" "secret_versions" {
  for_each = var.secrets
  
  secret      = google_secret_manager_secret.secrets[each.key].id
  secret_data = "CHANGE_ME_${random_password.placeholder[each.key].result}"
  
  depends_on = [google_secret_manager_secret.secrets]
}

# Generate random placeholders for initial values
resource "random_password" "placeholder" {
  for_each = var.secrets
  
  length  = 32
  special = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

# IAM bindings for GKE service accounts to access secrets
resource "google_secret_manager_secret_iam_member" "secret_accessor" {
  for_each = var.service_account_emails != null ? {
    for pair in setproduct(keys(var.secrets), var.service_account_emails) :
    "${pair[0]}-${pair[1]}" => {
      secret  = pair[0]
      sa_email = pair[1]
    }
  } : {}
  
  project   = var.project_id
  secret_id = google_secret_manager_secret.secrets[each.value.secret].secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${each.value.sa_email}"
  
  depends_on = [google_secret_manager_secret.secrets]
}
