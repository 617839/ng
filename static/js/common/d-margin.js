/**
 * Created by j on 15-6-10.
 */


(function () {

    var dbApp = angular.module('dbApp', ['ctrls', 'servs', 'dires']);

    var ctrls = angular.module('ctrls', []);

    var servs = angular.module('servs', []);

    var dires = angular.module('dires', []);

    dires.directive('vs', function(){
        return function(v){
            return v;
        };
    });


    ctrls.controller('cdmCtrl', function ($scope) {

        $scope.vs = function(v) { return v; };

        $scope.active = function(select){

            var dob = select && NGGLOBAL[select] || NGGLOBAL.countRm.r;
            var all;
            var prev;

            for(var j = 0,len=dob.length; j<len; j++){
                all = dob[j].all = _.uniq(dob[j].all);
                dob[j].active = _.uniq(dob[j].active);
                dob[j].change = Math.abs(all.length - prev - 1);
                prev = all.length;
            }

            $scope.cdm = dob;

            $scope.activeIndex = select || 'countRm';

        };

        $scope.activeIndex = 'countRm';


        //////////////////////////////////////////////////


        $scope.active();


    });



    //统计
    ctrls.controller('countCtrl', function($scope){

        $scope.vs = function(v) { return v; };

        var downRef = $scope.downRef = NGGLOBAL.downMarginRef;

        var upRef = $scope.upRef = NGGLOBAL.upMarginRef;

        var sdRef = $scope.sdRef = NGGLOBAL.singleDigitRef.shift() && NGGLOBAL.singleDigitRef;

        var countDm = $scope.countDm = NGGLOBAL.countDm;

        var countUm = $scope.countUm = NGGLOBAL.countUm;

        var countSm = $scope.countSm = NGGLOBAL.countSm.shift() && NGGLOBAL.countSm;







        $scope.xx = function(){

            var map = ['downRef', 'upRef', 'sdRef'];

            var f = function(item){
                return [_.uniq(item).length];
            }


            $scope.downRef = downRef.map(f);
            $scope.upRef = upRef.map(f);
            $scope.sdRef = sdRef.map(f);

        };


        $scope.xx();




    });






})();





