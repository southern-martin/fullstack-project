# Terraform Configuration for Fullstack Project on GCP
# This is the main provider configuration

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.11"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }

  # Backend configuration for remote state
  # Uncomment and configure after creating GCS bucket
  # backend "gcs" {
  #   bucket = "your-project-terraform-state"
  #   prefix = "terraform/state"
  # }
}

# Google Cloud Provider
provider "google" {
  project = var.project_id
  region  = var.region
}

# Google Cloud Provider (Beta features)
provider "google-beta" {
  project = var.project_id
  region  = var.region
}

# Kubernetes Provider (configured after GKE cluster creation)
provider "kubernetes" {
  host                   = "https://${module.gke.endpoint}"
  token                  = data.google_client_config.default.access_token
  cluster_ca_certificate = base64decode(module.gke.ca_certificate)
}

# Helm Provider (for deploying applications to GKE)
provider "helm" {
  kubernetes {
    host                   = "https://${module.gke.endpoint}"
    token                  = data.google_client_config.default.access_token
    cluster_ca_certificate = base64decode(module.gke.ca_certificate)
  }
}

# Get current Google Cloud client configuration
data "google_client_config" "default" {}
