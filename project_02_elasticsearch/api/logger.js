const ecsFormat = require('@elastic/ecs-pino-format')
const pino = require('pino')
const mode = process.env.SERVER_ENV === 'production' ?
    '/Users/carlo/DAAR/project_02_elasticsearch/logs.json' :
    pino.destination(1);
const logger = pino(ecsFormat(), mode)

module.exports = {
    logger
}
