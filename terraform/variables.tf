variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "domain_name" {
  description = "Domain name for the website"
  type        = string
  default     = "ces2026.volr.io"
}

variable "root_domain" {
  description = "Root domain name"
  type        = string
  default     = "volr.io"
}

variable "acm_certificate_arn" {
  description = "ARN of the existing ACM certificate for *.volr.io or ces2026.volr.io (must be in us-east-1)"
  type        = string
  # Example: "arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012"
}

variable "route53_zone_id" {
  description = "Route53 hosted zone ID for volr.io"
  type        = string
  # Example: "Z1234567890ABC"
}

variable "tags" {
  description = "Common tags for all resources"
  type        = map(string)
  default = {
    Project     = "CES 2026 Volr Demo"
    Environment = "production"
    ManagedBy   = "Terraform"
  }
}
