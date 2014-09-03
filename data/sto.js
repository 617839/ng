/**
 * Created by julien.zhang on 2014/9/2.
 */


module.exports = {

    resolve: function (ng) {

        if (typeof ng === 'string') ng = JSON.stringify(ng);


        /////////////////////////////////////////////////////////////////////////////////////

        var rsto = {};
        var bsto = {};
        var rtop = [];

        for (var i = 0, ngl = ng.length; i < ngl; i++) {

            var num = ng[i];
            var rs = num.red;
            var bs = num.blue;


            for (var k = 1; k < 34; k++) {

                for (var j = 0; j < 6; j++) {

                    var r = rs[j];

                    if (k === r) {

                        var rstoItem = rsto[k] = rsto[k] || { margin: [] };

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
                    }

                    bstoItem.start = i;

                }


                if (i === ngl - 1) {

                    var bstoItem = bsto[k] = bsto[k] || { margin: [] };
                    bstoItem.margin.push(i - (bstoItem.start || 0));
                }

            }

        }


        ////////////////////////////////////////////////////////////////////////////////////////


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

        (function(ng){

            var result;
            var cloneReds;
            var el;

            for(var i in ng){

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

        return {
            ng: ng,
            opnRedBall: ng[ng.length - 1].red.slice(),
            singleDigitRef: singleDigitRef,
            colMap: colMap,
            redMargin: reds,
            downMarginRef: prev,
            next: next,
            upMarginRef: up
        };


    }


};
