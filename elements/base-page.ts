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

  async zoomOut(zoomLevel?: number) {
    await this.page.evaluate(zoom => {
      const calculatedZoom = zoom ?? 1 / window.devicePixelRatio

      // ใช้ transform scale แทน zoom เพื่อไม่ให้ layout เพี้ยน
      document.body.style.transformOrigin = 'top left'
      document.body.style.transform = `scale(${calculatedZoom})`
      document.body.style.width = `${100 / calculatedZoom}%`
      document.body.style.height = `${100 / calculatedZoom}%`
    }, zoomLevel)
  }

  async getDevicePixelRatio(): Promise<number> {
    return await this.page.evaluate(() => window.devicePixelRatio)
  }

  async zoomToFit() {
    await this.page.evaluate(() => {
      const ratio = window.devicePixelRatio
      const zoomLevel = ratio > 1 ? 1 / ratio : 0.75

      document.body.style.transformOrigin = 'top left'
      document.body.style.transform = `scale(${zoomLevel})`
      document.body.style.width = `${100 / zoomLevel}%`
      document.body.style.height = `${100 / zoomLevel}%`
    })
  }

  async logout() {
    // Close any dialogs
    await this.page.keyboard.press('Escape')
    await this.page.waitForTimeout(500)

    // Proceed with logout
    await this.userProfileBtnLocator.waitFor({ state: 'visible' })
    await this.userProfileBtnLocator.click()

    await this.logoutMenuItemLocator.waitFor({ state: 'visible' })
    await this.logoutMenuItemLocator.click()

    await this.page.waitForURL(/\/sign-in/i)
  }
}
