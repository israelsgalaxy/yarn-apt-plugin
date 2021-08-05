import { BaseCommand } from '@yarnpkg/cli';
import { Usage } from 'clipanion';
export default class AptCommand extends BaseCommand {
    static paths: string[][];
    static usage: Usage;
    packages: string[];
    all: boolean;
    execute(): Promise<void>;
}
