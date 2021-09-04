import { Clients } from '.';
import { State } from './cli';
import { exec, spawn } from 'child_process';
const commandsCreatorsMap = {
  [Clients.yarn]:
    (packages: string[], isDev: boolean) => (workspaceName: string) =>
      `yarn workspaces ${workspaceName} add ${packages.join(' ')} ${isDev ? '--dev' : ''
      }`,
  [Clients.lerna]:
    (packages: string[], isDev: boolean) => (workspaceName: string) =>
      `yarn workspaces ${workspaceName} add ${packages.join(' ')} ${isDev ? '--dev' : ''
      }`,
};

const execute = (at: string) => (command: string) => new Promise((resolve, reject) => {
  const cp = spawn(command, [], { cwd: at, stdio: 'inherit' })
  cp.on('close', resolve)
  cp.on('exit', resolve)
  cp.on('error', reject)
})

export const installer = async (
  basePath: string,
  client: Clients,
  { workspacesToInstallIn, packagesToInstall }: State,
  isDev: boolean
) => {
  if (client === Clients.yarn) {
    const commandCreator = commandsCreatorsMap[client](
      packagesToInstall,
      isDev
    );

    await Promise.all(workspacesToInstallIn.map(commandCreator).map(execute(basePath)))
  }
};
