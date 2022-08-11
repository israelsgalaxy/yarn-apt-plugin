# yarn-apt plugin

This yarn plugin allows apt-installed packages satisfy a Nodejs project's dependencies.

## Getting started

### Prerequisites

- Install Yarn  
`apt install yarnpkg`  
- Change Yarn's command from yarnpkg to yarn (this is necessary for some other commands below to work)  
run `which yarnpkg` and use `mv` to change yarnpkg in the output to yarn  
- Install nodepath  
`apt install nodepath`  
- `cd` into your Nodejs project's folder (all the remaining commands should be run in this folder)
- Initialise Yarn (skip if already existing)   
`yarn init`  
- Set Yarn version to berry  
`yarn set version berry`
- Set Yarn version to latest upstream (fixes a bug)  
`yarn set version from sources`  
- Import yarn-apt plugin  
`yarn plugin import https://salsa.debian.org/izzygala/yarn-apt-plugin/-/raw/master/bundles/@yarnpkg/plugin-apt.js`

## Usage

1. `yarn apt-add <package name>@<package version or package semver range>`  
    This will add the specified package from locally available apt packages  
    e.g 
    - `yarn apt-add enhanced-resolve@5.9.2`
    - `yarn apt-add enhanced-resolve@^5.0.0`
    - `yarn apt-add enhanced-resolve@~5.9.0`  
  

2. `yarn apt-install`  
    This will add all dependencies listed in package.json from locally available apt packages  


3. `yarn apt-reset`  
    This will remove all occurrences of apt in package.json and leave only dependency versions/ranges 

## Note  

Dependencies are gotten from npm when:  
- The dependency is not locally available through apt
- The locally available apt package's version doesn't satisfy the requested version or range
- The locally available apt package contains symlinks
- The locally available apt package contains wrong dependency versions in its package.json