import readdirp from "readdirp";
import { readdirSync } from "fs";

const afterAllInstalled = () => {
    console.log("Everything Installed");
}

module.exports = {
    name: `yarn2-plugin-apt`,
    factory: (require: any) => {        
        const {Command} = require(`clipanion`);

        class Ceck extends Command {
            async execute(){
                //for await (const entry of readdirp('/usr/share/nodejs')) {
                  //  const path = entry
                  //  console.log(`${JSON.stringify({path})}`);
                    
                //}
                //lists names of packages
                const getDirectories = (source: any) => readdirSync(source, {withFileTypes: true})
                .filter(dirent => dirent.isDirectory())
                .map(dirent => dirent.name)
                console.log(getDirectories('/usr/share/nodejs'));
                
                this.context.stdout.write(`New Plugin?`);
            }
        }
        
        Ceck.addPath(`hev`);
        return{
            commands: [
                Ceck
            ]
        }
    }
}