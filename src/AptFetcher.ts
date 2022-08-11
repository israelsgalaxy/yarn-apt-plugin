import { Fetcher, FetchOptions, FetchResult, Locator, MinimalFetchOptions, structUtils } from "@yarnpkg/core";
import { PortablePath } from "@yarnpkg/fslib";
import semver from "semver"
import { fetchFromDisk } from "./utils";

const PROTOCOL = "apt:"

export default class AptFetcher implements Fetcher {
  supports(locator: Locator, opts: MinimalFetchOptions): boolean {
    if (!(locator.reference.startsWith(PROTOCOL)))
      return false;

    const {selector} = structUtils.parseRange(locator.reference);
    if (!semver.valid(selector))
      return false;

    return true;
  }
  getLocalPath(locator: Locator, opts: FetchOptions): PortablePath | null {
    return null;
  }
  async fetch(locator: Locator, opts: FetchOptions): Promise<FetchResult> {
    const expectedChecksum = opts.checksums.get(locator.locatorHash) || null;

    const [packageFs, releaseFs, checksum] = await opts.cache.fetchPackageFromCache(locator, expectedChecksum, {
      onHit: () => opts.report.reportCacheHit(locator),
      onMiss: () => opts.report.reportCacheMiss(locator, `${structUtils.prettyLocator(opts.project.configuration, locator)} can't be found in the cache and will be fetched from your apt installed packages`),
      loader: () => fetchFromDisk(locator, opts.project.cwd),
      ...opts.cacheOptions,
      skipIntegrityCheck: true
    });

    return {
      packageFs,
      releaseFs,
      prefixPath: structUtils.getIdentVendorPath(locator),
      checksum,
    };
  }
}