/**
 * Created by j on 15-8-16.
 */

//filter for group by down
//标准: 0开头， 第二位 in [1,2,3,4], same in [0,1,2,3],  length >= 4, 非全奇或全欧，重延比例 >= 3/5,  重延伸分布overlap != 1, 两位数比例 < 2/5
//original + unique & sort + 重延伸分布 + length + same + 全奇或全偶 + 两位数比例 + 横向重延比例 + 与标准比对结果

function filterForGroupByDown(arr, n) {

    var prevDown = downMarginRef.slice(downMarginRef.length - 3);

    var pass = window.passGroupByDownList = [];
    var noPass = window.noPassGroupByDownList = [];

    var result = [];

    arr.forEach(function (currentDown) {

        prevDown.push(currentDown);
        var list = groupRefListModel(prevDown);

        tagGroupByDown(list);

        prevDown.pop();

        var model = list.pop();
        var x = 0;

        var _noPass = _.filter(model.tags, function (v) {
            if (!v.pass) x += v.weight;
            return !v.pass;
        });

        model.noPass = _noPass;
        model.x = x;

        if (_noPass.length > (localStorage.passRef || 0)) {
            noPass.push(model);
        } else {
            pass.push(model);
            result.push(currentDown);
        }
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

