var fs = require('fs');
var path = require('path');

var info = require('./info');
var utils = require('./utils');

var check_version = info.check_version;


function install() {
    var commonplace_src = path.resolve(__dirname, '../src');
    var local_src = path.resolve(process.cwd(), info.src_dir());
    console.log('Installing Commonplace...');
    console.log('Source:       ' + commonplace_src);
    console.log('Destination:  ' + local_src);

    check_version(
        local_src,
        function() {  // Same
            console.warn('Existing commonplace installation found. Overwriting.');
        },
        function() {  // Different
            console.error('Commonplace installation already exists from different version.');
            console.error('You must delete or update the existing installation.');
            console.error('Installation aborted.');
            process.exit(1);
        }
    );

    var files_copied = utils.copyDir(commonplace_src, local_src);
    console.log('Copied ' + files_copied + ' files.');

    // Write a commonplace manifest.
    fs.writeFile(
        path.resolve(local_src, '.commonplace'),
        JSON.stringify({version: info.version()}),
        function(err) {
            if (err) {console.error('Error creating commonplace manifest.', err);}
        }
    );

    console.log('Initializing distributable files...');
    utils.globEach(local_src, '.dist', function(file) {
        var non_dist = file.substr(0, file.length - 5);
        if (fs.existsSync(non_dist)) {
            console.warn('Distributable file exists: ' + non_dist);
            return;
        }
        fs.readFile(file, function(err, data) {
            fs.writeFile(non_dist, data, function(err) {
                if (err) {
                    console.warn('Error initializing ' + file, err);
                }
            });
        });
    }, function(err) {
        console.log('Done.');
    });
}

function update() {
    var opts = utils.opts(process.argv.slice(2));

    if (opts.npm) {
        var spawn = require('child_process').spawn;
        console.log('Starting `npm update`...');
        var npm_update = spawn('npm', ['update', '-g', 'commonplace']);

        function writer(stream) {
            var new_line = true;
            return function(data) {
                if (data[0] == '\n') {
                    new_line = true;
                }
                if (new_line) {
                    process.stdout.write('[npm] ');
                    new_line = false;
                }
                process.stdout.write(data);
                if (data[data.length - 1] == '\n') {
                    new_line = true;
                }
            };
        }

        npm_update.stdout.on('data', writer(process.stdout));
        npm_update.stderr.on('data', writer(process.stderr));

        npm_update.on('close', function(code) {
            if (code !== 0) {
                console.error('`npm update` failed with non-zero exit code');
                return;
            }
            console.log('`npm update` complete.');

            console.log('Bootstrapping commonplace update...');

            var updater = spawn('commonplace', ['update']);
            updater.stdout.on('data', process.stdout.write);
            updater.stderr.on('data', process.stderr.write);

            updater.on('close', function(code) {
                if (code) {
                    console.error('Error updating commonplace');
                } else {
                    console.log('Bootstrapped commonplace update successful!');
                }
            });
        });

        return;
    }

    var commonplace_src = path.resolve(__dirname, '../src');
    var local_src = path.resolve(process.cwd(), info.src_dir());

    check_version(
        local_src,
        function() {  // Same
            console.warn('Commonplace installation up-to-date.');
            process.exit();
        },
        function(local_version, current_version) {  // Different
            console.log('Updating from ' + local_version + ' to ' + current_version);
        },
        function() {  // Neither
            console.error('No commonplace installation found.');
            process.exit(1);
        }
    );

    function update_file(file) {
        fs.readFile(file, function(err, data) {
            fs.writeFile(file.replace(commonplace_src, local_src), data, function(err) {
                if (err) {
                    console.error('Error updating ' + file, err);
                }
            });
        });
    }

    var extensions = ['.js', '.dist', '.woff', '.svg'];

    function update_type() {
        if (!extensions.length) {
            return update_resources();
        }

        var ext = extensions.pop();
        console.log('Updating ' + ext + ' files.');
        utils.globEach(commonplace_src, ext, update_file, update_type);
    }

    function update_resources() {
        var manifest = path.resolve(local_src, '.commonplace');
        fs.readFile(manifest, function(err, data) {
            if (err) {
                console.error('Error reading commonplace manifest: ' + manifest, err);
                return;
            }

            var manifest_data = JSON.parse(data);
            manifest_data.version = info.version();
            fs.writeFile(manifest, JSON.stringify(manifest_data), function() {
                if (err) {
                    console.error('Error updating commonplace manifest.', err);
                    return;
                }
                console.log('Update complete!');
            });
        });
    }

    update_type();

}

function clean() {
    _check_version(info.src_dir(), undefined, undefined, function() {
        console.error('No Commonplace installation found.');
        process.exit(1);
    });

    var targets = [
        '_tmp',
        'src/templates.js',
        'src/media/css/include.css',
        'src/media/js/include.js',
        'src/locales/'
    ];
    targets.forEach(function(path) {
        fs.stat(path, function(err, data) {
            if (err) return;

            if (data && data.isDirectory()) {
                utils.rmdirRecursive(path);
            } else {
                utils.removeFile(path);
            }
        });
    });

    var css_dir = 'src/media/css/';
    fs.exists(css_dir, function(exists) {
        if (!exists) {
            console.warn('CSS directory does not exist.');
            return;
        }
        utils.globEach(css_dir, '.styl.css', function(filepath) {
            utils.removeFile(filepath, null);
        });
    });
}

