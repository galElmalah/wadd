import { join, parse } from 'path';
import { getLernaJson, getRootPackageJson } from './readIfExists';

export const findPathToTheNearestMonorepo = (fromPath: string) => {
  const packageJson = getRootPackageJson(fromPath);

  if (packageJson?.workspaces) {
    return fromPath;
  }

  const lernaJson = getLernaJson(fromPath);
  
  if (lernaJson?.packages) {
    return fromPath;
  }

  if (fromPath === parse(fromPath).root) {
    return;
  }

  return findPathToTheNearestMonorepo(join(fromPath, '..'));
};
