terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# S3 bucket for static assets
resource "aws_s3_bucket" "ecommerce_assets" {
  bucket = "ecommerce-assets-${var.environment}-${data.aws_caller_identity.current.account_id}"

versioning {
  enabled = true
}
  
  tags = {
    Name        = "E-commerce Assets"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# Block public access by default (security best practice)
resource "aws_s3_bucket_public_access_block" "ecommerce_assets" {
  bucket = aws_s3_bucket.ecommerce_assets.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Enable versioning for audit trail
resource "aws_s3_bucket_versioning" "ecommerce_assets" {
  bucket = aws_s3_bucket.ecommerce_assets.id
  versioning_configuration {
    status = "Enabled"
  }
}

# Enable server-side encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "ecommerce_assets" {
  bucket = aws_s3_bucket.ecommerce_assets.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# CloudFront distribution for CDN
resource "aws_cloudfront_distribution" "ecommerce_cdn" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "E-commerce CDN for ${var.environment}"
  default_root_object = "index.html"
  
  origin {
    domain_name = aws_s3_bucket.ecommerce_assets.bucket_regional_domain_name
    origin_id   = "S3-${aws_s3_bucket.ecommerce_assets.id}"
    
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.ecommerce_oai.cloudfront_access_identity_path
    }
  }
  
  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.ecommerce_assets.id}"
    
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
    
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress               = true
  }
  
  price_class = "PriceClass_100"
  
  viewer_certificate {
    cloudfront_default_certificate = true
  }
  
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  
  tags = {
    Environment = var.environment
  }
}

# Origin Access Identity for CloudFront
resource "aws_cloudfront_origin_access_identity" "ecommerce_oai" {
  comment = "OAI for e-commerce assets"
}

# Bucket policy to allow CloudFront access
resource "aws_s3_bucket_policy" "ecommerce_assets" {
  bucket = aws_s3_bucket.ecommerce_assets.id
  policy = data.aws_iam_policy_document.ecommerce_assets.json
}

data "aws_iam_policy_document" "ecommerce_assets" {
  statement {
    effect = "Allow"
    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.ecommerce_oai.iam_arn]
    }
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.ecommerce_assets.arn}/*"]
  }
}

data "aws_caller_identity" "current" {}
terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  region                      = var.aws_region

  # Dummy credentials (for local/dev/demo mode)
  access_key                  = "dummy"
  secret_key                  = "dummy"

  skip_credentials_validation = true
  skip_requesting_account_id  = true
  skip_metadata_api_check     = true
}

resource "aws_kms_key" "s3_key" {
  description             = "KMS key for S3 encryption"
  deletion_window_in_days = 7
  enable_key_rotation     = true
}

# Random suffix for uniqueness
resource "random_id" "bucket_suffix" {
  byte_length = 4
}

# ==============================
# MAIN S3 BUCKET (SECURE)
# ==============================
resource "aws_s3_bucket" "ecommerce_assets" {
  bucket = "${var.project_name}-assets-${var.environment}-${random_id.bucket_suffix.hex}"
  tags   = var.tags
}

# Block public access
resource "aws_s3_bucket_public_access_block" "ecommerce_assets" {
  bucket = aws_s3_bucket.ecommerce_assets.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "ecommerce_assets" {
  bucket = aws_s3_bucket.ecommerce_assets.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Versioning
resource "aws_s3_bucket_versioning" "ecommerce_assets" {
  bucket = aws_s3_bucket.ecommerce_assets.id

  versioning_configuration {
    status = "Enabled"
  }
}

# ==============================
# LOG BUCKET (SECURE)
# ==============================
resource "aws_s3_bucket" "log_bucket" {
  bucket = "${var.project_name}-logs-${var.environment}-${random_id.bucket_suffix.hex}"
  tags   = var.tags
}

# Fix deprecated ACL
resource "aws_s3_bucket_acl" "log_bucket_acl" {
  bucket = aws_s3_bucket.log_bucket.id
  acl    = "log-delivery-write"
}

# Block public access (IMPORTANT)
resource "aws_s3_bucket_public_access_block" "log_bucket" {
  bucket = aws_s3_bucket.log_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Encryption (IMPORTANT)
resource "aws_s3_bucket_server_side_encryption_configuration" "log_bucket" {
  bucket = aws_s3_bucket.log_bucket.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Versioning
resource "aws_s3_bucket_versioning" "log_bucket" {
  bucket = aws_s3_bucket.log_bucket.id

  versioning_configuration {
    status = "Enabled"
  }
}

# Enable logging
resource "aws_s3_bucket_logging" "ecommerce_assets" {
  bucket        = aws_s3_bucket.ecommerce_assets.id
  target_bucket = aws_s3_bucket.log_bucket.id
  target_prefix = "s3-access-logs/"
}

# ==============================
# IAM ROLE (Least Privilege)
# ==============================
resource "aws_iam_role" "app_role" {
  name = "${var.project_name}-app-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = var.tags
}

# IAM Policy (least privilege)
resource "aws_iam_policy" "s3_access" {
  name = "${var.project_name}-s3-access-${var.environment}"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject"
        ]
        Resource = "${aws_s3_bucket.ecommerce_assets.arn}/*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "s3_attach" {
  role       = aws_iam_role.app_role.name
  policy_arn = aws_iam_policy.s3_access.arn
}

# ==============================
# SECURITY GROUP (SECURE)
# ==============================
resource "aws_security_group" "app_sg" {
  name        = "${var.project_name}-app-sg-${var.environment}"
  description = "Secure SG for e-commerce app"
  vpc_id      = var.vpc_id

  ingress {
    description = "HTTP from VPC"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

  ingress {
    description = "HTTPS from VPC"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

egress {
  from_port   = 443
  to_port     = 443
  protocol    = "tcp"
  cidr_blocks = [var.vpc_cidr]
}
  tags = var.tags
}
