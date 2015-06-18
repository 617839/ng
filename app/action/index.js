/**
 * Created by julien.zhang on 2015/2/27.
 */


module.exports = function (req, res) {

    res.render('index/index.html', {name: req.session.id});

};