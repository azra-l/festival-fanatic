#!/bin/bash

VOLUMES=$(docker ps -a -f name=festival-fanatic_devcontainer-db-1 --no-trunc --format "{{.Mounts}}")
PROCESSEDVOLUMES=$(echo "$VOLUMES" | tr , " ")

docker stop $(docker ps -a -q -f name=festival)
docker rm $(docker ps -a -q -f name=festival)
docker volume rm $PROCESSEDVOLUMES