import { BaseConfiguration } from '@services/configurations/base-configurtaion'
import { APIContextManager } from './api-context-manager'

export class BaseAPIService {
  protected readonly contextManager: APIContextManager
  protected readonly configuration: BaseConfiguration
  protected readonly baseUrl: string
  protected readonly baseAdminUrl: string
  protected readonly baseApiUrl: string
  protected readonly baseAdminApiUrl: string
  protected endpoint: string
  protected mockResponseName: string | null

  constructor(contextManager: APIContextManager, configuration: BaseConfiguration) {
    this.contextManager = contextManager
    this.configuration = configuration
    this.baseUrl = configuration.settings.baseUrl
    this.baseApiUrl = configuration.settings.baseApiUrl
    this.mockResponseName = null
  }

  getContextManager(): APIContextManager {
    return this.contextManager
  }

  getHeaderForBaseUrl(withToken = true): any {
    const headers = { origin: this.baseUrl }
    if (withToken) {
      headers['Authorization'] = `Bearer ${this.contextManager.getAccessToken()}`
    }
    if (this.mockResponseName) {
      headers['x-mock-response-name'] = this.mockResponseName
    }
    return headers
  }

  getHeaderForBaseAdminUrl(withToken = true): any {
    const headers = { origin: this.baseAdminUrl }
    if (withToken) {
      headers['Authorization'] = `Bearer ${this.contextManager.getAccessToken()}`
    }
    if (this.mockResponseName) {
      headers['x-mock-response-name'] = this.mockResponseName
    }
    return headers
  }

  getHeaderForBasicAuthen(username: string, password: string, withToken = true): any {
    const headers = { origin: this.baseUrl }
    const auth = Buffer.from(username + ':' + password).toString('base64')
    if (withToken) {
      headers['Authorization'] = `Basic ${auth}`
    }
    if (this.mockResponseName) {
      headers['x-mock-response-name'] = this.mockResponseName
    }
    return headers
  }

  setMockResponseName(mockName: string): void {
    this.mockResponseName = mockName
  }

  getMockResponseName(): string | null {
    return this.mockResponseName
  }

  clearMockResponse(): void {
    this.mockResponseName = null
  }

  async setBearerToken(token: string): Promise<this> {
    this.contextManager.setAccessToken(token)
    return this
  }
}
