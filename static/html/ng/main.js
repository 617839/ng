/**
 * Created by j on 15-8-23.
 */


brick.controllers.reg('groupCtrl', function (scope) {

    var groupModel = brick.services.get('groupModel');
    var utils = brick.services.get('utils');

    var $elm = scope.$elm;

    brick.on('groupModel.init', function(e, msg){
        scope.render('group', msg);
    });

    groupModel.init();

    //////////////////////////////////////////////////////

    $elm.find('[name=groupSize]:checkbox').on('change', function(e){
        var groupSize = $elm.find('[name=groupSize]:checked').map(function(){
            return this.value * 1;
        }).get();
        groupModel.groupSize(groupSize);
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
        groupModel.set(k, v);
    });

    scope.make = function (e) {
        groupModel.combine();
    };

    scope.cache = function(e){
        groupModel.cache(true);
    };

    scope.apply = function(e){
        groupModel.cache();
    }

});

/**
 * define combineCtrl
 */
brick.controllers.reg('combineCtrl', function(scope){

    var xModel = brick.services.get('xModel');
    var groupModel = brick.services.get('groupModel');

    var $elm = scope.$elm;

    brick.on('groupModel.combine.change', function(e, msg){
        msg && scope.render('list', msg);
        $elm.show();
    });

    scope.allComb = function(e){
        var list = groupModel.groupList();
        console.log(list);
        var ballList = xModel.combine(list);
        console.table(ballList);
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

        var result = countMoney(window.currentCombList, dob);

        result.list.sort(function(a, b){
            return a.money - b.money;
        });

        $(this).find('sup').text(result.money);

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
            /*var name = $th.attr('ic-close');
            var action = $th.attr('ic-close-action');
            var $placeholder;
            if(!name){
                name = 'ic-id-'+(+new Date);
                $th.attr('ic-close', name);
                $placeholder = $('<a style="display: none!important;" ic-close-placeholder="?"></a>'.replace('?', name)).insertAfter($th);
            }
            if(action != 'open'){
                $th.closest('[ic-close-target]').hide();
                $th.attr('ic-close-action', 'open').text('open');
                $th.appendTo(document.body);
            }else{
                $placeholder = $('a[ic-close-placeholder=?]'.replace('?', name));
                $th.insertBefore($placeholder);
                $th.closest('[ic-close-target]').show();
                $th.attr('ic-close-action', 'close').text('close');
            }*/

        });
    }
});

/**
 * define ic-checkbox
 */
brick.directives.reg('ic-checkbox', {
    selfExec: true,
    once: true,
    fn: function () {
        $(document.body).on('click', '[ic-checkbox]', function (e) {
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
 * define ic-dom-clone
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
 * define ic-dom-rmove
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

