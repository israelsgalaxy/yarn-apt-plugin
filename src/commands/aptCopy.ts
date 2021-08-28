import {BaseCommand}                                        from '@yarnpkg/cli';
import {Configuration, Manifest}                            from '@yarnpkg/core';
import {execUtils, scriptUtils, structUtils}                from '@yarnpkg/core';
import {xfs, ppath, npath }                                 from '@yarnpkg/fslib';
import {Command, Option, Usage, UsageError}                 from 'clipanion';


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

  packages = Option.Array(`--pkg`, {
    description: `Packages to copy`,
  });
  all = Option.Boolean(`-l,--all`, false, {
    description: `Copy all Packages`,
  });
  
  async execute(): Promise<any> {

    const opts = !!this.packages || this.all;
    if(!opts)
        throw new UsageError(`"apt copy" command requires a option of the package to copy. Run "yarn apt copy --help" for usage information`);
    
    try{

      return this.copy()  
        
    }catch(err){
        console.error('error:',err)
    }
  }


  async find(pkg_names: string[]){
    pkg_names = pkg_names.filter(
        (e)=> !xfs.existsSync(npath.toPortablePath(this.context.cwd +`/node_modules/${e}`))
    )
    let results: PromiseSettledResult<{name: string; data: string}>[] = await Promise.allSettled(
        pkg_names.map(e=>this.resolvePackage(e))
    )
    let found = results
        .map(e=>e.status === 'fulfilled' && e.value)
        .filter(e=>e)

    let notFound = results
        .map(e=>e.status === 'rejected' && e.reason.name)
        .filter(e=>e)

    return {
        found,
        notFound
    }
}

resolvePackage(name) {
    return new Promise<{name: string; data: string}>(async(resolve, reject) => {
      const {stdout, stderr} = await execUtils.execvp(`nodepath`, [name], {
        cwd: this.context.cwd,
      });
      if(stdout){
        return resolve({name, data: stdout.replace(/(\r\n|\n|\r)/gm, "")});
      }
      return reject({name, data: `Cannot find module ${name}`})
        

    });
}


  async copy(){
    const manifest = (await Manifest.tryFind(this.context.cwd))|| new Manifest();

    let deps: string[] = this.all ? Object.keys(manifest.raw.dependencies || {}) : this.packages;

    let results = await this.find(deps);
    console.log('results:', results)
    
    const found = results.found
    
    const not_found = results.notFound
    
    if(not_found.length){
          found.length && console.log(
              `INSTALLED VIA APT:\n`,
              `-----------------\n`,
              ...found.map(e=>`${e.name} => ${e.data}\n`)
          );
          not_found.length && console.log(
              `THE FOLLOWING PACKAGES ARE NOT INSTALLED: \n`,
              `----------------------------------------\n`,
              ...not_found.map(e=>`${e}\n`)
          )

    }
    
    return await Promise.allSettled(
      found.map(({name, data})=>{
        const cwd = this.context.cwd;
        return  execUtils.execvp(`cp`, ['-rL', data, cwd+'/node_modules/'+name], {
            cwd,
          });
    
      })
    )
  }

}