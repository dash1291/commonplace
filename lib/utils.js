var fs = require('fs');
var path = require('path');

module.exports.opts = function(opts, defaults) {
    var out = defaults || {},
        last, i, is_flag;
    for(i = 0; i < opts.length; i++) {
        is_flag = opts[i].substr(0, 1) === '-';
        if (is_flag && last) {
            out[last] = true;
        } else if (!is_flag && last) {
            out[last] = opts[i];
        }
        last = is_flag ? opts[i].replace(/^\-+/, '') : null;
    }
    if (last) {out[last] = true;}
    return out;
};

module.exports.glob = function(path_, ext, done) {
    var results = [];
    var wildcard = ext === '*';

    fs.readdir(path_, function(err, list) {
        if (err) return done(err);
        var pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(function(file) {
            file = path_ + '/' + file;
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    module.exports.glob(file, ext, function(err, res) {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    // If it's got the right extension, add it to the list.
                    if(wildcard || file.substr(file.length - ext.length) == ext)
                        results.push(path.normalize(file));
                    if (!--pending) done(null, results);
                }
            });
        });
    });
};

module.exports.globSync = function(path_, ext, done) {
    var results = [];
    var list = fs.readdirSync(path_);
    var pending = list.length;
    var wildcard = ext === '*';

    if (!pending) return done(null, results);
    list.forEach(function(file) {
        file = path_ + '/' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            module.exports.globSync(file, ext, function(err, res) {
                results = results.concat(res);
                if (!--pending) done(null, results);
            });
        } else {
            // If it's got the right extension, add it to the list.
            if(wildcard || file.substr(file.length - ext.length) == ext)
                results.push(path.normalize(file));
            if (!--pending) done(null, results);
        }
    });
};

module.exports.copyDir = function(src, dest) {
    // `dest` is expected to be the path to a directory.
    // `src` is expected to be the path to a directory.

    if (!fs.existsSync(src)) {
        console.error('Source directory "' + src + '" doesn\'t exist.');
        return;
    }
    function mkdirRecursive(dir) {
        var parent = path.resolve(dir, '../');
        if (!fs.existsSync(parent)) {
            mkdirRecursive(parent);
        }
        fs.mkdirSync(dir);
    }
    if (!fs.existsSync(dest)) {
        mkdirRecursive(dest);
    }

    if (src.substr(src.length - 1) !== '/') {
        src += '/';
    }

    if (dest.substr(dest.length - 1) !== '/') {
        dest += '/';
    }

    var files_copied = 0;

    utils.globSync(src, '*', function(err, files) {
        files.forEach(function(file) {
            var interim_path = file.substr(src.length);
            var dest_file = dest + interim_path;

            var dir = path.dirname(dest_file);
            if (!fs.existsSync(dir)) {
                console.log(dir);
                mkdirRecursive(dir);
            }
            files_copied++;
            fs.readFile(file, function(err, data) {
                if (err) {return;}
                fs.writeFile(dest_file, data, function(err) {
                    if (err) {
                        console.warn('Error copying ' + interim_path, err);
                    }
                });
            });
        });
    });

    return files_copied;
};

module.exports.removeFile = function(path, callback, silent) {
    fs.exists(path, function(exists) {
        if (!exists) {
            if (!silent) {
                console.warn('Cannot remove non-existing file: ' + path);
            }
            return;
        }

        fs.unlink(path, function(err) {
            if (!silent) {
                if (err) {
                    console.warn('Unable to delete file: ' + path, err);
                }
            }
            if (callback) callback(err);
        });
    });
};


module.exports.rmdirRecursive = function(path_, callback) {
    function rmdir(done) {
        fs.readdir(path_, function(err, list) {
            if (err) return done(err);
            var pending = list.length;
            if (!pending) return done(null);
            list.forEach(function(file) {
                file = path.resolve(path_, file);
                fs.stat(file, function(err, stat) {
                    if (stat && stat.isDirectory()) {
                        module.exports.rmdirRecursive(file, function() {
                            if (!--pending) done(null);
                        });
                    } else {
                        fs.unlink(file, function() {
                            if (!--pending) done(null);
                        });
                    }
                });
            });
        });
    }
    fs.exists(path_, function(exists) {
        if (!exists) {
            console.warn('Specified path does not exist: ' + path_);
            return;
        }
        rmdir(function(err) {
            if (err) return;
            fs.rmdir(path_, callback);
        });
    });
};

module.exports.rmdirRecursiveSync = function(path) {
    // Recursive directory deletion.
    if (!fs.existsSync(path)) {
        console.warn('Specified path does not exist: ' + path);
        return;
    }
    var list = fs.readdirSync(path);
    list.forEach(function(file) {
        file = path + '/' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            rmdir(file);
        } else {
            fs.unlinkSync(file);
        }
    });
    fs.rmdir(path);
    console.log('Removed: ' + path);
};
