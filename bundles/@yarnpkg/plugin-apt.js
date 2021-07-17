/* eslint-disable */
//prettier-ignore
module.exports = {
name: "@yarnpkg/plugin-apt",
factory: function (require) {
var plugin=(()=>{var i=(n,e)=>()=>(e||n((e={exports:{}}).exports,e),e.exports);var o=i((h,c)=>{c.exports={name:"yarn-plugin-apt",factory:n=>{let{Command:e}=n("clipanion");class a extends e{async execute(){let t=n("child_process").exec(`bash scripts/nodePath.sh ${this.package}`);t.stdout.on("data",s=>{this.context.stdout.write(s)}),t.stderr.on("data",s=>{this.context.stderr.write(`${this.package} is not installed
`)})}}return a.addOption("package",e.String("--resolve")),a.addOption("package",e.String("-r")),a.addPath("dop-check"),a.usage=e.Usage({description:`
            ------------------------------------------

            Yarn2 apt module resolve plugin for debian

            ------------------------------------------

            `,details:`
            This command will check if a package is installed on your machine

            The command "dop" = Debian Outreachy project, in appreciation of Debian

            and Outreachy for sponsoring this plugin 


            Special thanks to the Debian community js-team \u2764
            `,examples:[[`Check if memfs is installed
`,`yarn dop-check --resolve memfs
`]]}),{commands:[a]}}}});return o();})();
return plugin;
}
};
