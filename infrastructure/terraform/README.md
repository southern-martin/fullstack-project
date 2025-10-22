# Terraform Infrastructure for Fullstack Project

This directory contains Terraform configurations for deploying the fullstack microservices application to Google Cloud Platform (GCP).

## 📁 Directory Structure

```
terraform/
├── main.tf              # Main orchestration file
├── variables.tf         # Root-level variables
├── outputs.tf           # Root-level outputs
├── providers.tf         # Provider configurations
├── modules/            # Reusable Terraform modules
│   ├── networking/     # VPC, subnets, firewall rules
│   ├── gke/           # Google Kubernetes Engine cluster
│   ├── cloud-sql/     # Cloud SQL MySQL instances
│   ├── redis/         # Memorystore for Redis
│   └── secrets/       # Secret Manager
└── environments/      # Environment-specific configurations
    ├── dev/          # Development environment
    ├── staging/      # Staging environment
    └── production/   # Production environment
```

## 🚀 Quick Start

### Prerequisites

1. **Install Terraform** (>= 1.5.0)
   ```bash
   brew install terraform  # macOS
   # or download from https://www.terraform.io/downloads
   ```

2. **Install Google Cloud SDK**
   ```bash
   brew install --cask google-cloud-sdk  # macOS
   # or download from https://cloud.google.com/sdk/docs/install
   ```

3. **Authenticate with GCP**
   ```bash
   gcloud auth login
   gcloud auth application-default login
   ```

4. **Create GCP Project** (if not exists)
   ```bash
   gcloud projects create your-project-id
   gcloud config set project your-project-id
   ```

5. **Enable Required APIs**
   ```bash
   gcloud services enable compute.googleapis.com
   gcloud services enable container.googleapis.com
   gcloud services enable sqladmin.googleapis.com
   gcloud services enable redis.googleapis.com
   gcloud services enable secretmanager.googleapis.com
   gcloud services enable servicenetworking.googleapis.com
   ```

### Deploy to Development Environment

1. **Navigate to dev environment**
   ```bash
   cd infrastructure/terraform/environments/dev
   ```

2. **Copy and configure variables**
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   # Edit terraform.tfvars with your project details
   ```

3. **Initialize Terraform**
   ```bash
   terraform init
   ```

4. **Review the plan**
   ```bash
   terraform plan
   ```

5. **Apply the configuration**
   ```bash
   terraform apply
   ```

6. **Get outputs**
   ```bash
   terraform output
   ```

## 📊 Infrastructure Components

### Networking Module
- **VPC Network**: Private network for all resources
- **Subnets**: Main subnet with secondary ranges for GKE pods and services
- **Cloud NAT**: Outbound internet access for private resources
- **Firewall Rules**: Secure internal communication

### GKE Module
- **Kubernetes Cluster**: Managed GKE cluster
- **Node Pools**: Auto-scaling node pools with configurable machine types
- **Workload Identity**: Secure service-to-service authentication
- **Auto-upgrade/Auto-repair**: Automated maintenance

### Cloud SQL Module
- **4 MySQL Instances**:
  - `shared-db`: Auth and User services (shared database)
  - `customer-db`: Customer service
  - `carrier-db`: Carrier service
  - `pricing-db`: Pricing service
- **Features**: Private IP, automated backups, point-in-time recovery, high availability (staging/prod)

### Redis Module
- **Memorystore Instance**: Managed Redis cache
- **Features**: Private IP, persistence (optional), read replicas (optional), high availability (staging/prod)

### Secrets Module
- **Secret Manager**: Encrypted storage for sensitive data
- **Secrets Created**:
  - Database passwords (4 instances)
  - Redis password
  - JWT secrets (signing + refresh)
  - API keys (6 services)

## 🔧 Configuration by Environment

### Development
- **Purpose**: Local development testing
- **Cost Optimization**: Preemptible VMs, smaller instances, ZONAL availability
- **GKE**: 2 nodes (e2-standard-2), min 1, max 3
- **Cloud SQL**: db-n1-standard-1, ZONAL, 10GB
- **Redis**: 1GB, BASIC tier

### Staging
- **Purpose**: Pre-production testing
- **Configuration**: Production-like setup
- **GKE**: 3 nodes (e2-standard-4), min 2, max 8
- **Cloud SQL**: db-n1-standard-2, REGIONAL, 20GB
- **Redis**: 5GB, STANDARD_HA

### Production
- **Purpose**: Live production workloads
- **Configuration**: High availability, optimized performance
- **GKE**: 3+ nodes (e2-standard-4), min 3, max 10
- **Cloud SQL**: db-n1-standard-2, REGIONAL, 50GB, read replicas
- **Redis**: 10GB, STANDARD_HA, persistence enabled

## 📝 Common Commands

### Terraform Operations
```bash
# Initialize (download providers)
terraform init

