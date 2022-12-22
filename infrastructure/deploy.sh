function env_prompt(){
    echo -n "Enter Environment name (dev/qa/stage/prod): " 
    read env

    #if [ "$env" != "dev" ] && [ "$env" != "qa" ]  && [ "$env" != "stage" ]  && [ "$env" != "prod" ]; then
    if [ "$env" != "dev" ]; then
        return 0
    fi

    echo "Entered $env"

    

}

function import_key(){
    echo -n "Enter key path: " 
    read key_path
    if gpg --import $key_path > /dev/null ; then
        echo "Key successfully imported\n"
    else
        import_key
    fi
}
function verify_keys(){
    printf "Verifying Keys..\n"
    key="Home Chef App Key"
    if gpg -k $key > /dev/null ; then
        echo "Key validation success"
    else
        printf "Key Not Found!!\n"
        import_key
    fi
}

function deploy(){
  command terraform apply --var-file="./accounts/home-chef-app/vars.tfvars" --var-file="./accounts/home-chef-app/${env}.tfvars"
}

env_prompt
deploy