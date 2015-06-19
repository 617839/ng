/**
 * 解析用户代理
 * Created by julien.zhang on 2015/3/5.
 */


module.exports = function(req, res, next){

    var ua = {};

    var agent = req.header('user-agent').toLowerCase();

    ua.isAndroid = /android/i.test(agent);
    ua.isIos = /(?:iphone|ipad)/i.test(agent);
    ua.isWeixin = /micromessenger/i.test(agent);

    //供模板页面使用
    res.locals.UserAgent = ua;

    next();

};