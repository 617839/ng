/**
 * Created by j on 15-8-23.
 */

/**
 * define groupModel
 */
brick.services.reg('groupModel', function(){

    var data = NGGLOBAL.countRm.r;
    var last = data[data.length-1];
    var allDown = last.all.slice();
    var uniqueDown = _.uniq(allDown).sort(function(a,b){ return a - b;});

    return {
        //    pool结构： = [
        //        {
        //          name: 0,
        //          numbers: [
        //            {n: 0, selected: true},
        //            {n: 1, selected: true},
        //            {n: 2, selected: false},
        //            {n: 3, selected: true},
        //            {n: 4, selected: false}
        //        ], use: [4, 5]}
        //    ];
        pool:[],
        _rev:function(arr){
            return arr.map(function(v, i){
                return {n: v.n, selected:!v.selected};
            });
        },
        _size: function(){
            var c = {};
            allDown.forEach(function(v, i){
                c[v] = c[v] || [];
                c[v].push(++i);
            });
            var down = uniqueDown.map(function (v, i) {
                return {n:v, selected: c[v].length !== 1};
            });
            this.pool.push({numbers:down,use:[]}, {numbers:this._rev(down),use:[]});
        },
        _clone:function(o){
            try{
                o = JSON.parse( JSON.stringify(o) );
            }catch(e){
                console.error('on statusModel._clone(): ', e);
            }
            return o;
        },
        init: function(){
            this._size();
        },
        get: function(index){
            var o = index != void(0) ? this.pool[index] : this.pool;
            return o && this._clone(o);
        },
        set: function(){

        },
        add: function(){

        },
        count: function(){
            var pool = this.pool;
            return pool.map(function(item, i){
                var numbers = item.numbers.filter(function(v){
                    return v.selected;
                });

                if(!numbers.length) return false;

                return {numbers:numbers, use: item.use};
            });
        }
    };

});

/**
 * define groupCtrl
 */
brick.controllers.reg('groupCtrl', function (scope) {

    var $elm = scope.$elm;

    var groupModel = brick.services.get('groupModel');

    scope.render('group', groupModel.get());

    scope.make = function(e){


    };

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

/**
 * define ic-checkbox
 */
brick.directives.reg('ic-checkbox', {
    selfExec: true,
    once: true,
    fn: function () {
        $(document.body).on('click', '[ic-checkbox]', function (e) {
            var $th = $(this);
            if($th.attr('ic-selected') == 'true'){
                $th.attr('ic-selected', false).removeClass('selected');
            }else{
                $th.attr('ic-selected', true).addClass('selected');
            }
            $th.trigger('ic-checkbox.change');
        });
    }
});