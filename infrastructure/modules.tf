module "common" {
  source = "./modules/common"

  aws_region      = var.aws_region
  resource_prefix = var.resource_prefix
  env             = var.env
}
