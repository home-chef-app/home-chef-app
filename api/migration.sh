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

function init_funcs(){
    # Set Env variables to be used by sequelize CLI
    function initMigration(){
        sops -d ../infrastructure/environments/secrets.yml >> temp-secrets.yml   
        db_username=$(cat temp-secrets.yml | yq -r .database_creds.db_username)
        db_password=$(cat temp-secrets.yml | yq -r .database_creds.db_password)
        db_name=$(cat config/dev/vars.yml | yq -r .parameters.db_name)
        db_host=$(cat config/dev/vars.yml | yq -r .parameters.db_host)
        jq -n --arg env "$env" --arg db_username "$db_username" --arg db_name "$db_name" --arg db_password "$db_password" --arg db_host "$db_host"  '{($env):  {username: $db_username, password: $db_password, host: $db_host, database: $db_name, dialect: "mysql"}}' > temp.json
    }
    # Remove temp files used by CLI
    function cleanMigration(){
        db_username=""
        db_password=""
        db_name=""
        db_host=""
        rm temp-secrets.yml
        rm temp.json
    }

    # Apply all migrations
    declare function migrate(){
        initMigration
        npx sequelize db:migrate --config ./temp.json --env $env
        cleanMigration
    }

    # Undo previous migration
    declare function migrate-undo(){
        initMigration
        npx sequelize-cli db:migrate:undo --config ./temp.json --env $env
        cleanMigration
    }
    # Revert back to the initial state by undoing all migrations
    declare function migrate-undo-all(){
        initMigration
        npx sequelize-cli db:migrate:undo:all --config ./temp.json --env $env
        cleanMigration
    }
}

env_prompt
verify_keys
init_funcs