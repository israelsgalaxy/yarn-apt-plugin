/* eslint-disable */
//prettier-ignore
module.exports = {
name: "@yarnpkg/plugin-apt",
factory: function (require) {
var plugin=(()=>{var F=Object.create,D=Object.defineProperty;var I=Object.getOwnPropertyDescriptor;var C=Object.getOwnPropertyNames;var B=Object.getPrototypeOf,G=Object.prototype.hasOwnProperty;var _=o=>D(o,"__esModule",{value:!0});var i=o=>{if(typeof require!="undefined")return require(o);throw new Error('Dynamic require of "'+o+'" is not supported')};var H=(o,t)=>{for(var n in t)D(o,n,{get:t[n],enumerable:!0})},K=(o,t,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of C(t))!G.call(o,a)&&a!=="default"&&D(o,a,{get:()=>t[a],enumerable:!(n=I(t,a))||n.enumerable});return o},r=o=>K(_(D(o!=null?F(B(o)):{},"default",o&&o.__esModule&&"default"in o?{get:()=>o.default,enumerable:!0}:{value:o,enumerable:!0})),o);var q={};H(q,{default:()=>Y});var R=r(i("@yarnpkg/cli")),v=r(i("@yarnpkg/core")),S=r(i("@yarnpkg/fslib")),m=r(i("clipanion")),k=class extends R.BaseCommand{constructor(){super(...arguments);this.package=m.Option.Array("-r,--resolve",{description:"Resolve specific dependencies"});this.devDep=m.Option.Array("-rd,--resolve-dev",{description:"Resolve specific dev dependencies"})}async execute(){try{if([!!this.package,!!this.devDep].filter(a=>a).length>1)return 0;let n=this.package||this.devDep;if(console.log("packages:",n),!n)throw new m.UsageError('apt command requires an option of the package(s) to resolve. Run "yarn apt --help" for usage information');if(n)return this.addPackages(n)}catch(t){console.error(t)}}resolvePackage(t){return new Promise(async(n,a)=>{let{stdout:s,stderr:e}=await v.execUtils.execvp("nodepath",[t],{cwd:this.context.cwd});return s?n({name:t,data:s}):a({name:t,data:`Cannot find module ${t}`})})}async find(t){let n=await Promise.allSettled(t.map(e=>this.resolvePackage(e))),a=n.map(e=>e.status==="fulfilled"&&e.value).filter(e=>e),s=n.map(e=>e.status==="rejected"&&e.reason.name).filter(e=>e);return a.length&&console.log(`FOUND:
`,`-----
`,...a.map(e=>`${e.name} => ${e.data}`)),s.length&&console.log(`THE FOLLOWING PACKAGES ARE NOT INSTALLED: 
`,`----------------------------------------
`,...s.map(e=>`${e}
`)),{found:a,notFound:s}}async addPackages(t){let a=(await this.find(t)).found.map(({name:e,data:l})=>{let f=`file:${l.replace(/(\r\n|\n|\r)/gm,"")}`;return`${e}@${f}`}),s=[];return this.devDep&&s.push("-D"),await S.xfs.mktempPromise(async e=>{let{code:l}=await v.execUtils.pipevp("yarn",["add",...s,...a],{cwd:this.context.cwd,stdin:this.context.stdin,stdout:this.context.stdout,stderr:this.context.stderr,env:await v.scriptUtils.makeScriptEnv({binFolder:e})});return l})}};k.paths=[["apt"]],k.usage=m.Command.Usage({description:`
    ------------------------------------------

    Yarn2 apt module resolve plugin for debian

    ------------------------------------------

    `,details:`
    The apt command check if a node module is installed via apt, 

    if true resolves and links the module as a project dependency

    for the nodejs project within which the command was ran.
    `,examples:[[`Resolves specified dependencies (example, mocha and jest) if found

       in Debian node paths`,"yarn apt -r=mocha --resolve=jest"],[`Resolves specified devDependencies (mocha and jest) if all found

       in Debian node paths`,"yarn apt -rd=mocha --resolve-dev=jest"]]});var b=k;var T=r(i("@yarnpkg/cli")),E=r(i("@yarnpkg/core")),d=r(i("@yarnpkg/core")),p=r(i("@yarnpkg/fslib")),w=r(i("clipanion")),x=class extends T.BaseCommand{constructor(){super(...arguments);this.localOnly=w.Option.Boolean("-l,--local",!1,{description:"Resolve packages if all are found locally"});this.dev=w.Option.Boolean("-d,--dev",!1,{description:"Resolve both dependencies and devDependencies"})}async execute(){try{return this.install()}catch(t){console.error(t)}}async find(t){t=t.filter(e=>!p.xfs.existsSync(p.npath.toPortablePath(this.context.cwd+`/node_modules/${e}`)));let n=await Promise.allSettled(t.map(e=>this.resolvePackage(e))),a=n.map(e=>e.status==="fulfilled"&&e.value).filter(e=>e),s=n.map(e=>e.status==="rejected"&&e.reason.name).filter(e=>e);return{found:a,notFound:s}}resolvePackage(t){return new Promise(async(n,a)=>{let{stdout:s,stderr:e}=await d.execUtils.execvp("nodepath",[t],{cwd:this.context.cwd});return s?n({name:t,data:s}):a({name:t,data:`Cannot find module ${t}`})})}async install(){let t=await E.Manifest.tryFind(this.context.cwd)||new E.Manifest,n=Object.keys(t.raw.dependencies||{}),a=Object.keys(t.raw.devDependencies||{}),s=await this.find(n),e=this.dev&&await this.find(a),l=this.dev?[...s.found,...e.found]:[...s.found],f=this.dev?[...s.notFound,...e.notFound]:[...s.notFound];if(f.length&&this.localOnly)return l.length&&console.log(`INSTALLED VIA APT:
`,`-----------------
`,...l.map(c=>`${c.name} => ${c.data}`)),f.length&&console.log(`THE FOLLOWING PACKAGES ARE NOT INSTALLED: 
`,`----------------------------------------
`,...f.map(c=>`${c}
`)),0;s.found.forEach(({name:c,data:h})=>{let y=d.structUtils.makeDescriptor(d.structUtils.makeIdent(null,c),`file:${h.replace(/(\r\n|\n|\r)/gm,"")}`);t.dependencies.set(y.identHash,y)}),this.dev&&e.found.forEach(({name:c,data:h})=>{let y=d.structUtils.makeDescriptor(d.structUtils.makeIdent(null,c),`file:${h.replace(/(\r\n|\n|\r)/gm,"")}`);t.devDependencies.set(y.identHash,y)});let g={};t.exportTo(g);let j=p.ppath.join(this.context.cwd,E.Manifest.fileName);return await p.xfs.changeFilePromise(j,`${JSON.stringify(g,null,2)}
`,{automaticNewlines:!0}),await p.xfs.mktempPromise(async c=>{let{code:h}=await d.execUtils.pipevp("yarn",["install"],{cwd:this.context.cwd,stdin:this.context.stdin,stdout:this.context.stdout,stderr:this.context.stderr,env:await d.scriptUtils.makeScriptEnv({binFolder:c})});return h})}};x.paths=[["apt","install"]],x.usage=w.Command.Usage({description:`
    ---------------------------

    Yarnpkg apt install command

    ---------------------------

    `,details:`
    The 'apt install' command resolves all your project

    dependencies as specified in package.json
    `,examples:[[`Resolve all packages found in Debian node paths and
         fetch those not found fron npm registry`,"yarn apt install"],[`Check if all project dependecies are safisfied by local
         files in Debian node paths. Resolve only if all is satisfied`,"yarn apt install --local"]]});var L=x;var N=r(i("@yarnpkg/cli")),$=r(i("@yarnpkg/core")),O=r(i("@yarnpkg/core")),U=r(i("@yarnpkg/fslib")),u=r(i("clipanion")),P=class extends N.BaseCommand{constructor(){super(...arguments);this.packages=u.Option.Array("-pkg",{description:"Packages to copy"});this.all=u.Option.Boolean("-l,--all",!1,{description:"Copy all Packages"})}async execute(){if(!(!!this.packages||this.all))throw new u.UsageError('"apt copy" command requires a option of the package to copy. Run "yarn apt copy --help" for usage information');try{return await this.copy()}catch(n){console.error(n)}}async find(t){t=t.filter(e=>!U.xfs.existsSync(U.npath.toPortablePath(this.context.cwd+`/node_modules/${e}`)));let n=await Promise.allSettled(t.map(e=>this.resolvePackage(e))),a=n.map(e=>e.status==="fulfilled"&&e.value).filter(e=>e),s=n.map(e=>e.status==="rejected"&&e.reason.name).filter(e=>e);return{found:a,notFound:s}}resolvePackage(t){return new Promise(async(n,a)=>{let{stdout:s,stderr:e}=await O.execUtils.execvp("nodepath",[t],{cwd:this.context.cwd});return s?n({name:t,data:s.replace(/(\r\n|\n|\r)/gm,"")}):a({name:t,data:`Cannot find module ${t}`})})}async copy(){let t=await $.Manifest.tryFind(this.context.cwd)||new $.Manifest,n=this.all?Object.keys(t.raw.dependencies||{}):this.packages,a=await this.find(n);console.log("results:",a);let s=a.found,e=a.notFound;return e.length&&(s.length&&console.log(`INSTALLED VIA APT:
`,`-----------------
`,...s.map(l=>`${l.name} => ${l.data}
`)),e.length&&console.log(`THE FOLLOWING PACKAGES ARE NOT INSTALLED: 
`,`----------------------------------------
`,...e.map(l=>`${l}
`))),Promise.all(s.map(async({name:l,data:f})=>{let g=this.context.cwd,{code:j}=await O.execUtils.execvp("cp -R",[f,g+"/node_modules/"+l],{cwd:g});return j}))}};P.paths=[["apt","copy"]],P.usage=u.Command.Usage({description:`
    ------------------------

    Yarnpkg apt copy command

    ------------------------

    `,details:`
    The 'apt copy' command copies all/specified packages if

    found in Debian node paths to node_modules directory
    `,examples:[[`Copy specified packages (mocha and jest) if all found

         in Debian node paths`,"yarn apt copy -pkg=mocha -pkg=jest"],[`Copy all dependencies specified in package.json if all

        found in Debian node paths`,"yarn apt copy --all"]]});var A=P;var W={commands:[b,L,A]},Y=W;return q;})();
return plugin;
}
};
