# yarn-plugin-apt

Yarn plugin to resolve node modules installed via apt. See https://wiki.debian.org/Javascript/Nodejs/Yarn2-plugin-apt for more details.
<pre><code>
Development started in yarn 2 but was later switched to yarn 3, both under the code name berry 
</code></pre>
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
- `yarnpkg apt --resolve/-r <package>`
- For Help:  
    `yarnpkg apt --help`

## Installation
To install and use this plugin in a nodejs project:
#### 1.
    Your project has been configured to use yarn berry (v3)
- `cd` into the your project folder
- `yarnpkg plugin import https://salsa.debian.org/js-team/yarn2-plugin-apt/raw/master/lib/index.js`
#### 2.
    Your project has not been configured to use yarn berry (v3)
- `apt install yarnpkg`
- `cd` into the project folder
- `yarnpkg set version berry`
- `yarnpkg plugin import https://salsa.debian.org/js-team/yarn2-plugin-apt/raw/master/lib/index.js`

#### System Dependencies
This plugin depends on the following Debian packages, which are installable via apt on Debian and Debian-based distros:
- pkg-js-tools

## Usage
This plugin provides a `yarnpkg apt` command. To use this plugin, call `yarnpkg apt` with the `--resolve` ( or `-r`) option and pass package to resolve as command argument.<br/>
**Example:**<br/>
    To resolve `mocha`<br/>
    `yarnpkg apt --resolve mocha`<br/>
If mocha is installed in a Debian node path ( via apt), this resolves pulls it from the local files and links it as a dependency for your project using your specified nodeLinker.<br/>
This command must be run in the root of the project you wish to resolve dependencies for.


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
