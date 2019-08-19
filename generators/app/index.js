'use strict';
const Generator = require('yeoman-generator');
const slugify = require('slugify');
const mkdirp = require('mkdirp');

module.exports = class OxUiModuleGenerator extends Generator {

    initializing() {
        this.pkg = this.fs.readJSON(this.destinationPath('package.json'));
    }

    async prompting() {
        if (this.fs.exists('package.json')) return;
        this.answers = await this.prompt([{
            name: 'moduleName',
            message: 'What do you want the name of your package to be?',
            default: this.appname,
            store: true
        }, {
            type: 'editor',
            name: 'description',
            message: 'Please enter a little description for your package',
            store: true
        }, {
            type: 'list',
            name: 'version',
            message: 'Which OX App Suite version is this package for?',
            choices: ['7.10.2', '7.10.1'],
            store: true
        }, {
            type: 'list',
            name: 'license',
            message: 'Under what license is this project released?',
            choices: ['CC-BY-NC-SA-3.0', 'MIT'],
            store: true
        }, {
            type: 'confirm',
            name: 'translations',
            message: 'Do you want to include translations into your package?',
            default: true,
            store: true
        }, {
            type: 'confirm',
            name: 'e2eTests',
            message: 'Do you want to include e2e tests into your package?',
            default: true,
            store: true
        }]);
    }

    writing () {
        if (this.fs.exists('package.json')) return;
        const { moduleName, license, version, description } = this.answers;
        this.fs.copyTpl(this.templatePath('_package.json'), this.destinationPath('package.json'), { slugify, moduleName, license, version, description });
        this.fs.copyTpl(this.templatePath('_bower.json'), this.destinationPath('bower.json'), { slugify, moduleName });
        this.fs.copyTpl(this.templatePath('_Gruntfile.js'), this.destinationPath('Gruntfile.js'));
        this.fs.copy(this.templatePath('eslintrc'), this.destinationPath('.eslintrc'));
        // Add apps folder
        mkdirp.sync('./apps');
        // Create ox.pot in i18n 
        if (this.answers.translations === true) {
            this.fs.copy(this.templatePath('i18n/ox.pot'), this.destinationPath('i18n/ox.pot'));
        }
        // Create scaffolding for e2e 
        if (this.answers.e2eTests === true) {
            mkdirp.sync('./e2e/output');
            this.npmInstall(['@open-xchange/codecept-helper', 'chai', 'codeceptjs', 'eslint-plugin-codeceptjs', 'selenium-standalone', 'webdriverio'], { 'save-dev': true });
            this.fs.copyTpl(this.templatePath('_codecept.conf.js'), this.destinationPath('codecept.conf.js'), { slugify, moduleName });
            this.fs.copy(this.templatePath('e2e/actor.js'), this.destinationPath('e2e/actor.js'));
            this.fs.copy(this.templatePath('e2e/helper.js'), this.destinationPath('e2e/helper.js'));
            this.fs.copy(this.templatePath('e2e/users.js'), this.destinationPath('e2e/users.js'));
        }

        this.fs.copy(this.templatePath('gitignore'), this.destinationPath('.gitignore'));
    }
    install() {
        if (this.fs.exists('package.json')) return;
        return this.installDependencies();
    }
    end() {
        this.config.set('sourceRoot', this.sourceRoot());
        // Install selenium standalone
        if (this.config.get('e2eTests') === true) this.spawnCommand('npx', ['selenium-standalone', 'install']);
        return;
    }
};
