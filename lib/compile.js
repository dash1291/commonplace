#!/usr/bin/env node
var fs = require('fs');
var path = require('path');

// nunjucks
var compiler = require('nunjucks').compiler;
var parser = require('nunjucks').parser;

var utils = require('./utils');
var srcdir = require('./info').src_dir();

function process(folder, output_file, callback) {
    var extensions = require('./deferparser').extensions || [];

    utils.glob(folder, '.html', function(err, templates) {
        var template_strings = (
            '(function() {' +
            'var templates = {};\n'
        );

        for(var i=0; i<templates.length; i++) {
            var name = templates[i].replace(path.join(folder, '/'), '');
            template_strings += 'templates["' + name + '"] = (function() {';

            var doCompile = function() {
                var src = fs.readFileSync(templates[i], 'utf-8');
                var cinst = new compiler.Compiler(extensions);
                cinst.compile(parser.parse(src, extensions));
                template_strings += cinst.getCode();
            };

            try {
                doCompile();
            } catch(e) {
                template_strings += [
                    'return {root: function() {',
                    'throw new Error("' + name + ' failed to compile. Check the damper for details.");',
                    '}}'
                ].join('\n');

                console.error(e);
            }

            template_strings += '})();\n';
        }

        template_strings += (
            'define("templates", ["nunjucks", "helpers"], function(nunjucks) {\n' +
            '    nunjucks.env = new nunjucks.Environment([], {autoescape: true});\n' +
            '    nunjucks.env.registerPrecompiled(templates);\n' +
            '    nunjucks.templates = templates;\n' +
            '    console.log("Templates loaded");\n' +
            '    return nunjucks;\n' +
            '});\n' +
            '})();'
        );

        fs.writeFile(output_file, template_strings, callback);

    });

}

module.exports.process = process;
