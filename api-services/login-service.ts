import { APIResponse, expect } from '@playwright/test'

import { BaseAPIService } from '@services/api-request/base-api-service'

export class LoginService extends BaseAPIService {
  async login(email: string, password: string, audience: string, autoParseToken = true): Promise<APIResponse> {
    const resp = await this.contextManager.getContext().post(`${this.baseApiUrl}/auth/token`, {
      data: {
        username: email,
        password: password,
        audience: audience
      }
    })

    if (autoParseToken) {
      await expect(resp).toBeOK()
      const respJson = await resp.json()
      this.contextManager.setAccessToken(respJson.data.access_token)
      this.contextManager.setRefreshToken(respJson.data.refresh_token)
    }

    return resp
  }
}
