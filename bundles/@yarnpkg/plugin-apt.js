/* eslint-disable */
//prettier-ignore
module.exports = {
name: "@yarnpkg/plugin-apt",
factory: function (require) {
var plugin=(()=>{var d=(e,a)=>()=>(a||e((a={exports:{}}).exports,a),a.exports);var p=d((l,i)=>{i.exports={name:"yarn-plugin-apt",factory:e=>{let{Command:a}=e("clipanion");class n extends a{async execute(){let o=e("child_process").exec,c=e("path"),t=o(`bash ${c.join(__dirname,"..","scripts/nodePath.sh")} ${this.package}`);t.stdout.on("data",s=>{this.context.stdout.write(s)}),t.stderr.on("data",s=>{this.context.stderr.write(`${this.package} is not installed
`)})}}return n.addOption("package",a.String("--resolve")),n.addOption("package",a.String("-r")),n.addPath("dop-check"),n.usage=a.Usage({description:`
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
`]]}),{commands:[n]}}}});return p();})();
return plugin;
}
};
