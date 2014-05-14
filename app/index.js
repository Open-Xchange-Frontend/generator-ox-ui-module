'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');

var OxUiModuleGenerator = module.exports = function OxUiModuleGenerator(args, options) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(OxUiModuleGenerator, yeoman.generators.Base);

OxUiModuleGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  //TODO: once this has been released with yo, switch to their version
  try {
    this.appname = require(path.join(process.cwd(), 'bower.json')).name;
  } catch (e) {
    try {
      this.appname = require(path.join(process.cwd(), 'package.json')).name;
    } catch (e) {
      this.appname = path.basename(process.cwd());
    }
  }

  var prompts = [{
    name: 'moduleName',
    message: 'What do you want the name of your package to be?',
    default: this.appname
  }];

  this.prompt(prompts, function (props) {
    this.moduleName = props.moduleName;

    cb();
  }.bind(this));
};

OxUiModuleGenerator.prototype.app = function app() {
  /* This method uses bulkCopy, because copy will automatically try to template
   * every file. This is unwanted (would have used this.template instead), but
   * yeoman API says, it's there for backwards-compatibility. Need to wait until
   * this has been dropped by the yeoman team.
   */
  this.mkdir('apps');
  this.mkdir('grunt');
  this.mkdir('grunt/tasks');

  this.template('_package.json', 'package.json');
  this.template('_bower.json', 'bower.json');
  this.template('_Gruntfile.js', 'Gruntfile.js');

  this.copy('gitignore', '.gitignore');
};

OxUiModuleGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('jshintrc', '.jshintrc');
};
