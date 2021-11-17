const postCV = require('./post-cv');
const getCV = require('./get-cv');
const getAll = require('./get-all');
const downloadCV = require('./download-cv');

module.exports = {
    paths: {
        '/upload': {
            ...postCV
        },
        '/search': {
            ...getCV
        },
        '/all': {
            ...getAll
        },
        '/download': {
            ...downloadCV
        }
    }
}