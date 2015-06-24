/**
 * Created by julien.zhang on 2015/2/28.
 */

var path = require('path');

module.exports =  function (req, res) {


    var type = req.params.type || '33';

    var jsPath = path.join(DATA_DIR, type + '/data.js');

    res.sendFile(jsPath);


};