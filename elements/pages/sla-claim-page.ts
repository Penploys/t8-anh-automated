import { Locator, expect } from '@playwright/test'
import { BasePage } from '../base-page'

export class SlaClaimPage extends BasePage {
  // Inputs
  readonly assigneesInputLocator: Locator = this.page.locator('input[name="assignee"]')
  readonly claimTypeLocator: Locator = this.page.locator('#mui-component-select-claim_types')
  readonly claimServiceTypeLocator: Locator = this.page.locator('#mui-component-select-claimServiceType')
  readonly claimStageLocator: Locator = this.page.locator('#mui-component-select-claimStages')
  readonly claimStatusLocator: Locator = this.page.locator('#mui-component-select-claimStatuses')

  // Actions
  readonly searchBtnLocator: Locator = this.page.getByRole('button', { name: /Search/ })
  readonly resultGridLocator: Locator = this.page.getByRole('grid')

  async slaClaimSearch(slaData: any) {
    // Fill assignees if data exists
    if (slaData.assignees) {
      await this.assigneesInputLocator.fill(slaData.assignees)
      // Wait for autocomplete dropdown and select the option
      await this.page.getByRole('option', { name: slaData.assignees }).click()
    }

    // Validate claim type
    if (slaData.claimType) {
      await expect(this.claimTypeLocator).toHaveText(slaData.claimType)
    }

    // Validate claim service type
    if (slaData.claimServiceType) {
      await expect(this.claimServiceTypeLocator).toHaveText(slaData.claimServiceType)
    }

    // Select claim stage
    if (slaData.claimStage) {
      await this.claimStageLocator.click()
      await this.page.getByRole('option', { name: slaData.claimStage }).click()

      // Click outside to close the dropdown
      await this.page.keyboard.press('Escape')
    }

    // Select claim status
    if (slaData.claimStatus) {
      await this.claimStatusLocator.click()

      // Uncheck all selected items first
      const checkedOptions = this.page.getByRole('option', { checked: true })
      const count = await checkedOptions.count()
      for (let i = 0; i < count; i++) {
        await checkedOptions.nth(0).click()
      }

      // Select the desired status
      await this.page.getByRole('option', { name: slaData.claimStatus }).click()

      // Click outside to close the dropdown
      await this.page.keyboard.press('Escape')
    }

    await this.searchBtnLocator.waitFor({ state: 'visible' })
    await this.searchBtnLocator.click()
  }

  async selectSlaClaimAssign(claimNumber: string, slaData: any) {
    const firstRow = this.resultGridLocator.getByRole('row').nth(1)
    await firstRow.waitFor({ state: 'visible' })

    // Filter and Click
    const targetRow = this.resultGridLocator
      .getByRole('row')
      .filter({ hasText: claimNumber })
      .filter({ hasText: slaData.name })
      .filter({ hasText: slaData.assignment })
      .filter({ hasText: slaData.claimStatus })

    await targetRow.click()

    await expect(this.page).toHaveURL(/\/claim-management\/detail/i)
  }

  async selectSlaClaimAuthorize(claimNumber: string, slaData: any) {
    const firstRow = this.resultGridLocator.getByRole('row').nth(1)
    await firstRow.waitFor({ state: 'visible' })

    // Filter and Click
    const targetRow = this.resultGridLocator
      .getByRole('row')
      .filter({ hasText: claimNumber })
      .filter({ hasText: slaData.name })
      .filter({ hasText: slaData.assignment })
      .filter({ hasText: 'Under Review' })

    await targetRow.click()

    await expect(this.page).toHaveURL(/\/claim-management\/detail/i)
  }
}
