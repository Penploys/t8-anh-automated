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
    // Handle claim type
    if (slaData.claimType) {
      const isDisabled = await this.claimTypeLocator.locator('..').evaluate(el => el.classList.contains('Mui-disabled'))

      if (isDisabled) {
        // If disabled, validate the text
        await expect(this.claimTypeLocator).toHaveText(slaData.claimType)
      } else {
        // If not disabled, click and select from dropdown
        await this.claimTypeLocator.click()
        await this.page.getByRole('option', { name: slaData.claimType, exact: true }).click()
        await this.page.keyboard.press('Escape')
      }
    }

    // Handle claim service type
    if (slaData.claimServiceType) {
      const isDisabled = await this.claimServiceTypeLocator
        .locator('..')
        .evaluate(el => el.classList.contains('Mui-disabled'))

      if (isDisabled) {
        // If disabled, validate the text
        await expect(this.claimServiceTypeLocator).toHaveText(slaData.claimServiceType)
      } else {
        // If not disabled, click and select from dropdown
        await this.claimServiceTypeLocator.click()
        await this.page.getByRole('option', { name: slaData.claimServiceType, exact: true }).click()
        await this.page.keyboard.press('Escape')
      }
    }

    // Select claim stage
    if (slaData.claimStage) {
      await this.claimStageLocator.click()

      // Uncheck all selected items first
      const checkedOptions = this.page.getByRole('option', { checked: true })
      const count = await checkedOptions.count()
      for (let i = 0; i < count; i++) {
        await checkedOptions.nth(0).click()
      }

      // Select the desired stage
      await this.page.getByRole('option', { name: slaData.claimStage, exact: true }).click()

      // Click outside to close the dropdown
      await this.page.keyboard.press('Escape')
    }

    // Select claim status
    if (slaData.claimStatus) {
      await this.claimStatusLocator.click()

      // Get all options
      const allOptions = this.page.getByRole('option')
      const count = await allOptions.count()

      // Uncheck all options that don't match the desired status
      for (let i = 0; i < count; i++) {
        const option = allOptions.nth(i)
        const isChecked = (await option.getAttribute('aria-selected')) === 'true'
        const optionText = await option.textContent()

        if (isChecked && optionText?.trim() !== slaData.claimStatus) {
          await option.click()
        }
      }

      // Check the desired status if not already checked
      const desiredOption = this.page.getByRole('option', { name: slaData.claimStatus, exact: true })
      const isDesiredChecked = (await desiredOption.getAttribute('aria-selected')) === 'true'
      if (!isDesiredChecked) {
        await desiredOption.click()
      }

      // Click outside to close the dropdown
      await this.page.keyboard.press('Escape')
    }

    // Fill assignees if data exists
    if (slaData.assignees) {
      await this.assigneesInputLocator.fill(slaData.assignees)
      // Wait for autocomplete dropdown and select the option
      await this.page.getByRole('option', { name: slaData.assignees, exact: true }).click()
    }

    await this.searchBtnLocator.waitFor({ state: 'visible' })
    await this.searchBtnLocator.click()
  }

  async selectSlaClaim(claimNumber: string, slaData: any) {
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
}
