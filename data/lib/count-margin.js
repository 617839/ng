/**
 * Created by j on 15-6-9.
 */

/**
 * @todo
 * @param arr {Array}
 * @param conf {Object}
 * @example
 *
 *   var countMargin = require('countMargin');
 *   var arr = [[1,2,5],[1,3,7],[0,2,5]];
 *   countMargin(arr);  // return [];
 *
 *
 */

/*
if(window) {
    module = window;
    module.exports = window;
    window.require = function(name, alias){
        return window[alias || name];
    }
}*/

var _ = require('underscore', '_');

module.exports = function (arr, conf){

    conf = conf || {start:1, end:34};

    var cache = {};

    var result = [];

    var end = {all:[], active:[]};


    for(var i = 0, item, ri, al = arr.length; i < al;  i++){

        item = _.uniq(arr[i]);

        ri = {all:[], active:[]};


        for(var j = conf.start, cj; j < conf.end; j++){

            cj = cache[j] = cache[j] || {margin:[]};

            ri.all.push(i - cj.start - 1);


            for(var k = 0, v, mr; k < item.length; k++){

                v = item[k]

                mr = null;

                if(v == j){

                    if('start' in cj){
                        mr = i - cj.start - 1;
                        cj.margin.push(mr);
                    }

                    ri.active.push(mr);

                    cj.start = i;

                }

            }


            if (i === al - 1) {

                mr = i - (cj.start || 0);
                cj.margin.push(mr);
                end.all.push(mr);

            }


        }


        result.push(ri);

    }

    result.push(end);

    console.log(JSON.stringify(result));
    return result;

};