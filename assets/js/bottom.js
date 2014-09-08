/**
 *
 *
 */

(function () {

    var dbApp = angular.module('dbApp', ['ngRoute', 'ctrls', 'servs']);

    var ctrls = angular.module('ctrls', []);

    var servs = angular.module('servs', []);


    ctrls.controller('marginCtrl', function ($scope) {

        $scope.reds = window.redMargin;

    });


    ctrls.controller('bMarginCtrl', function ($scope) {

        $scope.bMarginList = window.bMargin;

        $scope.bdgs = window.bdgs.slice(window.bdgs.length-40);

    });


    ctrls.controller('bottomCtrl', function ($scope) {

        $scope.vs = function(v) { return v; };

        var r = window.NGGLOBAL;

        $scope.ng = ng.slice(ng.length - r.downMarginRef.length, ng.length);
        $scope.upList = r.upMarginRef;
        $scope.prevList = r.downMarginRef;
        $scope.nextList = r.next;

    });


})();


