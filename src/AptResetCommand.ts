import { BaseCommand } from '@yarnpkg/cli';
import { NodeFS, PortablePath, ppath } from '@yarnpkg/fslib';
import { getPackageJsonObjectAsync, unAptifyPackageJsonObject } from './utils';

export default class AptResetCommand extends BaseCommand {
  static paths = [
    ["apt-reset"]
  ]

  // static usage: Usage = Command.Usage({
  //   description: ``,
  //   details: ``,
  //   examples: [[]],
  // });

  async execute() {
    let fs = new NodeFS()

    let packageJsonPath = ppath.resolve(PortablePath.dot, "package.json" as PortablePath)
    let packageJsonObject = await getPackageJsonObjectAsync(packageJsonPath)
    let unAptifiedPackageJsonObject = unAptifyPackageJsonObject(packageJsonObject)

    await fs.writeJsonPromise(packageJsonPath, unAptifiedPackageJsonObject)

    console.log("Succesfully unaptified package.json")

    return
  }
}