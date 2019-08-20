var fs = require('fs');
var _ = require('underscore');
var localConf = {};

if (fs.existsSync('grunt/local.conf.json')) {
    localConf = JSON.parse(fs.readFileSync('grunt/local.conf.json')) || {};
}
localConf.e2e = localConf.e2e || {};
localConf.e2e.helpers = localConf.e2e.helpers || {};

module.exports.config = {
    'tests': './e2e/*_test.js',
    'timeout': 10000,
    'output': './e2e/output/',
    'helpers': {
        'WebDriver': _.extend({}, {
            'url': process.env.LAUNCH_URL || 'http://localhost',
            'host': process.env.SELENIUM_HOST || '127.0.0.1',
            'smartWait': 1000,
            'waitForTimeout': 10000,
            'browser': 'chrome',
            'restart': true,
            'keepBrowserState': false,
            'desiredCapabilities': {
                'browserName': 'chrome',
                'chromeOptions': {
                    'args': ['--disable-gpu','--window-size=1920,1080'],
                    'prefs': {
                        'intl.accept_languages': 'en-US'
                    }
                }
            },
            'timeouts': {
                'script': 30000
            }
        }, localConf.e2e.helpers.WebDriver || {}),
        'OpenXchange': _.extend({}, {
            require: './e2e/helper',
            mxDomain: 'example.com'
        }, localConf.e2e.helpers.OpenXchange || {}),
    },
    'include': {
        I: './e2e/actor',
        users: './e2e/users'
    },
    'bootstrap': function (done) {
        var chai = require('chai');
        chai.config.includeStack = true;

        var config = require('codeceptjs').config.get();
        if (/127\.0\.0\.1/.test(config.helpers.WebDriver.host)) {
            require('@open-xchange/codecept-helper').selenium
                .start(localConf.e2e.selenium)
                .then(done);
        } else {
            done();
        }
    },
    'teardown': function () {
        //HACK: defer killing selenium, because it's still needed for a few ms
        setTimeout(function () {
            require('@open-xchange/codecept-helper').selenium.stop();
        }, 500);
    },
    'mocha': {},
    'name': '<%= slugify(moduleName) %> e2e tests'
};
