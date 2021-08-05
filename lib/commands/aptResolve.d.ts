import { BaseCommand } from '@yarnpkg/cli';
import { Usage } from 'clipanion';
export default class AptCommand extends BaseCommand {
    static paths: string[][];
    static usage: Usage;
    package: string[];
    devDep: string[];
    execute(): Promise<any>;
    resolvePackage(name: any): Promise<{
        name: string;
        data: string;
    }>;
    find(pkg_names: string[]): Promise<{
        found: {
            name: string;
            data: string;
        }[];
        notFound: any[];
    }>;
    addPackages(names: string[]): Promise<any>;
}
