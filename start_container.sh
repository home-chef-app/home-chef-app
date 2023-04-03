#!/usr/bin/env zsh
SOURCE_PATH=$(dirname "$0")


IMAGE_NAME="home-chef-dev"
CURR_DIR=$(pwd)
MOUNT_DIR=${1:-"$CURR_DIR"}
IMAGE_VERSION=${2:-latest}


function start_container() {
    printf "Starting development container $IMAGE_NAME  with mount path $MOUNT_DIR..."
    docker container run -it --platform linux/amd64 -v $MOUNT_DIR:/src \
                             -v ~/.aws/:/root/.aws  \
                             -v ~/.gnupg/:/root/.gnupg \
                             -v ~/tmp/:/root/tmp \
                             dc880696d99a44ac456d3a67d37935c8d5dbca3f63ee9db26e8e021fcb236aff
                             #$IMAGE_NAME:$IMAGE_VERSION 
                             #Take from docker image id built from ./Dockerfile
                             #TODO Finalize built/dev process around this image


}


start_container
