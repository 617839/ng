/**
 * Created by julien.zhang on 2015/1/26.
 */

jQuery.support.cors = true;



$(function(){

    var $body = $('body');

    var $ctrlBox = $('<div style="position:fixed;right:10px;bottom: 50px;"><button role="ctrlLight">light</button></div>').appendTo($body);

    var $light = $('<div style="position: absolute;width:100%;height:21px;background:rgba(0,125,255,.1);pointer-events:none;"></div>').appendTo('body');

    $ctrlBox.on('click','[role=ctrlLight]', function(e){
        lightCall.active = !lightCall.active;
        if(lightCall.active){
            $body.on('mousemove', lightCall);
            $light.show();
        }else{
            $body.off('mousemove', lightCall);
            $light.hide();
        }
    });
    
    function lightCall(e){
        $light.css({top:Math.floor(e.pageY/21)*21+'px'});
    }




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
