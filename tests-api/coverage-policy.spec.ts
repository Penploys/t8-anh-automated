import { expect } from '@playwright/test'
import { test } from '@fixtures/api-fixture'

test.beforeEach(async ({ configuration, loginService }) => {
  const user = configuration.users.claimManager

  const resp = await loginService.login(user.email, user.password, user.audience)

  expect(resp.status()).toBe(200)
})

test('API_Policy_Coverage_200', async ({ configuration, policyCoverageService }) => {
  const policiesInfoData = configuration.policies.policyNo1.info
  const policiesMemberUUID = configuration.policies.policyNo1.member.uuid
  const policiesCoverageData = configuration.policies.policyNo1.coverages

  const response = await policyCoverageService.getCoveragePolicy({
    policyNumber: policiesInfoData.policyNumber,
    iiaMembership: policiesMemberUUID
  })

  expect(response.status()).toBe(200)

  const responseJson = await response.json()
  expect(responseJson.data).toEqual(policiesCoverageData)
})
