variable "project_name" {
  default = "ecommerce"
}

variable "environment" {
  default = "dev"
}

variable "vpc_id" {
  default = "vpc-123456"
}

variable "vpc_cidr" {
  default = "10.0.0.0/16"
}

variable "tags" {
  type = map(string)

  default = {
    Environment = "dev"
    Project     = "ecommerce"
  }
}
