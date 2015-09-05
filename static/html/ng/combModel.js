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
        numbers: {},
        use: {},
        list: [],
        _groupSize: [4, 5, 6],
        groupSize: function (arr) {
            if (!arr) return this._groupSize;
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
            var a = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
            var item;
            while (item = a.shift()) {
                this.numbers[item] = uniqueDown.map(function (v, i) {
                    return {n: v, selected: false};
                });
            }
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
            _.each(pool, function (item, i) {
                var numbers = item.numbers.filter(function (v) {
                    return v.selected;
                });
                numbers = numbers.map(function (v) {
                    return v.n;
                });
                var use = item.use;
                if (numbers.length && use.length) {
                    while (use = item.use.shift()+2) {
                        result.push({numbers: numbers.slice(), use: use-2});
                    }
                }
            });

            if (!result.length) {
                return alert('没有可用的numbers 或 use.');
            }

            result = _.groupBy(result, function (item) {
                return item.numbers.join(',');
            });
            result = _.values(result);
            return utils._combine(result);
        }

    };

});
