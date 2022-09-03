# yarn-apt plugin

This yarn plugin allows apt-installed packages satisfy a Nodejs project's dependencies.

## Getting started

### Prerequisites

- Install Yarn from apt  
`apt install yarnpkg`
- Install nodepath  
`apt install pkg-js-tools`

### Local plugin development

- Clone the repository  
`git clone https://salsa.debian.org/izzygala/yarn-plugin-apt.git`
- `cd` into plugin folder (All the remaining commands should be run in this folder)
- Set Yarn version to berry  
`yarnpkg set version berry`
- Install plugin dependencies  
`yarnpkg install`
- Build plugin  
`yarnpkg run build` or `yarnpkg builder build plugin`

### Adding plugin to your project

- `cd` into your Nodejs project's folder (All the remaining commands should be run in this folder)
- Initialise Yarn (Skip if package.json already exists)  
`yarnpkg init`
- Set Yarn version to berry  
`yarnpkg set version berry`
- Set Yarn version to latest upstream (You need to symlink yarn command to yarnpkg command using `ln -s /path/to/bin/folder/yarnpkg /path/to/bin/folder/yarn` for this command to work. You can destroy the symlink after this command using `rm /path/to/bin/folder/yarn`)  
`yarnpkg set version from sources`
- Import plugin  
`yarnpkg plugin import path/to/plugin/folder/bundles/@yarnpkg/plugin-apt.js`

## Usage

Command | Use | Options | Example
--------|-----|---------|--------
`yarnpkg apt-add <package name>@<package version or package semver range>` | This will add the specified package from locally available apt packages | -D: Adds as a dev dependency, -P: Adds as a peer dependency | `yarnpkg apt-add enhanced-resolve@5.9.2`, `yarnpkg apt-add enhanced-resolve@^5.0.0`, `yarnpkg apt-add enhanced-resolve@~5.9.0`  
`yarnpkg apt-install` | This will add all dependencies listed in package.json from locally available apt packages | Nil | `yarnpkg apt-install`  
`yarnpkg apt-reset` | This will remove all occurrences of apt in package.json and leave only dependency versions/ranges | Nil | `yarnpkg apt-reset`

## Note

Dependencies are gotten from npm when:
- The dependency is not locally available through apt
- The locally available apt package's version doesn't satisfy the requested version or range
- The locally available apt package contains symlinks
- The locally available apt package contains wrong dependency versions in its package.json

## Acknowledgements

The Sponsors:  
Debian js-team and Outreachy Internships  

The Mentors:  
Pirate Praveen  
Akshay S Dinesh  

Past Interns:  
Sunday Nkwuda  
Ajayi Olatunji  

Every member of the Debian js-team