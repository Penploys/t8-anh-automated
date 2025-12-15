import { test as base } from '@playwright/test'

import { LoginPage } from '@elements/pages/login-page'
import { ProductListPage } from '@elements/pages/product-list-page'
import { E2EConfiguration } from '@services/configurations/e2e-configuration'

interface E2ETestFixtures {
  configuration: E2EConfiguration

  loginPage: LoginPage
  productListPage: ProductListPage
}

const test = base.extend<E2ETestFixtures>({
  configuration: async ({}, use) => {
    const configuration = new E2EConfiguration()
    await use(configuration)
  },
  loginPage: async ({ page }, use) => {
    // page.setDefaultTimeout(configuration.appSettings.timeout);
    // await page.goto(configuration.appSettings.baseUrl);
    const loginPage = new LoginPage(page)
    await use(loginPage)
  },
  productListPage: async ({ page }, use) => {
    const productListPage = new ProductListPage(page)
    await use(productListPage)
  }
})

export { test }
