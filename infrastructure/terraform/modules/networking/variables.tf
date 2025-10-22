# Networking Module Variables

variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP region for resources"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, staging, production)"
  type        = string
}

variable "network_name" {
  description = "Name of the VPC network"
  type        = string
}

variable "subnet_cidr" {
  description = "CIDR block for the main subnet"
  type        = string
}

variable "pods_cidr" {
  description = "CIDR block for GKE pods (secondary range)"
  type        = string
}

variable "services_cidr" {
  description = "CIDR block for GKE services (secondary range)"
  type        = string
}

variable "labels" {
  description = "Labels to apply to resources"
  type        = map(string)
  default     = {}
}
