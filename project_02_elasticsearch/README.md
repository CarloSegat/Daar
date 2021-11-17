# DAAR Project 02: Elasticsearch
This is my project for the DAAR module (network algorithms module at Sorbonne University, 2021/2022).
It's a BE for uploading and searching CVs on Elasticsearch.

## Team member
Carlo Segat (one-person team)

## Set up

###System requirements:
- Elasticsarch (tested with version 7.17)
- ingest-attachment (a plugin for ElasticSearch)
- Logstash (tested wit version 7.15.1)
- FileBeat (tested with version 7.15.1)

This project was coded on mac and homebrew was used to install all of the above.

###API dependencies
```
cd api
npm install
```

## Run stuff
### Elasticsearch node on locahost
```
cd commands
chmod +x ./launch_elasticsearch_cluster
```
Change the script with your installation location and then
```
./launch_elasticsearch_cluster
```
Check that it worked with:
```
chmod +x ./checkElasticnode.sh 
./checkElasticnode.sh 
```
### API
Run the API in development mode:
```
cd api
npm run dev
```
Run the API in production mode:
You can always set a global env or:
```
SERVER_ENV=production npm run dev
```
Access the swagger api at:
```http://localhost:4000/api-docs/#/```

### Logstash
Run logstash service from root of project: 
```
logstash -f logstash.conf --config.reload.automatic
```
### Filebeat
Configure filebeat on mac, config file location:
```
/usr/local/etc/filebeat/filebeat.yml
```
The config file for Filebeat I used is the following 
(please change paths according to system):

```
filebeat.inputs:
  - type: log
    paths: /Users/carlo/DAAR/project_02_elasticsearch/logs.json
      json.keys_under_root: true
      json.overwrite_keys: true
      json.add_error_key: true
      json.expand_keys: true
  output.logstash:
    hosts: ["localhost:5044"]
```
Run filebeat service on mac:
```
sudo filebeat -e
```

## Architecture

### CV endpoints
This porjects consists of a back-end accessible through a swagger interface. 
There are 3 endpoints:

- POST uploadCv
- GET searchCv
- GET all
- GET downloadCv

The uploadCv endpoint takes as input a file corresponding to a CV, does base64 encoding and sends it to the 
elasticsearch endpoint for indexing (everything is on the same machine now, but the elasticsearch endpoint can be 
configured to point to a server). I use Elasticsearch pipeline feature - attachment preprocessor - to process the 
encodeded file.

The search endpoint takes a list of words and returns the metadata of the CV that match (search strategy is OR).



### Logging
The API is an express server.
Pino is the library used for logging.
When in development Pino will output to stdout, when in producition it will write to a file (`logs.json).

After the logs are dumped to the file, the responsibility to index them to ES it's not of the application anymore:
we need a running `Filebeat service` watching the file and passing it to a running instance of `Logstash`, which will
index the logs in Elasticsearch.

My config for Logstash is in the root folder.

If we run the applicaiton in production mode
we will stop seeing logs in the console and instead the logs.json will be populated.
Also Elasticsearch will be populated, for each day a new index will be created, we
can get the logs with the following command in Kibana dev tool:
```
GET logstash-2021.10.28-000001/_search
```



## Creating an index from Kibana Dev Console

#### Index creation
```
PUT /cv
{
    "settings": {
    "number_of_shards": 1
        },
        "mappings": {
        "properties": {
            "fileName": { "type": "text" },
            "content": { "type": "text" },
            "owner": { "type": "text" }
        }
    }
}
```
## Setting up a pipeline from Kibana Dev Console

#### Creating a pipeline
```
PUT _ingest/pipeline/attachment {
    "description" : "Extract attachment information",
    "processors" : [
        {
            "attachment" : {
                "field" : "content"
            }   
        }
    ]
}
```

#### Checkign exisiting pipelines
```
GET _ingest/pipeline
```

#### Putting stuff in the index

First get a base64 string:
```
echo sonme text Java | base64
```
Then push the base64 string to the pipeline:
```
POST my-index-000001/_doc?pipeline=attachment
{
  "fileName": "myCv.pdf",
    "content": "SSBzdWNrIGhhcmQgYXQgamF2YQo=",
    "owner": "Carlo Segat"
}
```

#### Searching the index
```
GET my-index-000001/_search
{
    "query": {
    "term": {
        "attachment.content": "java"
        }
    }
}
```
