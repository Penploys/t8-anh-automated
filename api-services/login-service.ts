import { APIResponse, expect } from '@playwright/test'

import { BaseAPIService } from '@services/api-request/base-api-service'

export class LoginService extends BaseAPIService {
  async login(email: string, password: string, autoParseToken = true): Promise<APIResponse> {
    const resp = await this.contextManager.getContext().post(`${this.baseApiUrl}/auth/login`, {
      data: {
        email: email,
        password: password
      }
    })

    if (autoParseToken) {
      await expect(resp).toBeOK()
      const respJson = await resp.json()
      this.contextManager.setAccessToken(respJson.access_token)
      this.contextManager.setRefreshToken(respJson.refresh_token)
    }

    return resp
  }
}
