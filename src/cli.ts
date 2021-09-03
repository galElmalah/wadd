import { Command } from 'commander';
import { join } from 'path';
import { executer } from './executer';
import { getPackages } from './getPackages';
import { identifyClient } from './identifyClient';
import { askForPackagesToInstall, askForWorkspaces } from './questions';

export interface State {
  workspacesToInstallIn: string[];
  packagesToInstall: string[];
}
const program = new Command();
program
  .argument('[workspacesToInstallIn]', 'The workspaces you want to install a package into, you can pass workspaces separated with by a comma e.g w1,w2,w3 etc, with no white spaces in between', '')
  .argument('[packagesToInstall]', 'Enter the name of the packages you wish to install, to pass several packages just separate them with white space e.g p1 p2 p3...','')
  .option('-d --dev', 'Passing this flag while install all of the packages as dev dependencies', false)
  .description('Add a package to a specified workspace package')
  .action(async (workspacesToInstallIn: string, packagesToInstall: string, options:{isDev:boolean}) => {

    const basePath = join(__dirname, '../tests/fixtures/getPackages/workspacesInPackageJsonAsArray') || process.cwd();

    const state:State = {
      workspacesToInstallIn:  workspacesToInstallIn.split(',').filter(Boolean),
      packagesToInstall:  packagesToInstall.split(' ').filter(Boolean) ,
    };

    if (!state.workspacesToInstallIn.length) {
      const choices = (await getPackages(basePath)).map((p) => p.name);
      state.workspacesToInstallIn = await askForWorkspaces(choices)
      state.packagesToInstall = await askForPackagesToInstall()
    }

    const client = identifyClient(basePath)
    executer(basePath, client, state, options.isDev)

  });

program.parse(process.argv);
