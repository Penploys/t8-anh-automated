import { expect } from '@playwright/test'
import { test } from '@fixtures/api-fixture'

test.beforeEach(async ({ configuration, loginService }) => {
  const user = configuration.users.claimManager

  const resp = await loginService.login(user.email, user.password, user.audience)

  expect(resp.status()).toBe(200)
})

test('API_Policy_Search_By_PolicyNumber_And_CitizenID_200', async ({ configuration, policySearchService }) => {
  const policiesData = configuration.policies.policyNo1.info

  const response = await policySearchService.getPolicy({
    policyNumber: policiesData.policyNumber,
    identityNumber: policiesData.citizenId,
    lossDate: '2024-12-04T16:59:00.000Z'
  })

  expect(response.status()).toBe(200)

  const responseJson = await response.json()
  expect(responseJson.data.list.length).toBeGreaterThan(0)
  expect(responseJson.data.list[0]).toEqual(policiesData)
})
