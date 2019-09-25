'use strict';
const Generator = require('yeoman-generator');
const slugify = require('slugify');
const mkdirp = require('mkdirp');

module.exports = class OxUiModuleGenerator extends Generator {

    initializing() {
        this.pkg = this.fs.readJSON(this.destinationPath('package.json'));
        this.config.set('sourceRoot', this.sourceRoot());
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
            choices: ['7.10.3', '7.10.2', '7.10.1'],
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
        const { moduleName, license } = this.answers,
            maintainer = this.user.git.name() + ' \<' + this.user.git.email() + '\>';
        let { description, version } = this.answers;
        // Trim description to avoid line brakes
        description = description.trim().replace(/\n/g, '\\n');
        // Create files from templates and scaffolding
        this.fs.copyTpl(this.templatePath('_package.json'), this.destinationPath('package.json'), { slugify, moduleName, license, version, description, maintainer });
        this.fs.copyTpl(this.templatePath('_bower.json'), this.destinationPath('bower.json'), { slugify, moduleName });
        this.fs.copyTpl(this.templatePath('_Gruntfile.js'), this.destinationPath('Gruntfile.js'));
        this.fs.copy(this.templatePath('eslintrc'), this.destinationPath('.eslintrc'));
        this.fs.copy(this.templatePath('gitignore'), this.destinationPath('.gitignore'));
        // Add apps folder
        mkdirp.sync('./apps');
        // Create ox.pot in i18n
        if (this.answers.translations === true) {
            this.fs.copy(this.templatePath('i18n/ox.pot'), this.destinationPath('i18n/ox.pot'));
        }
        // Create scaffolding for e2e
        if (this.answers.e2eTests === true) {
            let croppedVersion = version.replace(/\./g, '');
            console.log('test2', croppedVersion, version);
            // Create e2e and output folder 
            mkdirp.sync('./e2e/output');
            this.npmInstall(['@open-xchange/codecept-helper', 'chai', 'codeceptjs', 'eslint-plugin-codeceptjs', 'selenium-standalone', 'webdriverio'], { 'save-dev': true });
            // Create files from templates
            this.fs.copyTpl(this.templatePath('_codecept.conf.js'), this.destinationPath('codecept.conf.js'), { slugify, moduleName });
            this.fs.copyTpl(this.templatePath('_Dockerfile'), this.destinationPath('Dockerfile'), { slugify, moduleName, version, maintainer });
            this.fs.copyTpl(this.templatePath('_gitlab-ci.yml'), this.destinationPath('../.gitlab-ci.yml'), { slugify, moduleName, croppedVersion });
            // Copy necessary scaffolding files
            this.fs.copy(this.templatePath('dockerignore'), this.destinationPath('.dockerignore'));
            this.fs.copy(this.templatePath('e2e/actor.js'), this.destinationPath('e2e/actor.js'));
            this.fs.copy(this.templatePath('e2e/helper.js'), this.destinationPath('e2e/helper.js'));
            this.fs.copy(this.templatePath('e2e/users.js'), this.destinationPath('e2e/users.js'));
            // Add e2e script to package.json
            this.fs.extendJSON(this.destinationPath('package.json'), { scripts: { e2e: "codeceptjs run" } });
        }
    }
    install() {
        if (this.fs.exists('package-lock.json')) return;
        return this.installDependencies();
    }
    end() {
        // Skip if updating package
        if (this.options['skip-install']) return;
        // Check in selenium has to be installed
        let installSelenium = false;
        if (this.fs.readJSON(this.destinationPath('package.json')).devDependencies.hasOwnProperty('codeceptjs')) {
            installSelenium = true;
        } else if (this.answers) {
            installSelenium = this.answers.e2eTests;
        }
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
