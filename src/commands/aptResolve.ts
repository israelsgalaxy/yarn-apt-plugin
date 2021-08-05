import {BaseCommand}                              from '@yarnpkg/cli';
import {execUtils, scriptUtils}                   from '@yarnpkg/core';
import {xfs }                                     from '@yarnpkg/fslib';
import {Command, Option, Usage, UsageError}       from 'clipanion';


export default class AptCommand extends BaseCommand {
  static paths = [
    [`apt`]
  ];

  static usage: Usage = Command.Usage({
    description: `
    ------------------------------------------\n
    Yarn2 apt module resolve plugin for debian\n
    ------------------------------------------\n
    `,
    details: `
    The apt command check if a node module is installed via apt, \n
    if true resolves and links the module as a project dependency\n
    for the nodejs project within which the command was ran.
    `,
    examples: [[
      `Resolves specified dependencies (example, mocha and jest) if found\n
       in Debian node paths`,
      `yarn apt -r=mocha --resolve=jest`,
    ], [
      `Resolves specified devDependencies (mocha and jest) if all found\n
       in Debian node paths`,
      `yarn apt -rd=mocha --resolve-dev=jest`,
    ]],
});

  package = Option.Array(`-r,--resolve`, {
    description: `Resolve specific dependencies`
  });
  devDep = Option.Array(`-rd,--resolve-dev`, {
    description: `Resolve specific dev dependencies`,
  });
 

  async execute() {

    try{
     
        const opts = [!!this.package, !!this.devDep]

        if(opts.filter(e=>e).length > 1)
          return 0

        let pkgs: Array<string> =  (this.package || this.devDep);

        console.log('packages:', pkgs)
        if(!pkgs)
          throw new UsageError(`apt command requires an option of the package(s) to resolve. Run "yarn apt --help" for usage information`);
    


        if(pkgs)
          return this.addPackages(pkgs)   
        
    }catch(err){
        console.error(err)
    }
}

resolvePackage(name) {
  return new Promise<{name: string; data: string}>(async(resolve, reject) => {
    const {stdout, stderr} = await execUtils.execvp(`nodepath`, [name], {
      cwd: this.context.cwd,
    });
    if(stdout){
      return resolve({name, data: stdout});
    }
    return reject({name, data: `Cannot find module ${name}`})
      

  });
}

async find(pkg_names: string[]){
    let results: PromiseSettledResult<{name: string; data: string}>[] = await Promise.allSettled(
        pkg_names.map(e=>this.resolvePackage(e))
    )
    let found = results
        .map(e=>e.status === 'fulfilled' && e.value)
        .filter(e=>e)

    let notFound = results
        .map(e=>e.status === 'rejected' && e.reason.name)
        .filter(e=>e)

        found.length && console.log(
          `FOUND:\n`,
          `-----\n`,
          ...found.map(e=>`${e.name} => ${e.data}`)
      );
      notFound.length && console.log(
          `THE FOLLOWING PACKAGES ARE NOT INSTALLED: \n`,
          `----------------------------------------\n`,
          ...notFound.map(e=>`${e}\n`)
      )

    return {
        found,
        notFound
    }
}



async addPackages(names: string[]): Promise<any> {

    const pkgs = await this.find(names)

    const descriptors = pkgs.found.map(({name,data})=>{
        const range = `file:${data.replace(/(\r\n|\n|\r)/gm, "")}`
        return `${name}@${range}`
    })
    
    const args: Array<string> = [];
    if (this.devDep)
      args.push(`-D`);


    return await xfs.mktempPromise(async binFolder => {
      const {code} = await execUtils.pipevp(`yarn`, [`add`, ...args, ...descriptors], {
        cwd: this.context.cwd,
        stdin: this.context.stdin,
        stdout: this.context.stdout,
        stderr: this.context.stderr,
        env: await scriptUtils.makeScriptEnv({binFolder}),
      });

      return code;
    });
  }
  
  
}
