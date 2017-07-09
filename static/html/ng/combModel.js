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

brick.services.reg('combModel', function () {

    var utils = brick.services.get('utils');

    var data = NGGLOBAL.countRm.r;
    var last = data[data.length - 1];
    var allDown = last.all.slice();
    var uniqueDown = _.uniq(allDown).sort(function (a, b) {
        return a - b;
    });

    return {
        pool: {},
        numbers: {}, //记录每个组合条件使用哪几个下间隔数字，比如某个组合条件使用0，1，2
        use: {},     //记录每个组合条件里的下间隔数字使用几个，比如一个组合方案里0，1，2里使用1个或2个或3个
        list: [],
        combForGroupFilter:[], //组合条件数据模型用于编组过滤。比如完成编组后参照每个组合条件进行筛选，比如0，1，2里最多2个，最少1个。检查是否符合。
        _groupSize: [4, 5, 6], //去重后的组合长度
        //设置或获取组合长度
        groupSize: function (arr) {
            if (!arr) return this._groupSize;
            this._groupSize = arr;
        },
        _rev: function (arr) {
            return arr.map(function (v, i) {
                return {n: v.n, selected: !v.selected};
            });
        },
        _fillByCys: function(){
            var prevDown = downMarginRef.slice(downMarginRef.length - 1);
            var arr = utils.countCys(_.uniq(prevDown[0]), uniqueDown);
            var cy = [].concat(arr[0]).concat(arr[1]);
            var numbers = uniqueDown.map(function (v, i) {
                return {n: v, selected: _.contains(cy, v)};
            });
            return numbers;
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

            var a = [2, 3, 4, 5, 6, 7, 8, 9];
            var item;
            while (item = a.shift()) {
                this.numbers[item] = uniqueDown.map(function (v, i) {
                    return {n: v, selected: false};
                });
            }

            //var cy = this._fillByCys();
            //this.numbers[10] = cy;
            //this.numbers[11] = this._rev(cy);
        },
        init: function () {
            this._size();
            brick.broadcast('combModel.init', this.get());
        },
        cache: function (flag) {
            var s;
            var o;
            try {
                if (flag) {
                    s = JSON.stringify({numbers: this.numbers, use: this.use});
                    localStorage.setItem('combModel', s);
                } else {
                    s = localStorage.getItem('combModel');
                    o = JSON.parse(s);
                    _.extend(this, o);
                    brick.broadcast('combModel.init', this.get());
                }
            } catch (e) {
                console.log('combModel.cache:', e);
                alert(e.message);
            }
        },
        get: function (name) {
            var pool = this.joint();
            var o = name != void(0) ? pool[name] : pool;
            return o && utils.clone(o);
        },
        //设置this.numbers 和 this.use
        set: function (k, v) {
            k = k.split('-');
            var name = k[0];
            var type = k[1];
            v = v.map(function (item, i) {
                if (_.isObject(item)) {
                    item.n *= 1;
                    return item;
                }
                return item * 1;
            });
            this[type][name] = v;
        },
        add: function () {
        },
        //联结下间隔数字和使用位数，比如，0，1，2里使用2位或3位
        joint: function () {
            var pool = this.pool = {};
            var _numbers = utils.clone(this.numbers);
            var _use = utils.clone(this.use);
            _.each(_numbers, function (v, i) {
                pool[i] = {numbers: v, use: _use[i] || []};
            });
            return pool;
        },
        count: function () {
            var pool = this.joint();
            var result = [];
            var combForGroupFilter = this.combForGroupFilter = [];
            _.each(pool, function (item, i) {
                var numbers = item.numbers.filter(function (v) {
                    return v.selected;
                });
                numbers = numbers.map(function (v) {
                    return v.n;
                });
                var use = item.use.slice();
                if (numbers.length && use.length) {
                    combForGroupFilter.push({numbers: numbers.slice(), use: use});
                    use.forEach(function(v){
                        result.push({numbers: numbers.slice(), use: v});
                    });
                }
            });

            if (!result.length) {
                return alert('没有可用的numbers 或 use.');
            }

            console.info('combForGroupFilter is = ', combForGroupFilter);

            result = _.groupBy(result, function (item) {
                return item.numbers.join(',');
            });
            //console.info(result);
            result = _.values(result);
            //console.log('>>>', result);
            result = utils._combine(result);
            return result;
        },
        // 对编组按照组合条件进行过滤
        filter: function(list){
            var combForGroupFilter = this.combForGroupFilter;
            return list.filter(function(arr){
                return combForGroupFilter.every(function(item){
                    var r = _.intersection(arr, item.numbers); //计算编组与组合条件交集长度
                    return _.contains(item.use, r.length);     //交集长度应该在使用范围内
                });
            });
        }

    };

});
