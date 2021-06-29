const afterAllInstalled = () => {
    console.log("Everything Installed");
}

module.exports = {
    name: `yarn2-plugin-apt`,
    factory: (require) => {
        const {Command} = require(`clipanion`);

        class Ceck extends Command {
            async execute(){
                this.context.stdout.write(`New Plugin, innit?`);
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