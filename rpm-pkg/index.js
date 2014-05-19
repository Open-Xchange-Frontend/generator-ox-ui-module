'use strict';
var util = require('util');
var lib = require('../lib/index');

var RpmpkgGenerator = module.exports = function RpmpkgGenerator() {
    lib.PkgGeneratorBase.apply(this, arguments);
};

util.inherits(RpmpkgGenerator, lib.PkgGeneratorBase);

//TODO: can this be prevented?
RpmpkgGenerator.prototype.askFor = lib.PkgGeneratorBase.prototype.askFor;

RpmpkgGenerator.prototype.files = function files() {
    this.template('_specfile.spec', this.packageName + '.spec');
};
