import { Page, Locator } from '@playwright/test'

export class BasePage {
  readonly page: Page

  readonly userProfileBtnLocator: Locator
  readonly logoutMenuItemLocator: Locator

  constructor(page: Page) {
    this.page = page

    this.userProfileBtnLocator = this.page.locator('button[aria-controls="user-menu"]')
    this.logoutMenuItemLocator = this.page.getByRole('menuitem', { name: /Logout|ออกจากระบบ/ })
  }

  async logout() {
    await this.userProfileBtnLocator.waitFor({ state: 'visible' })
    await this.userProfileBtnLocator.click()

    await this.logoutMenuItemLocator.waitFor({ state: 'visible' })
    await this.logoutMenuItemLocator.click()

    await this.page.waitForURL(/\/sign-in/i)
  }
}
