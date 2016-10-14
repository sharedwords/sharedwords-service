#!/bin/bash

echo "----> prepare"
rm -r ./dist
npm install
tsc

# echo "----> build image"
# docker build -t zsoltfarkas/sharedwords:latest .
# docker push zsoltfarkas/sharedwords:latest

echo "----> run"
docker-compose down
docker-compose up -d --build

echo "----> status"
docker ps -a