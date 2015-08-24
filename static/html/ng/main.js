/**
 * Created by j on 15-8-23.
 */

brick.services.reg('groupModel', function(){

    var data = NGGLOBAL.countRm.r;
    var last = data[data.length-1];
    var allDown = last.all.slice();
    var uniqueDown = _.uniq(allDown).sort(function(a,b){ return a - b;});;

    return {
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
            this.pool.push(down, this._rev(down));
        },
        get : function(){
            this._size();
            return this.pool;
        }
    };

});

brick.controllers.reg('groupCtrl', function (scope) {

    var $elm = scope.$elm;

    var groupModel = brick.services.get('groupModel');

    scope.render('group', groupModel.get());




    scope.make = function(e){


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