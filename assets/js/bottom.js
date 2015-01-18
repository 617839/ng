/**
 *
 *
 */

(function () {

    var dbApp = angular.module('dbApp', ['ctrls', 'servs']);

    var ctrls = angular.module('ctrls', []);

    var servs = angular.module('servs', []);


    ctrls.controller('marginCtrl', function ($scope) {

        $scope.reds = window.redMargin;

    });


    ctrls.controller('bMarginCtrl', function ($scope) {

        $scope.bMarginList = window.bMargin;

        $scope.bdgs = window.bdgs.slice(window.bdgs.length-32);

    });


    ctrls.controller('bottomCtrl', function ($scope) {

        $scope.vs = function(v) { return v; };

        var r = window.NGGLOBAL;

        $scope.ng = ng.slice(ng.length - r.downMarginRef.length, ng.length);
        $scope.upList = r.upMarginRef;
        $scope.prevList = r.downMarginRef;
        $scope.nextList = r.next;


        //计算位置列表
        var locaList = [];
        for (var arr1, arr2, result, i = 1, len = ng.length; i < len; i++) {

            arr1 = ng[i - 1].red;
            arr2 = ng[i].red;
            result = locaCompare(arr1, arr2);

            locaList.push(result);
        }

        $scope.locaList = locaList;

        console.log(locaList);

    });


})();


