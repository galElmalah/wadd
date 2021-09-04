import { spawn } from 'child_process';
import { Clients } from '../src';
import {installer}from '../src/installer';

jest.mock('child_process')
describe('installer', () => {
  describe('when the client is Yarn', () => {
    it('Install the packages in all of the workspaces', () => {
      const workspacesToInstallIn = ['a','b'];
      const packagesToInstall = ['first-package', 'second-package']
      const installIn = 'some/path'
      installer(installIn, Clients.yarn, {workspacesToInstallIn, packagesToInstall}, false)
      expect(spawn).toHaveBeenCalledTimes(workspacesToInstallIn.length)
      expect(spawn).toHaveBeenNthCalledWith(1, `yarn workspaces ${workspacesToInstallIn[0]} add ${packagesToInstall.join(' ')}`, [], {cwd: installIn, stdio: "inherit"})
      expect(spawn).toHaveBeenNthCalledWith(2, `yarn workspaces ${workspacesToInstallIn[1]} add ${packagesToInstall.join(' ')}`, [], {cwd: installIn, stdio: "inherit"})
    })
  })
})