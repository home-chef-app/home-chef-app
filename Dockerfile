FROM --platform=linux/amd64 ubuntu:20.04

WORKDIR /tmp

ENV NODE_OPTIONS=--max_old_space_size=4096
ENV AWS_CLI_VER=2.4.17
ENV TF_VERSION=1.3.6

#install the dependencies
RUN apt-get update && \
      apt-get -y install sudo wget unzip python3-pip curl gnupg

# Install terraform
RUN wget https://releases.hashicorp.com/terraform/${TF_VERSION}/terraform_${TF_VERSION}_linux_amd64.zip
RUN unzip terraform_${TF_VERSION}_linux_amd64.zip && rm terraform_${TF_VERSION}_linux_amd64.zip
RUN mv terraform /usr/bin/terraform
RUN terraform version

# Install sops
RUN pip3 install sops

#Install nvm
SHELL ["/bin/bash", "--login", "-c"]
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
RUN nvm install 14.16.0 | bash
RUN nvm install 18.15.0 | bash
RUN nvm alias default 18.15.0 | bash
RUN nvm use 18.15.0 | bash


#Install AWS
RUN curl -sL https://awscli.amazonaws.com/awscli-exe-linux-x86_64-${AWS_CLI_VER}.zip -o awscliv2.zip \
    && unzip awscliv2.zip \
    && aws/install \
    && rm -rf \
    awscliv2.zip \
    aws \
    /usr/local/aws-cli/v2/*/dist/aws_completer \
    /usr/local/aws-cli/v2/*/dist/awscli/data/ac.index \
    /usr/local/aws-cli/v2/*/dist/awscli/examples

RUN node -v | bash
RUN npm -v | bash

# Install serverless
RUN npm i -g serverless | bash