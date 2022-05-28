FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:16-bullseye

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive && apt-get install -y software-properties-common \
    && apt-get install -y gnupg2 && wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -\
    && echo "deb http://repo.mongodb.org/apt/debian bullseye/mongodb-org/5.0 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list \
    && sudo apt update && sudo apt -y install mongodb-mongosh