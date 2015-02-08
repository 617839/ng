/**
 * Created by julien.zhang on 2015/1/26.
 */

jQuery.support.cors = true;



$(function(){


    $('body').on('dblclick', function(e) {

        if(this.tagName == 'BODY'){

            var x = e.pageX;
            var y = e.pageY;

            x = Math.floor(x/41)*41+'px';
            y = Math.floor(y/21)*21+'px';

            console.log(x,y)

            $('<input type="text" class="input-x">').appendTo('body').css({left:x, top:y}).focus();

            return false;

        }



    });


});
