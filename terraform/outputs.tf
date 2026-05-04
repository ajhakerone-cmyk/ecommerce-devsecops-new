output "s3_bucket_arn" {
  description = "ARN of the S3 bucket"
  value       = aws_s3_bucket.ecommerce_assets.arn
}

output "s3_bucket_name" {
  description = "Name of the S3 bucket"
  value       = aws_s3_bucket.ecommerce_assets.id
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.ecommerce_cdn.domain_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.ecommerce_cdn.id
output "s3_bucket_arn" {
  description = "ARN of the S3 bucket"
  value       = aws_s3_bucket.ecommerce_assets.arn
}

output "s3_bucket_name" {
  description = "Name of the S3 bucket"
  value       = aws_s3_bucket.ecommerce_assets.id
}

output "log_bucket_name" {
  description = "Log bucket name"
  value       = aws_s3_bucket.log_bucket.id
}

output "iam_role_name" {
  description = "IAM Role name"
  value       = aws_iam_role.app_role.name
}

output "security_group_id" {
  description = "Security group ID"
  value       = aws_security_group.app_sg.id
}
