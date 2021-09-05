import { spawn } from 'child_process';
import { Clients } from '../src';
import { installer } from '../src/installer';

jest.mock('child_process')
describe('installer', () => {

  beforeEach(() => {
    jest.resetAllMocks()
  })

  const installIn = 'some/path'
  const spawnOptions = { cwd: installIn, stdio: "inherit" };

  describe('when the client is Yarn', () => {

    it('Install the packages in all of the workspaces', () => {
      const workspacesToInstallIn = ['a', 'b'];
      const packagesToInstall = ['first-package', 'second-package']

      installer(installIn, Clients.yarn, { workspacesToInstallIn, packagesToInstall }, false)

      expect(spawn).toHaveBeenCalledTimes(workspacesToInstallIn.length)
      expect(spawn).toHaveBeenNthCalledWith(1, `yarn workspaces ${workspacesToInstallIn[0]} add ${packagesToInstall.join(' ')}`, [], spawnOptions)
      expect(spawn).toHaveBeenNthCalledWith(2, `yarn workspaces ${workspacesToInstallIn[1]} add ${packagesToInstall.join(' ')}`, [], spawnOptions)
    })

    it('Install the packages in a single workspaces', () => {
      const workspacesToInstallIn = ['a'];
      const packagesToInstall = ['first-package']

      installer(installIn, Clients.yarn, { workspacesToInstallIn, packagesToInstall }, false)

      expect(spawn).toHaveBeenCalledTimes(workspacesToInstallIn.length)
      expect(spawn).toHaveBeenNthCalledWith(1, `yarn workspaces ${workspacesToInstallIn[0]} add ${packagesToInstall.join(' ')}`, [], spawnOptions)
    })

    it('Uses --dev as a suffix', () => {
      const workspacesToInstallIn = ['a', 'b'];
      const packagesToInstall = ['first-package']

      installer(installIn, Clients.yarn, { workspacesToInstallIn, packagesToInstall }, true)

      expect(spawn).toHaveBeenCalledTimes(workspacesToInstallIn.length)
      expect(spawn).toHaveBeenNthCalledWith(1, `yarn workspaces ${workspacesToInstallIn[0]} add ${packagesToInstall.join(' ')} --dev`, [], spawnOptions)
      expect(spawn).toHaveBeenNthCalledWith(2, `yarn workspaces ${workspacesToInstallIn[1]} add ${packagesToInstall.join(' ')} --dev`, [], spawnOptions)
    })
  })

  describe('when the client is Lerna', () => {

    it('Install the packages in all of the workspaces', () => {
      const workspacesToInstallIn = ['a', 'b'];
      const packagesToInstall = ['first-package', 'second-package']

      installer(installIn, Clients.lerna, { workspacesToInstallIn, packagesToInstall }, false)

      expect(spawn).toHaveBeenCalledTimes(workspacesToInstallIn.length * packagesToInstall.length)
      expect(spawn).toHaveBeenNthCalledWith(1, `lerna add ${packagesToInstall[0]} --scope=${workspacesToInstallIn[0]}`, [], spawnOptions)
      expect(spawn).toHaveBeenNthCalledWith(2, `lerna add ${packagesToInstall[0]} --scope=${workspacesToInstallIn[1]}`, [], spawnOptions)
      expect(spawn).toHaveBeenNthCalledWith(3, `lerna add ${packagesToInstall[1]} --scope=${workspacesToInstallIn[0]}`, [], spawnOptions)
      expect(spawn).toHaveBeenNthCalledWith(4, `lerna add ${packagesToInstall[1]} --scope=${workspacesToInstallIn[1]}`, [], spawnOptions)

    })

    it('Install the packages in a single workspaces', () => {
      const workspacesToInstallIn = ['a'];
      const packagesToInstall = ['first-package']

      installer(installIn, Clients.lerna, { workspacesToInstallIn, packagesToInstall }, false)

      expect(spawn).toHaveBeenCalledTimes(workspacesToInstallIn.length * packagesToInstall.length)
      expect(spawn).toHaveBeenNthCalledWith(1, `lerna add ${packagesToInstall[0]} --scope=${workspacesToInstallIn[0]}`, [], spawnOptions)
    })

    it('Uses --dev as a suffix', () => {
      const workspacesToInstallIn = ['a', 'b'];
      const packagesToInstall = ['first-package', 'second-package']

      installer(installIn, Clients.lerna, { workspacesToInstallIn, packagesToInstall }, true)

      expect(spawn).toHaveBeenCalledTimes(workspacesToInstallIn.length * packagesToInstall.length)
      expect(spawn).toHaveBeenNthCalledWith(1, `lerna add ${packagesToInstall[0]} --scope=${workspacesToInstallIn[0]} --dev`, [], spawnOptions)
      expect(spawn).toHaveBeenNthCalledWith(2, `lerna add ${packagesToInstall[0]} --scope=${workspacesToInstallIn[1]} --dev`, [], spawnOptions)
      expect(spawn).toHaveBeenNthCalledWith(3, `lerna add ${packagesToInstall[1]} --scope=${workspacesToInstallIn[0]} --dev`, [], spawnOptions)
      expect(spawn).toHaveBeenNthCalledWith(4, `lerna add ${packagesToInstall[1]} --scope=${workspacesToInstallIn[1]} --dev`, [], spawnOptions)
    })
  })
})