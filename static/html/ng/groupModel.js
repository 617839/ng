/**
 * Created by j on 15-8-30.
 */

    //    pool结构： = {
    //        "0":{
    //          name: 0,
    //          numbers: [
    //            {n: 0, selected: true},
    //            {n: 1, selected: true},
    //            {n: 2, selected: false},
    //            {n: 3, selected: true},
    //            {n: 4, selected: false}
    //        ], use: [4, 5]}
    //    };

brick.services.reg('groupModel', function () {

    var utils = brick.services.get('utils');
    var xModel = brick.services.get('xModel');

    var data = NGGLOBAL.countRm.r;
    var last = data[data.length - 1];
    var allDown = last.all.slice();
    var uniqueDown = _.uniq(allDown).sort(function (a, b) {
        return a - b;
    });

    var exports = {
        pool: {},
        numbers: {},
        use: {},
        list:[],
        _groupSize:[4, 5, 6],
        groupList: function(){
            return this.list.map(function(item){
                return item.original;
            });
        },
        groupSize: function(arr){
            if(!arr) return this._groupSize;
            this._groupSize = arr;
        },
        _rev: function (arr) {
            return arr.map(function (v, i) {
                return {n: v.n, selected: !v.selected};
            });
        },
        _size: function () {
            var c = {};
            allDown.forEach(function (v, i) {
                c[v] = c[v] || [];
                c[v].push(++i);
            });
            var down = uniqueDown.map(function (v, i) {
                return {n: v, selected: c[v].length !== 1};
            });
            this.numbers[0] = down;
            this.numbers[1] = this._rev(down);
        },
        _clone: function (o) {
            try {
                o = JSON.parse(JSON.stringify(o));
            } catch (e) {
                console.error('on statusModel._clone(): ', e);
            }
            return o;
        },
        init: function () {
            this._size();
            brick.broadcast('groupModel.init', this.get());
        },
        cache: function(flag){
            try{
                if(flag){
                    var s = JSON.stringify({numbers:this.numbers, use:this.use});
                    localStorage.setItem('groupModel', s);
                }else{
                    var s = localStorage.getItem('groupModel');
                    var o = JSON.parse(s);
                    _.extend(this, o);
                    brick.broadcast('groupModel.init', this.get());
                }
            }catch(e){
                console.log('groupModel.cache():', e);
                alert(e.message);
            }
        },
        get: function (name) {
            var pool = this.joint();
            var o = name != void(0) ? pool[name] : pool;
            return o && this._clone(o);
        },
        set: function (k, v) {
            k = k.split('-');
            var name = k[0];
            var type = k[1];
            v = v.map(function(item, i){
                if(_.isObject(item)){
                    item.n *= 1;
                    return item;
                }
                return item * 1;
            });
            this[type][name] = v;
        },
        add: function () {

        },
        joint: function () {
            var pool = this.pool = {};
            var _numbers = this._clone(this.numbers);
            var _use = this._clone(this.use);
            _.each(_numbers, function (v, i) {
                pool[i] = {numbers: v, use: _use[i] || []};
            });
            return pool;
        },
        count: function () {
            var pool = this.joint();
            var result = [];
            _.each(pool, function (item, i) {
                var numbers = item.numbers.filter(function (v) {
                    return v.selected;
                });
                numbers = numbers.map(function (v) {
                    return v.n;
                });
                var use = item.use;
                if (numbers.length && use.length) {
                    while(use = item.use.shift()){
                        result.push({numbers: numbers.slice(), use: use});
                    }
                }
            });

            if(!result.length){
                return alert('没有可用的numbers 或 use.');
            }

            result = _.groupBy(result, function(item){
                return item.numbers.join(',');
            });
            result = _.values(result);
            return utils._combine(result);
            return result;
        },
        combine: function(){
            var groupSize = this.groupSize();
            var args = this.count();
            var list = [];
            args.forEach(function(v){
                var result = utils.combine(v);
                list.push(result);
                console.info(JSON.stringify(result));
            });
            //var list = utils.combine(args);
            list = _.flatten(list, true);

            list = list.map(function(arr, i){
                arr.sort(function(a, b){
                    return a - b;
                });
                return _.uniq(arr);
            });
            list = list.filter(function(arr, i){
                return groupSize.indexOf(arr.length) > -1;
            });

            list = _.uniq(list, function(a){return JSON.stringify(a)});

            list = xModel.filter(list);

            this.list = list;

            brick.broadcast('groupModel.combine.change', list);
            return list;
        }
    };

    return exports;

});