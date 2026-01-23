import { expect } from '@playwright/test'

import { test } from '@fixtures/api-fixture'

test('API_Login_ClaimManager_200', async ({ configuration, loginService }) => {
  const user = configuration.users.claimManager
  const resp = await loginService.login(user.email, user.password, user.audience)

  await expect(resp).toBeOK()
  const respJson = await resp.json()

  expect(respJson.message).toEqual('Successfully logged in')
})
