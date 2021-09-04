import { identifyClient } from '../src/identifyClient';
import { getPackages } from '../src/getPackages';
import { Clients } from '../src';
import { aFixturePathGetter } from './fixtures';
import {findPathToTheNearestMonorepo} from '../src/findPathToTheNearestMonorepo'

describe('identifyClient', () => {
  const getFixturePath = aFixturePathGetter('identifyClient');
  it('Identify a yarn client correctly', () => {
    const client = identifyClient(getFixturePath('yarnClient'));
    expect(client).toBe(Clients.yarn);
  });
  it('Identify a lerna client correctly', () => {
    const client = identifyClient(getFixturePath('lernaClient'));
    expect(client).toBe(Clients.lerna);
  });
});

describe('getPackages', () => {
  const getFixturePath = aFixturePathGetter('getPackages');
  const expectedPackages = [
    '@gal/p',
    '@gal/a-b',
    '@gal/a-a',
    '@gal/p-b',
    '@gal/p-a',
  ].sort();

  it('should get all packages based on package.json workspaces array field', async () => {
    const packageNames = (
      await getPackages(getFixturePath('workspacesInPackageJsonAsArray'))
    ).map(({ name }) => name);
    expect(packageNames.sort()).toEqual(expectedPackages);
  });

  it('should get all packages based on package.json workspaces object field', async () => {
    const packageNames = (
      await getPackages(getFixturePath('workspacesInPackageJsonAsObject'))
    ).map(({ name }) => name);

    expect(packageNames.sort()).toEqual(expectedPackages);
  });

  it('should get all packages based on lerna packages field', async () => {
    const packageNames = (
      await getPackages(getFixturePath('workspacesInLernaJson'))
    ).map(({ name }) => name);

    expect(packageNames.sort()).toEqual(expectedPackages);
  });
});


describe.only('findPathToTheNearestMonorepo', () => {
  const getFixturePath = aFixturePathGetter('findPathToTheNearestMonorepo');

  it('should return nothing if no monorepo was detected', () => {
    const basePath = getFixturePath('noMonorepo/a/b/c')
    expect(findPathToTheNearestMonorepo(basePath)).toBeUndefined()

  })

  describe('Monorepo is detectable from package json', () => {
    it('should get the path to monorepo when called with a nested path', () => {
      const basePath = getFixturePath('hasMonorepo/inPackageJson/a/b/c')
      expect(findPathToTheNearestMonorepo(basePath)).toBe(getFixturePath('hasMonorepo/inPackageJson'))
    })

    it('should get the path to monorepo when called with the actual path to the monorepo', () => {
      const basePath = getFixturePath('hasMonorepo/inPackageJson')
      expect(findPathToTheNearestMonorepo(basePath)).toBe(getFixturePath('hasMonorepo/inPackageJson'))
    })
  })

  describe('Monorepo is detectable from lerna json', () => {
    it('should get the path to monorepo when called with a nested path', () => {
      const basePath = getFixturePath('hasMonorepo/inLernaJson/a/b/c')
      expect(findPathToTheNearestMonorepo(basePath)).toBe(getFixturePath('hasMonorepo/inLernaJson'))
    })

    it('should get the path to monorepo when called with the actual path to the monorepo', () => {
      const basePath = getFixturePath('hasMonorepo/inLernaJson')
      expect(findPathToTheNearestMonorepo(basePath)).toBe(getFixturePath('hasMonorepo/inLernaJson'))
    })
  })



})