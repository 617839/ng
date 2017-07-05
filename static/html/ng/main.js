/**
 * Created by j on 15-8-23.
 */

function cc(obj,prefix){
    var prefix = prefix || '';
    if(typeof obj == 'object'){
        console.log(prefix +  ' = ' + JSON.stringify(obj) + ';');
    }else{
        console.log(prefix + ' : ' + obj);
    }
}

/**
 * 组合方案控制器
 * 用于定制组合方案
 * 比如组合的长度是4？5？ 6？
 *
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
    };

    /**
     * 设置重复补丁，重0，重1， 重2 ...
     * @param e
     * @returns {*}
     */
    scope.setCombPatch = function(e){

        var str = prompt('allCombPatch is ' + getAllCombPatch() + '; reset. \r\n example:0 1,0 0 or 0,1,3');

        if(!str) return alert('not set.');

        str = str.trim();

        var arr = str.split(/\s+/img);

        arr.forEach(function(v, i, list){
            var a =  v.split(/\D+/img);
            for(var j in a) a[j] = a[j] * 1;
            list[i] = a;
        });

        window.allCombPatch = arr;

        str = JSON.stringify(arr);

        console.log('allCombPatch is =>', str);

        var data = getUrlParam('data') || 33;

        localStorage[ 'allCombPatch' + data ] = str;

    };

});

/**
 * 组合列表控制器
 */
brick.controllers.reg('groupCtrl', function(scope){

    var ballsModel = brick.services.get('ballsModel');
    var groupModel = brick.services.get('groupModel');

    var $elm = scope.$elm;
    var $balls = $elm.find('#balls');
    var $info = $elm.find('[role=info]');

    var sizerTpl = brick.getTpl('sizer');

    brick.on('groupModel.change', function(e, msg){
        msg && scope.render('list', msg);
        var selectList = groupModel.selectList();
        $info.text(msg.length + ' # '+ selectList.length);
        $elm.show();
    });

    //反转选择
    scope.invert = function(e){
        groupModel.invert();
    };

    //清除当前选择
    scope.reselect = function(e){
        groupModel.reselect();
    };

    //
    scope.toggleSizerBox = function(e){
        var $th = $(this);
        var selected = $th.closest('li[ic-checkbox]').hasClass('selected');
        var $sizerBox = $th.next('[role=sizerBox]');
        var model = {
            code: $th.data('code'),
            prop: $th.data('property'),
            value: $th.data('value'),
            selected:selected
        };
        if($sizerBox.length){
            $sizerBox.remove();
        }else{
            $th.after( sizerTpl({model: model}));
        }
        //$(this).next().toggle().find('[name=pattern]').prop('checked', selected);
    };

    //对组合项进行筛选
    scope.select = function(e){
        var $th = $(this);
        var $box = $th.closest('[role=sizerBox]').hide();
        var prop = $th.data('prop');
        var val = $th.prev('input').val();
        var reg = $box.find('input[name="reg"]:checked').val();
        var pattern = $box.find('input[name="pattern"]').prop('checked');
        groupModel.select(prop, val, reg, pattern);
    };

    /**
     * 根据编组模式生成最终的彩票号码。
     * @param e
     * @returns {*}
     */
    scope.allComb = function(e){

        if($balls.is(':visible')){
            return $balls.hide();
        }

        var list = groupModel.groupList();

        var ballList = ballsModel.combine(list);

        var str = '';

        for(var i = 0; i < ballList.length; i++){
            str += ballList[i].red .join(' ') + ' : ' + ballList[i].blue + '<br>';
        }

        $balls.empty().toggle().html(str);
        $(this).find('i').text(dFormat(ballList.length));
    };

    /**
     * 设置开奖结果，计算奖金
     * @param e
     */
    scope.countMoney = function(e){

        var lottey = getCurrentLottey();
        var input = prompt(' 开奖结果是: ' + lottey.red.join(' ') + ':' + lottey.blue +  '; 重新设置\r\n example: 4 9 10 24 27 33:9\r\n4 9 10 24 27 33 9');

        if(input){
            var arr = input.split(/\D+/img);
            var blue = arr.pop();
            var red = arr; //[0].split(/\s+/img);
            var dob = {red:red, blue: blue};
            localStorage.setItem('currentLottey', JSON.stringify(dob));
        }else{
            dob = getCurrentLottey();
        }

        var result = countMoney(ballsModel.get(), dob);

        result.list.sort(function(a, b){
            return a.money - b.money;
        });

        $(this).find('i').text(dFormat(result.money));

        console.log(JSON.stringify(result.list).replace(/},\{/img, '},\r\n{'));

        console.log('all money is ' + result.money + '; list length is ' + result.list.length);

    };

    function dFormat(d){
        return (d+'').replace(/(\d)(?=(\d\d\d)+(?!\d))/g,'$1,');
    }

});

/**
 * 红蓝球号码控制器
 * 显示所有可用的红球和篮球并能够对其过滤，默认全部可用
 * 比如双色球33个篮球，16个红球默认都可用于生成最后的彩票号码方案。
 * 可以过滤掉比如篮球15，那么篮球15就不会出现在最终的彩票号码方案中。
 */
brick.controllers.reg('allBallsCtrl', function(scope){

    var ballsModel = brick.services.get('ballsModel');
    var allBalls = ballsModel.getAllBalls();

    var $elm = scope.$elm;

    scope.render('allBalls', allBalls);

    $elm.on('ic-checkbox.change', function (e, msg) {
        var keys = msg.name.split('-');
        var redOrBlue = keys[0];
        var index = keys[1];
        allBalls[redOrBlue][index].usable = e.target.hasAttribute('selected') ? 1 : 0;
        ballsModel.setAllBalls(allBalls);
    });


});


//////////////////////////////-----------指令相关-----------/////////////////////////////////////////////////////////////

/**
 * 定义ic-toggle指令;
 */
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

/**
 * 定义ic-close指令;
 */
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

/**
 * 定义ic-checkbox指令;
 */
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

/**
 * 定义ic-dom-clone指令;
 */
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

/**
 * 定义ic-dom-remove指令;
 */
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

