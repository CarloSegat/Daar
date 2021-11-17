module.exports = {
    post: {
        tags: ["Elastic Search Operations"],
        description: "Index a CV",
        operationId: "indexOneCV",
        parameters: [],
        requestBody: {
            required: true,
            content: {
                "multipart/form-data": {
                    schema: {
                        type: "object",
                        properties: {
                            media: {
                                type: "string",
                                format: "binary"
                            },
                            owner: {
                                type: "string",
                            }
                        }
                    }
                }
            }
        },
        responses: {
            201: {
                description: "CVs indexed successfully",
            },
            400: {
                description: "File not included, file size too big or owner of CV not specified",
            },
        },
    },
}