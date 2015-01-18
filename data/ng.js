/**
 * Created by julien.zhang on 2014/9/2.
 *
 * 运行一个http服务,从client接收数据,通过sto.js解析成特定格式数据,生成一个js文件供client使用;
 */

var fs = require('fs');
var http = require('http');
var sto = require('./sto.js');

http.createServer(function (req, res) {

    var data = '';

    req.setEncoding('utf-8');

    req.on('data', function (chunk) {
        data += chunk;
    });

    req.on('end', function () {

        if(!data) return res.end('The data is wrong.');

        try{
            var dob = JSON.parse(data);
        }catch(e){
            return res.end('The data is not JSON.');
        }

        fs.writeFileSync('data.json', data);

        createJs(dob);

        res.end('To complete the receiving.');

        console.log(data);
    });


}).listen('2014');

console.log('http server start on port 2014.');


function createJs(data) {

    fs.writeFileSync('33.js', 'window.NGGLOBAL = window.NGGLOBAL || {};');

    var obj = sto.resolve(data);

    var t;

    for (var i in obj) {

        t = '\r\nNGGLOBAL.' + i + ' = window.' + i + ' = ' + JSON.stringify(obj[i]) + ';';

        fs.appendFile('33.js', t, call);

    }

    function call(err) {
        err && console.log(err);
    }

}



