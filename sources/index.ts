import {Plugin}                     from '@yarnpkg/core';
import aptResolve                   from './commands/aptResolve';
import aptInstall                   from './commands/aptInstall';
import aptCopy                      from './commands/aptCopy';

const plugin: Plugin = {
  commands: [
    aptResolve,
    aptInstall,
    aptCopy
  ],
};

export default plugin;
