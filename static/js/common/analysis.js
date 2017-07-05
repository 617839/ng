/**
 * Created by j on 15/10/25.
 * 对下间隔组合的可能性进行筛选评判
 * 譬如 3 4 7 11 14 15 这种下间隔组合的可能性微乎其微，不是没有
 * 我要做的是根据以往的数据对组合进行筛选评判
 * 譬如 0 0 1 3 4 15 ，这种组合就是几率最高的
 */
//
var _filtersForGroupByDown = {

    //下间隔组合的第一位，通常是0，每次开奖号码都会和上期号码有重复
    first: {
        code: 'first',
        tag: '开头',
        weight: 3, // 权重
        handle: function (current, prev) {
            var o = _.omit(this, 'handle');
            var v = current.uniq[0];
            o.details = [v];
            o.pass = v == 0;
            current.tags.push(o);
        }
    },

    //下间隔组合的第二位，基本是1，2 ，3
    second: {
        code: 'second',
        tag: '第二位',
        weight: 2,
        handle: function (current, prev) {
            var o = _.omit(this, 'handle');
            var v = current.uniq[1];
            o.details = [v];
            o.pass = v < 5;
            current.tags.push(o);
        }
    },

    //第三位通常小于7
    third: {
        code: 'third',
        tag: '第三位',
        weight: 1,
        handle: function (current, prev) {
            var o = _.omit(this, 'handle');
            var v = current.uniq[2];
            o.details = [v];
            o.pass = v < 10;
            current.tags.push(o);
        }
    },

    //组合数字去重后的长度，长度5最多，4，6其次，3很少见，其它基本没有
    //groupSize: {
    //    code: 'groupSize',
    //    tag: '',
    //    weight: 0,
    //    handle: function (current) {
    //        var o = _.omit(this, 'handle');
    //        var size = current.uniq.length;
    //        o.details = [];
    //        o.pass = false;
    //        o.weight = size == 5 ? 0 : size == 6 ? 1 : size == 4 ? 1 : 3;
    //        current.tags.push(o);
    //    }
    //},

    // 组合数字全为奇数或偶数，全奇数或全偶数可能性很低
    allOddOrEven: {
        code: 'allOddOrEven',
        tag: '全奇偶',
        weight: 7,
        handle: function (current) {
            var o = _.omit(this, 'handle');
            var arr = current.uniq;
            var isOdd = arr.every(function (item) {
                return item % 2 == 0;
            });
            var isEven = arr.every(function (item) {
                return item % 2 == 1;
            });
            o.details = isOdd ? ['0'] : isEven ? ['0'] : [];
            o.pass = !(isOdd || isEven);
            current.tags.push(o);
            current.allOddOrEven = (isOdd || isEven);
        }
    },

    //overlap
    overlap: {
        code: 'overlap',
        tag: 'cys重叠',
        weight: 3,
        handle: function (current, prev) {
            var o = _.omit(this, 'handle');
            var cys_c = current.cys;
            var cys_p = prev.cys;
            var diff = _.difference(cys_c, cys_p);
            o.pass = diff.length || _.uniq(cys_c).length != _.uniq(cys_p).length ? true : false;
            o.details = o.pass ? ['', '', ''] : cys_c;
            current.tags.push(o);
            current.overlap = !o.pass;
        }
    },

    //重延比例 >= 1/2
    cysRadio: {
        code: 'cysRadio',
        tag: 'cys比例',
        weight: 1,
        handle: function (current, prev) {
            var o = _.omit(this, 'handle');
            var cys = current.cys;
            var a = cys[0] + cys[1];
            var b = cys[0] + cys[1] + cys[2];
            o.details = [(a / b).toFixed(1) * 10];
            o.pass = a / b >= 1 / 2;
            current.tags.push(o);
        }
    },

    //组合里重复的数字是否是0， 1， 2， 3， 4
    same: {
        code: 'same',
        tag: '重号',
        weight: 7,
        handle: function (current) {
            var o = _.omit(this, 'handle');
            var count = _.countBy(current.original, function (item) {
                return item;
            });
            o.pass = _.every(count, function (v, k) {
                return !(v > 1 && k > 4);
            });
            o.details = _.pick(count, function (v) {
                return v > 1;
            });
            o.details = _.pairs(o.details);
            o.details = o.details.map(function (item) {
                return item.join('');
            });
            //o.details = _.flatten(o.details);
            //o.details = [];
            current.tags.push(o);
        }
    },

    //Sequential numbering
    sn: {
        code: 'sn',
        tag: '连号',
        weight: 2,
        handle: function (current, prev) {
            var o = _.omit(this, 'handle');
            var result = [];
            var uniq = current.uniq;
            var clone;
            var first;
            var range;
            var index;
            var comp;
            for (var i = 0, length = uniq.length - 1; i < length;) {

                comp = [];
                index = 0;
                clone = uniq.slice(i);
                first = clone[0];
                range = _.range(first, first + clone.length);
                clone.forEach(function (v, k) {
                    if (v == range[k]) {
                        index = k;
                        comp.push(v);
                    }
                });

                if (index > 0) {
                    result.push(comp);
                    i += index;
                } else {
                    i += 1;
                }

            }

            o.details = _.flatten(result);
            o.pass = !!result.length;
            current.tags.push(o);
        }
    }

};