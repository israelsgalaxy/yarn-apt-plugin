# yarn2-plugin-apt

Yarn 2 plugin to resolve node modules installed via apt. See https://wiki.debian.org/Javascript/Nodejs/Yarn2-plugin-apt for more details.

## Local development
- `apt install yarnpkg`
- clone this repository
- `cd yarn2-plugin-apt`
- `yarnpkg set version berry` . This may overwrite the contents of `.yarnrc.yml` with a yarnPath entry. Copy the yarnPath, `git restore .yarnrc.yml` and add copied yarnPath to it.
- `yarnpkg install`
- `yarnpkg build`
- `yarnpkg apt --resolve/-r <package>`
- For Help:  
    `yarnpkg apt --help`

## Installation
To install and use this plugin in a nodejs project:
#### 1.
    Your project has been configured to use yarn2
- `cd` into the your project folder
- `yarn plugin import https://salsa.debian.org/js-team/yarn2-plugin-apt/raw/master/lib/index.js`
#### 2.
    Your project has not been configured to use yarn2
- `apt install yarnpkg`
- `cd` into the project folder
- `yarnpkg set version berry`
- `yarn plugin import https://salsa.debian.org/js-team/yarn2-plugin-apt/raw/master/lib/index.js`

#### System Dependencies
This plugin depends on the following packages, which are installable via apt on Debian and Debian-based distros:
- pkg-js-tools

## Usage
This plugin provides a `yarn apt` command. To use this plugin, call `yarn apt` with the `--resolve` ( or `-r`) option and pass package to resolve as command argument.
**Example:**
    To resolve `mocha`
    `yarn apt --resolve mocha`
If mocha is installed in a Debian node path ( via apt), this resolves pulls it from the local files and links it as a dependency for your project using your specified nodeLinker.
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
