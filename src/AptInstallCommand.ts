import { BaseCommand } from '@yarnpkg/cli';
import { Option, UsageError } from 'clipanion';
import {Configuration, execUtils} from '@yarnpkg/core';

export default class AptInstallCommand extends BaseCommand {
  static paths = [
    [`apt-install`],
  ]

  //   static usage: Usage = Command.Usage({
  //     description: ``,
  //     details: ``,
  //     examples: [[]],
  //   });

  // strict = Option.Boolean(`-S,--strict`, false, {
  //   description: `Resolve dependencies from apt in strict mode`,
  // })

  // relaxed = Option.Boolean(`-R,--relaxed`, false, {
  //   description: `Resolve dependencies from apt in strict mode`,
  // })

  async execute() {

    // if (this.strict === this.relaxed) {
    //   throw new UsageError("Either [-S,--strict] or [-R,--relaxed] flag must be set")
    // }

    // let resolver = this.strict ? "apts:" : "aptr:"
    let resolver = "apt:"

    await Configuration.updateConfiguration(this.context.cwd, (current: { [key: string]: unknown }) => {
      return {
        ...current,
        defaultProtocol: resolver
      }
    })

    // console.log(`Default protocol is now ${this.strict ? "apts" : "aptr"}`)
    console.log(`Default protocol is now apt`)

    let { code } = await execUtils.pipevp("yarn", ["install"], { 
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