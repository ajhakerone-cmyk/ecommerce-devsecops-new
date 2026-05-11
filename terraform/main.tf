terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# S3 Bucket
resource "aws_s3_bucket" "ecommerce_assets" {
  bucket = "ecommerce-assets-demo-bucket"

  tags = {
    Name        = "EcommerceAssets"
    Environment = "Dev"
  }
}

# Block Public Access
resource "aws_s3_bucket_public_access_block" "ecommerce_assets" {
  bucket = aws_s3_bucket.ecommerce_assets.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Enable Versioning
resource "aws_s3_bucket_versioning" "ecommerce_assets" {
  bucket = aws_s3_bucket.ecommerce_assets.id

  versioning_configuration {
    status = "Enabled"
  }
}

# Enable Encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "ecommerce_assets" {
  bucket = aws_s3_bucket.ecommerce_assets.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Security Group
resource "aws_security_group" "app_sg" {
  name        = "ecommerce-app-sg"
  description = "Security group for ecommerce app"
  vpc_id      = "vpc-123456"

  ingress {
    description = "HTTP Access"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  ingress {
    description = "HTTPS Access"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  egress {
    description = "Outbound HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "EcommerceSecurityGroup"
  }
}
