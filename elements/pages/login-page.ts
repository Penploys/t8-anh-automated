import { expect, Locator } from '@playwright/test'
import { BasePage } from '../base-page'

export class LoginPage extends BasePage {
  // Input Locators
  readonly emailInputLocator: Locator = this.page.locator('#email')
  readonly passwordInputLocator: Locator = this.page.locator('#password')

  // Login button Locators
  readonly submitBtnLocator: Locator = this.page.getByRole('button', { name: 'เข้าสู่ระบบ' })

  async submitLogin(email: string, password: string) {
    await this.emailInputLocator.fill(email)
    await this.passwordInputLocator.fill(password)
    await this.submitBtnLocator.click()

    await expect(this.page).toHaveURL(/\/member-policy/i)
  }
}
