# Secrets Management

## ⚠️ IMPORTANT: Never Commit Actual Secrets

This directory is for managing application secrets. Actual secret files are excluded from git.

## Local Development Setup

1. Copy the template:
   ```bash
   cp secrets.example.yaml secrets.yaml
   ```

2. Fill in your local development secrets in `secrets.yaml`

3. The `secrets.yaml` file is gitignored and will never be committed

## Cloud Deployment (GCP)

For production/staging environments, secrets should be stored in:
- **GCP Secret Manager** (recommended)
- **Kubernetes Secrets** (for cluster-specific configs)

## File Structure

- `secrets.example.yaml` - Template showing required secrets (safe to commit)
- `secrets.yaml` - Your actual local secrets (NEVER commit)
- `.gitignore` - Ensures secrets are not tracked

## Usage

Secrets are loaded into environment variables before starting services:

```bash
# Local development
make start-local

# This will automatically load secrets from secrets.yaml
```

## Adding New Secrets

1. Add the secret key to `secrets.example.yaml` with a placeholder value
2. Add the actual value to your local `secrets.yaml`
3. Update environment files in `infrastructure/environments/`
4. For production, add to GCP Secret Manager