function generate_langpacks() {
    var process_file = require('./generate_langpacks').process_file;
    var src_dir = info.src_dir();

    check_version(src_dir, undefined, undefined, function() {
        console.error('No Commonplace installation found.');
        process.exit(1);
    });

    var langpacks_path = src_dir + '/locales/';

    if (!fs.existsSync(langpacks_path)) {
        console.log('Langpacks path does not exist. Creating: ' + langpacks_path);
        fs.mkdirSync(langpacks_path);
    }
    utils.globEach('locale', '.po', function(filepath) {
        var path_regex = /locale\/([^\/]+?)\/LC_MESSAGES\/(.+?).po/;
        var match = path_regex.exec(filepath);
        process_file(filepath, match[1], langpacks_path + match[1] + '.js');
    });
}

function extract_l10n() {
    var context = new (require('./extract_l10n').L10nContext)();
    var src_dir = info.src_dir();

    _check_version(src_dir, undefined, undefined, function() {
        console.error('No Commonplace installation found.');
        process.exit(1);
    });

    var nunjucks_parser = require('nunjucks').parser;
    var nunjucks_extensions = require('./deferparser').extensions || [];

    var file_count = 0;
    var init_html;  // These are needed to prevent race conditions.
    var init_js;

    function done() {
        file_count--;
        if (init_html && init_js && !file_count) {
            context.save_po('locale/templates/LC_MESSAGES/messages.pot', function(err) {
                if (err) {
                    console.error('Could not save extracted strings.', err);
                    return;
                }
                console.log('Strings extracted successfully.');
                console.log(context.string_count() + ' strings extracted.');
            });
        }
    }

    function clean_path(path) {
        if (path.substr(0, src_dir.length) === src_dir) {
            path = path.substr(src_dir.length);
        }
        return path;
    }

    utils.glob(path.resolve(src_dir, 'templates'), '.html', function(err, list) {
        if (err) {
            console.warn('Error extracting HTML string.', err);
            return;
        }

        file_count += list.length;
        init_html = true;

        list.forEach(function(html_file) {
            fs.readFile(html_file, function(err, data) {
                var str_data = data + '';
                if (err) {
                    console.warn('Could not extract strings from: ' + html_file, err);
                    return;
                }
                var parse_tree = nunjucks_parser.parse(str_data, nunjucks_extensions);
                context.extract_template(str_data, parse_tree, clean_path(html_file));
                done();
            });
        });
    });

    utils.glob(path.resolve(src_dir, 'media/js'), '.js', function(err, list) {
        if (err) {
            console.warn('Error extracting JS string.', err);
            return;
        }

        file_count += list.length;
        init_js = true;

        list.forEach(function(js_file) {
            fs.readFile(js_file, function(err, data) {
                if (err) {
                    console.warn('Could not extract strings from: ' + js_file, err);
                    return;
                }
                context.extract_js(data + '', clean_path(js_file));
                done();
            });
        });
    });
}

function build_includes(raw) {
    var src_dir = info.src_dir();
    _check_version(src_dir, undefined, undefined, function() {
        console.error('No Commonplace installation found.');
        process.exit(1);
    });

    utils.copyFile(
        __dirname + '/amd/amd.js',
        src_dir + '/media/js/include.js',
        function(err) {
            if (err) {
                console.warn('Error copying amd.js');
            }
            require('./build.js').build(src_dir);

            // For raw includes mode. Does not minify.
            if (raw) {return;}

            var cleanCSS = require('clean-css');
            var cssSource = src_dir + '/media/include.css';

            console.log('Minifying CSS and writing to `media/css/include.css`');
            fs.readFile(cssSource, function(err, data) {
                if (err) {
                    console.warn('Error reading file: ' + cssSource);
                }
                var out = cleanCSS.process(data.toString());
                fs.writeFile(src_dir + '/media/css/include.css', out, function(err) {
                    if (err) {
                        console.warn('Error writing `include.css` to disk.');
                    }
                });
            });

            console.log('Minifying JS and writing to `media/js/include.js`');
            var result = require('uglify-js').minify(src_dir + '/media/include.js', {
                screw_ie8: true
            });
            fs.writeFile(src_dir + '/media/js/include.js', result.code, function(err) {
                if (err) {
                    console.warn('Error writing `include.js` to disk.');
                }
            });
        }
    );
}

function wrap(func) {
    return function() {
        if (!utils.opts().s) {
            console.log('Commonplace v' + info.version());
        }
        func.apply(this, arguments);
    };
}

module.exports.install = wrap(install);
module.exports.update = wrap(update);
module.exports.clean = wrap(clean);
module.exports.generate_langpacks = wrap(generate_langpacks);
module.exports.extract_l10n = wrap(extract_l10n);
module.exports.build_includes = wrap(build_includes);
