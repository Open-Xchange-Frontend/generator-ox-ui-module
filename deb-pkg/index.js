'use strict';
var util = require('util');
var lib = require('../lib/index');

var DebpkgGenerator = module.exports = function DebpkgGenerator() {
    lib.PkgGeneratorBase.apply(this, arguments);
};

util.inherits(DebpkgGenerator, lib.PkgGeneratorBase);

//TODO: can this be prevented?
DebpkgGenerator.prototype.askFor = lib.PkgGeneratorBase.prototype.askFor;

DebpkgGenerator.prototype.files = function files() {
    this.mkdir('debian');
    this.mkdir('debian/source');

    this.copy('debian/source/format', 'debian/source/format');
    this.copy('debian/compat', 'debian/compat');

    this.copy('debian/package.postinst', 'debian/' + this._.slugify(this.packageName) + '.postinst');
    this.copy('debian/package.postrm', 'debian/' + this._.slugify(this.packageName) + '.postrm');

    this.template('debian/_changelog', 'debian/changelog');

    //reset interpolate settings to ignore ES6 delimiters: ${}, because this breaks the template
    var interpolate = this._.templateSettings.interpolate;
    this._.templateSettings.interpolate = /<%=([\s\S]+?)%>/g;
    this.template('debian/_control', 'debian/control');
    this.template('debian/_rules', 'debian/rules');
    this._.templateSettings.interpolate = interpolate;
    interpolate = null;

    this.template('debian/_copyright', 'debian/copyright');
};
