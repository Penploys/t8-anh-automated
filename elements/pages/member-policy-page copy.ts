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

  // Grid cell
  readonly resultGridLocator: Locator = this.page.getByRole('grid')
  readonly gridVirtualScroller: Locator = this.page.locator('.MuiDataGrid-virtualScroller').last()
  readonly policyCellHeaderLocator: Locator = this.page.locator('[data-field="policyNumber"]').first()
  readonly nameCellLocator: Locator = this.page.locator('div[role="gridcell"][data-field="firstNameTh"]').first()
  readonly policyNumberCellLocator: Locator = this.page
    .locator('div[role="gridcell"][data-field="policyNumber"]')
    .first()
  readonly subClassCellLocator: Locator = this.page.locator('div[role="gridcell"][data-field="policySubClass"]').first()
  readonly policyHolderCellLocator: Locator = this.page
    .locator('div[role="gridcell"][data-field="policyHolderNameEn"]')
    .first()
  readonly citizenIdCellLocator: Locator = this.page.locator('div[role="gridcell"][data-field="citizenId"]').first()
  readonly cardNoCellLocator: Locator = this.page.locator('div[role="gridcell"][data-field="cardNo"]').first()
  readonly memberEffectiveDateCellLocator: Locator = this.page
    .locator('div[role="gridcell"][data-field="effectiveAt"]')
    .first()
  readonly planCellLocator: Locator = this.page.locator('div[role="gridcell"][data-field="planName"]').first()
  readonly policyStatusCellLocator: Locator = this.page.locator('div[role="gridcell"][data-field="status"]').first()

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

  async validateMemberSearchResult(memberData: {
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
    await this.policyCellHeaderLocator.waitFor({ state: 'visible' })

    const expectedFullName = `${memberData.nameTh} ${memberData.surnameTh}`

    // Member Effective Date (Combined Range)
    const startDate = memberData.memberEffectiveDate.split(' ')[0]
    const endDate = memberData.memberExpiryDate.split(' ')[0]
    const expectedDateRange = `${startDate} - ${endDate}`

    // Name (Use toContainText because HTML has <span>TPA</span> inserted)
    await expect(this.nameCellLocator).toContainText(expectedFullName)
    await expect(this.policyNumberCellLocator).toHaveText(memberData.policyNumber)
    await expect(this.subClassCellLocator).toHaveText(memberData.subClass)
    await expect(this.policyHolderCellLocator).toHaveText(memberData.policyHolder)
    await expect(this.citizenIdCellLocator).toHaveText(memberData.citizenId)
    await expect(this.cardNoCellLocator).toHaveText(memberData.cardNo)

    await this.gridVirtualScroller.evaluate(element => {
      element.scrollLeft = 1000
    })

    await expect(this.memberEffectiveDateCellLocator).toHaveText(expectedDateRange)
    await expect(this.planCellLocator).toHaveText(memberData.plan)
    await expect(this.policyStatusCellLocator).toHaveText(memberData.policyStatus)

    await this.gridVirtualScroller.evaluate(element => {
      element.scrollLeft = 0
    })
  }

  async selectPolicy(memberData: { nameTh?: string; surnameTh?: string; policyNumber?: string; citizenId?: string }) {
    // Wait for search result
    const firstRow = this.resultGridLocator.getByRole('row').nth(1)
    await firstRow.waitFor({ state: 'visible' })

    // Filter and Click
    const targetRow = this.resultGridLocator
      .getByRole('row')
      .filter({ hasText: memberData.policyNumber })
      .filter({ hasText: memberData.citizenId })

    await targetRow.click()

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
