/**
 * Created by j on 15-8-30.
 */

brick.services.reg('ballsModel', function () {


    var exports = {};

    //filter for group by down
//标准: 0开头， 第二位 in [1,2,3,4], same in [0,1,2,3],  length >= 4, 非全奇或全欧，重延比例 >= 3/5,  重延伸分布overlap != 1, 两位数比例 < 2/5
//original + unique & sort + 重延伸分布 + length + same + 全奇或全偶 + 两位数比例 + 横向重延比例 + 与标准比对结果

    function filterForGroupByDown(arr) {

        var prevDown = downMarginRef.slice(downMarginRef.length - 3);

        var result = [];

        arr.forEach(function (currentDown) {

            prevDown.push(currentDown);
            var list = groupRefListModel(prevDown);

            tagGroupByDown(list);

            prevDown.pop();

            var model = list.pop();
            var x=0;

            var _noPass = _.filter(model.tags, function (v) {
                if(!v.pass) x += v.weight;
                return !v.pass;
            });

            model.noPass = _noPass;
            model.x = x;

            result.push(model);

        });

        return result;

    }

//
    function tagGroupByDown(list) {

        list.reduce(function (prev, current, index, list) {

            current.tags = [];

            _.forEach(_filtersForGroupByDown, function (filter) {

                filter.handle(current, prev);

            });

            return current;
        });

        return list;

    }


///////////////////////////////////////////////////////

    exports.filter = filterForGroupByDown;

    exports.get = function(){
        return this.list;
        //this.list.map(function(item){
        //    var red = item.redBall.slice();
        //    var blue = red.pop();
        //    blue = blue.replace(/^\:/img, '');
        //    return {red:red,blue:blue};
        //});
    };

    exports.combine = function (groupList) {
        var numList = [];

        _.forEach(groupList, function (v, i, list) {
            var q;
            try {
                q = combineWrap(window.classifyByDownMargin, v);
            } catch (e) {
                console.log(1, e)
            }

            //q = filterByRef(q, window.filterByRefArr);
            //q = redBlueBallModel(q);
            numList = numList.concat(q || []);
            //numList.push(q);
        });

        //numList = _.flatten(numList);


        numList = numList.map(function (item) {
            //console.log(item);
            item.sort(function(a, b){ return a-b});
            // 顺序提取篮球
            var blue = blues.shift();
            blues.push(blue);
            return {red: item, blue: blue};
        });

        console.log(numList);
        console.log('all comb length is %s', numList.length);

        //var str = '';
        //
        //for (var i = 0; i < numList.length; i++) {
        //    str += (numList[i].redBall + '').replace(/,/g, '  ') + '<br>';
        //}
        //
        //console.log(str);

        this.list = numList;

        return numList;

    };


    return exports;


});