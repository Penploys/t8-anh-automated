import { env } from 'process'

export class BaseConfiguration {
  settings: {
    baseUrl: string
    baseApiUrl: string
  }

  constructor(settings: { baseUrl: string; baseApiUrl: string }) {
    this.settings = settings
  }

  isTestOnCI(): boolean {
    return env.CI !== undefined
  }
}
