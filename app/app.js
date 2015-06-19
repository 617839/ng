/**
 * Created by julien.zhang on 2015/1/26.
 */

var express = require('express');
var app = express();


//目录
var path = require("path");
GLOBAL.ROOT_DIR = path.join(__dirname, '../');
GLOBAL.DATA_DIR = path.join(ROOT_DIR, './data/');
GLOBAL.LOG_DIR = path.join(ROOT_DIR, './log/');
GLOBAL.ASSETS_DIR = path.join(ROOT_DIR, '/assets');
GLOBAL.USER_DIR = path.join(ROOT_DIR, './app/');
GLOBAL.CONF_DIR = path.join(USER_DIR, './conf/');
GLOBAL.SERVICE_DIR = path.join(USER_DIR, './services/');
GLOBAL.HELPER_DIR = path.join(USER_DIR, './helper/');
GLOBAL.ACTION_DIR = path.join(USER_DIR, './action/');
GLOBAL.FILTER_DIR = path.join(USER_DIR, './filter/');
GLOBAL.VIEW_DIR = path.join(USER_DIR, './view/');
GLOBAL.STATIC_DIR = path.join(USER_DIR, './static/');


//全局配置
require(CONF_DIR + 'global.js');

//环境相关配置
require(CONF_DIR + app.get('env') + '.js')(app);


//logger
//app.use(require(CONF_DIR + 'logger.js').useLog());
//控制台打印日志
app.use(function(req, res, next){
    console.log('%s %s', req.method, req.url);
    next();
});


//配置模板引擎
var swig = require('swig');
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', VIEW_DIR);

//express 视图缓存
app.set('view cache', VIEWCACHE);
//swig 视图缓存
swig.setDefaults({ cache: false });



//请求体解析
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));



//处理静态视图
app.use('/static', express.static(STATIC_DIR.replace(/\/$/, '')));

//处理静态资源文件,实际产品环境中静态资源由nginx或cdn处理
app.use('/assets', express.static(ASSETS_DIR));


//应用路由
require(HELPER_DIR + 'routes.js')(require(CONF_DIR + 'routes.js'), app);



//start
app.listen(2017, function () {
    console.log('server start on port 2017.');
});

