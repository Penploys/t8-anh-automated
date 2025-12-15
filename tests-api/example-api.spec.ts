import { expect } from '@playwright/test'

import { test } from '@fixtures/api-fixture'

test('Authen user able to get product list', async ({ configuration, loginService, productService }) => {
  const user = configuration.users.user1
  await loginService.login(user.email, user.password)

  const resp = await productService.getProducts()
  await expect(resp).toBeOK()
  const productList = await resp.json()
  expect(productList[1]).toEqual(
    expect.objectContaining({
      name: 'Apple Watch',
      price: 12500
    })
  )
})
