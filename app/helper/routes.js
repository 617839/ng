/**
 * 根据配置应用路由
 * Created by julien.zhang on 2015/2/27.
 */

module.exports = function(conf, app){

    //过滤器
    var filters = parseFilter(conf.filter);

    function applyFilter(filter){
        var _filter = getAction(filter, FILTER_DIR);
        if(_filter){
            app.use(_filter);
        }else{
            throw 'miss filter for ' + filter;
        }
    }

    //应用前置过滤器
    filters.before.forEach(applyFilter);

    //应用路由
    var routes = conf.mapping;

    routes.forEach(function(route){

        var action = getAction(route.action, ACTION_DIR);

        if(!action){
            throw 'miss action for ' + route.url;
        }
        if(action.constructor !== Function){
            throw 'action must be a function for' + route.url;
        }


        var params = [wrapAction(action)];

        var filters = parseFilter(route.filter);

        filters.before.forEach(function(filter){
            var _filter = getAction(filter, FILTER_DIR);
            if(_filter){
                params.unshift(_filter);
            }else{
                throw 'miss filter for ' + filter;
            }
        });


        filters.after.forEach(function(filter){
            var _filter = getAction(filter, FILTER_DIR);
            if(_filter){
                params.push(_filter);
            }else{
                throw 'miss filter for ' + filter;
            }
        });

        params.unshift(route.url);

        //app[route.method || 'all'](route.url, action);
        app[route.method || 'all'].apply(app, params);

    });

    //应用全局后置过滤器
    filters.after.forEach(applyFilter);

};

function wrapAction(action){

    return function(req, res, next){
        try{
            return action(req, res, next);
        }catch(e){
            next(e);
        }
    }
}

function parseFilter(filter) {

    var filters = filter || {};

    filters = filters.constructor === Array ? {before: filters, after: []} : filters;

    var before = filters.before || [];

    var after = filters.after || [];

    return {
        before: before.constructor === Array ? before : [before],
        after : after.constructor === Array ? after : [after]
    }
}

function getAction(namespace, dir){

    namespace = namespace.split('.');

    var ActionPath = dir + namespace.shift();

    try{
        var ctrl = require(ActionPath);
    }catch(e){
        return false;
    }

    var action = namespace.shift();

    return action ?
        function(req, res, next){
           return ctrl[action](req, res, next);
        }
        : ctrl;
}