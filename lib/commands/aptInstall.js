"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cli_1 = require("@yarnpkg/cli");
const core_1 = require("@yarnpkg/core");
const core_2 = require("@yarnpkg/core");
const fslib_1 = require("@yarnpkg/fslib");
const clipanion_1 = require("clipanion");
class AptCommand extends cli_1.BaseCommand {
    constructor() {
        super(...arguments);
        this.localOnly = clipanion_1.Option.Boolean(`-l,--local`, false, {
            description: `Resolve if all found locally`,
        });
    }
    async execute() {
        try {
            return this.install();
        }
        catch (err) {
            console.error(err);
        }
    }
    async find(pkg_names) {
        pkg_names = pkg_names.filter((e) => !fslib_1.xfs.existsSync(fslib_1.npath.toPortablePath(this.context.cwd + `/node_modules/${e}`)));
        let results = await Promise.allSettled(pkg_names.map(e => this.resolvePackage(e)));
        let found = results
            .map(e => e.status === 'fulfilled' && e.value)
            .filter(e => e);
        let notFound = results
            .map(e => e.status === 'rejected' && e.reason.name)
            .filter(e => e);
        return {
            found,
            notFound
        };
    }
    resolvePackage(name) {
        return new Promise(async (resolve, reject) => {
            const { stdout, stderr } = await core_2.execUtils.execvp(`nodepath`, [name], {
                cwd: this.context.cwd,
            });
            if (stdout) {
                return resolve({ name, data: stdout });
            }
            return reject({ name, data: `Cannot find module ${name}` });
        });
    }
    async install() {
        const manifest = (await core_1.Manifest.tryFind(this.context.cwd));
        let deps = Object.keys(manifest.raw.dependencies);
        let devDeps = Object.keys(manifest.raw.devDependencies);
        let results_deps = await this.find(deps);
        let results_devDeps = await this.find(devDeps);
        const all_found = [...results_deps.found, ...results_devDeps.found];
        const all_not_found = [...results_deps.notFound, ...results_devDeps.notFound];
        if (all_not_found.length) {
            if (this.localOnly) {
                all_found.length && console.log(`INSTALLED VIA APT:\n`, `-----------------\n`, ...all_found.map(e => `${e.name} => ${e.data}`));
                all_not_found.length && console.log(`THE FOLLOWING PACKAGES ARE NOT INSTALLED: \n`, `----------------------------------------\n`, ...all_not_found.map(e => `${e}\n`));
                return 0;
            }
        }
        results_deps.found.forEach(({ name, data }) => {
            const descriptor = core_2.structUtils.makeDescriptor(core_2.structUtils.makeIdent(null, name), `file:${data.replace(/(\r\n|\n|\r)/gm, "")}`);
            manifest.dependencies.set(descriptor.identHash, descriptor);
        });
        results_devDeps.found.forEach(({ name, data }) => {
            const descriptor = core_2.structUtils.makeDescriptor(core_2.structUtils.makeIdent(null, name), `file:${data.replace(/(\r\n|\n|\r)/gm, "")}`);
            manifest.devDependencies.set(descriptor.identHash, descriptor);
        });
        const serialized = {};
        manifest.exportTo(serialized);
        const manifestPath = fslib_1.ppath.join(this.context.cwd, core_1.Manifest.fileName);
        await fslib_1.xfs.changeFilePromise(manifestPath, `${JSON.stringify(serialized, null, 2)}\n`, {
            automaticNewlines: true,
        });
        return await fslib_1.xfs.mktempPromise(async (binFolder) => {
            const { code } = await core_2.execUtils.pipevp(`yarn`, [`install`], {
                cwd: this.context.cwd,
                stdin: this.context.stdin,
                stdout: this.context.stdout,
                stderr: this.context.stderr,
                env: await core_2.scriptUtils.makeScriptEnv({ binFolder }),
            });
            return code;
        });
    }
}
exports.default = AptCommand;
AptCommand.paths = [
    [`apt`, `install`]
];
AptCommand.usage = clipanion_1.Command.Usage({
    description: `
    ---------------------------\n
    Yarnpkg apt install command\n
    ---------------------------\n
    `,
    details: `
    The 'apt install' command resolves all your project\n
    dependencies as specified in package.json
    `,
    examples: [[
            `Resolve all packages found in Debian node paths and
         fetch those not found fron npm registry`,
            `yarn apt install`,
        ], [
            `Check if all project dependecies are safisfied by local
         files in Debian node paths. Resolve only if all is satisfied`,
            `yarn apt install --local`,
        ]],
});
