"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readdirp_1 = __importDefault(require("readdirp"));
module.exports = {
    name: `yarn2-plugin-apt`,
    factory: (require) => {
        const { Command, UsageError, } = require(`clipanion`);
        const nodeDir = '/usr/share/nodejs';
        class Ceck extends Command {
            async execute() {
                //lists names of packages
                // const getDirectories = (source: any) => readdirSync(source, {withFileTypes: true})
                // .filter(dirent => dirent.isDirectory())
                // .map(dirent => dirent.name)
                // const modules = getDirectories(nSodeDir)
                // const atModule = modules.filter((module) => module.startsWith('@'))
                const moduleDir = async (source) => {
                    var paths = [];
                    for await (const iterator of readdirp_1.default(source, {
                        fileFilter: ['*.js', 'index.js', '!*.test.js'],
                        directoryFilter: ['!node_modules', '!types'],
                        depth: 4
                    })) {
                        paths.push((iterator.fullPath));
                    }
                    // const path = JSON.stringify(paths)
                    // writeFileSync('./paah.txt', path)
                    return paths;
                };
                const themodule = await moduleDir(nodeDir);
                // console.log(themodule);
                const regex = new RegExp(`\\b/${this.package}\\b`);
                const matcch = themodule.filter(value => regex.test(value));
                if (matcch.length > 0) {
                    console.log(matcch);
                }
                else {
                    this.context.stdout.write(`Module is not installed\n`);
                }
                // //if package isn't found in first dir level, check next
                // if (modules.indexOf(this.package) == -1) {  
                //     // const innerModule = atModule.map((modul) =>
                //     //  getDirectories(join(nodeDir, modul)))
                //     // .reduce((prev, curr) => prev.concat(curr));
                //     // if (innerModule.indexOf(this.package) == -1) {
                //     //     this.context.stdout.write(`don't exist`)
                //     // }
                //     var paths: string[] = [];
                //     for await (const iterator of readdirp(nodeDir, {fileFilter: 'index.js'})) {
                //        paths.push((iterator.fullPath))                       
                //     }
                //     const path = JSON.stringify(paths)
                //     writeFileSync('./paah.txt', path)
                //     //find the real path of package
                //     // this.context.stdout.write(`\n${realpathSync(`${this.package}`)}\n`);
                // } else{
                // this.context.stdout.write(`${this.package}\n`);
                // }
            }
        }
        // class AllPkg extends Command {
        //     async execute() {
        //         // this.context.stdout.write(`Hey \n`);
        //         const checkcwd = this.context.cwd;
        //         const getFiles = (source: any) => readdirSync(source, {withFileTypes: true})
        //         .filter(dirent => dirent.isFile())
        //         .map(dirent => dirent.name)
        //         const file_ = getFiles(checkcwd);
        //         if (file_.indexOf('package.json') == -1) {    
        //             throw new UsageError(`You are working in a wrong directory\n`)                
        //         } else{
        //         this.context.stdout.write(`${this.package}\n`);
        //         }
        //     }
        // }
        Ceck.addOption(`package`, Command.String(`--resolve`));
        Ceck.addOption(`package`, Command.String(`-r`));
        Ceck.addPath(`dop-check`);
        // AllPkg.addPath(`dop-install`);
        Ceck.usage = Command.Usage({
            description: `
            ------------------------------------------\n
            Yarn2 apt module resolve plugin for debian\n
            ------------------------------------------\n
            `,
            details: `
            This command will check if a package is installed on your machine\n
            The command "dop" = Debian Outreachy project, in appreciation of Debian\n
            and Outreachy for sponsoring this plugin \n

            Special thanks to the Debian community js-team \u2764
            `,
            examples: [[
                    `Check if memfs is installed\n`,
                    `yarn dop-check --resolve memfs\n`
                ]]
        });
        return {
            commands: [
                Ceck,
            ]
        };
    }
};
