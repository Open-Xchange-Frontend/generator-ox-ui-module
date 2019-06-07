/*global describe, before, it*/
'use strict';

var path    = require('path');
var assert  = require('yeoman-assert');
var helpers = require('yeoman-test');


describe('ox-ui-module generator', function () {
    before(function () {
        return helpers
            .run(path.join(__dirname, '../generators/app'))
            .withOptions({ 'skip-install': true });
    });

    it('creates expected files', function () {
        var expected = [
            // add files you expect to exist here.
            '.eslintrc',
            'package.json',
            'Gruntfile.js'
        ];

        assert.file(expected);
    });
});

describe('ox-ui-module packaging generators', function () {
    describe('for deb packages', function () {
        before(function () {
            return helpers
                .run(path.join(__dirname, '../generators/deb-pkg'))
                .withOptions({
                    package: path.join(__dirname, 'fixtures/unicorn/package.json')
                });
        });

        it('creates expected files', function () {
            var expected = [
                'debian/control',
                'debian/changelog'
            ];

            assert.file(expected);
        });

        it('extracts and user version number correctly', () => {
            assert.fileContent('debian/changelog', /unicorn \(1\.3\.3-7[^)]*\)/);
        });
    });

    describe('for rpm packages', function () {
        before(function () {
            return helpers
                .run(path.join(__dirname, '../generators/rpm-pkg'))
                .withOptions({
                    package: path.join(__dirname, 'fixtures/unicorn/package.json')
                });
        });
        it('creates expected files', function () {
            var expected = [
                'unicorn.spec'
            ];

            assert.file(expected);
        });

        it('extracts and user version number correctly', () => {
            assert.fileContent('unicorn.spec', /Version:\s+ 1\.3\.3-7/);
        });
    });
});
