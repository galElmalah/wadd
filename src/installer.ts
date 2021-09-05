import { Clients } from '.';
import { State } from './cli';
import { spawn } from 'child_process';

const yarnInstaller = (
  workspaces: string[],
  packagesToInstall: string[],
  isDev: boolean
): string[] =>
  workspaces.reduce(
    (acc, nextWorkspace) => [
      ...acc,
      `yarn workspaces ${nextWorkspace} add ${packagesToInstall.join(' ')}${
        isDev ? ' --dev' : ''
      }`,
    ],
    []
  );

const lernaInstaller = (
  workspaces: string[],
  packagesToInstall: string[],
  isDev: boolean
): string[] => {
  const commands = [];
  packagesToInstall.forEach((packageToInstall) => {
    workspaces.forEach((workspace) => {
      commands.push(
        `lerna add ${packageToInstall} --scope=${workspace}${
          isDev ? ' --dev' : ''
        }`
      );
    });
  });
  return commands;
};

const commandsCreatorsMap = {
  [Clients.yarn]: yarnInstaller,
  [Clients.lerna]: lernaInstaller,
};

const execute = (at: string) => (command: string) =>
  new Promise((resolve, reject) => {
    const cp = spawn(command, [], { cwd: at, stdio: 'inherit' });
    cp.on('close', resolve);
    cp.on('exit', resolve);
    cp.on('error', reject);
  });

export const installer = async (
  basePath: string,
  client: Clients,
  { workspacesToInstallIn, packagesToInstall }: State,
  isDev: boolean
) => {
  const commands = commandsCreatorsMap[client](
    workspacesToInstallIn,
    packagesToInstall,
    isDev
  );

  await Promise.all(commands.map(execute(basePath)));
};
