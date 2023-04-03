# Home Chef Backend

### Dependencies

- AWS CLI
- SOPS (mac: `brew install sops`)
- gnupg (mac: `brew install gnupg`)
- gpg (mac: `brew install gng`)
- yq (mac: `brew install yq`)

### Starting The Development Container
A docker image has been created for easy cross platform development and script execution.

Create Image
`docker build . -t home-chef-dev`

Mount to Directory 
`. ./start_container.sh`

Run all scripts from within the image

### Prerequisites

- Store AWS Creds for the home-chef account into an AWS Profile names `home-chef	`
- Obtain the GNU Private Guard private key, and import it into your local key ring (can use infrastructure/init.sh, or the `gpg --import` command

The backend is broken into two subdirectories

- Infrastructure
- API

## Infrastructure

The infrastructure is defined as code using a [Terraform](https://www.terraform.io/) project. Terraform is a provider agnostic tool that codifies cloud APIs into declarative configuration files.

```
.
├── ...
├── environments         # Env Specific variables/secrets
│   ├── dev.tfvars       # Variable definitions for dev env
│   ├── secrets.yml      # Encrypted Secrets (see details below)
├── modules              # Submodules of infrastructure config
│   ├── common           # Infrastructure common to all modules/deployments
|	│   ├── gen          # Folder for generated files (ex: output values)
|	│   ├── templates    # Folder for templates (ex: output value template)
|	│   ├── variables.tf # Variable Definitions for common module
|	|	└── ...          # Files for infrastructure definitions
├── config.tf            # Terraform Config
├── variables.tf         # Variable Definitions for the entire project
├── global.tfvars        # Variable values common to all environments
├── sops.yaml            # Config for SOPS CLI (which key to use to decrypt)
├── modules.tf           # Root of the terraform, where we define submodules
├── init.sh        		 # Initialize terraform for your shell session
└── ...
```

### How To Use

- Download Dependencies and complete prerequisites
- Run `source init.sh` , select the environment
- Use the following terraform commands
  - Run `terraform-deploy` to deploy the infrastructure
  - Run `terraform-plan` to test the infrastructure deployment without applying it
  - Run `terraform-destroy`to tear down the infrastructure

#### init .sh

The init function will initialize your shell session to use the terraform CLI in a preconfigured way and with preconfigured credentials.

1. Pulls credentials from your aws profile home-chef and stores them into environment variables. This ensure the proper credentials are used (i.e the deployment is to the proper account)
2. Initializes terraform to use the state file found in the AWS account, at the appropriate s3 bucket / environment key.
3. Creates functions which can be called from command line that run terraform commands with configured arguments, to save the hassle.

#### Secrets

SOPS is used to encrypt a secrets file. This encrypted file can be stored in the repo, containing app/infra secrets which will be used in the creation of resources. If you have the appropriate private key file (GNU Privacy Guard), and its imported into your local key ring, you will be able to decrypt and edit this file. The private key is required to make deployments, you need to be able to decrypt it.

The init function will ask for the path to the private key, if you do not already have it added.

With the private key imported you can run these commands:
Show Values: `cat environments/secrets.yml`
Edit Values: `sops environments/secrets.yml` (Use command line editor, i to edit, :wq! to save)

## API

The API is a serverless application that deploy an API Gateway/Lambda REST API

Features:

- [Sequelize](https://sequelize.org/) : Object Relational Mapping and DB Migrations
- API Versioning

```
.
├── ...
├── config               # Env Specific variables/secrets
│   ├── dev.yml          # Variables from infrastructure/gen/output-values
│   ├── secrets.yml      # Encrypted Secrets (see details below)
├── handlers             # Lambda handlers
│   ├── v1        		 # Verison 1 of the handlers
│   |	├── index.js     # Mapping of handlers
|	|	└── ...			 # Object specific handler folders
├── helpers              # JS Helper Funcs
├── migrations           # Migration Files
├── models               # Sequelize Models that define tables
│   ├── database.js      # Sequelize definition of the DB
|	└── ...			  	 # Sequelize definition of the tables
├── migrations.sh        # Bash script to init shell session for sequelize migrations
├── serverless.yml       # Serverless File
└── ...
```

### How To Use

- Copy values from `infrastructure/gen/<env>/output_values.yml` into `api/config/<env>.yml`
- To Run Local: Run `serverless run start`
- To Deploy: Run `serverless deploy --stage <stage> --version <version>`
- To Tear Down: Run `serverless remove --stage <stage> --version <version>`

#### DB Migrations

Similar to the infrastructure bash scripts, `source migrations.sh` will setup your shell session and provide you with commands that will effectively use the Sequelize CLI to run the migrations in the ./migrations folder, into the DB of our choosing.

1. Prompt for environment, and verify your keys
2. Create commands to carry out migrations with the Sequelize CLI but with pre configured CLI arguments. The Sequelize CLI requires a config input in this format:

```
"{env}":  {
	"username":  "root",
	"password":  null,
	"database":  "database_development",
	"host":  "127.0.0.1",
	"dialect":  "mysql"
}
```

Rather than maintaining this file, it will generate it, temporarily while you run the command. It fills these values from the /infrastructure/env/secrets, and from the /api/config/env.yml variables.

#### How To Run Migrations

- Run `source migrations.sh`, select the environment
  - To run migration: Run: `migrate`
  - To undo previous migration: Run: `migrate-undo`
  - To undo all previous migrations: Run: `migrate-undo-all`
