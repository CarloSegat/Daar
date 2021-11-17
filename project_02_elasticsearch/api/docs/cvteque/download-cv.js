module.exports = {
    get: {
        tags: ["Elastic Search Operations"],
        description: "Download CV by ID, for the time being the file is simply downloaded in the /api folder.",
        operationId: "downloadCVByID",
        parameters: [
            {
                in: "query",
                name: "id",
                schema: {
                    type: "string"
                },
                required: true
            }],
        responses: {
            200: {
                description: "A CV has been downloaded in the specified folder",
            },
        },
    },
}