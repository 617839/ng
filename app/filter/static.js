/**
 * 处理静态视图
 * Created by julien.zhang on 2015/2/27.
 */

var fs = require('fs');
var path = require('path');

module.exports = function (req, res, next) {

    var _path = req.path.toLowerCase().replace(/^\//, '');

    var file = path.join(STATIC_DIR,  _path + '.html');

    console.log('path: ', _path);
    console.log('fire: ', file);

    if (fs.existsSync(file)) {
        return res.sendFile(file);
    }

    //没有对应静态视图
    next();

};