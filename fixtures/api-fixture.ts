import { test as base } from '@playwright/test'

import { LoginService } from '@api-services/login-service'
import { PolicySearchService } from '@api-services/search-policy-service'
import { PolicyCoverageService } from '@api-services/coverage-policy-service'
import { ClaimService } from '@api-services/claim-service'
import { APIContextManager } from '@services/api-request/api-context-manager'
import { APIConfiguration } from '@services/configurations/api-configuration'

interface APITestFixtures {
  configuration: APIConfiguration

  apiContextManager: APIContextManager

  loginService: LoginService
  policySearchService: PolicySearchService
  policyCoverageService: PolicyCoverageService
  claimService: ClaimService
}

const test = base.extend<APITestFixtures>({
  configuration: async ({}, use) => {
    const configuration = new APIConfiguration()
    await use(configuration)
  },
  apiContextManager: async ({ playwright, request }, use) => {
    const apiContextManager = new APIContextManager(playwright.request, request)
    await use(apiContextManager)
  },
  loginService: async ({ apiContextManager, configuration }, use) => {
    const loginService = new LoginService(apiContextManager, configuration)
    await use(loginService)
  },
  policySearchService: async ({ apiContextManager, configuration }, use) => {
    const policySearchService = new PolicySearchService(apiContextManager, configuration)
    await use(policySearchService)
  },
  policyCoverageService: async ({ apiContextManager, configuration }, use) => {
    const policyCoverageService = new PolicyCoverageService(apiContextManager, configuration)
    await use(policyCoverageService)
  },
  claimService: async ({ apiContextManager, configuration }, use) => {
    const claimService = new ClaimService(apiContextManager, configuration)
    await use(claimService)
  }
})

export { test }
