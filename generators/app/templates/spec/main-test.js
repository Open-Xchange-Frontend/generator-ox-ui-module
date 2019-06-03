// clear localstorage here before everything starts
// seems like phantom has problems with a non cleared localstorage
localStorage.clear();

/* eslint block-scoped-var:0 */
var tests = [];
for (var file in window.__karma__.files) {
    if (window.__karma__.files.hasOwnProperty(file)) {
        if (/spec\.js$/.test(file)) {
            tests.push(file);
        }
    }
}

try {
    require(['io.ox/core/extPatterns/stage'], function (Stage) {

        'use strict';

        new Stage('io.ox/core/stages', {
            id: 'run_tests',
            index: 99999,
            run: function () {
                requirejs.config({
                    // Karma serves files from '/base/apps'
                    baseUrl: '/base/apps',

                    // ask Require.js to load these files (all our tests)
                    deps: tests,

                    // start test run, once Require.js is done
                    callback: window.__karma__.start
                });
            }
        });
    });
} catch (e) {
    if (/require$/.test(e.message)) console.error(e.message, ' - May be you need to configure "coreDir" variable');
    // start tests anyway, so reporters have the chance to report something
    window.__karma__.start();
    throw e;
}
