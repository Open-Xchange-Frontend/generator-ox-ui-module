'use strict';

module.exports = function (grunt) {
    grunt.config.init({
        bump: {
            options: {
                files: ['package.json'],
                createTag: false,
                push: false
            }
        },
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
        },
        watch: {
            grunt: {
                options: {
                    reload: true
                },
                files: ['Gruntfile.js'],
                tasks: ['default']
            },
            all: {
                files: [
                    'lib/*.*',
                    'app/**/*.*',
                    'deb-pkg/**/*.*',
                    'rpm-pkg/**/*.*'
                ],
                tasks: ['default']
            }
        }
    });

    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['jshint']);
};

