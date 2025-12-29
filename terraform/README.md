# Terraform Configuration for CES 2026 Volr Demo

This directory contains Terraform configuration for deploying the static website to AWS.

## Quick Start

```bash
# 1. Copy example variables
cp terraform.tfvars.example terraform.tfvars

# 2. Edit terraform.tfvars with your values
# You need:
#   - ACM certificate ARN (must be in us-east-1)
#   - Route53 hosted zone ID for volr.io

# 3. Initialize Terraform
terraform init

# 4. Preview changes
terraform plan

# 5. Apply configuration
terraform apply

# 6. View outputs
terraform output
```

## Resources Created

- **S3 Bucket**: `ces2026.volr.io` - Hosts static files
- **CloudFront Distribution**: CDN with HTTPS
- **CloudFront OAI**: Secure S3 access
- **Route53 Records**: DNS A and AAAA records
- **S3 Bucket Policy**: Allows CloudFront access only

## Required Variables

Edit `terraform.tfvars`:

```hcl
acm_certificate_arn = "arn:aws:acm:us-east-1:ACCOUNT:certificate/CERT_ID"
route53_zone_id     = "ZONE_ID"
```

## Outputs

After `terraform apply`, you'll get:

- `s3_bucket_name`: Use this in GitHub Secrets as `S3_BUCKET`
- `cloudfront_distribution_id`: Use this as `CLOUDFRONT_DISTRIBUTION_ID`
- `website_url`: Your live website URL

## File Structure

- `provider.tf`: AWS provider configuration
- `variables.tf`: Input variables
- `main.tf`: Main infrastructure resources
- `outputs.tf`: Output values
- `terraform.tfvars`: Your actual values (gitignored)
- `terraform.tfvars.example`: Template for variables

## Security

- S3 bucket blocks all public access
- CloudFront uses OAI for secure access
- HTTPS enforced via ACM certificate
- TLS 1.2+ required

## Cost Estimate

Monthly costs (approximate):

- S3: $0.50 - $2
- CloudFront: $1 - $10 (depends on traffic)
- Route53: $0.50

**Total**: ~$2-15/month

## Maintenance

### Update infrastructure

```bash
terraform plan
terraform apply
```

### Destroy infrastructure

```bash
terraform destroy
```

⚠️ **Warning**: This deletes all resources including S3 bucket contents!
