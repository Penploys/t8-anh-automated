import { Locator } from '@playwright/test'

import { BasePage } from '../base-page'

export class LoginPage extends BasePage {
  readonly emailInputLocator: Locator = this.page.locator('data-testid=email')
  readonly passwordInputLocator: Locator = this.page.locator('data-testid=password')
  readonly submitBtnLocator: Locator = this.page.locator('data-testid=submit')

  async sumbitLogin(email: string, password: string) {
    await this.emailInputLocator.fill(email)
    await this.passwordInputLocator.fill(password)
    await this.submitBtnLocator.click()
  }
}
