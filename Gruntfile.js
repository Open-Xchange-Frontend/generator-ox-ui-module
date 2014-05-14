'use strict';

module.exports = function (grunt) {
    grunt.config.init({
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: {
                files: [{
                    src: [
                        'Gruntfile.js',
                        'lib/*.js',
                        'app/**/*.js',
                        'deb-pkg/**/*.js',
                        'rpm-pkg/**/*.js'
                    ]
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['jshint']);
};

