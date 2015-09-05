/**
 * Created by Julien on 2015/8/27.
 * define utils
 */

brick.services.reg('utils', function(){

    var exports = {};

    /////////////////////////////////////////////////////////////////

    /*
     * 对数字进行编组
     *
     * example:
     * var r = group([1,2,3,4],3);
     * JSON.stringify(r) == "[[1,2,3],[1,2,4],[1,3,4],[2,3,4]]";
     */
    function group(nu, groupl, result){

        var result = result ? result : [];
        var nul = nu.length;
        var outloopl = nul - groupl;

        var nuc = nu.slice(0);

        var item = nuc.shift();
        item = item.constructor === Array ? item : [item];


        (function func(item,nuc){
            var itemc;
            var nucc = nuc.slice(0);
            var margin = groupl- item.length;


            if( margin == 0){
                result.push(item);
                return;
            }
            if( margin == 1){
                for(var j in nuc){
                    itemc = item.slice(0);
                    itemc.push(nuc[j]);
                    result.push(itemc);
                }
            }
            if( margin > 1){
                itemc = item.slice(0);
                itemc.push(nucc.shift());
                func(itemc,nucc);

                if(item.length + nucc.length >= groupl){
                    func(item,nucc);
                }

            }

        })(item,nuc);


        if(nuc.length >= groupl){
            return group(nuc, groupl, result);
        }else{
            return result;
        }

    }

    /*
     * example:
     * var r = _combine([1,2,3],[0],[9]);
     * JSON.stringify(r) == "[[1,0,9],[2,0,9],[3,0,9]]";
     */
    function _combine(){
        var args = Array.prototype.slice.call(arguments, 0);
        var arr1;
        var arr2;
        var arr3;

        function func(arr1,arr2){
            var arr3 = [];
            var item1,item2,item1c;

            if(arr1.length == 0) return arr2;
            if(arr2.length == 0) return arr1;

            for(var i in arr1){
                item1 = arr1[i];
                item1 = item1.constructor === Array ? item1 : [item1];
                for(var j in arr2){
                    item1c = item1.slice();
                    item2 = arr2[j];
                    item1c = item1c.concat(item2);

                    arr3.push(item1c);
                }
            }

            return arr3;
        }

        if(args.length == 1) {
            return args[0];
        }
        if(args.length > 1){
            arr1 = args.shift();
            arr2 = args.shift();
            arr3 = func(arr1,arr2);
            args.unshift(arr3);
            return _combine.apply(null,args);
        }
    }

    /**
     * 对_combine进行包装,处理[[[1,2],[1,3],[2,3]],[[4,5]],[[6],[7]]]这样的参数
     * @param arr {Array}
     * @returns {*}
     */
    function combine(arr){
        return (_combine.apply(null, arr));
    }


    /////////////////////////////////////////////////////////////////////////

    exports.group = group;

    exports._combine = combine;

    exports.clone = function (o) {
        try {
            o = JSON.parse(JSON.stringify(o));
        } catch (e) {
            console.error('utils.clone: ', e);
        }
        return o;
    };

    /**
     *
     * @param arr => [{numbers:[0,1,2,3,4,5],use:4},{numbers:[12,14,20],use:1}]
     */
    exports.combine = function(arr){
        var args = [];
        arr.forEach(function(item, i){
            var g = group(item.numbers, item.use);
            console.log(JSON.stringify(item.numbers), JSON.stringify(item.use), JSON.stringify(g));
            args.push(g);
        });
        console.log(JSON.stringify(args));
        return combine(args);
    };

    return exports;

});