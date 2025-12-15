import { Locator } from '@playwright/test'

import { BasePage } from '../base-page'

export class ProductListPage extends BasePage {
  readonly addToCartBtnsLocator: Locator = this.page.locator(
    '//div[@class="dashboard-page"]//button[text()="Add to cart"]'
  )

  async addProductToCartByIndex(index: number) {
    await this.addToCartBtnsLocator.nth(index).click()
  }
}
