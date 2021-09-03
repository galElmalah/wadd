import { join } from 'path'

export const aFixturePathGetter = (functionality: string) => (name: string) => join(__dirname, functionality, name)