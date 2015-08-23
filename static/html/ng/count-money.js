/**
 * Created by julien on 2015/7/20.
 */

/**
 * @todo
 * @param arr Array
 * @param refer Object
 * @return Object
 * @example
 * var countMoney = require('count-money');
 * var list =  [{red:[1, 5, 12, 13, 27, 30], blue:4}];
 * var compare = {red:[11, 15, 8, 23, 17, 18], blue:7};
 * var result = countMoney(list); // {list:[{red:[1, 5, 12, 13, 27, 30], blue:4, money:5}],money:5}
 *
 */

if(window){
    exports = window;
}


exports.countMoney = function(arr, refer){

    arr = JSON.parse(JSON.stringify(arr));

    var referR = refer.red.map(function(v){
        return v * 1;
    });

    var referB = refer.blue * 1;

    arr.forEach(function(v, i, list){

        var r = v.red.map(function(v){
            return v * 1;
        });
        var b = v.blue * 1;

        var compare = _.intersection(r, referR);
        var compareL = compare.length;

        var money = b == referB ? 5 : 0;

        if(compareL == 4){
            money = b == referB ? 200 : 10;
        }

        else if(compareL == 5){
            money = b == referB ? 3000 : 200;
        }

        else if(compareL == 6){
            money = b == referB ? 5000000 : 100000;
        }

        v.money = money;

    });

    var money = 0;
    var result = arr.filter(function(v){
        money += v.money;
        return v.money > 0;
    });

    return {
        list: result,
        money: money
    };

};