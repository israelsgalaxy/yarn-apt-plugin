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
        const oldNodeDir = '/usr/lib/nodejs';
        class Ceck extends Command {
            async execute() {
                const moduleDir = async (source) => {
                    var paths = [];
                    for await (const iterator of readdirp_1.default(source, {
                        // fileFilter: ['*.js', 'index.js', '!*.test.js'],
                        directoryFilter: ['!node_modules', '!types'],
                        type: 'directories',
                        depth: 1
                    })) {
                        paths.push((iterator.fullPath));
                    }
                    return paths;
                };
                const nodeModule = await moduleDir(nodeDir);
                const oldNodeModule = await moduleDir(oldNodeDir);
                const allModules = [...nodeModule, ...oldNodeModule];
                // const merged = [].concat.apply([], allModules);
                const regex = new RegExp(`\\b/${this.package}\\b`);
                const matcch = allModules.filter(value => regex.test(value));
                if (matcch.length > 0) {
                    console.log(matcch);
                }
                else {
                    this.context.stdout.write(`Module is not installed\n`);
                }
            }
        }
        Ceck.addOption(`package`, Command.String(`--resolve`));
        Ceck.addOption(`package`, Command.String(`-r`));
        Ceck.addPath(`dop-check`);
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
