'use strict';
const Generator = require('yeoman-generator');
const slugify = require('slugify');
const mkdirp = require('mkdirp');
module.exports = class OxUiModuleUpdateGenerator extends Generator {

    initializing() {
        this.pkg = this.fs.readJSON(this.destinationPath('package.json'));
        // Run OxUiModuleGenerator to get some necessary info from it like source root
        this.composeWith('ox-ui-module', { skipInstall: true });
    }
    async prompting () {
        const { e2eTests } = this.config.get('promptValues') !== undefined ? this.config.get('promptValues') : false;
        if (e2eTests === true) return;
        if (this.fs.readJSON(this.destinationPath('package.json')).devDependencies.hasOwnProperty('codeceptjs')) return;

        this.answers = await this.prompt([{
            type: 'confirm',
            name: 'e2eTests',
            message: 'Do you want to include e2e tests into your package?',
            default: true,
            store: true
        }]);
    }
    writing() {
        const moduleName = this.appname,
            license = this.pkg.license || '',
            description = (this.pkg.description || '').trim().replace(/\n/g, '\\n'),
            maintainer = this.user.git.name() + ' \<' + this.user.git.email() + '\>',
            version = this.pkg.version || '',
            { e2eTests } = this.config.get('promptValues');

        console.log(this.user, maintainer);
        // Use source root of OxUiModuleGenerator
        this.sourceRoot(this.config.get('sourceRoot'));

        // Copy template to temporary file
        this.fs.copyTpl(this.templatePath('_package.json'), this.destinationPath('package.json.temp'), { slugify, moduleName, license, version, description, maintainer });

        const packageJSON = this.fs.readJSON(this.destinationPath('package.json.temp'));
        this.log('Updating your package information');

        // Write content of newer package.json to old package.json
        this.fs.extendJSON(this.destinationPath('package.json'), packageJSON);

        // Check if package.json contains codecept as devDependency and uptade all e2e dependencies
        if (this.fs.readJSON(this.destinationPath('package.json')).devDependencies.hasOwnProperty('codeceptjs') || e2eTests == true) {
            let croppedVersion = version.replace(/\./g, '');
            mkdirp.sync('./e2e/output');
            this.npmInstall(['@open-xchange/codecept-helper', 'chai', 'codeceptjs', 'eslint-plugin-codeceptjs', 'selenium-standalone', 'webdriverio'], { 'save-dev': true });
            this.fs.copyTpl(this.templatePath('_codecept.conf.js'), this.destinationPath('codecept.conf.js'), { slugify, moduleName });
            this.fs.copyTpl(this.templatePath('_Dockerfile'), this.destinationPath('Dockerfile'), { slugify, moduleName, version, maintainer });
            this.fs.copyTpl(this.templatePath('_gitlab-ci.yml'), this.destinationPath('../.gitlab-ci.yml'), { slugify, moduleName, croppedVersion });
            // Copy necessary scaffolding files
            this.fs.copy(this.templatePath('dockerignore'), this.destinationPath('.dockerignore'));
            this.fs.copy(this.templatePath('e2e/actor.js'), this.destinationPath('e2e/actor.js'));
            this.fs.copy(this.templatePath('e2e/helper.js'), this.destinationPath('e2e/helper.js'));
            this.fs.copy(this.templatePath('e2e/users.js'), this.destinationPath('e2e/users.js'));
            this.fs.extendJSON(this.destinationPath('package.json'), { scripts: { e2e: "codeceptjs run" } });
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
    end() {
        let installSelenium = this.fs.readJSON(this.destinationPath('package.json')).devDependencies.hasOwnProperty('codeceptjs');
        // Install selenium standalone
        if (installSelenium === true) return new Promise((resolve, reject) => {
            const proc = this.spawnCommand('npx', ['selenium-standalone', 'install']);
            proc
                .on('exit', resolve)
                .on('error', reject);
        });
        return;
    } 
};
