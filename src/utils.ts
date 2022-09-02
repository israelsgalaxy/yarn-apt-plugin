import { Locator, structUtils, tgzUtils, semverUtils } from "@yarnpkg/core";
import { PortablePath, NodeFS, ppath, ZipFS } from "@yarnpkg/fslib";
import { spawnSync } from "child_process"

let fs = new NodeFS()

let NODE_PATH = getNodePath()

export async function packageExistsAsync(pkgName: string): Promise<PortablePath | null> {
  let packageJsonPath = ppath.resolve(NODE_PATH as PortablePath, pkgName as PortablePath, "package.json" as PortablePath)

  let exists = await fs.existsPromise(packageJsonPath)

  return exists ? packageJsonPath : null
}

export function packageExistsSync(pkgName: string): PortablePath | null {
  let packageJsonPath = ppath.resolve(NODE_PATH as PortablePath, pkgName as PortablePath, "package.json" as PortablePath)

  let exists = fs.existsSync(packageJsonPath)

  return exists ? packageJsonPath : null
} 

export async function getPackageJsonObjectAsync(packageJsonPath: PortablePath): Promise<any> {
  let packageJsonObject = await fs.readJsonPromise(packageJsonPath)

  return packageJsonObject
}

export function getPackageJsonObjectSync(packageJsonPath: PortablePath): any {
  let packageJsonObject = fs.readJsonSync(packageJsonPath)

  return packageJsonObject
}

export async function fetchFromDisk(locator: Locator, cwd: PortablePath): Promise<ZipFS> {
  let pkgName = locator.scope ? "@" + locator.scope + "/" + locator.name : locator.name
  let packagePath = ppath.resolve(NODE_PATH as PortablePath, pkgName as PortablePath)

  return await tgzUtils.makeArchiveFromDirectory(packagePath, {
    prefixPath: structUtils.getIdentVendorPath(locator)
  })
}

export function unAptifyPackageJsonObject(aptPackageJsonObject: any): any {
  let oldDependencies = aptPackageJsonObject.dependencies
  let oldPeerDependencies = aptPackageJsonObject.peerDependencies
  let oldDevDependencies = aptPackageJsonObject.devDependencies
  let newDependencies = {}
  let newPeerDependencies = {}
  let newDevDependencies = {}
  let packageJsonObject = { ...aptPackageJsonObject }

  if (oldDependencies) {
    for (let [dependency, range] of Object.entries<string>(oldDependencies)) {
      let newRange = range.includes(":") ? range.split(":")[1] : range
      newDependencies[dependency] = newRange
    }

    packageJsonObject.dependencies = newDependencies
  }

  if (oldPeerDependencies) {
    for (let [peerDependency, range] of Object.entries<string>(oldPeerDependencies)) {
      let newRange = range.includes(":") ? range.split(":")[1] : range
      newPeerDependencies[peerDependency] = newRange
    }

    packageJsonObject.peerDependencies = newPeerDependencies
  }

  if (oldDevDependencies) {
    for (let [devDependency, range] of Object.entries<string>(oldDevDependencies)) {
      let newRange = range.includes(":") ? range.split(":")[1] : range
      newDevDependencies[devDependency] = newRange
    }

    packageJsonObject.devDependencies = newDevDependencies
  }

  return packageJsonObject
}

export function checkDependencies(packageJsonObject: any): boolean {
  let dependencies: any | null = packageJsonObject.dependencies
  let peerDependencies: any | null = packageJsonObject.peerDependencies

  let combinedDependencies = !!dependencies
    ? !!peerDependencies
      ? [...Object.values<string>(dependencies), ...Object.values<string>(peerDependencies)]
      : [...Object.values<string>(dependencies)]
    : !!peerDependencies
      ? [...Object.values<string>(peerDependencies)]
      : []

  return !(!!(combinedDependencies.find((range) => {
    return !(!!semverUtils.validRange(range))
  })))
}

export function checkDirectory(packagePath: PortablePath): boolean {
  let content = fs.readdirSync(packagePath)

  return !(!!(content.find((fileName) => {
    let stat = fs.lstatSync(ppath.resolve(packagePath, fileName))

    return stat.isSymbolicLink()
  })))
}



function getNodePath() {
  let { stderr, stdout } = spawnSync("nodepath", ["yarn"])

  let newStdErr = stderr ?? Buffer.from("")
  let newStdOut = stdout ?? Buffer.from("")

  if (newStdErr.length > 0 || newStdOut.length <= 0) {
    throw new Error("Cannot get NODE_PATH")
  }

  return newStdOut.toString("utf-8").trim().split("yarn")[0]
}