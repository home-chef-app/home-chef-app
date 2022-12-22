resource "aws_cognito_user_pool" "home-chef-user-pool" {
  name = "${var.resource_prefix}-users"
}

resource "aws_cognito_user_pool_client" "home-chef-user-pool-client" {
  name         = "${var.resource_prefix}-users"
  user_pool_id = aws_cognito_user_pool.home-chef-user-pool.id
}
