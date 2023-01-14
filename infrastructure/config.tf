terraform {
  required_version = "1.3.6"

  backend "s3" {
    profile="home-chef"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}
