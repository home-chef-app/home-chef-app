variable "aws_account" {
  description = "AWS Account"
  type        = string
  default     = "home-chef-app"
}

variable "aws_region" {
  description = "AWS Region"
  type        = string
  default     = "us-east-1"
}

variable "resource_prefix" {
  description = "Prefix prepended to resource names"
  type        = string
}

variable "env" {
  description = "AWS Env"
  type        = string
  default     = "dev"
}