module.exports = {
    get: {
        tags: ["Elastic Search Operations"],
        description: "Get all CVs",
        operationId: "getAllCVs",
        parameters: [],
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
            }
        },
    },
}