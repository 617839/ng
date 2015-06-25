/**
 * Created by j on 15-6-11.
 */

var _ = require('underscore');

var countMargin = require('./count-margin.js');


module.exports = function(ng, _kl){

    var result = {};

    var r = [];
    var b = [];

    _.forEach(ng, function(v, i, list){

        r.push(v.red.slice());
        b.push(v.blue);

    });


    for(var i in r) r[i] = _.uniq(r[i]);

    result.r = countMargin(r, {start:1, end: _kl || 34});

    result.b = countMargin(b, {start:1, end:17});


    _.forEach(result.r, function(v, i, list){

        v.num = ng[i] && ng[i].num;

    });

    return result;

};