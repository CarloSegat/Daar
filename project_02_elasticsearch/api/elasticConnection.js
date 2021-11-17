const {logger} = require("./logger");
const {Client} = require('@elastic/elasticsearch')
const indexName = 'my-index-000001';
const pipelineID = 'my-ingest-pipeline-000001';

class ElasticConnection {

    static client = new Client({node: 'http://localhost:9200'})
    static filterPath = `hits.hits._id,hits.hits._source.owner,hits.hits._source.fileName`;

    constructor() {
        throw "This is a singleton: use instead the static fields of the class"
    }

    static async init() {
        let createIndex = ! await this.doesIndexExist();
        if (createIndex) {
            await this.createIndex();
            logger.info("Index created")
        }
        try {
            let temp34 = await ElasticConnection.client.ingest.getPipeline(
                {
                    id: pipelineID
                }
            )
        } catch (e) {
            await this.createPipeline()
            logger.info("Pipeline created")
        }
    }

    static async doesIndexExist() {
        let r = await ElasticConnection.client.indices.exists(
            {
                index: indexName
            }
        )
        return r.body;
    }

    static createPipeline() {
        return ElasticConnection.client.ingest.putPipeline(
            {
                id: pipelineID,
                body: {
                    "description": "Extract the base64 encoded CV in the filed content",
                    "processors": [
                        {
                            "attachment": {
                                "field": "content"
                            }
                        }
                    ]
                }
            }
        );
    }

    static async createIndex() {
        await ElasticConnection.client.indices.create(
            {
                index: indexName,
                body: {
                    settings: {
                        number_of_shards: 1
                    },
                    mappings: {
                        properties: {
                            fileName: {"type": "text"},
                            content: {"type": "text"},
                            owner: {"type": "text"}
                        }
                    }
                }
            }
        )
    }

    static async searchCvs(searchTerms) {

        let apiResponse = await ElasticConnection.client.search({
                index: indexName,
                body: {
                    "query": {
                        "terms": {
                            "attachment.content": searchTerms
                        }
                    }
                },
                filter_path: ElasticConnection.filterPath
            }
        );

        return ElasticConnection._extractHits(apiResponse)
    }

    static async postCV(base64Cv, fileName, owner) {

        let apiResponse = await ElasticConnection.client.index({
            index: indexName,
            pipeline: "attachment",
            body: {
                "fileName": fileName,
                "content": base64Cv,
                "owner": owner
            }
        });

        return apiResponse
    }

    static async downloadCV(id) {

        let apiResponse = await ElasticConnection.client.get({
                index: indexName,
                id: id,
                _source_includes: ['content', 'fileName']
            }
        );

        return {
            content: apiResponse.body._source.content,
            fileName: apiResponse.body._source.fileName,
        };
    }

    static async getAll() {

        let apiResponse = await ElasticConnection.client.search({
                index: indexName,
                filter_path: ElasticConnection.filterPath
            }
        );

        return ElasticConnection._extractHits(apiResponse)
    }

    static async exists(id) {
        let response = await ElasticConnection.client.exists({
                index: indexName,
                id: id
            }
        );
        return response.body
    }

    static _extractHits(result) {
            if (result.body.hits === undefined) {
                return []
            }
            return result.body.hits.hits.map(e => {
                return {
                    ...e._source,
                    ...{id: e._id}
                }
            });
        }
}

module.exports = {
    ElasticConnection
}