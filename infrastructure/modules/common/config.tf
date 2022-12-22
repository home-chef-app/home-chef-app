data "sops_file" "secrets" {
  source_file = "${path.module}/../../environments/secrets.yml"
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
    sops = {
      source  = "carlpett/sops"
      version = "0.6.3"
    }
  }
}
