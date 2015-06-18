/**
 * Created by julien.zhang on 2015/3/3.
 */

var log4js = require('log4js');

log4js.configure({
    'appenders': [
        {
            type: 'clustered',
            appenders: [
                {
                    type: 'dateFile',
                    filename: LOG_DIR + 'access.log',
                    pattern: '-yyyy-MM-dd',
                    alwaysIncludePattern: false,
                    category: 'http'
                },
                {
                    type: 'file',
                    filename: LOG_DIR + 'app.log',
                    maxLogSize: 10485760,
                    //category: 'app',
                    numBackups: 3

                },
                {
                    type: 'logLevelFilter',
                    level: 'ERROR',
                    appender: {
                        type: ENVIRONMENT == 'development' ?  'console' : 'file',
                        filename: LOG_DIR + 'errors.log'
                    }
                }
            ]
        }
    ]
});




GLOBAL.LOGGER = log4js.getLogger('app');

exports.logger = LOGGER.getLogger = function(name){
    return log4js.getLogger(name);
};

exports.useLog = function(){
    return log4js.connectLogger(log4js.getLogger('http'), { level: 'auto' });
};
