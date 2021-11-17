const express = require("express");
const {logger} = require("../logger");
const router = express.Router();
const {ElasticConnection} = require("../elasticConnection");
const fs = require('fs')
const path = require('path')

let searchValidation = (req, res, next) => {
    if (!req.query.searchTerms || req.query.searchTerms === '' || req.query.searchTerms.length === 0) {
        logger.warn("Searching a CV with an empty search term")
        res.status(400)
        return res.send("Please provide a search term")
    }
    next()
};
let searchLogic = (req, res) => {
    let searchTerms = [].concat(req.query.searchTerms);
    logger.info(`search cv with termsm ${searchTerms.join(', ')}`)
    ElasticConnection.searchCvs(searchTerms)
        .then(hits => {
            res.status(200)
            return res.send(hits);
        })
};
router.get('/search',
    searchValidation,
    searchLogic);

router.get('/all', (req, res) => {
    ElasticConnection.getAll()
        .then(hits => {
            res.status(200)
            return res.send(hits);
        })
});


let uploadLogic = (req, res) => {
    logger.info(`uploading cv file named ${req.files.media.name} of size ${req.files.media.size}MB`)
    let base64CV = Buffer.from(req.files.media.data, 'base64').toString('base64');
    ElasticConnection.postCV(base64CV, req.files.media.name, req.body.owner)
        .then(result => {
            res.status(200)
            return res.send(`CV uploaded, its id is: ${result.body._id}`);
        })

};
let uploadValidation = (req, res, next) => {
    if (!req.files) {
        logger.info(`trying to upload an empty cv file`)
        res.status(400)
        return res.send("Please include a file in the request")
    }
    if (req.files.media.size / 10 ** 6 > 5) {
        res.status(400)
        return res.send(`Your file size is ${req.files.media.size / 10 ** 6}, only files below 5MBs can be uploaded`)
    }
    next()
}
router.post('/upload',
    uploadValidation,
    uploadLogic);


let downloadValidation = (req, res, next) => {
    if (!req.query.id) {
        logger.warn(`Trying to download a CV without specifying the ID`)
        res.status(400)
        return res.send("Please specify a CV id in the request")
    }
    ElasticConnection.exists(req.query.id).then(exists => {
        if (!exists) {
            res.status(404)
            return res.send(`The CV with ID ${req.query.id} deosn't exist`);
        }
        next()
    })
}
let downloadLogic = (req, res) => {
    logger.info(`downloading cv with id ${req.query.id}`)
    ElasticConnection.downloadCV(req.query.id,).then(obj => {
        let binaryCv = Buffer.from(obj.content, 'base64');
        fs.writeFile(path.resolve('../', 'cvs', obj.fileName), binaryCv, err => {
        });
        res.status(200)
        return res.send(`CV downloaded in ${path.resolve('../', 'cvs')}`);
    })
};
router.get('/download',
    downloadValidation,
    downloadLogic);

module.exports = router;