# Format code
terraform fmt -recursive

# Validate configuration
terraform validate

# Plan changes (dry run)
terraform plan

# Apply changes
terraform apply

# Apply without confirmation
terraform apply -auto-approve

# Destroy infrastructure
terraform destroy

# Show current state
terraform show

# List resources
terraform state list

# Get specific output
terraform output gke_kubectl_config
```

### GCP Operations After Deployment
```bash
# Configure kubectl to use the GKE cluster
gcloud container clusters get-credentials fullstack-dev-gke \
  --region us-central1 \
  --project your-project-id

# Verify cluster access
kubectl cluster-info
kubectl get nodes

# Connect to Cloud SQL using proxy
cloud_sql_proxy -instances=CONNECTION_NAME=tcp:3306

# List secrets
gcloud secrets list --filter="labels.environment=dev"

# Update a secret value
echo -n "new-password" | gcloud secrets versions add dev-shared-db-password --data-file=-
```

## 🔐 State Management

### Local State (Development)
By default, Terraform stores state locally. This is fine for individual development but not for teams.

### Remote State (Recommended)
For team collaboration, use Google Cloud Storage backend:

1. **Create GCS bucket**
   ```bash
   gsutil mb -p your-project-id gs://your-project-terraform-state
   gsutil versioning set on gs://your-project-terraform-state
   ```

2. **Uncomment backend block** in `main.tf`:
   ```hcl
   backend "gcs" {
     bucket = "your-project-terraform-state"
     prefix = "terraform/dev"
   }
   ```

3. **Migrate state**
   ```bash
   terraform init -migrate-state
   ```

## 🛡️ Security Best Practices

1. **Never commit** `terraform.tfvars` or `.tfstate` files
2. **Use Secret Manager** for all sensitive values
3. **Enable deletion protection** for production databases
4. **Use Workload Identity** instead of service account keys
5. **Restrict network access** with firewall rules
6. **Enable Cloud Audit Logs**
7. **Use private IP** for all databases and Redis

## 💰 Cost Optimization

### Development Environment
- Use preemptible VMs (70% cost reduction)
- Use ZONAL availability instead of REGIONAL
- Use BASIC Redis tier
- Smaller machine types and disk sizes
- Auto-shutdown GKE cluster at night (optional)

### Staging/Production
- Use committed use discounts for predictable workloads
- Enable autoscaling to match actual load
- Use sustained use discounts (automatic)
- Monitor and right-size resources

## 🔍 Troubleshooting

### Common Issues

1. **API Not Enabled**
   ```
   Error: Error creating Network: googleapi: Error 403: Access Not Configured
   ```
   **Solution**: Enable required APIs (see Prerequisites)

2. **Quota Exceeded**
   ```
   Error: Error creating instance: Quota exceeded for quota group 'CPU'
   ```
   **Solution**: Request quota increase in GCP Console

3. **State Lock**
   ```
   Error: Error acquiring the state lock
   ```
   **Solution**: Wait for other operations to complete or force unlock
   ```bash
   terraform force-unlock LOCK_ID
   ```

4. **Private IP Allocation**
   ```
   Error: Error creating Private Service Connection
   ```
   **Solution**: Ensure servicenetworking API is enabled

## 📚 Additional Resources

- [Terraform GCP Provider Documentation](https://registry.terraform.io/providers/hashicorp/google/latest/docs)
- [GKE Best Practices](https://cloud.google.com/kubernetes-engine/docs/best-practices)
- [Cloud SQL Best Practices](https://cloud.google.com/sql/docs/mysql/best-practices)
- [Memorystore for Redis Best Practices](https://cloud.google.com/memorystore/docs/redis/redis-best-practices)
- [GCP Security Best Practices](https://cloud.google.com/security/best-practices)

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review GCP documentation
3. Check Terraform logs: `TF_LOG=DEBUG terraform apply`
4. Contact the infrastructure team
