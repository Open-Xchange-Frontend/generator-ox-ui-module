'use strict';

const { PkgGeneratorBase } = require('../../lib/index');
const Generator = require('yeoman-generator');

module.exports = class RpmpkgGenerator extends Generator {
    initializing() {
        PkgGeneratorBase.initializing.call(this, arguments);
    }
    prompting() {
        PkgGeneratorBase.prompting.call(this, arguments);
    }

    files() {
        const { packageName, version, maintainer, license, summary, description, staticFrontendPackage } = this;
        this.fs.copyTpl(this.templatePath('_specfile.spec'), this.destinationPath(this.packageName + '.spec'), {
            packageName, version, maintainer, license, summary, description, staticFrontendPackage
        });
    }
};
