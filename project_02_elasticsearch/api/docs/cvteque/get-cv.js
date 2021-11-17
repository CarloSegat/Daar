module.exports = {
    get: {
        tags: ["Elastic Search Operations"],
        description: "Search CV by keywords",
        operationId: "getCVSByKeywords",
        parameters: [
            {
                in: "query",
                name: "searchTerms",
                schema: {
                    type: "array",
                    items: {
                        type: 'string'
                    }
                },
                required: false
            }],
        responses: {
            200: {
                description: "CVs were obtained",
                content: {
                    "application/json": {
                        schema: {
                            $ref: '#/components/schemas/CvMetadata',
                        },
                    },
                },
            },
            400: {
                description: "At least one search term has to be provided"
            }
        },
    },
}