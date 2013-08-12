var fs = require('fs');
var path = require('path');
var utils = require('./utils.js');

var blacklist = [
    'require.js',
    'settings_inferno.js',
    'settings_local.js',
    'settings_travis.js',

    'splash.styl.css',
    'include.js',
    'include.css',
];

function concatJS(assetsPath, includes, output_file) {
    var output = '';
    includes.forEach(function(include) {
        include = assetsPath + '/' + include;
        if (include.substr(-3) == '.js') {
            output += fs.readFileSync(include).toString();
        } else {
            utils.globSync(include, '.js', function(err, results) {
                results.forEach(function(file) {
                    if (blacklist.indexOf(path.basename(file)) === -1) {
                        output += fs.readFileSync(file).toString() + '\n';
                    }
                });
            });
        }
    });
    var include = fs.readFileSync(assetsPath + '/' + output_file).toString();
    output = include.replace(/'replace me'/, function(){
        return output;
    });
    fs.writeFileSync(assetsPath + '/' + output_file, output);
}

function concatCSS(assetsPath, includes, output_file) {
    var output = '';
    var match;
    var css_pattern = /href="(\/media\/css\/.+\.styl\.css)"/g;

    includes.forEach(function(include) {
        var include_path = [assetsPath, '/', include].join('');
        var include_data = fs.readFileSync(include_path).toString();
        if (include.substr(-5) === '.html') {
            while (match = css_pattern.exec(include_data)) {
                if (blacklist.indexOf(path.basename(match[1])) === -1) {
                    output += fs.readFileSync(assetsPath + match[1]).toString();
                }
            }
        }
    });

    var url_pattern = /url\(([^)]+)\)/g;
    output = output.replace(url_pattern, function(match, url, offset, string) {
        url = url.replace(/"|'/g, '');
        if (url.search(/(https?|data):|\/\//) === 0) {
            return ['url(', url, ')'].join('');
        }

        var timestamp = new Date().getTime();
        if (url.indexOf('#') !== -1) {
            var split = url.split('#');
            return ['url(', split[0], '?', timestamp, '#', split[1], ')'].join('');
        } else {
            return ['url(', url, '?', timestamp, ')'].join('');
        }
    });
    fs.writeFileSync(assetsPath + '/' + output_file, output);
}

function build(assetsPath) {
    console.log('Building assets...');
    concatJS(assetsPath, ['media/js', 'templates.js'], 'media/include.js');
    concatCSS(assetsPath, ['index.html'], 'media/include.css');
}

module.exports.build = build;
