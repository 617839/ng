// npm install iconv-lite

var iconv = require('iconv-lite'),
    fs = require("fs");

fs.readFile('晨昏(辛夷坞).TXT', function(err, data){

    if(err) return console.log(err);

    var str;
    var arr;

    try{
        str = iconv.decode(data, 'gb2312');
    }catch(e){
        str = iconv.decode(data, 'utf8');
    }

    arr = str.split('第二十九章');
    arr = str.match(/正文[.\s\S]+?正文/mg);

    console.log(arr.length);

    for(var i in arr){

        var content = arr[i];

        var title = content.match(/正文.+?$/);

        title = title ? title[0] : content.substr(0,14);

        title = title.replace(/\s*/g,'')  || +new Date;

        console.log(title);

        fs.appendFile(title + '.txt', content, function(err){

            //console.log(err);

        });

    }

    //console.log(str.substr(148,198));

});


