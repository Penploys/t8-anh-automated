import { test } from '@fixtures/e2e-fixture'

test('User purchase product with credit card', async ({ configuration, page, loginPage, productListPage }) => {
  const user = configuration.users.user1
  await page.goto(configuration.appSetting.baseURL)
  await loginPage.sumbitLogin(user.email, user.password)
  await productListPage.addProductToCartByIndex(0)
  await productListPage.addProductToCartByIndex(2)
})
