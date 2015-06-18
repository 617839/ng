/**
 * Created by j on 15-6-18.
 */

var fs = require('fs');
var path = require('path');

module.exports = function(req, res){

    var lotteryParser = require('./lib/lottery-parser.js');

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

};