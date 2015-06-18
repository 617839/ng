/**
 * Created by julien.zhang on 2015/2/28.
 */

var util = require('util');
var logger = require(CONF_DIR + 'logger.js').logger('app');

exports.index = function (req, res) {

    //写日志
    LOGGER.info(req.ip);
    //另一种写日志
    logger.warn(util.inspect(req.headers));

    res.locals.flash = util.inspect(res.locals.userAgent);

    //写cookie
    res.cookie('name', (+new Date).toString(36));
    res.cookie('aaa', 'cookie test');

    //写session
    req.session.id = req.session.id || +new Date();



    var vm = {};

    //读cookie
    vm.name = req.cookies.name;
    vm.id = req.session.id;
    vm.query = req.query.id;
    vm.body = req.body.name + req.body.like;
    vm.params = req.params;


    if(req.xhr) return res.send(vm);

    res.render('demo.html', vm);

};