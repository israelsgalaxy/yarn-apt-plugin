import { Plugin } from '@yarnpkg/core';
import AptResetCommand from './AptResetCommand';
import AptAddCommand from './AptAddCommand';
import AptInstallCommand from './AptInstallCommand';
import AptFetcher         from './AptFetcher';
import AptResolver from './AptResolver';

const plugin: Plugin = {
  commands: [
    AptResetCommand,
    AptAddCommand,
    AptInstallCommand
  ],
  fetchers: [
    AptFetcher,
  ],
  resolvers: [
    AptResolver
  ]
};

// eslint-disable-next-line arca/no-default-export
export default plugin;