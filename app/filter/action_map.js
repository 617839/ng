/**
 *
 * 根据请求路径映射到对应的action,省却手工定义routes
 *
 * Created by julien.zhang on 2015/3/10.
 */

var logger = require('log4js').getLogger('routes');

module.exports = function(req, res, next){

    var paths = req.path.replace(/^\//,'').replace('/','.');
    var action = getAction(paths);

    if(action) return action(req, res, next);

    next();

};

function getAction(namespace, dir){

    dir = dir || ACTION_DIR;
    namespace = namespace.split('.');

    var ActionPath = dir + namespace.shift();

    try{
        var ctrl = require(ActionPath);
    }catch(e){
        logger.error(e);
        return false;
    }

    var action = namespace.shift();

    return action ?
        function(req, res, next){
            return ctrl[action](req, res, next);
        }
        : ctrl;
}