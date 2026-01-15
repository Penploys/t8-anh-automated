import { expect, Locator } from '@playwright/test'
import { BasePage } from '../base-page'

export class MemberPolicyPage extends BasePage {
  // Navigation
  readonly searchMenuLocator: Locator = this.page.getByRole('link', { name: /Member search|ค้นหาผู้เอาประกันภัย/ })
  readonly claimManagementMenuLocator: Locator = this.page.getByRole('link', {
    name: /Claim management|การจัดการสินไหมทดแทน/
  })
  readonly slaMenuLocator: Locator = this.page.locator('nav').getByText(/SLA/)
  readonly faxClaimOptionLocator: Locator = this.page.getByRole('link', { name: /Fax Claim|เคลมแฟกซ์/ })
  readonly settingsMenuLocator: Locator = this.page.locator('nav').getByText(/Setting|ตั้งค่าระบบ/)
  readonly languageOptionLocator: Locator = this.page.locator('nav').getByText(/Thai|ภาษาอังกฤษ/)

  // Dropdowns
  readonly selectInsurerLocator: Locator = this.page.locator('#mui-component-select-insurer')
  readonly insurerListLocator: Locator = this.page.getByRole('listbox')

  // Inputs
  readonly lossDateLocator: Locator = this.page.locator('input[name="lossDate"]')
  readonly nameThLocator: Locator = this.page.locator('#name_th')
  readonly surnameThLocator: Locator = this.page.locator('#surname_th')
  readonly nameEnLocator: Locator = this.page.locator('#name_en')
  readonly surnameEnLocator: Locator = this.page.locator('#surname_en')
  readonly policyNumberLocator: Locator = this.page.locator('#policyNumber')
  readonly citizenIdLocator: Locator = this.page.locator('#identity_number')
  readonly creditCardLocator: Locator = this.page.locator('#creditCard')

  // Actions
  readonly searchBtnLocator: Locator = this.page.getByRole('button', { name: /Search|ค้นหา/ })

  // Grid
  readonly nameGridLocator: Locator = this.page.getByRole('grid').first()
  readonly policyGridLocator: Locator = this.page.getByRole('grid').last()

  async ensureLanguage() {
    if (!(await this.languageOptionLocator.isVisible())) {
      await this.settingsMenuLocator.click()
      await this.languageOptionLocator.waitFor({ state: 'visible' })
    }

    const languageText = await this.languageOptionLocator.textContent()

    if (languageText?.includes('ภาษาอังกฤษ')) {
      await this.languageOptionLocator.click()

      await expect(this.searchBtnLocator).toBeVisible()
    }
  }

  async getLossDate(): Promise<string> {
    await this.lossDateLocator.waitFor({ state: 'visible' })
    const value = await this.lossDateLocator.inputValue()

    if (value) {
      return value.trim()
    }
  }

  async memberSearch(memberData: {
    insurerName?: string
    lossDate?: string
    nameTh?: string
    surnameTh?: string
    policyNumber?: string
    citizenId?: string
  }) {
    await this.searchMenuLocator.click()

    // Select insurer
    await this.selectInsurerLocator.click()
    await this.insurerListLocator.getByRole('option', { name: memberData.insurerName, exact: true }).click()

    // Fill loss date if provided
    if (memberData.lossDate) {
      await this.lossDateLocator.fill(memberData.lossDate)
    }

    // Fill criteria
    await this.nameThLocator.fill(memberData.nameTh)
    await this.surnameThLocator.fill(memberData.surnameTh)
    await this.policyNumberLocator.fill(memberData.policyNumber)
    await this.citizenIdLocator.fill(memberData.citizenId)

    await this.searchBtnLocator.waitFor({ state: 'visible' })
    await this.searchBtnLocator.click()
  }

