"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const afterAllInstalled = () => {
    console.log("Everything Installed");
};
module.exports = {
    name: `yarn2-plugin-apt`,
    factory: (require) => {
        const { Command, UsageError, } = require(`clipanion`);
        class Ceck extends Command {
            async execute() {
                //lists names of packages
                const getDirectories = (source) => fs_1.readdirSync(source, { withFileTypes: true })
                    .filter(dirent => dirent.isDirectory())
                    .map(dirent => dirent.name);
                const modules = getDirectories('/usr/share/nodejs');
                if (modules.indexOf(this.package) == -1) {
                    throw new UsageError(`${this.package} is not an installed module\n`);
                }
                else {
                    this.context.stdout.write(`${this.package}\n`);
                }
            }
        }
        Ceck.addOption(`package`, Command.String(`--resolve`));
        Ceck.addOption(`package`, Command.String(`-r`));
        Ceck.addPath(`dop`);
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
                    `yarn dop --resolve memfs\n`
                ]]
        });
        class Deet extends Command {
            async execute() {
            }
        }
        Deet.addPath(`detail`);
        return {
            commands: [
                Ceck,
                Deet
            ]
        };
    }
};
