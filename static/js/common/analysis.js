/**
 * Created by j on 15/10/25.
 */
//
var _filtersForGroupByDown = {

    first: {
        code: 'first',
        tag: '开头',
        weight:30,
        handle: function (current, prev) {
            var o = _.omit(this, 'handle');
            var v = current.uniq[0];
            o.details = [v];
            o.pass = v == 0;
            current.tags.push(o);
        }
    },

    second: {
        code: 'second',
        tag: '第二位',
        weight:20,
        handle: function (current, prev) {
            var o = _.omit(this, 'handle');
            var v = current.uniq[1];
            o.details = [v];
            o.pass = v < 5;
            current.tags.push(o);
        }
    },

    third: {
        code: 'third',
        tag: '第三位',
        weight:10,
        handle: function (current, prev) {
            var o = _.omit(this, 'handle');
            var v = current.uniq[2];
            o.details = [v];
            o.pass = v < 7;
            current.tags.push(o);
        }
    },

    groupSize: {
        code: 'groupSize',
        tag: '',
        weight:0,
        handle: function (current) {
            var o = _.omit(this, 'handle');
            var size = current.uniq.length;
            o.details = [];
            o.pass = false;
            o.weight = size == 5 ? 0 : size == 6 ? 10 : 10;
            current.tags.push(o);
        }
    },

    allOddOrEven: {
        code: 'allOddOrEven',
        tag: '',
        weight:60,
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
        weight:30,
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
        weight:10,
        handle: function (current, prev) {
            var o = _.omit(this, 'handle');
            var cys = current.cys;
            var a = cys[0] + cys[1];
            var b = cys[0] + cys[1] + cys[2];
            o.details = [a, b];
            o.pass = a / b >= 1 / 2;
            current.tags.push(o);
        }
    },

    same: {
        code: 'same',
        tag: 'same',
        weight:30,
        handle: function (current) {
            var o = _.omit(this, 'handle');
            var count = _.countBy(current.original, function (item) {
                return item;
            });
            o.pass = _.every(count, function (v, k) {
                return !(v > 1 && k > 3);
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
        weight:0,
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
            o.pass = result.length;
            current.tags.push(o);
        }
    }

};