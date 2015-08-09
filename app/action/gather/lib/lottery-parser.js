/**
 * Created by julien.zhang on 2014/9/2.
 *
 * 把数据转换为特定格式;
 */

var _ = require('underscore');

module.exports = {

    resolve: function (ng, type) {

        if (typeof ng === 'string') ng = JSON.parse(ng);

        var _kl = 34;
        var _jl = 6;

        if(type == 30){
            _kl = 31;
            _jl = 7;
        }

        if(type == 15){
            _kl = 16;
            _jl = 5;
        }

        if(type == 35){
            _kl = 36;
            _jl = 5;
        }

        /////////////////////////////////////////////////////////////////////////////////////

        var rsto = {};
        var bsto = {};
        var rtop = [];
        var bcm = []; //blue common  margin

        var colCountRef = [];

        for (var i = 0, ngl = ng.length; i < ngl; i++) {

            var num = ng[i];
            var rs = num.red;
            var bs = num.blue;


            for (var k = 1; k < _kl; k++) {

                for (var j = 0; j < _jl; j++) {

                    var r = rs[j];

                    if (k === r) {

                        var rstoItem = rsto[k] = rsto[k] || { margin: [] };

                        var col = colCountRef[i] = colCountRef[i] || [];

                        col.push(rstoItem.col);

                        rstoItem.col = j+1;

                        if ('start' in rstoItem) {

                            rstoItem.margin.push(i - rstoItem.start - 1);

                            var rtopItem = rtop[i] = rtop[i] || {};

                            rtopItem[k] = rstoItem.margin.length - 1;

                        }

                        rstoItem.start = i;

                    }

                }


                if (i === ngl - 1) {

                    var rstoItem = rsto[k] = rsto[k] || { margin: [] };
                    rstoItem.margin.push(i - (rstoItem.start || 0));

                }

            }

            ///////////////////////////////////////////////////////////////////////////////////

            for (var k = 1; k < 17; k++) {

                if (k === bs) {

                    var bstoItem = bsto[k] = bsto[k] || { margin: [] };

                    if ('start' in bstoItem) {
                        bstoItem.margin.push(i - bstoItem.start - 1);
                        bcm.push(i - bstoItem.start - 1);
                    }

                    bstoItem.start = i;

                }


                if (i === ngl - 1) {

                    var bstoItem = bsto[k] = bsto[k] || { margin: [] };
                    bstoItem.margin.push(i - (bstoItem.start || 0));
                }

            }

        }



        ///////////////////////////////////////////////////////////////////////////////////////

        (function(colCountRef){

            function count(arr){
                var length = arr.length;
                var result = {};
                var item;

                for(var i = 0; i< length; i++){
                    item = arr[i];
                    result[item] = result[item] ? result[item]+1 : 1;
                }

                return result;
            }

            function countCol(arr) {
                var length = arr.length;
                var result = [];
                var obj = count(arr);

                for(var i = 0; i < length; i++){
                    result[i] = 0;
                }

                for(var j in obj){
                    result[j*1-1] = obj[j];
                }

                return result;
            }

            colCountRef.forEach(function(v, k, list){

                list[k] = countCol(v);

            }) ;

        })(colCountRef);


        ////////////////////////////////////////////////////////////////////////////////////////

        var bMargin = [];

        for(var i in bsto){
            bMargin[i] = bsto[i];
        }


        var reds = [];
        var prev = [];
        var next = [];
        var up = [];

        for (var i in rsto) {
            reds[i] = rsto[i];
        }


        rtop.forEach(function (v, k, list) {

            var arr = [];
            var arr1 = [];
            var arr2 = [];

            for (var i in v) {

                var margin = rsto[i].margin;

                arr.push(margin[v[i]]);
                arr1.push(margin[v[i] - 1]);

                var index = v[i] + 1;
                var ob = {v: margin[index]};
                if (index + 1 === margin.length) {
                    ob.over = 1;
                }
                arr2.push(ob);
            }

            prev.push(arr);
            up.push(arr1);
            next.push(arr2);
        });


        ////////////////////////////////////////////////////////////////////////////////////////

        var colMap = [];

        (function(reds){

            var p;
            var margin;

            for(var i in reds){

                margin = reds[i] ? reds[i].margin : [];
                p = margin.length - 2;
                colMap[i] = margin.slice(p);
                colMap[i].unshift(reds[i] && reds[i].col);
            }

        })(reds);


        //////////////////////////////////////////////////////////////////////////////////////////

        var singleDigitRef = [];
        var bdgs = [];
        var bmr = [];

        (function(ng){

            var result;
            var cloneReds;
            var el;
            var blue;

            for(var i in ng){

                var blue = ng[i].blue + '';
                blue = blue.substr(blue.length-1);
                bdgs.push(blue*1);

                result = [];
                cloneReds = ng[i].red.slice();

                while(el = cloneReds.shift()) {

                    el = el + '';
                    el = el.substr(el.length-1);
                    result.push(el*1);

                }

                singleDigitRef.push(result.sort());
            }

        })(ng);




        ////////////////////////////////////////////////////////////////////////////////////////////
        //间隔统计

        var countRm = (function(ng){

                return require('./count-down-margin.js')(ng, _kl);

            })(ng);


        var countUm = (function(up){

            var result = require('./count-margin.js')(up, {start:0, end:40});

            for(var i in result){
                result[i].num =  ng[i] && ng[i].num;
            }

            return result;

        })(up);


        var countDm = (function(prev){

            var countRm = require('./count-down-margin.js')(ng).r;

            var result = require('./count-margin.js')(prev, {start:0, end:40});

            for(var l = result.length-1, item, filter, all, map, k; l >= 0; l-- ){

                map = {};

                filter = [];

                all = result[l].all;

                item = _.uniq( countRm.pop().all);

                for(var j in item) {

                    k = all[ item[j] ];

                    filter.push(k);

                    map[k] = map[k] || [];
                    map[k].push(item[j]);
                }


                if(l == result.length-1){
                    result[l].map = map;
                }


                result[l].all = filter;

            }


            for(var i in result){
                result[i].num =  ng[i] && ng[i].num;
            }

            return result;

        })(prev);


        var countSm = (function(singleDigitRef){

            var result = require('./count-margin.js')(singleDigitRef, {start:0, end:10});

            for(var i in result){
                result[i].num =  ng[i] && ng[i].num;
            }

            return result;

        })(singleDigitRef);



        ////////////////////////////////////////////////////////////////////////////////////////////

        return {
            ng: ng,
            opnRedBall: ng[ng.length - 1].red.slice(),
            colMap: colMap,
            bdgs : bdgs,
            BCM: bcm,
            redMargin: reds,
            bMargin: bMargin,
            colCountRef : colCountRef,
            singleDigitRef: singleDigitRef,
            downMarginRef: prev,
            upMarginRef: up,
            next: next,

            countRm: countRm,

            countUm: countUm,

            countDm: countDm,

            countSm: countSm
        };


    }


};
