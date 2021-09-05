import * as cp from 'child_process';
import { Clients } from '../src';
import { installer } from '../src/installer';




const ticks = async (ticks:number =1) => {
for (let index = 0; index < ticks; index++) {
  await new Promise((r) => r('tock'))
}
  
}
describe('installer', () => {

  beforeEach(() => {
    jest.useFakeTimers()

    jest.resetAllMocks()
    // @ts-expect-error
    cp.exec = jest.fn().mockImplementation((): any => {
      return ({ stdout: { pipe: (c) => c }, stdin: { pipe: (c) => c }, stderr: { pipe: (c) => c }, on: (name, action) => name === 'close' && action() })
    })
  })

  afterEach(() => jest.useRealTimers())

  const installIn = 'some/path'
  const execOptions = { cwd: installIn };

  describe('when the client is Yarn', () => {


    it('Install the packages in all of the workspaces', async () => {


      const workspacesToInstallIn = ['a', 'b'];
      const packagesToInstall = ['first-package', 'second-package']

      installer(installIn, Clients.yarn, { workspacesToInstallIn, packagesToInstall }, false)

       await ticks()

      expect(cp.exec).toHaveBeenCalledTimes(workspacesToInstallIn.length)
      expect(cp.exec).toHaveBeenNthCalledWith(1, `yarn workspace ${workspacesToInstallIn[0]} add ${packagesToInstall.join(' ')}`, expect.objectContaining(execOptions))
      expect(cp.exec).toHaveBeenNthCalledWith(2, `yarn workspace ${workspacesToInstallIn[1]} add ${packagesToInstall.join(' ')}`, expect.objectContaining(execOptions))
    })

    it('Install the packages in a single workspaces',  () => {
      const workspacesToInstallIn = ['a'];
      const packagesToInstall = ['first-package']

      installer(installIn, Clients.yarn, { workspacesToInstallIn, packagesToInstall }, false)


      expect(cp.exec).toHaveBeenCalledTimes(workspacesToInstallIn.length)
      expect(cp.exec).toHaveBeenNthCalledWith(1, `yarn workspace ${workspacesToInstallIn[0]} add ${packagesToInstall.join(' ')}`, expect.objectContaining(execOptions))
    })

    it('Uses --dev as a suffix', async () => {
      const workspacesToInstallIn = ['a', 'b'];
      const packagesToInstall = ['first-package']

      installer(installIn, Clients.yarn, { workspacesToInstallIn, packagesToInstall }, true)
      await ticks()

      expect(cp.exec).toHaveBeenCalledTimes(workspacesToInstallIn.length)
      expect(cp.exec).toHaveBeenNthCalledWith(1, `yarn workspace ${workspacesToInstallIn[0]} add ${packagesToInstall.join(' ')} --dev`, expect.objectContaining(execOptions))
      expect(cp.exec).toHaveBeenNthCalledWith(2, `yarn workspace ${workspacesToInstallIn[1]} add ${packagesToInstall.join(' ')} --dev`, expect.objectContaining(execOptions))
    })
  })

  describe('when the client is Lerna', () => {

    it('Install the packages in all of the workspaces', async () => {
      const workspacesToInstallIn = ['a', 'b'];
      const packagesToInstall = ['first-package', 'second-package']

      installer(installIn, Clients.lerna, { workspacesToInstallIn, packagesToInstall }, false)
      await ticks(2)
    

      expect(cp.exec).toHaveBeenCalledTimes(workspacesToInstallIn.length * packagesToInstall.length)
      expect(cp.exec).toHaveBeenNthCalledWith(1, `lerna add ${packagesToInstall[0]} --scope=${workspacesToInstallIn[0]}`, expect.objectContaining(execOptions))
      expect(cp.exec).toHaveBeenNthCalledWith(2, `lerna add ${packagesToInstall[0]} --scope=${workspacesToInstallIn[1]}`, expect.objectContaining(execOptions))
      expect(cp.exec).toHaveBeenNthCalledWith(3, `lerna add ${packagesToInstall[1]} --scope=${workspacesToInstallIn[0]}`, expect.objectContaining(execOptions))
      expect(cp.exec).toHaveBeenNthCalledWith(4, `lerna add ${packagesToInstall[1]} --scope=${workspacesToInstallIn[1]}`, expect.objectContaining(execOptions))

    })

    it('Install the packages in a single workspaces', () => {
      const workspacesToInstallIn = ['a'];
      const packagesToInstall = ['first-package']

      installer(installIn, Clients.lerna, { workspacesToInstallIn, packagesToInstall }, false)

      expect(cp.exec).toHaveBeenCalledTimes(workspacesToInstallIn.length * packagesToInstall.length)
      expect(cp.exec).toHaveBeenNthCalledWith(1, `lerna add ${packagesToInstall[0]} --scope=${workspacesToInstallIn[0]}`, expect.objectContaining(execOptions))
    })

    it('Uses --dev as a suffix', async () => {
      const workspacesToInstallIn = ['a', 'b'];
      const packagesToInstall = ['first-package', 'second-package']

      installer(installIn, Clients.lerna, { workspacesToInstallIn, packagesToInstall }, true)
      await ticks(2)

      expect(cp.exec).toHaveBeenCalledTimes(workspacesToInstallIn.length * packagesToInstall.length)
      expect(cp.exec).toHaveBeenNthCalledWith(1, `lerna add ${packagesToInstall[0]} --scope=${workspacesToInstallIn[0]} --dev`, expect.objectContaining(execOptions))
      expect(cp.exec).toHaveBeenNthCalledWith(2, `lerna add ${packagesToInstall[0]} --scope=${workspacesToInstallIn[1]} --dev`, expect.objectContaining(execOptions))
      expect(cp.exec).toHaveBeenNthCalledWith(3, `lerna add ${packagesToInstall[1]} --scope=${workspacesToInstallIn[0]} --dev`, expect.objectContaining(execOptions))
      expect(cp.exec).toHaveBeenNthCalledWith(4, `lerna add ${packagesToInstall[1]} --scope=${workspacesToInstallIn[1]} --dev`, expect.objectContaining(execOptions))
    })
  })
})