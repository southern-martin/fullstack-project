#!/bin/bash
# Script to enable required GCP APIs for the project

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if project ID is provided
if [ -z "$1" ]; then
    print_error "GCP Project ID not specified"
    echo "Usage: $0 <project-id>"
    echo "Example: $0 my-gcp-project"
    exit 1
fi

PROJECT_ID=$1

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    print_error "gcloud CLI is not installed"
    echo "Install gcloud: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

print_info "Enabling required GCP APIs for project: ${PROJECT_ID}"
gcloud config set project "${PROJECT_ID}"

# List of required APIs
APIS=(
    "compute.googleapis.com"              # Compute Engine (for VPC, networking)
    "container.googleapis.com"            # Google Kubernetes Engine
    "sqladmin.googleapis.com"             # Cloud SQL
    "redis.googleapis.com"                # Memorystore for Redis
    "secretmanager.googleapis.com"        # Secret Manager
    "servicenetworking.googleapis.com"    # Service Networking (for private IPs)
    "cloudresourcemanager.googleapis.com" # Resource Manager
    "iam.googleapis.com"                  # IAM
    "logging.googleapis.com"              # Cloud Logging
    "monitoring.googleapis.com"           # Cloud Monitoring
    "cloudapis.googleapis.com"            # Cloud APIs
)

print_info "Enabling ${#APIS[@]} APIs..."
echo ""

for api in "${APIS[@]}"; do
    print_info "Enabling ${api}..."
    gcloud services enable "${api}" --project="${PROJECT_ID}"
done

echo ""
print_info "All required APIs have been enabled successfully!"
print_info ""
print_info "You can now run: scripts/terraform-init.sh <environment>"
