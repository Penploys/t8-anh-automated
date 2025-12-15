import { APIResponse } from '@playwright/test'

import { BaseAPIService } from '@services/api-request/base-api-service'

export class ProductService extends BaseAPIService {
  async getProducts(withToken = true): Promise<APIResponse> {
    const resp = await this.contextManager.getContext().get(`${this.baseApiUrl}/ecommerce/product-list`, {
      headers: this.getHeaderForBaseUrl(withToken)
    })
    return resp
  }
}
