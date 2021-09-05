import { Clients } from '.';
import { State } from './cli';
import { exec } from 'child_process';
import { Transform } from 'stream';

interface InstallerArgs {
  workspace: string;
  command: string;
}
const workspacePrefixTransformer = (workspace:string) => new Transform({
  transform(chunk, encoding, callback) {
    this.push(`[${workspace}]:: ${chunk.toString()}`);
    callback();
  }
});
const yarnInstaller = (
  workspaces: string[],
  packagesToInstall: string[],
  isDev: boolean
): InstallerArgs[] =>
  workspaces.reduce(
    (acc, workspace) => [
      ...acc,
      {command:`yarn workspace ${workspace} add ${packagesToInstall.join(' ')}${
        isDev ? ' --dev' : ''
      }`, workspace},
    ],
    []
  );

const lernaInstaller = (
  workspaces: string[],
  packagesToInstall: string[],
  isDev: boolean
): InstallerArgs[] => {
  const commands = [];
  packagesToInstall.forEach((packageToInstall) => {
    workspaces.forEach((workspace) => {
      commands.push(
        {command: `lerna add ${packageToInstall} --scope=${workspace}${
          isDev ? ' --dev' : ''
        }`, workspace}
      );
    });
  });
  return commands;
};

const commandsCreatorsMap = {
  [Clients.yarn]: yarnInstaller,
  [Clients.lerna]: lernaInstaller,
};

const execute = (at: string) => ({command, workspace}: InstallerArgs) =>
  new Promise((resolve, reject) => {
    const cp = exec(command, { cwd: at, env:process.env });
    cp.stdout.pipe(workspacePrefixTransformer(workspace)).pipe(process.stdout);
    cp.stdin.pipe(workspacePrefixTransformer(workspace)).pipe(process.stdin);
    cp.stderr.pipe(workspacePrefixTransformer(workspace)).pipe(process.stderr);
    cp.on('close', resolve);
    cp.on('exit', resolve);
    cp.on('error', reject);
  })

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

  for(const command of commands) {
    await execute(basePath)(command)
  }
};
