import { Clients } from '.';
import { State } from './cli';

const commandsCreatorsMap = {
  [Clients.yarn]:
    (packages: string[], isDev: boolean) => (workspaceName: string) =>
      `yarn workspaces ${workspaceName} add ${packages.join(' ')} ${
        isDev ? '--dev' : ''
      }`,
  [Clients.lerna]:
    (packages: string[], isDev: boolean) => (workspaceName: string) =>
      `yarn workspaces ${workspaceName} add ${packages.join(' ')} ${
        isDev ? '--dev' : ''
      }`,
};

export const executer = (
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
    console.log(workspacesToInstallIn.map(commandCreator));
  }
};
