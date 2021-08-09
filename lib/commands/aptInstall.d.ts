import { BaseCommand } from '@yarnpkg/cli';
import { Usage } from 'clipanion';
export default class AptCommand extends BaseCommand {
    static paths: string[][];
    static usage: Usage;
    localOnly: boolean;
    dev: boolean;
    execute(): Promise<number>;
    find(pkg_names: string[]): Promise<{
        found: {
            name: string;
            data: string;
        }[];
        notFound: any[];
    }>;
    resolvePackage(name: any): Promise<{
        name: string;
        data: string;
    }>;
    install(): Promise<number>;
}
