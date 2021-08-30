# yarn-plugin-apt

Yarn plugin to resolve node modules installed via apt. See https://wiki.debian.org/Javascript/Nodejs/yarn-plugin-apt for more details.


## Local development
- `apt install yarnpkg`
- clone this repository
- `cd yarn2-plugin-apt`
- `yarnpkg set version berry` 
- This command sets yarn version to berry and autogenerates a .yarnrc.yml file which should be listed in .gitignore, fill it with the following:
<pre><code>
nodeLinker: node-modules
plugins:
  - bin/@yarnpkg/plugin-apt.js
yarnPath: ".yarn/releases/yarn-berry.cjs" 
</code></pre>
- nodeLinker could be node-modules or pnp depending on the preferred option.
- `yarnpkg install`
- `yarnpkg build`


## Installation
To install and use this plugin in a nodejs project:
#### 1.
    Your project has been configured to use yarn berry (v3)
- `cd` into the your project folder
- `yarnpkg plugin import https://salsa.debian.org/js-team/yarn-plugin-apt/-/raw/master/bin/@yarnpkg/plugin-apt.js`
#### 2.
    Your project has not been configured to use yarn berry (v3)
- `apt install yarnpkg`
- `cd` into the project folder
- `yarnpkg set version berry`
- `yarnpkg plugin import https://salsa.debian.org/js-team/yarn-plugin-apt/-/raw/master/bin/@yarnpkg/plugin-apt.js`

#### System Dependencies
This plugin depends on the following Debian packages, which are installable via apt on Debian and Debian-based distros:
- pkg-js-tools

## Usage

This plugin provides a `yarnpkg apt`, `yarnpkg apt install`, `yarnpkg apt copy`, and `yarnpkg apt link` commands.

| COMMAND |   OPTIONS |  EXAMPLES      |
|---------|:---------:|---------------:|
| `apt`|--resolve/-r <br/> -resolve-dev/-rd|yarn apt --resolve mocha --resolve memfs <br /> yarn apt -r=mocha -r=memfs <br /> yarn apt -rd mocha -rd memfs <br /> yarn apt --help|
| `apt install`|--local <br /> --dev|yarn apt install <br /> yarn apt install --local <br /> yarn apt install --dev <br /> yarn apt install --dev --local <br /> yarn apt install --help|
| `apt copy`|--pkg <br /> --all|yarn apt copy --pkg=mocha --pkg=memfs <br /> yarn apt copy --pkg mocha --pkg memfs <br /> yarn apt copy --all <br /> yarn apt copy --help|
| `apt link`|--pkg <br /> --all|yarn apt link --pkg=mocha --pkg=memfs <br /> yarn apt link --pkg mocha --pkg memfs <br /> yarn apt link --all <br /> yarn apt link --help|


## Acknowledgements

The Sponsors:<br/>
Debian js-team and Outreachy Internships

The Mentors:<br/>
Pirate Praveen<br/>
Akshay S Dinesh

Every member of the Debian js-team

**Thank You! for the opportunity and support all the way.**

## LICENSE
GNU GPL
