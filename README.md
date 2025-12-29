# Volr CES 2026 Demo

A demo application showcasing Volr payment integration, built with React + TypeScript + Vite.

**Live Demo:** https://ces2026.volr.io

## Features

- Modern React UI with TypeScript
- Volr payment integration
- Payment history tracking
- Responsive design with Tailwind CSS

## Local Development

### Prerequisites

- Node.js 20 or higher
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

This project is deployed to AWS using Terraform for infrastructure and GitHub Actions for CI/CD.

### Architecture

- **S3**: Static website hosting
- **CloudFront**: CDN with HTTPS
- **Route53**: DNS management (ces2026.volr.io)
- **ACM**: SSL/TLS certificates

### Infrastructure Setup

#### 1. Prerequisites

- AWS CLI configured with appropriate credentials
- Terraform installed (version >= 1.0)
- Access to AWS account with necessary permissions
- Existing ACM certificate for `*.volr.io` or `ces2026.volr.io` in `us-east-1`
- Route53 hosted zone for `volr.io`

#### 2. Get Required AWS Information

```bash
# Get your ACM certificate ARN (must be in us-east-1)
aws acm list-certificates --region us-east-1

# Get your Route53 hosted zone ID
aws route53 list-hosted-zones
```

#### 3. Configure Terraform

```bash
cd terraform

# Copy the example variables file
cp terraform.tfvars.example terraform.tfvars

# Edit terraform.tfvars and fill in your values:
# - acm_certificate_arn: Your ACM certificate ARN
# - route53_zone_id: Your Route53 hosted zone ID
```

Example `terraform.tfvars`:

```hcl
aws_region = "us-east-1"
domain_name = "ces2026.volr.io"
root_domain = "volr.io"
acm_certificate_arn = "arn:aws:acm:us-east-1:123456789012:certificate/abcd1234-..."
route53_zone_id = "Z1234567890ABC"
```

#### 4. Deploy Infrastructure

```bash
# Initialize Terraform
terraform init

# Review the planned changes
terraform plan

# Apply the infrastructure
terraform apply

# Save the outputs (you'll need these for GitHub Secrets)
terraform output
```

#### 5. Configure GitHub Secrets

Add the following secrets to your GitHub repository (Settings → Secrets and variables → Actions):

- `AWS_ACCESS_KEY_ID`: Your AWS access key
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret key
- `AWS_REGION`: `us-east-1`
- `S3_BUCKET`: The bucket name from terraform output (e.g., `ces2026.volr.io`)
- `CLOUDFRONT_DISTRIBUTION_ID`: The distribution ID from terraform output

#### 6. Deploy Application

Push to the `main` branch to trigger automatic deployment:

```bash
git push origin main
```

Or manually trigger the workflow from GitHub Actions tab.

### Manual Deployment

If you prefer to deploy manually without GitHub Actions:

```bash
# Build the application
npm run build

# Sync to S3 (replace with your bucket name)
aws s3 sync dist/ s3://ces2026.volr.io \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "index.html" \
  --exclude "*.html"

# Upload HTML files with shorter cache
aws s3 sync dist/ s3://ces2026.volr.io \
  --cache-control "public, max-age=0, must-revalidate" \
  --exclude "*" \
  --include "*.html"

# Invalidate CloudFront cache (replace with your distribution ID)
aws cloudfront create-invalidation \
  --distribution-id E1234567890ABC \
  --paths "/*"
```

## Infrastructure Management

### View Current Infrastructure

```bash
cd terraform
terraform show
```

### Update Infrastructure

```bash
cd terraform
# Make changes to .tf files
terraform plan
terraform apply
```

### Destroy Infrastructure

```bash
cd terraform
terraform destroy
```

**Warning:** This will delete all resources including the S3 bucket and its contents.

## Troubleshooting

### CloudFront shows old content

CloudFront caches content. Either wait for cache expiration or manually invalidate:

```bash
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

### Certificate errors

Ensure your ACM certificate:

- Is in `us-east-1` region (required for CloudFront)
- Covers `ces2026.volr.io` or `*.volr.io`
- Is validated and issued

### DNS not resolving

After creating Route53 records, DNS propagation can take a few minutes to a few hours. Check with:

```bash
dig ces2026.volr.io
nslookup ces2026.volr.io
```

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Payment**: @volr/react-ui
- **Infrastructure**: Terraform, AWS (S3, CloudFront, Route53)
- **CI/CD**: GitHub Actions
