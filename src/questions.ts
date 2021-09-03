import chalk = require('chalk');
import * as inquirer from 'inquirer';
export const prompt = inquirer.createPromptModule();

export const askForWorkspaces = async (choices: string[]) => prompt({
  type: 'checkbox',
  choices: choices,
  name: 'workspacePackages',
  message: 'Choose all the workspaces you would like to add a dep to',
}).then(({ workspacePackages }) => workspacePackages);


export const askForPackagesToInstall = () => prompt({
  type: 'input',
  name: 'packagesToInstall',
  message: `Enter the name of the packages you wish to install${chalk.italic("\nTo choose several packages just add an empty space between the names.\nExample: package-one package-two...\n")}${chalk.whiteBright("Packages: ")}`,
}).then(({packagesToInstall}) => packagesToInstall.split(' ').map((p:string) => p.trim()));