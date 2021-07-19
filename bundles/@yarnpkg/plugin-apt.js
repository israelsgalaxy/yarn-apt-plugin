/* eslint-disable */
//prettier-ignore
module.exports = {
name: "@yarnpkg/plugin-apt",
factory: function (require) {
var plugin=(()=>{var d=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports);var c=d((l,o)=>{o.exports={name:"yarn-plugin-apt",factory:t=>{let{Command:e}=t("clipanion");class a extends e{async execute(){let n=t("child_process").exec(`nodepath ${this.package}`);n.stdout.on("data",s=>{this.context.stdout.write(s)}),n.stderr.on("data",s=>{this.context.stderr.write(`${this.package} is not installed
`)})}}return a.addOption("package",e.String("--resolve")),a.addOption("package",e.String("-r")),a.addPath("apt"),a.usage=e.Usage({description:`
            ------------------------------------------

            Yarn2 apt module resolve plugin for debian

            ------------------------------------------

            `,details:`
            The apt command check if a node module is installed via apt, 

            if true resolves and links the module as a project dependency

            for the nodejs project within which the command was ran.
            `,examples:[[`Resolve memfs package
`,`yarn apt --resolve memfs
`]]}),{commands:[a]}}}});return c();})();
return plugin;
}
};
