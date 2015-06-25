/**
 * Created by j on 15-6-24.
 */


;(function getData(){

    function getUrlParam(param){
        var reg = new RegExp("(^|&)" + param + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
            return decodeURIComponent(r[2]);
        return null;
    }


    var type = getUrlParam('data');

    var time = +(new Date);

    var url = 'http://localhost:2017/data' + ( type ? '/' + type : '') + '?time=' + time;

    document.write('<script src="?"></script>'.replace('?', url));

})();