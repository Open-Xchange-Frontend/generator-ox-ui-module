'use strict';
const Generator = require('yeoman-generator');
const slugify = require('slugify');
module.exports = class OxUiModuleUpdateGenerator extends Generator {

    initializing() {
        this.pkg = this.fs.readJSON(this.destinationPath('package.json'));
        // Run OxUiModuleGenerator to get some necessary info from it like source root
        this.composeWith('ox-ui-module', { skipInstall: true });
        // Use source root of OxUiModuleGenerator
        this.sourceRoot(this.config.get('sourceRoot'));
    }

    writing() {
        console.log(this.pkg.license);
        const moduleName = this.appname,
              license = this.pkg.license,
              description = this.pkg.description,
              version = this.pkg.version;
        // Copy template to temporary file 
        this.fs.copyTpl(this.templatePath('_package.json'), this.destinationPath('package.json.temp'), { slugify, moduleName, license, version, description });

        const packageJSON = this.fs.readJSON(this.destinationPath('package.json.temp'));
        this.log('Updating your package information');

        // Write content of newer package.json to old package.json
        this.fs.extendJSON(this.destinationPath('package.json'), packageJSON);

        // Check if package.json contains codecept as devDependency and uptade all e2e dependencies
        if (this.fs.readJSON(this.destinationPath('package.json')).devDependencies.hasOwnProperty('codeceptjs')) {
            this.npmInstall(['@open-xchange/codecept-helper', 'chai', 'codeceptjs', 'eslint-plugin-codeceptjs', 'selenium-standalone', 'webdriverio'], { 'save-dev': true });
        }
        // Delete some files
        this.fs.delete(this.destinationPath('package.json.temp'));
        this.fs.delete(this.destinationPath('*-lock.json'));
    }
    conflicts() {
        // Force overwrite
        this.conflicter.force = true;
    }
    install() {
        // Install new dependencies
        return this.installDependencies();
    }
};
