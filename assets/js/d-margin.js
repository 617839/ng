/**
 * Created by j on 15-6-10.
 */


(function () {

    var dbApp = angular.module('dbApp', ['ctrls', 'servs']);

    var ctrls = angular.module('ctrls', []);

    var servs = angular.module('servs', []);


    ctrls.controller('cdmCtrl', function ($scope) {

        $scope.vs = function(v) { return v; };



        $scope.active = function(select){

            var dob = select && NGGLOBAL[select] || NGGLOBAL.countRm.r;

            for(var j in dob){
                dob[j].all = _.uniq(dob[j].all);
                dob[j].active = _.uniq(dob[j].active);
            }

            $scope.cdm = dob;

            $scope.activeIndex = select || 'countRm';

        };

        $scope.activeIndex = 'countRm';


        //////////////////////////////////////////////////


        $scope.active();


    });



    ctrls.controller('m2dCtrl', function($scope){



        var sm = NGGLOBAL.countSm[countSm.length-1].all.slice();

        var cache = {};

        _.forEach(sm, function(v, i, list){

            for(var j = 1; j < colMap.length; j++){

                if( i === (j+'').replace(/\d*(?=\d)/,'') * 1 ){

                    cache[v] = cache[v] || [];

                    cache[v].push(colMap[j][2]);

                }

            }

        });


        console.log(cache);


    });




})();





