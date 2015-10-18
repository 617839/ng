
/**
 * Created by j on 15-8-30.
 */

brick.services.reg('groupModel', function () {

    var utils = brick.services.get('utils');
    var combModel = brick.services.get('combModel');
    var ballsModel = brick.services.get('ballsModel');

    var data = NGGLOBAL.countRm.r;
    var last = data[data.length - 1];
    var allDown = last.all.slice();

    var _patches = _.groupBy(allDown, function (v) {
        return v;
    });
    var patches = _.filter(_patches, function (v, i) {
        return i < 5 && v.length > 2
    });
    var patchesThree = _.filter(_patches, function (v, i) {
        return i < 4 && v.length > 3
    });
    patchesThree = patchesThree.map(function(v, i){
        return [i, i];
    });

    _patches = patches = patches.map(function (v, i) {
        return i;
    });
    patches = utils.group(_patches, 2);
    patches = patches.concat(_patches);
    patches = patches.concat(patchesThree);
    patches = patches.map(function (v) {
        return _.isArray(v) ? v : [v];
    });
    console.log(JSON.stringify(patches));

    return {
        patches:patches,
        patch: function (list) {
            var result = [];
            var patches = this.patches;
            var clone = utils.clone;
            var limitLength = getLimitLengthByData();

            list.forEach(function(v, i){
                if(v.length == limitLength){
                    return result.push(v);
                }
                var _patches = clone(patches);
                var patch;
                var cv;
                var uniq;
                while(patch = _patches.pop()){
                    cv = clone(v);
                    if(v.length + patch.length == limitLength){
                        cv.push.apply(cv, patch);
                        uniq = _.uniq(cv);
                        if(uniq.length == v.length){
                            cv.sort(function(a,b){
                                return a-b;
                            });
                            result.unshift(cv);
                        }
                    }
                }
            });
            return result.sort(function(a, b){
                return _.uniq(a).length - _.uniq(b).length;
            });
        },
        selectList: function(){
            return _.filter(this.list, function(item){
                return item.selected;
            });
        },
        groupList: function () {
            var selectList = this.selectList();
            selectList = selectList.length ? selectList : this.list;
            return selectList.map(function (item) {
                return item.original;
            });
        },
        find:function(item, prop){
            var arr = prop.split('.');
            var o = (function x(o, arr){
                var p = arr.shift();
                o = o[p];
                if(arr.length) return x(o, arr);
                return o;
            })(item, arr);
            return o.join ? o.join(',') : o;
        },
        sort: function(){
            this.list.sort(function(a, b){
                return !a.selected - !b.selected;
            });
        },
        select: function(prop, val, flag, pattern){
            var reg = new RegExp(val);
            var b = flag != '!';
            var that = this;
            var list = this.list;
            list.forEach(function(item){
                var s = that.find(item, prop);
                console.log(reg, s);
                if(!pattern){
                    if(reg.test(s) === b){
                        item.selected = true;
                    }
                }else if(item.selected){
                        item.selected = reg.test(s) === b;
                }
            });
            this.sort();
            brick.broadcast('groupModel.change', list);
        },
        invert: function(){
            this.list.forEach(function(item){
                item.selected = !item.selected;
            });
            this.sort();
            brick.broadcast('groupModel.change', this.list);
        },
        reselect: function(){
            this.list.forEach(function(item){
                delete item.selected;
            });
            this.sort();
            brick.broadcast('groupModel.change', this.list);
        },
        combine: function () {
            var groupSize = combModel.groupSize();
            var args = combModel.count();
            var list = [];
            args.forEach(function (v) {
                var result = utils.combine(v);
                list.push(result);
                console.info(JSON.stringify(result));
            });
            list = _.flatten(list, true);

            list = list.map(function (arr, i) {
                arr.sort(function (a, b) {
                    return a - b;
                });
                return _.uniq(arr);
            });
            list = list.filter(function (arr, i) {
                return groupSize.indexOf(arr.length) > -1;
            });

            list = _.uniq(list, function (a) {
                return JSON.stringify(a)
            });

            list = this.patch(list);
            list = ballsModel.filter(list);

            this.list = list;
            brick.broadcast('groupModel.change', list);
            return list;
        }

    };


});