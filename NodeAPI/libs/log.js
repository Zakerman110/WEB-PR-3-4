var winston = require('winston');

function getLogger(module) {
    var path = module.filename.split('/').slice(-2).join('/');

    return winston.createLogger({
        transports: [
            new winston.transports.Console({
                colorize: true,
                level: 'debug',
                label: path})
        ]
    });
}

module.exports = getLogger;