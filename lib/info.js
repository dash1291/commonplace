var fs = require('fs');
var path = require('path');

module.exports.src_dir = function() {
    var cwd = process.cwd();
    var temp;
    if (fs.existsSync(temp = path.resolve(cwd, 'hearth'))) {
        return temp;
    } else {
        return path.resolve(cwd, 'src');
    }
};

module.exports.version = function() {
    var package_json = path.resolve(__dirname, '../package.json');
    return JSON.parse(fs.readFileSync(package_json)).version;
};
