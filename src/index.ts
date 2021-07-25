
module.exports = {
    name: `yarn-plugin-apt`,
    factory: (require) => {
        const { Command } = require(`clipanion`);
        const { execUtils, scriptUtils} = require('@yarnpkg/core');
        const {xfs} = require('@yarnpkg/fslib');

        class Ceck extends Command {
            async execute() {

                const child_process = require('child_process');

                try{
                    const name = this.package || this.devDep
                    const packagePath = child_process.exec(`nodepath ${name}`);

                       packagePath.stdout.on('data', async (data)=>{
                          
                        await this.addPackage({name,range: `file:${data.replace(/(\r\n|\n|\r)/gm, "")}`})
                      });
                      packagePath.stderr.on('data', ()=>{
                        this.context.stderr.write(`${name} is not installed\n`);
                    });
  
                }catch(err){
                    console.error(err)
                }
            }

            async addPackage({name, range}) {
                
                const args: Array<string> = [];
                if (this.devDep)
                  args.push(`-D`);

                const descriptor = `${name}@${range}`
            
                return await xfs.mktempPromise(async binFolder => {
                  const {code} = await execUtils.pipevp(`yarn`, [`add`, ...args, descriptor], {
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
        Ceck.addOption(`package`, Command.String(`--resolve`));
        Ceck.addOption(`package`, Command.String(`-r`));
        Ceck.addOption(`devDep`, Command.String(`--resolve-dev`));
        Ceck.addOption(`devDep`, Command.String(`-rd`));
        Ceck.addPath(`apt`);
        Ceck.usage = Command.Usage({
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
                    `Resolve memfs package\n`,
                    `yarn apt --resolve memfs\n`
                ]]
        });
        return {
            commands: [
                Ceck,
            ]
        };
    }
};
