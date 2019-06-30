const log4js = require('log4js');
log4js.configure({
    appenders: { api: { type: 'file', filename: 'api.log' } },
    categories: {
        default: { appenders: ['api'], level: 'info' }
    }
});

const logger = log4js.getLogger('api');

exports.log = function (message, type) {
    switch (type) {
        case 'trace':
            logger.trace(message);
            break;
        case 'warn':
            logger.warn(message);
            break;
        case 'info':
            logger.info(message);
            break;
        case 'debug':
            logger.debug(message);
            break;
        case 'error':
            logger.error(message);
            break;
        default:
            logger.warn(`Cannot determine type: '${type}' for message: '${message}'`)
            console.error(`Cannot determine type: '${type}' for message: '${message}'`)
    }
}