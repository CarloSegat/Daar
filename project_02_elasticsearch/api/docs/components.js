module.exports = {
  components: {
    schemas: {
      CvMetadata: {
        type: "object",
        properties: {
          owner: {
            type: "string",
            description: "Todo identification number",
            example: "Carlo Segat",
          },
          fileName: {
            type: "string",
            description: "The CV's title",
            example: "cs_cv_final.pdf",
          },
          id: {
            type: "string",
            description: "id of cd",
            example: "-45i3489x494_58ndGY",
          }
        },
      }
    },
  },
};