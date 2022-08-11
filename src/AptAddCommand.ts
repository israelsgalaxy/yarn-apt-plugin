import { BaseCommand } from '@yarnpkg/cli';
import { execUtils, Configuration } from '@yarnpkg/core';
import { Option, UsageError } from 'clipanion';

export default class AptAddCommand extends BaseCommand {
  static paths = [
    [`apt-add`],
  ]

  //   static usage: Usage = Command.Usage({
  //     description: ``,
  //     details: ``,
  //     examples: [[]],
  //   });

  dev = Option.Boolean(`-D,--dev`, false, {
    description: `Add a package as a dev dependency`,
  })

  peer = Option.Boolean(`-P,--peer`, false, {
    description: `Add a package as a peer dependency`,
  })

  // strict = Option.Boolean(`-S,--strict`, false, {
  //   description: `Resolve dependencies from apt in strict mode`,
  // })

  // relaxed = Option.Boolean(`-R,--relaxed`, false, {
  //   description: `Resolve dependencies from apt in strict mode`,
  // })

  pkgs = Option.Rest();

  async execute() {
    // if (this.strict === this.relaxed) {
    //   throw new UsageError("Either [-S,--strict] or [-R,--relaxed] flag must be set")
    // }

    // let resolver = this.strict ? "apts:" : "aptr:"
    let resolver = "apt:"

    if (this.peer === true && this.dev === true) {
      throw new UsageError("[-P,--peer] and [-D,--dev] flags cannot be set together")
    }

    let target = this.dev
      ? "-D"
      : this.peer
        ? "-P"
        : ""
    
    let isPkgsCorrectFormat = this.pkgs.every((pkg, index, pkgsArray) => {
      return /^.+@.+$/.test(pkg)
    })

    if (!isPkgsCorrectFormat) {
      throw new UsageError("Packages should be in format <package name>@<package semver range> or <package name>@<package specific version>")
    }
    
    let formattedPkgs = this.pkgs.map((pkg, index, pkgsArray) => {
      let [pkgName, pkgRange] = pkg.split("@")
      let newPkg = pkgName + "@" + resolver + pkgRange
      return newPkg
    })

    await Configuration.updateConfiguration(this.context.cwd, (current: { [key: string]: unknown }) => {
      return {
        ...current,
        defaultProtocol: resolver
      }
    })
    
    // console.log(`Default protocol is now ${this.strict ? "apts" : "aptr"}`)
    console.log(`Default protocol is now apt`)

    let commandArgs = target ? ["add", target, ...formattedPkgs] : ["add", ...formattedPkgs]
    
    let { code } = await execUtils.pipevp("yarn", commandArgs, { 
        cwd: this.context.cwd,
        stdin: this.context.stdin,
        stdout: this.context.stdout,
        stderr: this.context.stderr,
    })

    await Configuration.updateConfiguration(this.context.cwd, (current: { [key: string]: unknown }) => {
      return {
        ...current,
        defaultProtocol: "npm:"
      }
    })

    console.log("Default protocol is now npm")

    return code
  }
}