# generator-ox-ui-module

A generator for [Yeoman](http://yeoman.io).


## Getting Started

### What is Yeoman?

Trick question. It's not a thing. It's this guy:

![](http://i.imgur.com/JHaAlBJ.png)

Basically, he wears a top hat, lives in your computer, and waits for you to tell him what kind of application you wish to create.

Not every new computer comes with a Yeoman pre-installed. He lives in the [npm](https://npmjs.org) package repository. You only have to ask for him once, then he packs up and moves into your hard drive. *Make sure you clean up, he likes new and shiny things.*

```
$ npm install -g yo
```

### Yeoman Generators

Yeoman travels light. He didn't pack any generators when he moved in. You can think of a generator like a plug-in. You get to choose what type of application you wish to create, such as a Backbone application or even a Chrome extension.

This generator provides a starting point for developing UI modules for the Open-Xchange Appsuite ecosystem. To install generator-ox-ui-module from npm, run:

```
$ npm install -g generator-ox-ui-module
```

Finally, initiate one of the generators:

```
$ yo ox-ui-module
$ yo ox-ui-module:deb-pkg
$ yo ox-ui-module:rpm-pkg
```

### Getting To Know Yeoman

Yeoman has a heart of gold. He's a person with feelings and opinions, but he's very easy to work with. If you think he's too opinionated, he can be easily convinced.

If you'd like to get to know Yeoman better and meet some of his friends, [Grunt](http://gruntjs.com) and [Bower](http://bower.io), check out the complete [Getting Started Guide](https://github.com/yeoman/yeoman/wiki/Getting-Started).

### ox-ui-module generator

This generator will provide scaffolding for Appsuite UI modules.
It provides a basic setup to help getting started with development.
Yeoman tries hard to provide sane defaults for any questions.
The default module name will be read from a `package.json` file or, if not found,
the current directory name will be used.

### Generating packaging information

It is possible to generate packaging information for UI modules using this generator. Some meta-data can be provided in
the modules package.json file:

* name field: used as package name
* version field: used as package version
* author field: used as package maintainer
* description field: used for package description
* license field: used as package license
* summary field: used as package summary

All these fields are optional, Yeoman will ask about any missing mandatory information.
For optional fields, sane defaults will be used, so you might want to check the content of the generated files,
afterwards.

#### ox-ui-module:deb-pkg generator

This generator will provide scaffolding for debian-based packaging information. It will create a `debian/` directory
containing all files needed to build .deb packages.

If you like to maintain packaging information separated from the actual sources of your module, you can run

```
$ yo ox-ui-module:deb-pkg --package /path/to/package.json
```

and point Yeoman to a package.json file of an UI module.

#### ox-ui-module:rpm-pkg generator

This generator will provide scaffolding for RPM-based packaging information. It will create a spec-file containing
all information needed to build .rpm packages.

If you like to maintain packaging information separated from the actual sources of your module, you can run

```
$ yo ox-ui-module:rpm-pkg --package /path/to/package.json
```

and point Yeoman to a package.json file of an UI module.

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
