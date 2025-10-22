#!/bin/bash
# Terraform initialization script for GCP deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if environment is provided
if [ -z "$1" ]; then
    print_error "Environment not specified"
    echo "Usage: $0 <environment>"
    echo "Example: $0 dev"
    exit 1
fi

ENVIRONMENT=$1
ENV_DIR="infrastructure/terraform/environments/${ENVIRONMENT}"

# Check if environment directory exists
if [ ! -d "$ENV_DIR" ]; then
    print_error "Environment directory not found: $ENV_DIR"
    echo "Available environments:"
    ls -d infrastructure/terraform/environments/*/ 2>/dev/null || echo "  No environments found"
    exit 1
fi

print_info "Initializing Terraform for environment: ${ENVIRONMENT}"

# Navigate to environment directory
cd "$ENV_DIR"

# Check if terraform.tfvars exists
if [ ! -f "terraform.tfvars" ]; then
    print_warn "terraform.tfvars not found"
    if [ -f "terraform.tfvars.example" ]; then
        print_info "Copying terraform.tfvars.example to terraform.tfvars"
        cp terraform.tfvars.example terraform.tfvars
        print_warn "Please edit terraform.tfvars with your GCP project details"
        print_warn "Required: Update 'project_id' variable"
        exit 0
    else
        print_error "terraform.tfvars.example not found"
        exit 1
    fi
fi

# Check if Terraform is installed
if ! command -v terraform &> /dev/null; then
    print_error "Terraform is not installed"
    echo "Install Terraform: https://www.terraform.io/downloads"
    exit 1
fi

# Check Terraform version
TERRAFORM_VERSION=$(terraform version -json | grep -o '"terraform_version":"[^"]*' | cut -d'"' -f4)
print_info "Terraform version: ${TERRAFORM_VERSION}"

# Check if gcloud is installed and authenticated
if ! command -v gcloud &> /dev/null; then
    print_warn "gcloud CLI is not installed"
    echo "Install gcloud: https://cloud.google.com/sdk/docs/install"
else
    print_info "Checking GCP authentication..."
    if ! gcloud auth application-default print-access-token &> /dev/null; then
        print_warn "Not authenticated with GCP"
        print_info "Running: gcloud auth application-default login"
        gcloud auth application-default login
    else
        print_info "GCP authentication verified"
    fi
fi

# Initialize Terraform
print_info "Running: terraform init"
terraform init

# Validate Terraform configuration
print_info "Running: terraform validate"
terraform validate

print_info "Terraform initialization complete for ${ENVIRONMENT} environment"
print_info ""
print_info "Next steps:"
echo "  1. Review configuration: terraform plan"
echo "  2. Apply configuration: terraform apply"
echo "  3. View outputs: terraform output"
