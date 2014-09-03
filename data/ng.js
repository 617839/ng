/**
 * Created by julien.zhang on 2014/9/2.
 */

var fs = require('fs');
var http = require('http');
var querystring = require('querystring');
var sto = require('./sto.js');

http.createServer(function (req, res) {

    var data = '';

    req.setEncoding('utf-8');

    req.on('data', function (chunk) {

        data += chunk;
    });

    req.on('end', function () {

        fs.writeFileSync('data.json', data);

        data = JSON.parse(data);

        // data = querystring.parse(data);

        f(data);

        res.end('<script src="http://code.jquery.com/jquery-latest.js"></script>');
    });


}).listen('2014');


function f(data) {

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


var data = require('./data.json');

if (data) f(data);