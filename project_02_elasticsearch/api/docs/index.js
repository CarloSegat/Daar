
const apiInfo = require('./apiInfo');
const servers = require('./servers');
const components = require('./components');
const tags = require('./tags');
const cvteque = require('./cvteque');

module.exports = {
    ...apiInfo,
    ...servers,
    ...components,
    ...tags,
    ...cvteque
};