import { APIResponse } from '@playwright/test'
import { BaseAPIService } from '@services/api-request/base-api-service'

export class PolicyCoverageService extends BaseAPIService {
  async getCoveragePolicy(
    params: {
      policyNumber: string
      iiaMembership: string
    },
    withToken = true
  ): Promise<APIResponse> {
    const { policyNumber, iiaMembership } = params

    const query = new URLSearchParams({
      policy_number: policyNumber,
      member_uuid: iiaMembership
    })

    const resp = await this.contextManager.getContext().get(`${this.baseApiUrl}/policy/coverages?${query.toString()}`, {
      headers: this.getHeaderForBaseUrl(withToken)
    })

    return resp
  }
}
