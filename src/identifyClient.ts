import { Clients } from './index';
import { getLernaJson, getRootPackageJson } from './readIfExists';


export const identifyClient = (basePath: string): Clients => {
  const lernaJson = getLernaJson(basePath)
  if (lernaJson) {
    return Clients.lerna;
  }

  const packageJson = getRootPackageJson(basePath)
  if (packageJson && packageJson.workspaces) {
    return Clients.yarn;
  }
};
