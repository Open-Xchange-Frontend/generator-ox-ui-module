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
        eslint: {
            all: {
                files: [{
                    src: [
                        'Gruntfile.js',
                        'lib/*.js',
                        'generators/**/*.js'
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
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-eslint');

    grunt.registerTask('default', ['eslint']);
};

