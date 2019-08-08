'use strict';
const Generator = require('yeoman-generator');
const slugify = require('slugify');
const mkdirp = require('mkdirp');

module.exports = class OxUiModuleGenerator extends Generator {

    initializing() {
        this.pkg = this.fs.readJSON(this.destinationPath('package.json'));
    }

    async prompting() {
        this.answers = await this.prompt([{
            name: 'moduleName',
            message: 'What do you want the name of your package to be?',
            default: this.appname
        }, {
            name: 'translations',
            message: 'Do you want to include translations into your package? (y|n)',
            default: 'y'
        }, {
            name: 'e2eTests',
            message: 'Do you want to include e2e tests into your package? (y|n)',
            default: 'y'
        }]);
    }

    writing () {
        const { moduleName } = this.answers;
        this.fs.copyTpl(this.templatePath('_package.json'), this.destinationPath('package.json'), { slugify, moduleName });
        this.fs.copyTpl(this.templatePath('_bower.json'), this.destinationPath('bower.json'), { slugify, moduleName });
        this.fs.copyTpl(this.templatePath('_Gruntfile.js'), this.destinationPath('Gruntfile.js'));
        this.fs.copy(this.templatePath('eslintrc'), this.destinationPath('.eslintrc'));
        // Add apps folder
        mkdirp.sync('./apps');
        // Create ox.pot in i18n 
        if (this.answers.translations === 'y') {
            this.fs.copy(this.templatePath('i18n/ox.pot'), this.destinationPath('i18n/ox.pot'));
        }
        // Create scaffolding for e2e 
        if (this.answers.e2eTests === 'y') {
            mkdirp.sync('./e2e/output');
            this.fs.copyTpl(this.templatePath('_codecept.conf.js'), this.destinationPath('codecept.conf.js'), { slugify, moduleName });
            this.fs.copy(this.templatePath('e2e/actor.js'), this.destinationPath('e2e/actor.js'));
            this.fs.copy(this.templatePath('e2e/helper.js'), this.destinationPath('e2e/helper.js'));
            this.fs.copy(this.templatePath('e2e/users.js'), this.destinationPath('e2e/users.js'));
        }

        this.fs.copy(this.templatePath('gitignore'), this.destinationPath('.gitignore'));
    }

    install() {
        this.installDependencies();
        // Install selenium standalone
        if (this.answers.e2eTests === 'y') this.spawnCommand('npx', ['selenium-standalone', 'install']);
        return;
    }
};
