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

function init(){
    aws_access_key=$(aws configure get home-chef.aws_access_key_id)
    aws_secret_access_key=`aws configure get home-chef.aws_secret_access_key`
    region=$(aws configure get home-chef.region)
    export AWS_ACCESS_KEY_ID="$aws_access_key"
    export AWS_SECRET_ACCESS_KEY="$aws_secret_access_key"
    echo $AWS_ACCESS_KEY_ID
    export AWS_REGION="us-east-1"
    export TERRAFORM_BUCKET="home-chef-app-terraform"
    echo $region

    tf_state_key="env/$env/terraform.tfstate"
    echo $TERRAFORM_BUCKET
    echo $tf_state_key
    echo $AWS_REGION
    
    terraform init -backend-config="bucket=${TERRAFORM_BUCKET}" -backend-config="key=${tf_state_key}" -backend-config="region=${AWS_REGION}"
    
    printf "\n***********************************************************************************\n\n"
    printf "To deploy the terraform stack to the environment $env, run terraform-deploy"
    printf "\n\n***********************************************************************************\n"

    # Programtically provide required params to commands
    function terraform-state(){
        command terraform state "$@" 
    }

    function terraform-deploy(){
        command terraform apply --var-file="./global.tfvars" --var-file="./environments/${env}.tfvars"
    }

    function terraform-plan(){
        command terraform plan "$@" --var-file="./global.tfvars" --var-file="./environments/${env}.tfvars"
    }

    function terraform-destroy(){
        command terraform destroy --var-file="./global.tfvars" --var-file="./environments/${env}.tfvars"
    }
}

env_prompt
verify_keys
init