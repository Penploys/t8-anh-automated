import { expect } from '@playwright/test'
import { test } from '@fixtures/api-fixture'
import { randomISODateBetween } from '../api-services/utils/random.util'

let claimUUIDNo1: string

test.beforeEach(async ({ configuration, loginService, claimService }) => {
  const user = configuration.users.claimManager

  const resp = await loginService.login(user.email, user.password, user.audience)

  expect(resp.status()).toBe(200)

  const payload = configuration.payloadCoverage
  const policyData = configuration.policies.policyNo1.info

  const bodyReq = (payload as any).default ?? payload
  bodyReq.visited_at = randomISODateBetween(policyData.effectiveAt, policyData.expiredAt)
  bodyReq.discharged_at = bodyReq.visited_at
  bodyReq.billing_at = payload.visited_at

  const res = await claimService.createClaim(bodyReq)
  expect(res.status()).toBe(201)

  const body = await res.json()
  claimUUIDNo1 = body.data.claimUuid
})

test('API_Claim_Assign_200', async ({ configuration, claimService }) => {
  const bodyReq = {
    assignee_uuid: configuration.users.claimManager.uuid,
    action_reason_remark: 'Assign claim to claim manager for processing'
  }

  const res = await claimService.assignClaim(claimUUIDNo1, bodyReq)
  expect(res.status()).toBe(200)

  const body = await res.json()
  expect(body.status).toBe('success')
})
