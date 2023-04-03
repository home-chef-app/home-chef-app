resource "aws_elasticsearch_domain" "home-chef-es" {
  domain_name           = "home-chef-dev"
  elasticsearch_version = "7.10"

  advanced_security_options {
    enabled                        = true
    internal_user_database_enabled = true
    master_user_options {
      master_user_name     = data.sops_file.secrets.data["es.master_user_name"]
      master_user_password = data.sops_file.secrets.data["es.master_user_password"]
    }
  }
  encrypt_at_rest {
    enabled = true
  }
  node_to_node_encryption {
    enabled = true
  }
  domain_endpoint_options {
    enforce_https       = true
    tls_security_policy = "Policy-Min-TLS-1-2-2019-07"
  }

  ebs_options {
    ebs_enabled = true
    volume_size = 10
  }



  cluster_config {
    instance_type = "t3.small.elasticsearch"
  }

  tags = {
    Domain = "DevDomain"
  }
  # Post Creation CLI Command if necessary
  # provisioner "local-exec" {
  #   command = "echo \"test\""
  # }
}

# resource "aws_elasticsearch_domain_policy" "home-chef-es-policy" {
#   domain_name = aws_elasticsearch_domain.home-chef-es.domain_name

# #   access_policies = <<POLICIES
# # {
# #     "Version": "2012-10-17",
# #     "Statement": [
# #         {
# #             "Action": "es:*",
# #             "Principal": "*",
# #             "Effect": "Allow",
# #             "Condition": {
# #                 "IpAddress": {"aws:SourceIp": "127.0.0.1/32"}
# #             },
# #             "Resource": "${aws_elasticsearch_domain.home-chef-es.arn}/*"
# #         }
# #     ]
# # }
# # POLICIES
# }
