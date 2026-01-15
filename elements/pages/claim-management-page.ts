import { Locator, expect } from '@playwright/test'
import { BasePage } from '../base-page'

export class ClaimManagementPage extends BasePage {
  // Inputs
  readonly claimNumberLocator: Locator = this.page.locator('#claim_number')

  // Actions
  readonly searchBtnLocator: Locator = this.page.getByRole('button', { name: /Search|ค้นหา/ })
  readonly resultGridLocator: Locator = this.page.getByRole('grid')

  async claimSearch(claimNumber: string) {
    await this.claimNumberLocator.fill(claimNumber)

    await this.searchBtnLocator.waitFor({ state: 'visible' })
    await this.searchBtnLocator.click()
  }

  async selectClaim(memberData: any, claimNumber: string) {
    // Wait for search result
    const firstRow = this.resultGridLocator.getByRole('row').nth(1)
    await firstRow.waitFor({ state: 'visible' })

    // Filter and Click
    const targetRow = this.resultGridLocator
      .getByRole('row')
      .filter({ hasText: memberData.citizenId })
      .filter({ hasText: memberData.policyNumber })
      .filter({ hasText: claimNumber })

    await targetRow.click()

    await expect(this.page).toHaveURL(/\/claim-management\/detail/i)
  }
}
