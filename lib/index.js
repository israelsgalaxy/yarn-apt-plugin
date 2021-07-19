module.exports = {
    name: `yarn-plugin-apt`,
    factory: (require) => {
        const { Command } = require(`clipanion`);
        class Ceck extends Command {
            async execute() {
                const exec = require('child_process').exec;
                const packagePath = exec(`nodepath ${this.package}`);
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
