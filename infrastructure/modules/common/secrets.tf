
#SSM Param
resource "aws_ssm_parameter" "db-username" {
  name        = "/${var.resource_prefix}/${var.env}/db-username"
  description = "The parameter description"
  type        = "SecureString"
  value       = data.sops_file.secrets.data["database_creds.db_username"]

  tags = {
    environment = "${var.env}"
  }
}

data "aws_arn" "db_username_arn" {
  arn = aws_ssm_parameter.db-username.arn
}

resource "aws_ssm_parameter" "db-password" {
  name        = "/${var.resource_prefix}/${var.env}/db-password"
  description = "The parameter description"
  type        = "SecureString"
  value       = data.sops_file.secrets.data["database_creds.db_password"]

  tags = {
    environment = "${var.env}"
  }
}

data "aws_arn" "db_password_arn" {
  arn = aws_ssm_parameter.db-password.arn
}

resource "aws_ssm_parameter" "es_master_username" {
  name        = "/${var.resource_prefix}/${var.env}/es-username"
  description = "The parameter description"
  type        = "SecureString"
  value       = data.sops_file.secrets.data["es.master_user_name"]

  tags = {
    environment = "${var.env}"
  }
}

data "aws_arn" "es_master_username_arn" {
  arn = aws_ssm_parameter.es_master_username.arn
}
resource "aws_ssm_parameter" "es_master_password" {
  name        = "/${var.resource_prefix}/${var.env}/es-password"
  description = "The parameter description"
  type        = "SecureString"
  value       = data.sops_file.secrets.data["es.master_user_password"]

  tags = {
    environment = "${var.env}"
  }
}

data "aws_arn" "es_master_password_arn" {
  arn = aws_ssm_parameter.es_master_password.arn
}


#Sec Manager 
# locals {
#   database_secrets = {
#     DB_USERNAME = data.sops_file.secrets.data["database_creds.db_username"]
#     DB_PASSWORD = data.sops_file.secrets.data["database_creds.db_password"]
#   }
# }
# resource "aws_secretsmanager_secret" "home_chef_db_secrets" {
#   name        = "${var.resource_prefix}-db-secrets"
#   description = "Secrets for home chef database"

#   provisioner "local-exec" {
#     when    = destroy
#     command = "aws secretsmanager delete-secret --secret-id ${self.name} --force-delete-without-recovery"

#   }
# }

# resource "aws_secretsmanager_secret_version" "home_chef_db_secret_versions" {
#   secret_id     = aws_secretsmanager_secret.home_chef_db_secrets.id
#   secret_string = jsonencode(local.database_secrets)
# }
