import { APIResponse } from '@playwright/test'
import { BaseAPIService } from '@services/api-request/base-api-service'

export type CreateClaimRequest = Record<string, any>
export type AssignClaimRequest = {
  assignee_uuid: string
  action_reason_remark?: string
}

export class ClaimService extends BaseAPIService {
  async createClaim(payload: CreateClaimRequest, withToken = true): Promise<APIResponse> {
    const resp = await this.contextManager.getContext().post(`${this.baseApiUrl}/claim/claims`, {
      data: payload,
      headers: this.getHeaderForBaseUrl(withToken)
    })

    return resp
  }

  async assignClaim(claimUuid: string, payload: AssignClaimRequest, withToken = true): Promise<APIResponse> {
    const resp = await this.contextManager.getContext().post(`${this.baseApiUrl}/claim/claims/${claimUuid}/assigns`, {
      data: payload,
      headers: this.getHeaderForBaseUrl(withToken)
    })

    return resp
  }
}
