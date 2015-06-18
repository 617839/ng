/**
 * Created by j on 15-6-18.
 */

var fs = require('fs');

module.exports = {

    get: function(req, res){
        var path = '../data/status.json';
        var dobj = require(path);
        res.send(dobj);
    },


    post: function(req, res){

        var path = '../data/status.json';
        var type = req.params.type;
        var dobj = require(path);

        dobj[req.body.type||type] = req.body.data;

        //console.log(req.body);

        fs.writeFileSync(path, JSON.stringify(dobj));
        res.send({code:1});
    },


    del: function(reg, res){

        var path = '../data/status.json';
        var type = req.params.type;
        var dobj = require(path);

        if(type){
            delete dobj[type];
        }else{
            dobj = {};
        }

        fs.writeFileSync(path, JSON.stringify(dobj));
        res.send({code:1});
    }
}