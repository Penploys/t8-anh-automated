import { expect } from '@playwright/test'
import { test } from '@fixtures/api-fixture'
import { randomISODateBetween } from '../api-services/utils/random.util'

test.beforeEach(async ({ configuration, loginService }) => {
  const user = configuration.users.claimManager

  const resp = await loginService.login(user.email, user.password, user.audience)

  expect(resp.status()).toBe(200)
})

test('API_Claim_Create_201', async ({ configuration, claimService }) => {
  const payload = configuration.payloadCoverage
  const policyData = configuration.policies.policyNo1.info

  const bodyReq = (payload as any).default ?? payload
  bodyReq.visited_at = randomISODateBetween(policyData.effectiveAt, policyData.expiredAt)
  bodyReq.discharged_at = bodyReq.visited_at
  bodyReq.billing_at = payload.visited_at

  const res = await claimService.createClaim(bodyReq)
  expect(res.status()).toBe(201)

  const body = await res.json()
  expect(body.claimUuid).toBeDefined()
})
