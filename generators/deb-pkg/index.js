'use strict';
const { PkgGeneratorBase } = require('../../lib/index');
const Generator = require('yeoman-generator');
const slugify = require('slugify');

module.exports = class DebpkgGenerator extends Generator {
    initializing() {
        return PkgGeneratorBase.initializing.call(this, arguments);
    }
    prompting() {
        return PkgGeneratorBase.prompting.call(this, arguments);
    }

    writing() {
        const { packageName, version, maintainer, description, staticFrontendPackage, copyright, license } = this;
        this.fs.copy(this.templatePath('debian/source/format'), this.destinationPath('debian/source/format'));
        this.fs.copy(this.templatePath('debian/compat'), this.destinationPath('debian/compat'));

        this.fs.copy(this.templatePath('debian/package.postinst'), this.destinationPath('debian/' + slugify(packageName) + '.postinst'));
        this.fs.copy(this.templatePath('debian/package.postrm'), this.destinationPath('debian/' + slugify(packageName) + '.postrm'));

        this.fs.copyTpl(this.templatePath('debian/_changelog'), this.destinationPath('debian/changelog'), {
            slugify, packageName, version, maintainer, description, staticFrontendPackage, copyright, license
        });

        this.fs.copyTpl(this.templatePath('debian/_control'), this.destinationPath('debian/control'), {
            slugify, packageName, version, maintainer, description, staticFrontendPackage, copyright, license,
            interpolate: /<%=([\s\S]+?)%>/g
        });
        this.fs.copyTpl(this.templatePath('debian/_rules'), this.destinationPath('debian/rules'), {
            slugify, packageName, version, maintainer, description, staticFrontendPackage, copyright, license,
            interpolate: /<%=([\s\S]+?)%>/g
        });

        this.fs.copyTpl(this.templatePath('debian/_copyright'), this.destinationPath('debian/copyright'), {
            slugify, packageName, version, maintainer, description, staticFrontendPackage, copyright, license
        });
    }
};
