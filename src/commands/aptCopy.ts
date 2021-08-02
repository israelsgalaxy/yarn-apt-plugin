import {BaseCommand}                                              from '@yarnpkg/cli';
import {Command, Option, Usage, UsageError}                       from 'clipanion';


export default class AptCommand extends BaseCommand {
  static paths = [
    [`apt`, `copy`]
  ];

  static usage: Usage = Command.Usage({
    description: `
    ------------------------\n
    Yarnpkg apt copy command\n
    ------------------------\n
    `,
    details: `
    The 'apt copy' command copies all/specified packages if\n
    found in Debian node paths to node_modules directory
    `,
    examples: [[
        `Copy specified packages (mocha and jest) if all found\n
         in Debian node paths`,
        `yarn apt copy -pkg=mocha -pkg=jest`,
      ], [
        `Copy all dependencies specified in package.json if all\n
        found in Debian node paths`,
        `yarn apt copy --all`,
      ]],
  });

  packages = Option.Array(`-pkg`, {
    description: `Packages to copy`,
  });
  all = Option.Boolean(`-l,--all`, false, {
    description: `Copy all Packages`,
  });
  
  async execute() {

    const opts = !!this.packages || this.all;
    if(!opts)
        throw new UsageError(`"apt copy" command requires a option of the package to copy. Run "yarn apt copy --help" for usage information`);
    
    if(this.packages)
        console.log('packages to copy:', this.packages)
    
    console.log('Implementation in development :)')
    return
  }

}