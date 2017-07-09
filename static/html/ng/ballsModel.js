/**
 * Created by j on 15-8-30.
 */

brick.services.reg('ballsModel', function () {

    var exports = {};

    /**
     * 彩票类型 33选6 15选5
     * @type {number}
     */
    exports.type = 33;

    /**
     * 获取号码列表
     * @returns {*|exports.list}
     */
    exports.get = function () {
        return this.list;
    };

    /**
     *
     */
    exports.filter = function(){


    };

    /**
     * 根据编组模式列表生成彩票号码列表
     * @param groupList
     * @returns {Array}
     */
    exports.combine = function (groupList) {
        var numList = [];
        _.forEach(groupList, function (v, i, list) {
            var q;
            try {
                q = combineWrap(window.classifyByDownMargin, v);
            } catch (e) {
                console.error(e);
            }
            //q = filterByRef(q, window.filterByRefArr);
            //q = redBlueBallModel(q);
            //numList.push(q);
            numList = numList.concat(q || []);
        });

        //numList = _.flatten(numList);

        numList = numList.map(function (item) {
            return item.sort(function (a, b) {
                return a - b
            });
        });

        this.list = this.addBlueBallForRedBall(numList, false);
        return this.list;
    };

    /**
     * 为每注号码添加篮球号码
     * @param list 没有添加篮球之前的红球号码列表
     * @param isUseAllBlueBalls Bool 是否为每组红球号码添加所有的篮球，红球号码会重复翻倍，默认为每组红球按序添加一个篮球
     */
    exports.addBlueBallForRedBall = function (list, isUseAllBlueBalls) {
        var result = [];
        //获取所有可用的篮球
        var blueBalls = this.getAllBalls().blueBalls;
        var _blueBalls = []; //[1, 5, 16]
        blueBalls.forEach(function (item) {
            item.usable && _blueBalls.push(item.number);
        });
        if (isUseAllBlueBalls) {
            _blueBalls.forEach(function (value) {
                list.forEach(function (item) {
                    result.push({red: item, blue: value});
                });
            });
            return result;
        } else {
            return list.map(function (item) {
                var blue = _blueBalls.shift();
                _blueBalls.push(blue);
                return {red: item, blue: blue};
            });
        }
    };


    /**
     * 获取所有投注的号码球,默认每个号码球都可用。
     * @param type （33选6、15选5等等，默认33）
     */
    exports.getAllBalls = function (type) {
        var red = this.type = type || this.type;
        var map = {'33': '16', '15': '0'};
        var blue = map[red];
        var redBalls = [];
        var blueBalls = [];
        var key = 'allBalls-' + red;
        //首先尝试从localStore中获取，没有则重新生成
        var allBalls = localStorage.getItem(key);
        if (allBalls) {
            return JSON.parse(allBalls);
        }
        for (var i = 1; i <= red; i++) {
            redBalls.push({number: i, usable: 1});
        }
        for (i = 1; i <= blue; i++) {
            blueBalls.push({number: i, usable: 1});
        }
        allBalls = {redBalls: redBalls, blueBalls: blueBalls};
        localStorage.setItem(key, JSON.stringify(allBalls));
        return allBalls;
    };

    /**
     * 根据过滤结果更新选球号码
     * @param allBalls
     */
    exports.setAllBalls = function (allBalls) {
        localStorage.setItem('allBalls-' + this.type, JSON.stringify(allBalls));
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //对外接口
    return exports;

});