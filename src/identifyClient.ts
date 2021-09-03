import * as fs from 'fs';
import { Clients } from './index';

interface LernaJsonSchema {
  npmClient?: Clients;
}
interface WorkspacesSchema {
  packages?: string[];
}
type Workspaces = string[] | WorkspacesSchema;
interface PackageJsonSchema {
  workspaces?: Workspaces;
}
const readIfExists = <T>(aFilePath: string, transformer: (fileContent: string) => any = x => x) => {
  if (fs.existsSync(aFilePath)) {
    return transformer(fs.readFileSync(aFilePath, 'utf-8')) as T;
  }
  return undefined;
};

export const identifyClient = (basePath: string): Clients => {
  const lernaJson = readIfExists<LernaJsonSchema>(`${basePath}/lerna.json`, JSON.parse);
  if (lernaJson) {
    return Clients.lerna;
  }

  const packageJson = readIfExists<PackageJsonSchema>(`${basePath}/package.json`, JSON.parse);
  if (packageJson && packageJson.workspaces) {
    return Clients.yarn;
  }

};
