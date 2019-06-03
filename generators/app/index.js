'use strict';
const Generator = require('yeoman-generator');
const slugify = require('slugify');

module.exports = class OxUiModuleGenerator extends Generator {

    initializing() {
        this.pkg = this.fs.readJSON(this.destinationPath('package.json'));
    }

    async prompting() {
        this.answers = await this.prompt([{
            name: 'moduleName',
            message: 'What do you want the name of your package to be?',
            default: this.appname
        }]);
    }

    writing () {
        const { moduleName } = this.answers;
        this.fs.copyTpl(this.templatePath('_package.json'), this.destinationPath('package.json'), { slugify, moduleName });
        this.fs.copyTpl(this.templatePath('_bower.json'), this.destinationPath('bower.json'), { slugify, moduleName });
        this.fs.copyTpl(this.templatePath('_Gruntfile.js'), this.destinationPath('Gruntfile.js'));
        this.fs.copy(this.templatePath('eslintrc'), this.destinationPath('.eslintrc'));

        this.fs.copyTpl(this.templatePath('_karma.conf.js'), this.destinationPath('karma.conf.js'));
        this.fs.copy(this.templatePath('spec/main-test.js'), this.destinationPath('spec/main-test.js'));
        this.fs.copy(this.templatePath('spec/basic_spec.js'), this.destinationPath('spec/basic_spec.js'));
        this.fs.copy(this.templatePath('spec/eslintrc'), this.destinationPath('spec/.eslintrc'));

        this.fs.copy(this.templatePath('gitignore'), this.destinationPath('.gitignore'));
    }

    install() {
        return this.installDependencies();
    }
};
