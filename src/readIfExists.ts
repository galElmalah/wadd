import * as fs from 'fs';
import { Clients } from '.';
import {join} from 'path'



interface LernaJsonSchema {
  npmClient?: Clients;
  packages: string[]
}
interface PackageJsonSchema {
  workspaces?: Workspaces;
}

interface WorkspacesSchema {
  packages?: string[];
}

type Workspaces = string[] | WorkspacesSchema;


export const readIfExists = <T>(aFilePath: string, transformer: (fileContent: string) => any = JSON.parse) => {
  if (fs.existsSync(aFilePath)) {
    return transformer(fs.readFileSync(aFilePath, 'utf-8')) as T;
  }
  return undefined;
};

export const getRootPackageJson = (basePath:string) => {
  return readIfExists<PackageJsonSchema>(join(basePath, 'package.json'))
};

export const getLernaJson = (basePath:string) => {
  return readIfExists<LernaJsonSchema>(join(basePath, 'lerna.json'))
};
