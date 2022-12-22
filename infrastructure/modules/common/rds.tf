resource "aws_db_instance" "home-chef" {
  identifier             = "${var.resource_prefix}-${var.env}"
  allocated_storage      = 10
  db_name                = "homechef"
  engine                 = "mysql"
  engine_version         = "5.7"
  instance_class         = "db.t3.micro"
  username               = data.sops_file.secrets.data["database_creds.db_username"]
  password               = data.sops_file.secrets.data["database_creds.db_password"]
  parameter_group_name   = "default.mysql5.7"
  skip_final_snapshot    = true
  db_subnet_group_name   = aws_db_subnet_group.home-chef-public-subnet-group.id
  vpc_security_group_ids = [aws_security_group.rds-sg.id]
  publicly_accessible    = true
}

resource "aws_db_subnet_group" "home-chef-public-subnet-group" {
  name       = "home-chef-subnet-group"
  subnet_ids = [aws_subnet.home-chef-public-subnet-1.id, aws_subnet.home-chef-public-subnet-2.id]

  tags = {
    Name = "My DB Public rdssubnet group"
  }
}
