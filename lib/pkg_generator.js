'use strict';
var fs = require('fs');

function getPackageFile(options) {
    var pkgFile =
        //we want a --package option to contain the path to package.json
        options['package'] ||
        //options.argv will work until yo@1.3 or 1.4 (unsure) this is available for
        //backward compatibility
        (options.argv && options.argv.remain[0]) ||
        'package.json';
    return pkgFile;
}

module.exports = {

    initializing() {
        this.generateStatic = this.options['static'];

        var pkgFile = getPackageFile(this.options);
        if (!fs.existsSync(pkgFile)) {
            console.log('Package file not found, aborting ...');
            return;
        }

        var pkg = this.fs.readJSON(pkgFile);
        this.packageName = pkg.name;
        this.version = pkg.version;
        this.authorName = (pkg.author || {}).name;
        this.email = (pkg.author || {}).email;
        this.description = pkg.description;
        this.license = pkg.license;
        this.summary = pkg.summary;
    },
    async prompting() {

        var prompts = [];

        if (!this.authorName || !this.email) {
            prompts.push({
                name: 'authorName',
                message: 'Who would you want the maintainer of your project to be?',
                default: this.authorName || ''
            }, {
                name: 'email',
                message: 'Would you mind telling me the email address of the maintainer?',
                default: this.email || ''
            });
        }

        if (!this.copyright) {
            prompts.push({
                name: 'copyright',
                message: 'What would you like the copyright string to be?',
                default: '(c) ' + (new Date()).getFullYear() + ' ' + (this.authorName || '')
            });
        }

        if (!this.license) {
            //TODO: provide a list here?
            prompts.push({
                name: 'license',
                message: 'Under what license is this project released?',
                default: 'MIT'
            });
        }

        if (this.generateStatic === undefined) {
            prompts.push({
                type: 'confirm',
                name: 'generateStatic',
                message: 'Would you like to generate a separate frontend package containing static files?',
                default: !!this.generateStatic
            });
        }

        const props = await this.prompt(prompts);

        this.maintainer = '"' + (props.authorName || this.authorName) + '" <' + (props.email || this.email) + '>';
        this.copyright = (props.copyright || this.copyright);
        this.version = this.version;
        this.license = (props.license || this.license);
        this.staticFrontendPackage = (props.generateStatic || this.generateStatic);
        this.summary = (props.summary || this.summary || 'Put your summary here!');
        this.description = (props.description || this.description || 'Put your description here!');
    }
};
