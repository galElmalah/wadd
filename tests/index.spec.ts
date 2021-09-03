import { identifyClient } from '../src/identifyClient';
import { getPackages } from '../src/getPackages';
import { Clients } from '../src';
import { aFixturePathGetter } from './fixtures';

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
