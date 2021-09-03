import {identifyClient} from '../src/identifyClient'
import {join} from 'path';
import { Clients } from '../src';
import {aFixturePathGetter} from './fixtures'

const getFixturePath = aFixturePathGetter('identifyClient')

describe('identifyClient', () => {
  it('Identify a yarn client correctly', () => {
    const client = identifyClient(getFixturePath('yarnClient'))
    expect(client).toBe(Clients.yarn)
  })
  it('Identify a lerna client correctly', () => {
    const client = identifyClient(getFixturePath('lernaClient'))
    expect(client).toBe(Clients.lerna)
  })
})