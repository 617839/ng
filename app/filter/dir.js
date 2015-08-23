/**
 * Created by j on 15-8-23.
 */
var args = process.argv.join('|');
var port = /\-\-port\|(\d+)(?:\||$)/.test(args) ? ~~RegExp.$1 : 2017;
var path = require('path');
var DOCUMENT_ROOT = path.resolve(/\-\-root\|(.*?)(?:\||$)/.test(args) ? RegExp.$1 : process.cwd());
var url = require('url');
var fs = require('fs');

module.exports = function(req, res, next) {
    var pathname = url.parse(req.url).pathname;
    var fullpath = path.join(DOCUMENT_ROOT, pathname);

    if (/\/$/.test(pathname) && fs.existsSync(fullpath)) {
        var stat = fs.statSync(fullpath);

        if (stat.isDirectory()) {
            var html = '';

            var files = fs.readdirSync(fullpath);

            html = '<!doctype html>';
            html += '<html>';
            html += '<head>';
            html += '<title>' + pathname + '</title>';
            html += '</head>';
            html += '<body>';
            html += '<h1> - ' + pathname + '</h1>';
            html += '<div id="file-list">';
            html += '<ul>';

            if(pathname != '/'){
                html += '<li><a href="' + pathname + '..">..</a></li>';
            }

            files.forEach(function(item) {
                var s_url = path.join(pathname, item);
                html += '<li><a href="' + s_url + '">'+ item + '</a></li>';
            });

            html += '</ul>';
            html += '</div>';
            html += '</body>';
            html += '</html>';

            res.send(html);
            return;
        }
    }

    next();
};