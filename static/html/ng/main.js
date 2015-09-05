/**
 * Created by j on 15-8-23.
 */


brick.controllers.reg('combCtrl', function (scope) {

    var utils = brick.services.get('utils');
    var combModel = brick.services.get('combModel');
    var groupModel = brick.services.get('groupModel');

    var $elm = scope.$elm;

    brick.on('combModel.init', function(e, msg){
        scope.render('comb', msg);
    });

    combModel.init();

    //////////////////////////////////////////////////////

    $elm.find('[name=groupSize]:checkbox').on('change', function(e){
        var groupSize = $elm.find('[name=groupSize]:checked').map(function(){
            return this.value * 1;
        }).get();
        combModel.groupSize(groupSize);
    });

    $elm.on('ic-checkbox.change', function (e, msg) {
        var k = msg.name;
        var v = [];
        var call = /use$/img.test(k) ? function () {
            if (this.hasAttribute('selected')) {
                v.push(this.getAttribute('ic-val'));
            }
        } : function (i) {
            var selected = this.hasAttribute('selected');
            v.push({n: this.getAttribute('ic-val'), selected: selected});
        };
        $elm.find('[ic-checkbox=?]'.replace('?', k)).each(call);
        combModel.set(k, v);
    });

    scope.make = function (e) {
        groupModel.combine();
    };

    scope.cache = function(e){
        combModel.cache(true);
    };

    scope.apply = function(e){
        combModel.cache();
    }

});


brick.controllers.reg('groupCtrl', function(scope){

    var ballsModel = brick.services.get('ballsModel');
    var groupModel = brick.services.get('groupModel');

    var $elm = scope.$elm;
    var $balls = $elm.find('#balls');
    var $info = $elm.find('[role=info]');

    brick.on('groupModel.change', function(e, msg){
        msg && scope.render('list', msg);
        var selectList = groupModel.selectList();
        $info.text(msg.length + ' # '+ selectList.length);
        $elm.show();
    });

    scope.invert = function(e){
        groupModel.invert();
    };

    scope.reselect = function(e){
        groupModel.reselect();
    };

    scope.toggleSizerBox = function(e){
        var $th = $(this);
        var selected = $th.closest('li[ic-checkbox]').hasClass('selected');
        $(this).next().toggle().find('[name=pattern]').prop('checked', selected);
    };

    scope.select = function(e){
        var $th = $(this);
        var $box = $th.closest('[role=sizerBox]').hide();
        var prop = $th.data('prop');
        var val = $th.prev('input').val();
        var reg = $box.find('input[name="reg"]:checked').val();
        var pattern = $box.find('input[name="pattern"]').prop('checked');
        groupModel.select(prop, val, reg, pattern);
    };

    scope.allComb = function(e){
        if($balls.is(':visible')){
            return $balls.hide();
        }
        var list = groupModel.groupList();
        console.log(list);
        var ballList = ballsModel.combine(list);
        var str = '';
        for(var i = 0; i < ballList.length; i++){
            str += (ballList[i].redBall + '').replace(/,/g,'  ') + '<br>';
        }
        $balls.empty().toggle().html(str);
        $(this).find('i').text(ballList.length);
    };

    scope.setCombPatch = function(e){

        var str = prompt('allCombPatch is ' + getAllCombPatch() + '; reset. \r\n example:0 1,0 0 or 0,1,3');

        if(!str) return alert('not set.');

        str = str.trim();

        var arr = str.split(/\s+/img);

        arr.forEach(function(v, i, list){
            var a =  v.split('');
            for(var j in a) a[j] = a[j] * 1;
            list[i] = a;
        });

        window.allCombPatch = arr;

        str = JSON.stringify(arr);

        console.log('allCombPatch is =>', str);

        var data = getUrlParam('data') || 33;

        localStorage[ 'allCombPatch' + data ] = str;

    };

    scope.countMoney = function(e){

        var input = prompt(' 开奖结果是: ' + getCurrentLottey() +  ';reset,\r\n example: 4 9 10 24 27 33:9');

        if(input){
            var arr = input.split(':');
            var blue = arr[1];
            var red = arr[0].split(/\s+/img);
            var dob = {red:red, blue: blue};
            localStorage.setItem('currentLottey', JSON.stringify(dob));
        }else{
            dob = getCurrentLottey();
        }

        var result = countMoney(ballsModel.get(), dob);

        result.list.sort(function(a, b){
            return a.money - b.money;
        });

        $(this).find('i').text(result.money);

        console.log(JSON.stringify(result.list).replace(/},\{/img, '},\r\n{'));

        console.log('all money is ' + result.money + '; list length is ' + result.list.length);

    };

});

brick.controllers.reg('ballCtrl', function(scope){

});

brick.directives.reg('ic-toggle', {
    selfExec: true,
    once: true,
    fn: function () {
        $(document.body).on('click', '[ic-toggle]', function (e) {
            var name = $(this).attr('ic-toggle');
            $('[ic-toggle-target=?]'.replace('?', name)).toggle();
        });
    }
});

brick.directives.reg('ic-close', {
    selfExec: true,
    once: true,
    fn: function () {
        $(document.body).on('click', '[ic-close]', function (e) {
            var $th = $(this);
            $th.closest('[ic-close-target]').toggle();
        });
    }
});

brick.directives.reg('ic-checkbox', {
    selfExec: true,
    once: true,
    fn: function () {
        $(document.body).on('click', '[ic-checkbox]', function (e) {
            if(this !== e.target) return;
            var $th = $(this);
            if (this.hasAttribute('selected')) {
                $th.removeAttr('selected').removeClass('selected');
            } else {
                $th.attr('selected', true).addClass('selected');
            }
            $th.trigger('ic-checkbox.change', {name: $th.attr('ic-checkbox')});
        });
    }
});

brick.directives.reg('ic-dom-clone', {
    selfExec: true,
    once: true,
    fn: function () {
        $(document.body).on('click', '[ic-dom-clone]', function (e) {
            var $th = $(this);
            $th.prev('[ic-dom]').clone(true).insertBefore($th);
        });
    }
});

brick.directives.reg('ic-dom-remove', {
    selfExec: true,
    once: true,
    fn: function () {
        $(document.body).on('click', '[ic-dom-remove]', function (e) {
            var nextAll = $(this).nextAll('[ic-dom]');
            nextAll.length > 1 && nextAll.eq(nextAll.length - 1).remove();
        });
    }
});

