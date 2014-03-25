/* This file has been generated by ox-ui-module generator.
 * Please only apply minor changes (better no changes at all) to this file
 * if you want to be able to run the generator again without much trouble.
 *
 * If you really have to change this file for whatever reason, try to contact
 * the core team and describe your use-case. May be, your changes can be
 * integrated into the templates to be of use for everybody.
 */
'use strict';

module.exports = function (grunt) {

    grunt.config.extend('concat', {
        manifests: {
            options: {
                banner: '[',
                footer: ']',
                separator: ',',
                process: function (data, filepath) {
                    var manifest = [],
                        data = JSON.parse(data),
                        prefix = /^apps[\\\/](.*)[\\\/]manifest\.json$/.exec(filepath)[1].replace(/\\/g, '/') + '/';
                    if (data && (data.constructor !== Array)) data = [data];
                    for (var i = 0; i < data.length; i++) {
                        if (!data[i].path) {
                            if (data[i].namespace) {
                                // Assume Plugin
                                if (grunt.file.exists('apps/' + prefix + 'register.js')) data[i].path = prefix + 'register';
                            } else {
                                // Assume App
                                if (grunt.file.exists('apps/' + prefix + 'main.js')) data[i].path = prefix + 'main';
                            }
                        }
                        manifest.push(data[i]);
                    }
                    return manifest.map(JSON.stringify);
                },
            },
            files: [
                {
                    expand: true,
                    src: ['apps/**/manifest.json'],
                    rename: function (dest, file) {
                        var data = JSON.parse(grunt.file.read(file)),
                            packageName = [].concat(data).map(function (obj) {
                                return obj.package;
                            }).reduce(function (acc, name) {
                                name = name || grunt.config('pkg').name;
                                //ignore the initial value of acc
                                if (!acc) return name;
                                if (acc !== name) grunt.fail.warn('Multiple package targets per manifest.json are not supported any longer. Create a manifest.json for each package.');
                                return name;
                            }, null);
                        return dest + packageName + '.json';
                    },
                    dest: 'build/manifests/',
                }
            ]
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
};
