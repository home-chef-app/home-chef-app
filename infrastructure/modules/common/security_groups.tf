resource "aws_security_group" "rds-sg" {
  name   = "${var.resource_prefix}-rds-sg"
  vpc_id = aws_vpc.home-chef-vpc.id

  ingress {
    from_port = 3306
    to_port   = 3306
    protocol  = "tcp"
    security_groups = [aws_security_group.lambda-sg.id]

  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]

  }
}

resource "aws_security_group" "lambda-sg" {
  name   = "${var.resource_prefix}-lambdas-sg"
  vpc_id = aws_vpc.home-chef-vpc.id

  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]

  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]

  }
}
