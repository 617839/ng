/**
 * Created by j on 15-8-23.
 */

brick.controllers.reg('ngCtrl', function (scope) {

    var $elm = scope.$elm;

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
            if($th.attr('ic-checked')){
                $th.removeAttr('ic-checked').removeClass('checked');
            }else{
                $th.attr('ic-checked', true).addClass('checked');
            }
            $th.trigger('ic-checkbox.change');
        });
    }
});