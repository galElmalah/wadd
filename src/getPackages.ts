import { identifyClient } from './identifyClient';
import { getLernaJson, getRootPackageJson, readIfExists } from './readIfExists';
import * as glob from 'fast-glob';
import { Clients } from '.';
import { readFileSync } from 'fs';
import { join } from 'path';

const enrichPatterns = (patterns: string[]) =>
  patterns.map((pattern) =>
    pattern.endsWith('*')
      ? `${pattern}/package.json`
      : `${pattern}/package.json`
  );

export const getPathsToPackages = async (basePath: string) => {
  const client = identifyClient(basePath);
  const packageJson = getRootPackageJson(basePath);
  if (packageJson && packageJson.workspaces) {
    const patterns = Array.isArray(packageJson.workspaces)
      ? packageJson.workspaces
      : packageJson.workspaces.packages;

    return await glob(enrichPatterns(patterns), {
      onlyFiles: true,
      cwd: basePath,
    });
  }

  if (client === Clients.lerna) {
    const lernaJson = getLernaJson(basePath);
    return await glob(enrichPatterns(lernaJson.packages), {
      onlyFiles: true,
      cwd: basePath,
    });
  }

  return [];
};

export const getPackages = async (basePath: string) => {
  const packageJsonPaths = await getPathsToPackages(basePath);

  return (
    packageJsonPaths.map((aPath) => ({
      name: JSON.parse(readFileSync(join(basePath, aPath), 'utf-8'))
        .name as string,
      path: join(basePath, aPath),
    })) || []
  );
};
