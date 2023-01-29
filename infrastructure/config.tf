terraform {
  required_version = "1.3.6"

  backend "s3" {
    profile="home-chef"
    bucket = "home-chef-app-terraform"
    key = "env/dev/terraform.tfstate"
    region = "us-east-1"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}
