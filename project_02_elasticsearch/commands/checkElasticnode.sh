#!/bin/zsh
smokeTestCluster=$(curl -v --silent http://localhost:9200/ 2>&1 | grep cluster | wc -m | awk '{$1=$1};1')

if [[ $smokeTestCluster == 0 ]]
then
    echo "The Elasticsearch instance doesn't seem to be up and running..."
else
    echo "The Elasticsearch instance was set up correctly"
fi