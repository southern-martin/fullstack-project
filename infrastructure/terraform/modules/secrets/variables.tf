# Secrets Module Variables

variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, staging, production)"
  type        = string
}

variable "secrets" {
  description = "Map of secrets to create (key = secret name, value = description)"
  type        = map(string)
  default     = {}
}

variable "service_account_emails" {
  description = "List of service account emails that need access to secrets"
  type        = list(string)
  default     = null
}

variable "labels" {
  description = "Labels to apply to secrets"
  type        = map(string)
  default     = {}
}
