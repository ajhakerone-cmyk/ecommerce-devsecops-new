<<<<<<< HEAD
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
=======
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "ecommerce-devsecops"
}

variable "environment" {
  description = "Environment (dev/staging/prod)"
  type        = string
  default     = "dev"
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "tags" {
  description = "Resource tags"
  type        = map(string)
  default = {
    Project     = "DevSecOps-ECommerce"
    ManagedBy   = "Terraform"
    SecurityScan = "Enabled"
  }
>>>>>>> e7ad686 (Updated DevSecOps pipeline, Terraform IaC security fixes, Checkov improvements)
}