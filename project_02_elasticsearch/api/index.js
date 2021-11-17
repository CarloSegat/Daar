const express = require("express");
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const docs = require('./docs');
const cvRouter = require('./routes/cv-endpoints');

const app = express();
const PORT = process.env.PORT || 4000;
const fileUpload = require('express-fileupload');
const {ElasticConnection} = require("./elasticConnection");
const {logger} = require("./logger");

app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

function errorReportingCallback(err, req, res, next) {
    if (!err) return next();
    logger.error(err)
    res.sendStatus(500);
}

app.use(errorReportingCallback);
app.use('/cv', cvRouter);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(docs));

async function initialize() {
    app.listen(PORT);
    ElasticConnection.init()
};

initialize()
    .finally(
        () => console.log(`app started on port:${PORT}`)
    );