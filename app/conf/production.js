/**
 * 产品环境配置
 * Created by julien.zhang on 2015/2/27.
 */

GLOBAL.ENVIRONMENT = 'production';



//模板视图是否缓存
GLOBAL.VIEWCACHE = true;

module.exports = function (app) {

    //产品环境禁用头信息
    app.disable('x-powered-by');

    //日志
    /*app.use(require('express-logger')({
        path: LOG_DIR + 'requests.log'
    }));*/


};