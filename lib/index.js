module.exports = {
    name: `yarn-plugin-apt`,
    factory: (require) => {
        const { Command } = require(`clipanion`);
        class Ceck extends Command {
            async execute() {
                const exec = require('child_process').exec;
                const packagePath = exec(`bash scripts/nodePath.sh ${this.package}`);
                packagePath.stdout.on('data', (data) => {
                    this.context.stdout.write(data);
                });
                packagePath.stderr.on('data', (data) => {
                    this.context.stderr.write(`${this.package} is not installed\n`);
                });
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
