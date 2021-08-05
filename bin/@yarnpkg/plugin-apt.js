/* eslint-disable */
//prettier-ignore
module.exports = {
name: "@yarnpkg/plugin-apt",
factory: function (require) {
var plugin=(()=>{var I=Object.create,x=Object.defineProperty;var N=Object.getOwnPropertyDescriptor;var L=Object.getOwnPropertyNames;var F=Object.getPrototypeOf,C=Object.prototype.hasOwnProperty;var A=n=>x(n,"__esModule",{value:!0});var i=n=>{if(typeof require!="undefined")return require(n);throw new Error('Dynamic require of "'+n+'" is not supported')};var B=(n,t)=>{for(var a in t)x(n,a,{get:t[a],enumerable:!0})},_=(n,t,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of L(t))!C.call(n,s)&&s!=="default"&&x(n,s,{get:()=>t[s],enumerable:!(a=N(t,s))||a.enumerable});return n},r=n=>_(A(x(n!=null?I(F(n)):{},"default",n&&n.__esModule&&"default"in n?{get:()=>n.default,enumerable:!0}:{value:n,enumerable:!0})),n);var Y={};B(Y,{default:()=>H});var U=r(i("@yarnpkg/cli")),y=r(i("@yarnpkg/core")),E=r(i("@yarnpkg/fslib")),d=r(i("clipanion")),k=class extends U.BaseCommand{constructor(){super(...arguments);this.package=d.Option.Array("-r,--resolve",{description:"Resolve specific dependencies"});this.devDep=d.Option.Array("-rd,--resolve-dev",{description:"Resolve specific dev dependencies"})}async execute(){try{if([!!this.package,!!this.devDep].filter(s=>s).length>1)return 0;let a=this.package||this.devDep;if(console.log("packages:",a),!a)throw new d.UsageError('apt command requires an option of the package(s) to resolve. Run "yarn apt --help" for usage information');if(a)return this.addPackages(a)}catch(t){console.error(t)}}resolvePackage(t){return new Promise(async(a,s)=>{let{stdout:o,stderr:e}=await y.execUtils.execvp("nodepath",[t],{cwd:this.context.cwd});return o?a({name:t,data:o}):s({name:t,data:`Cannot find module ${t}`})})}async find(t){let a=await Promise.allSettled(t.map(e=>this.resolvePackage(e))),s=a.map(e=>e.status==="fulfilled"&&e.value).filter(e=>e),o=a.map(e=>e.status==="rejected"&&e.reason.name).filter(e=>e);return s.length&&console.log(`FOUND:
`,`-----
`,...s.map(e=>`${e.name} => ${e.data}`)),o.length&&console.log(`THE FOLLOWING PACKAGES ARE NOT INSTALLED: 
`,`----------------------------------------
`,...o.map(e=>`${e}
`)),{found:s,notFound:o}}async addPackages(t){let s=(await this.find(t)).found.map(({name:e,data:m})=>{let g=`file:${m.replace(/(\r\n|\n|\r)/gm,"")}`;return`${e}@${g}`}),o=[];return this.devDep&&o.push("-D"),await E.xfs.mktempPromise(async e=>{let{code:m}=await y.execUtils.pipevp("yarn",["add",...o,...s],{cwd:this.context.cwd,stdin:this.context.stdin,stdout:this.context.stdout,stderr:this.context.stderr,env:await y.scriptUtils.makeScriptEnv({binFolder:e})});return m})}};k.paths=[["apt"]],k.usage=d.Command.Usage({description:`
    ------------------------------------------

    Yarn2 apt module resolve plugin for debian

    ------------------------------------------

    `,details:`
    The apt command check if a node module is installed via apt, 

    if true resolves and links the module as a project dependency

    for the nodejs project within which the command was ran.
    `,examples:[[`Resolves specified dependencies (example, mocha and jest) if found

       in Debian node paths`,"yarn apt -r=mocha --resolve=jest"],[`Resolves specified devDependencies (mocha and jest) if all found

       in Debian node paths`,"yarn apt -rd=mocha --resolve-dev=jest"]]});var O=k;var R=r(i("@yarnpkg/cli")),P=r(i("@yarnpkg/core")),c=r(i("@yarnpkg/core")),p=r(i("@yarnpkg/fslib")),D=r(i("clipanion")),v=class extends R.BaseCommand{constructor(){super(...arguments);this.localOnly=D.Option.Boolean("-l,--local",!1,{description:"Resolve packages if all are found locally"})}async execute(){try{return this.install()}catch(t){console.error(t)}}async find(t){t=t.filter(e=>!p.xfs.existsSync(p.npath.toPortablePath(this.context.cwd+`/node_modules/${e}`)));let a=await Promise.allSettled(t.map(e=>this.resolvePackage(e))),s=a.map(e=>e.status==="fulfilled"&&e.value).filter(e=>e),o=a.map(e=>e.status==="rejected"&&e.reason.name).filter(e=>e);return{found:s,notFound:o}}resolvePackage(t){return new Promise(async(a,s)=>{let{stdout:o,stderr:e}=await c.execUtils.execvp("nodepath",[t],{cwd:this.context.cwd});return o?a({name:t,data:o}):s({name:t,data:`Cannot find module ${t}`})})}async install(){let t=await P.Manifest.tryFind(this.context.cwd)||new P.Manifest,a=Object.keys(t.raw.dependencies||{}),s=Object.keys(t.raw.devDependencies||{}),o=await this.find(a),e=await this.find(s),m=[...o.found,...e.found],g=[...o.notFound,...e.notFound];if(g.length&&this.localOnly)return m.length&&console.log(`INSTALLED VIA APT:
`,`-----------------
`,...m.map(l=>`${l.name} => ${l.data}`)),g.length&&console.log(`THE FOLLOWING PACKAGES ARE NOT INSTALLED: 
`,`----------------------------------------
`,...g.map(l=>`${l}
`)),0;o.found.forEach(({name:l,data:u})=>{let h=c.structUtils.makeDescriptor(c.structUtils.makeIdent(null,l),`file:${u.replace(/(\r\n|\n|\r)/gm,"")}`);t.dependencies.set(h.identHash,h)}),e.found.forEach(({name:l,data:u})=>{let h=c.structUtils.makeDescriptor(c.structUtils.makeIdent(null,l),`file:${u.replace(/(\r\n|\n|\r)/gm,"")}`);t.devDependencies.set(h.identHash,h)});let j={};t.exportTo(j);let T=p.ppath.join(this.context.cwd,P.Manifest.fileName);return await p.xfs.changeFilePromise(T,`${JSON.stringify(j,null,2)}
`,{automaticNewlines:!0}),await p.xfs.mktempPromise(async l=>{let{code:u}=await c.execUtils.pipevp("yarn",["install"],{cwd:this.context.cwd,stdin:this.context.stdin,stdout:this.context.stdout,stderr:this.context.stderr,env:await c.scriptUtils.makeScriptEnv({binFolder:l})});return u})}};v.paths=[["apt","install"]],v.usage=D.Command.Usage({description:`
    ---------------------------

    Yarnpkg apt install command

    ---------------------------

    `,details:`
    The 'apt install' command resolves all your project

    dependencies as specified in package.json
    `,examples:[[`Resolve all packages found in Debian node paths and
         fetch those not found fron npm registry`,"yarn apt install"],[`Check if all project dependecies are safisfied by local
         files in Debian node paths. Resolve only if all is satisfied`,"yarn apt install --local"]]});var $=v;var b=r(i("@yarnpkg/cli")),f=r(i("clipanion")),w=class extends b.BaseCommand{constructor(){super(...arguments);this.packages=f.Option.Array("-pkg",{description:"Packages to copy"});this.all=f.Option.Boolean("-l,--all",!1,{description:"Copy all Packages"})}async execute(){if(!(!!this.packages||this.all))throw new f.UsageError('"apt copy" command requires a option of the package to copy. Run "yarn apt copy --help" for usage information');this.packages&&console.log("packages to copy:",this.packages),console.log("Implementation in development :)")}};w.paths=[["apt","copy"]],w.usage=f.Command.Usage({description:`
    ------------------------

    Yarnpkg apt copy command

    ------------------------

    `,details:`
    The 'apt copy' command copies all/specified packages if

    found in Debian node paths to node_modules directory
    `,examples:[[`Copy specified packages (mocha and jest) if all found

         in Debian node paths`,"yarn apt copy -pkg=mocha -pkg=jest"],[`Copy all dependencies specified in package.json if all

        found in Debian node paths`,"yarn apt copy --all"]]});var S=w;var G={commands:[O,$,S]},H=G;return Y;})();
return plugin;
}
};
