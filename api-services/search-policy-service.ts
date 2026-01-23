import { APIResponse } from '@playwright/test'
import { BaseAPIService } from '@services/api-request/base-api-service'

export class PolicySearchService extends BaseAPIService {
  async getPolicy(
    params: {
      policyNumber: string
      identityNumber: string
      lossDate: string | Date
      insurerSlug?: string
      page?: number
      perPage?: number
      lang?: 'EN' | 'TH'
    },
    withToken = true
  ): Promise<APIResponse> {
    const {
      policyNumber,
      identityNumber,
      lossDate,
      insurerSlug = 'DHIPAYA',
      page = 1,
      perPage = 20,
      lang = 'EN'
    } = params

    const lossDateIso = lossDate instanceof Date ? lossDate.toISOString() : lossDate

    const query = new URLSearchParams({
      policy_number: policyNumber,
      identity_number: identityNumber,
      loss_date: lossDateIso,
      insurer_slug: insurerSlug,
      page: page.toString(),
      per_page: perPage.toString(),
      lang
    })

    const resp = await this.contextManager.getContext().get(`${this.baseApiUrl}/policy/search?${query.toString()}`, {
      headers: this.getHeaderForBaseUrl(withToken)
    })

    return resp
  }
}
