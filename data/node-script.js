/**
 * Created by julien.zhang on 2014/9/9.
 */

var fs = require('fs');

console.log('@@@@@@@@@@@@@@@@@');

fs.writeFileSync('abc.js', 'xx'+new Date+'--');

console.log('..................');