import { APIRequest, APIRequestContext } from '@playwright/test'

export class APIContextManager {
  private readonly _apiRequest: APIRequest
  private _selectedContext: string
  private readonly _contexts = new Map<
    string,
    {
      context: APIRequestContext
      accessToken: string | null
      refreshToken: string | null
    }
  >()
  private readonly _default_context_key = 'default'

  constructor(apiRequest: APIRequest, context: APIRequestContext) {
    this._apiRequest = apiRequest
    this._selectedContext = this._default_context_key
    this._contexts.set(this._default_context_key, {
      context: context,
      accessToken: null,
      refreshToken: null
    })
  }

  getContext(): APIRequestContext {
    const context = this._contexts.get(this._selectedContext)
    if (!context) {
      throw new Error("Can't get current context")
    }
    return context.context
  }

  _getSelectedContext() {
    const context = this._contexts.get(this._selectedContext)
    if (!context) {
      throw new Error("Can't get current context")
    }
    return context
  }

  getAccessToken(): string | null {
    return this._getSelectedContext().accessToken
  }

  getRefreshToken(): string | null {
    return this._getSelectedContext().refreshToken
  }

  setAccessToken(accessToken: string): void {
    const context = this._getSelectedContext()
    context.accessToken = accessToken
  }

  setRefreshToken(refreshToken: string): void {
    const context = this._getSelectedContext()
    context.refreshToken = refreshToken
  }

  async newContext(key: string, baseUrl: string): Promise<APIRequestContext> {
    this._selectedContext = key
    const context = await this._apiRequest.newContext({ baseURL: baseUrl })
    this._contexts.set(key, {
      context: context,
      accessToken: null,
      refreshToken: null
    })
    return context
  }

  switchContext(key: string): APIRequestContext {
    this._selectedContext = key
    const context = this._getSelectedContext().context
    return context
  }
}
