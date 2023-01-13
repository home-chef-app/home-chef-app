resource "aws_vpc" "home-chef-vpc" {
  cidr_block = "172.31.0.0/16"
  enable_dns_hostnames = true
  tags = {
    Name = "Home Chef VPC"
  }
}

resource "aws_subnet" "home-chef-private-subnet-1" {
  vpc_id            = aws_vpc.home-chef-vpc.id
  cidr_block        = "172.31.0.0/18"
  availability_zone = "us-east-1a"

  tags = {
    Name = "Private Subnet 1"
  }
}

resource "aws_subnet" "home-chef-private-subnet-2" {
  vpc_id            = aws_vpc.home-chef-vpc.id
  cidr_block        = "172.31.64.0/18"
  availability_zone = "us-east-1b"

  tags = {
    Name = "Private Subnet 2"
  }
}

resource "aws_subnet" "home-chef-public-subnet-1" {
  vpc_id            = aws_vpc.home-chef-vpc.id
  cidr_block        = "172.31.128.0/18"
  availability_zone = "us-east-1a"

  tags = {
    Name = "Public Subnet 1"
  }
}

resource "aws_subnet" "home-chef-public-subnet-2" {
  vpc_id            = aws_vpc.home-chef-vpc.id
  cidr_block        = "172.31.192.0/18"
  availability_zone = "us-east-1b"

  tags = {
    Name = "Public Subnet 2"
  }
}



resource "aws_internet_gateway" "home-chef-igw" {
  vpc_id = aws_vpc.home-chef-vpc.id

  tags = {
    Name = "home-chef-gateway"
  }
}

resource "aws_route_table" "home-chef-public-route-table" {
  vpc_id = aws_vpc.home-chef-vpc.id

  tags = {
    Name = "Public Route Table"
  }
}
resource "aws_route_table_association" "pub-1" {
  route_table_id = aws_route_table.home-chef-public-route-table.id
  subnet_id      = aws_subnet.home-chef-public-subnet-1.id
}
resource "aws_route_table_association" "pub-2" {
  route_table_id = aws_route_table.home-chef-public-route-table.id
  subnet_id      = aws_subnet.home-chef-public-subnet-2.id
}
resource "aws_route" "home-chef-public-table-igw-route" {
  route_table_id         = aws_route_table.home-chef-public-route-table.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.home-chef-igw.id
  depends_on             = [aws_route_table.home-chef-public-route-table]
}


resource "aws_route_table" "home-chef-private-route-table" {
  vpc_id = aws_vpc.home-chef-vpc.id
  tags = {
    Name = "Private Route Table"
  }
}
resource "aws_route_table_association" "priv-1" {
  route_table_id = aws_route_table.home-chef-private-route-table.id
  subnet_id      = aws_subnet.home-chef-private-subnet-1.id
}
resource "aws_route_table_association" "priv-2" {
  route_table_id = aws_route_table.home-chef-private-route-table.id
  subnet_id      = aws_subnet.home-chef-private-subnet-2.id
}

# FOR PRIVATE SUBNET
# Must be attached to private subnets for lambdas to have internet access, since they are
# in the same VPC as RDS.
# Cost $33/mo

# resource "aws_nat_gateway" "home-chef-nat-gw" {
#   allocation_id = aws_eip.home-chef-eip.id
#   subnet_id     = aws_subnet.home-chef-public-subnet-1.id

#   tags = {
#     Name = "gw"
#   }

#   # To ensure proper ordering, it is recommended to add an explicit dependency
#   # on the Internet Gateway for the VPC.
#   depends_on = [aws_internet_gateway.home-chef-igw]
# }

# resource "aws_eip" "home-chef-eip" {
#   vpc        = true
#   depends_on = [aws_internet_gateway.home-chef-igw]
# }

# Required for private subnets to have internet access
# resource "aws_route" "home-chef-private-table-nat-route" {
#   route_table_id         = aws_route_table.home-chef-private-route-table.id
#   destination_cidr_block = "0.0.0.0/0"
#   nat_gateway_id         = aws_nat_gateway.home-chef-nat-gw.id
#   depends_on             = [aws_route_table.home-chef-private-route-table]
# }
