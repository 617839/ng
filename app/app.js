/**
 * Created by julien.zhang on 2015/1/26.
 */

var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();


//全局变量定义
global.ROOT_DIR = path.join(__dirname, '../');
global.HELP_DIR = path.join(__dirname, './helper/');
global.DATA_DIR = path.join(ROOT_DIR, './data/');


//设置静态文件服务器目录
app.use(express.static(__dirname + '/../'));

//控制台打印日志
app.use(function(req, res, next){
    console.log('%s %s', req.method, req.url);
    next();
});

//允许跨域请求
app.use( function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",'3.2.1');
    if(req.method=="OPTIONS"){
        res.send(200);//让options请求快速返回
    }
    else {
        next();
    }
});

//bodyParser组件
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

//数据收集接口
app.post('/gather/:type', function(req, res){

    var lotteryParser = require(HELP_DIR + 'lottery-parser.js');

    var data = req.body;

    var type = req.params.type;

    var jsonPath = path.join(DATA_DIR, type + '/data.json');

    var jsPath = path.join(DATA_DIR, type + '/data.js');

    fs.writeFileSync(jsonPath, JSON.stringify(data));
    fs.writeFileSync(jsPath, 'window.NGGLOBAL = window.NGGLOBAL || {};');
    
    var dob = lotteryParser.resolve(data);

    var t;

    for (var i in dob) {

        t = '\r\n' + 'NGGLOBAL.' + i + ' = window.' + i + ' = ' + JSON.stringify(dob[i]) + ';';

        fs.appendFile(jsPath, t, function(err) {

            err && console.log(err);

        });

    }

    res.send('It\'s ok. To complete the receiving.');

});

//
app.get('/status', function(req, res){
    var path = '../data/status.json';
    var dobj = require(path);
    res.send(dobj);
});

//
app.post('/status/:type?', function(req, res){

    var path = '../data/status.json';
    var type = req.params.type;
    var dobj = require(path);

    dobj[req.body.type||type] = req.body.data;

    //console.log(req.body);

    fs.writeFileSync(path, JSON.stringify(dobj));
    res.send({code:1});
});

//
app.del('/status/:type?', function(reg, res){

    var path = '../data/status.json';
    var type = req.params.type;
    var dobj = require(path);

    if(type){
        delete dobj[type];
    }else{
        dobj = {};
    }

    fs.writeFileSync(path, JSON.stringify(dobj));
    res.send({code:1});
});


//启动server
app.listen(2017);
console.log('server start on port 2017.');