  async selectPolicy(memberData: {
    nameTh?: string
    surnameTh?: string
    policyNumber?: string
    subClass?: string
    policyHolder?: string
    citizenId?: string
    cardNo?: string
    memberEffectiveDate?: string
    memberExpiryDate?: string
    plan?: string
    policyStatus?: string
  }) {
    // Wait for grids to be visible
    await this.policyGridLocator.waitFor({ state: 'visible' })
    await this.nameGridLocator.waitFor({ state: 'visible' })

    // Filter name grid first if name is provided
    let matchedNameRowIndex = -1

    if (memberData.nameTh && memberData.surnameTh) {
      // Use double filter instead of regex to handle "TPA" suffix
      const nameRow = this.nameGridLocator
        .getByRole('row')
        .filter({ hasText: memberData.nameTh })
        .filter({ hasText: memberData.surnameTh })

      const nameRowCount = await nameRow.count()
      if (nameRowCount === 0) {
        throw new Error(`No member found with name: ${memberData.nameTh} ${memberData.surnameTh}`)
      }

      // Get the row index (data-rowindex attribute)
      const rowIndexAttr = await nameRow.first().getAttribute('data-rowindex')
      matchedNameRowIndex = rowIndexAttr ? parseInt(rowIndexAttr) : -1
    }

    // Filter policy grid
    let filteredRow = this.policyGridLocator.getByRole('row')

    if (memberData.policyNumber) {
      filteredRow = filteredRow.filter({ hasText: memberData.policyNumber })
    }

    if (memberData.subClass) {
      filteredRow = filteredRow.filter({ hasText: memberData.subClass })
    }

    if (memberData.citizenId) {
      filteredRow = filteredRow.filter({ hasText: memberData.citizenId })
    }

    if (memberData.memberEffectiveDate && memberData.memberExpiryDate) {
      const startDate = memberData.memberEffectiveDate.split(' ')[0]
      const endDate = memberData.memberExpiryDate.split(' ')[0]
      const expectedDateRange = `${startDate} - ${endDate}`
      filteredRow = filteredRow.filter({ hasText: expectedDateRange })
    }

    if (memberData.plan) {
      filteredRow = filteredRow.filter({ hasText: memberData.plan })
    }

    if (memberData.policyStatus) {
      filteredRow = filteredRow.filter({ hasText: memberData.policyStatus })
    }

    if (memberData.policyHolder) {
      filteredRow = filteredRow.filter({ hasText: memberData.policyHolder })
    }

    if (memberData.cardNo) {
      filteredRow = filteredRow.filter({ hasText: memberData.cardNo })
    }

    // If name was checked, verify the policy row has the same index
    if (matchedNameRowIndex !== -1) {
      // Get all matching rows and filter manually
      const allMatchingRows = await filteredRow.all()

      for (const row of allMatchingRows) {
        const rowIndex = await row.getAttribute('data-rowindex')
        if (rowIndex === String(matchedNameRowIndex)) {
          filteredRow = this.page.locator(`[role="row"][data-rowindex="${matchedNameRowIndex}"]`).last()
          break
        }
      }
    }

    // Validate that exactly one row matches
    const matchCount = await filteredRow.count()

    if (matchCount === 0) {
      throw new Error(`No policy found matching the criteria`)
    }

    if (matchCount > 1) {
      console.warn(`Warning: Found ${matchCount} policies matching the criteria. Selecting the first one.`)
    }

    // Click the matched row
    await filteredRow.first().click()

    await expect(this.page).toHaveURL(/\/member-policy\/detail/i)
  }

  async claimManagement() {
    await this.claimManagementMenuLocator.waitFor({ state: 'visible' })
    await this.claimManagementMenuLocator.click()

    await expect(this.page).toHaveURL(/\/claim-management/)
  }

  async slaClaim() {
    if (!(await this.faxClaimOptionLocator.isVisible())) {
      await this.slaMenuLocator.waitFor({ state: 'visible' })
      await this.slaMenuLocator.click()
    }

    await this.faxClaimOptionLocator.waitFor({ state: 'visible' })
    await this.faxClaimOptionLocator.click()

    await expect(this.page).toHaveURL(/\/sla\/claim/)
  }
}
