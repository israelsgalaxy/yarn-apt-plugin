import { Descriptor, Locator, MinimalResolveOptions, Package, ResolveOptions, Resolver, structUtils, LinkType, semverUtils, Manifest } from "@yarnpkg/core";
import { PortablePath } from "@yarnpkg/fslib";
import semver from "semver";
import { getPackageJsonObjectAsync, getPackageJsonObjectSync, packageExistsAsync, packageExistsSync, checkDependencies, checkDirectory } from "./utils";

const PROTOCOL = "apt:";

export default class AptRelaxedResolver implements Resolver {
  supportsDescriptor(descriptor: Descriptor, opts: MinimalResolveOptions): boolean {
    if (!descriptor.range.startsWith(PROTOCOL)) {
      return false;
    }

    if (descriptor.range.slice(PROTOCOL.length) === "latest") {
      return true
    }

    return !!semverUtils.validRange(descriptor.range.slice(PROTOCOL.length));
  }
  supportsLocator(locator: Locator, opts: MinimalResolveOptions): boolean {
    if (!locator.reference.startsWith(PROTOCOL)) {
      return false;
    }

    const { selector } = structUtils.parseRange(locator.reference);
    if (!semver.valid(selector)) {
      return false;
    }

    return true;
  }
  shouldPersistResolution(locator: Locator, opts: MinimalResolveOptions): boolean {
    return true;
  }
  bindDescriptor(descriptor: Descriptor, fromLocator: Locator, opts: MinimalResolveOptions): Descriptor {
    let packageJsonPath = packageExistsSync(descriptor.scope ? "@" + descriptor.scope + "/" + descriptor.name : descriptor.name)

    let npmIdent = structUtils.makeIdent(descriptor.scope, descriptor.name)
    let npmDescriptor = structUtils.makeDescriptor(npmIdent, "npm:" + descriptor.range.split(":")[1])

    if (!packageJsonPath) {
      // console.log(`Resolving with npm: ${descriptor.scope ? "@" + descriptor.scope + "/" + descriptor.name : descriptor.name} is not in apt installed packages`)
      return npmDescriptor
    }

    let packageJsonObject = getPackageJsonObjectSync(packageJsonPath)
    
    let localVersion = packageJsonObject.version || `0.0.0`
    let requestedRange = descriptor.range.split(":")[1]

    if (requestedRange === "latest") {
      // console.log(`Resolving with npm: ${descriptor.scope ? "@" + descriptor.scope + "/" + descriptor.name : descriptor.name} requested for latest version`)
      return npmDescriptor
    }

    let localVersionSatisfies = semverUtils.satisfiesWithPrereleases(localVersion, requestedRange)

    if (!localVersionSatisfies) {
      // console.log(`Resolving with npm: ${descriptor.scope ? "@" + descriptor.scope + "/" + descriptor.name : descriptor.name} found in apt installed packages but does not satisy requested version/range`)
      return npmDescriptor
    }

    let dependenciesSatisfy = checkDependencies(packageJsonObject)

    if (!dependenciesSatisfy) {
      // console.log(`Resolving with npm: ${descriptor.scope ? "@" + descriptor.scope + "/" + descriptor.name : descriptor.name} found in apt installed packages but has a dependency version/range which cannot be understood in its package.json`)
      return npmDescriptor
    }

    let directorySatisfies = checkDirectory(packageJsonPath.replace("package.json", "") as PortablePath)

    if (!directorySatisfies) {
      // console.log(`Resolving with npm: ${descriptor.scope ? "@" + descriptor.scope + "/" + descriptor.name : descriptor.name} found in apt installed packages but its folder contains symlinks`)
      return npmDescriptor
    }

    return descriptor
  }
  getResolutionDependencies(descriptor: Descriptor, opts: MinimalResolveOptions): Record<string, Descriptor> {
    return {};
  }
  async getCandidates(descriptor: Descriptor, dependencies: Record<string, Package>, opts: ResolveOptions): Promise<Locator[]> {
    let packageJsonPath = await packageExistsAsync(descriptor.scope ? "@" + descriptor.scope + "/" + descriptor.name : descriptor.name)

    if (!packageJsonPath) {
      return Promise.resolve([])
    }

    let packageJsonObject = await getPackageJsonObjectAsync(packageJsonPath)
    
    let localVersion = packageJsonObject.version || `0.0.0`
    let requestedRange = descriptor.range.split(":")[1]

    let locator = structUtils.makeLocator(descriptor, PROTOCOL + localVersion)

    let satisfies = semverUtils.satisfiesWithPrereleases(localVersion, requestedRange)

    if (satisfies) {
      opts.report.reportInfo(null, `Resolving with apt: ${descriptor.scope ? "@" + descriptor.scope + "/" + descriptor.name : descriptor.name}`)
    }

    return satisfies ? Promise.resolve([locator]) : Promise.resolve([])
  }
  async getSatisfying(descriptor: Descriptor, dependencies: Record<string, Package>, locators: Locator[], opts: ResolveOptions): Promise<{ locators: Locator[]; sorted: boolean }> {
    if (!(locators.length === 1)) {
      throw new Error("Expected one locator but got more that one")
    }

    return Promise.resolve({ locators, sorted: false })
  }
  async resolve(locator: Locator, opts: ResolveOptions): Promise<Package> {
    let packageJsonPath = await packageExistsAsync(locator.scope ? "@" + locator.scope + "/" + locator.name : locator.name);
    let packageJsonObject = await getPackageJsonObjectAsync(packageJsonPath!);
    let packageJson = JSON.stringify(packageJsonObject)
    let manifest = Manifest.fromText(packageJson)

    return {
      ...locator,
      version: manifest.version || `0.0.0`,
      languageName: manifest.languageName || opts.project.configuration.get(`defaultLanguageName`),
      linkType: LinkType.HARD,
      conditions: manifest.getConditions(),
      dependencies: opts.project.configuration.normalizeDependencyMap(manifest.dependencies),
      peerDependencies: manifest.peerDependencies,
      dependenciesMeta: manifest.dependenciesMeta,
      peerDependenciesMeta: manifest.peerDependenciesMeta,
      bin: manifest.bin,
    };
  }
}

// does yarn use npm resolver last (dont change default protocol)
// do checking earlier in supportsDescriptor and supportsLocator