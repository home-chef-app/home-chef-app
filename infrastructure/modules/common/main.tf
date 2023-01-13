locals {
  output_values = templatefile("${path.module}/templates/common-output.tftpl", {
    env                           = var.env
    cognito_user_pool_id          = aws_cognito_user_pool.home-chef-user-pool.id
    cognito_user_pool_client_id   = aws_cognito_user_pool_client.home-chef-user-pool-client.id
    vpc_id                        = aws_vpc.home-chef-vpc.id
    lambda_security_group         = aws_security_group.lambda-sg.id
    public_1_id                   = aws_subnet.home-chef-public-subnet-1.id
    public_2_id                   = aws_subnet.home-chef-public-subnet-2.id
    private_1_id                  = aws_subnet.home-chef-private-subnet-1.id
    private_2_id                  = aws_subnet.home-chef-private-subnet-2.id
    db_username_ssm_parameter_arn = substr(data.aws_arn.db-username-arn.resource, 9, length(data.aws_arn.db-username-arn.resource))
    db_password_ssm_parameter_arn = substr(data.aws_arn.db-password-arn.resource, 9, length(data.aws_arn.db-password-arn.resource))
    db_host                       = aws_db_instance.home-chef.address
    db_name                       = aws_db_instance.home-chef.name
  })
}

resource "null_resource" "common_output_values" {
  triggers = {
    template = local.output_values
  }

  provisioner "local-exec" {
    command = "echo \"${local.output_values}\" > ${path.module}/gen/output_values.yml"
  }
}
