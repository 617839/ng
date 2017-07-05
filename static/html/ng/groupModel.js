
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
    console.info('allDown = ', allDown);

    //补丁功能，主要是在unique编组里添加重复的下间隔，比如重0，重1，那就添加一个0或一个1，一个编组里3个0，或3个1，那就添加两个0或两个1
    var _patches = _.groupBy(allDown, function (v) {
        return v;
    });
    //console.info('_patches = ', _patches);
    var patches = _.filter(_patches, function (v, i) {
        //return v.length >= 1;
        return i < 5 && v.length > 2;
    });
    var patchesThree = _.filter(_patches, function (v, i) {
        return i < 4 && v.length > 3;
    });
    //console.info(patchesThree);

    patchesThree = patchesThree.map(function(v, i){
        var z = v[0];
        return [z, z];
    });

    _patches = patches = patches.map(function (v, i) {
        return v[0];
    });
    patches = utils.group(_patches, 2);
    patches = patches.concat(_patches);
    patches = patches.concat(patchesThree);
    patches = patches.map(function (v) {
        return _.isArray(v) ? v : [v];
    });

    console.info('重复补丁=', JSON.stringify(patches));

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
            if(flag == '^') val = '^' + val;
            if(flag == '$') val = val + '$';
            var reg = new RegExp(val);
            var b = flag != '!';
            var that = this;
            var list = this.list;
            list.forEach(function(item){
                var s = that.find(item, prop);
               //console.log(reg, s);
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
            var args = combModel.count();  console.info('组合条件参数 = ', args);
            var list = [];
            if(!args){
                return alert('组合参数有错误！请检查！');
            }
            args.forEach(function (v) {
                var result = utils.combine(v);
                list.push(result);
                //console.info(JSON.stringify(result));
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

            //console.log('base list is = ', list);
            //组合模式过滤
            list = combModel.filter(list);

            //填充重复补丁
            list = this.patch(list);

            //添加筛选标签及评级权重
            list = ballsModel.filter(list);

            this.list = list;
            brick.broadcast('groupModel.change', list);
            return list;
        }

    };


});