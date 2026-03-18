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
  readonly policyGridVirtualScroller: Locator = this.page.locator('.MuiDataGrid-virtualScroller').last()

  async ensureLanguage() {
    if (!(await this.languageOptionLocator.isVisible())) {
      await this.settingsMenuLocator.waitFor({ state: 'visible' })
      await this.settingsMenuLocator.click()
      await this.languageOptionLocator.waitFor({ state: 'visible' })
    }

    const languageText = await this.languageOptionLocator.textContent()

    if (languageText?.includes('ภาษาอังกฤษ')) {
      await this.languageOptionLocator.click()

      await expect(this.searchBtnLocator).toBeVisible()
    }
  }

  async getLossDate(): Promise<string | undefined> {
    await this.lossDateLocator.waitFor({ state: 'visible' })
    const value = await this.lossDateLocator.inputValue()

    if (value) {
      return value.trim()
    }
  }

  async memberSearch(memberData: {
    insurerName?: string | undefined
    lossDate?: string | undefined
    nameTh?: string | undefined
    surnameTh?: string | undefined
    policyNumber?: string | undefined
    citizenId?: string | undefined
  }) {
    await this.searchMenuLocator.waitFor({ state: 'visible' })
    await this.searchMenuLocator.click()

    // Select insurer
    await this.selectInsurerLocator.click()
    await this.insurerListLocator.getByRole('option', { name: memberData.insurerName, exact: true }).click()

    // Fill loss date if provided
    if (memberData.lossDate) {
      await this.lossDateLocator.fill(memberData.lossDate)
    }

    // Fill criteria
    if (memberData.nameTh) {
      await this.nameThLocator.fill(memberData.nameTh)
    }
    if (memberData.surnameTh) {
      await this.surnameThLocator.fill(memberData.surnameTh)
    }
    if (memberData.policyNumber) {
      await this.policyNumberLocator.fill(memberData.policyNumber)
    }
    if (memberData.citizenId) {
      await this.citizenIdLocator.fill(memberData.citizenId)
    }

    await this.searchBtnLocator.waitFor({ state: 'visible' })
    await this.searchBtnLocator.click()
  }

  async MemberSearchByName(memberData: {
    insurerName?: string | undefined
    lossDate?: string | undefined
    nameTh?: string | undefined
    surnameTh?: string | undefined
  }) {
    await this.searchMenuLocator.waitFor({ state: 'visible' })
    await this.searchMenuLocator.click()

    // Select insurer
    await this.selectInsurerLocator.waitFor({ state: 'visible' })
    await this.selectInsurerLocator.click()
    await this.insurerListLocator.getByRole('option', { name: memberData.insurerName, exact: true }).click()

    // Fill loss date if provided
    if (memberData.lossDate) {
      await this.lossDateLocator.fill(memberData.lossDate)
    }

    // Clear other fields first
    await this.nameEnLocator.clear()
    await this.surnameEnLocator.clear()
    await this.citizenIdLocator.clear()
    await this.policyNumberLocator.clear()
    await this.creditCardLocator.clear()

    // Fill only name criteria
    if (memberData.nameTh) {
      await this.nameThLocator.fill(memberData.nameTh)
    }
    if (memberData.surnameTh) {
      await this.surnameThLocator.fill(memberData.surnameTh)
    }

    await this.searchBtnLocator.waitFor({ state: 'visible' })
    await this.searchBtnLocator.click()
  }

  async MemberSearchByCitizenId(
    memberData: { insurerName?: string | undefined; 
      lossDate?: string | undefined; 
      citizenId?: string | undefined 
    }) {
    await this.searchMenuLocator.waitFor({ state: 'visible' })
    await this.searchMenuLocator.click()

    // Select insurer
    await this.selectInsurerLocator.waitFor({ state: 'visible' })
    await this.selectInsurerLocator.click()
    await this.insurerListLocator.getByRole('option', { name: memberData.insurerName, exact: true }).click()

    // Fill loss date if provided
    if (memberData.lossDate) {
      await this.lossDateLocator.fill(memberData.lossDate)
    }

    // Clear other fields first
    await this.nameThLocator.clear()
    await this.surnameThLocator.clear()
    await this.nameEnLocator.clear()
    await this.surnameEnLocator.clear()
    await this.policyNumberLocator.clear()
    await this.creditCardLocator.clear()

    // Fill only citizen ID
    if (memberData.citizenId) {
      await this.citizenIdLocator.fill(memberData.citizenId)
    }

    await this.searchBtnLocator.waitFor({ state: 'visible' })
    await this.searchBtnLocator.click()
  }

  async validateSearchResultsByName(memberData: { nameTh: string; surnameTh: string }) {
    await this.nameGridLocator.waitFor({ state: 'visible' })

    const allRows = await this.nameGridLocator.locator('[role="row"][data-rowindex]').all()

    if (allRows.length === 0) {
      throw new Error('No search results found')
    }

    for (const row of allRows) {
      const rowText = await row.textContent()

      if (rowText === null) continue

      // Check that both name and surname are present
      if (!rowText.includes(memberData.nameTh) || !rowText.includes(memberData.surnameTh)) {
        throw new Error(
          `Search result contains incorrect data. Expected: ${memberData.nameTh} ${memberData.surnameTh}, Found: ${rowText}`
        )
      }

      // Check for duplicates
      const nameCount = (rowText.match(new RegExp(memberData.nameTh, 'g')) || []).length
      const surnameCount = (rowText.match(new RegExp(memberData.surnameTh, 'g')) || []).length

      if (nameCount > 1 || surnameCount > 1) {
        throw new Error(
          `Search result contains duplicate name/surname. Expected: ${memberData.nameTh} ${memberData.surnameTh} (once), Found: ${rowText}`
        )
      }
    }
  }

  async validateSearchResultsByCitizenId(memberData: { citizenId: string }) {
    await this.policyGridLocator.waitFor({ state: 'visible' })

    // Get only data rows - rows that have data-rowindex attribute
    const allRows = await this.policyGridLocator.locator('[role="row"][data-rowindex]').all()

    if (allRows.length === 0) {
      throw new Error('No search results found')
    }

    // Validate each row contains the searched citizen ID
    for (const row of allRows) {
      const rowText = await row.textContent()

      if (rowText === null) continue

      if (!rowText.includes(memberData.citizenId)) {
        throw new Error(
          `Search result contains incorrect citizen ID. Expected: ${memberData.citizenId}, Found: ${rowText}`
        )
      }
    }
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
    await this.policyGridLocator.waitFor({ state: 'visible' })

    // --- Pre-filter: collect valid row indices from name grid if name is provided ---
    let nameMatchedIndices: Set<number> | null = null

    if (memberData.nameTh && memberData.surnameTh) {
      await this.nameGridLocator.waitFor({ state: 'visible' })
      nameMatchedIndices = new Set()
      const nameRows = await this.nameGridLocator.locator('[role="row"][data-rowindex]').all()

      for (const nameRow of nameRows) {
        const cell = nameRow.locator('[data-field="firstNameTh"]')
        const text = await cell.textContent()
        if (text?.includes(memberData.nameTh) && text?.includes(memberData.surnameTh)) {
          const idx = await nameRow.getAttribute('data-rowindex')
          if (idx !== null) nameMatchedIndices.add(parseInt(idx))
        }
      }

      if (nameMatchedIndices.size === 0) {
        throw new Error(`No member found with name: ${memberData.nameTh} ${memberData.surnameTh}`)
      }
    }

    // --- Pass 1: scroll left, filter by left-side visible columns ---
    await this.policyGridVirtualScroller.evaluate(el => { el.scrollLeft = 0 })
    await this.page.waitForTimeout(500)

    const candidateIndices: number[] = []
    const allRows = await this.policyGridLocator.locator('[role="row"][data-rowindex]').all()

    for (const row of allRows) {
      const idx = await row.getAttribute('data-rowindex')
      if (idx === null) continue
      const rowIndex = parseInt(idx)

      // Skip if not in name-matched indices
      if (nameMatchedIndices !== null && !nameMatchedIndices.has(rowIndex)) continue

      let match = true

      if (memberData.policyNumber) {
        const cell = row.locator('[data-field="policyNumber"]')
        if (!(await cell.textContent())?.includes(memberData.policyNumber)) match = false
      }
      if (memberData.subClass) {
        const cell = row.locator('[data-field="policySubClass"]')
        if (!(await cell.textContent())?.includes(memberData.subClass)) match = false
      }
      if (memberData.policyHolder) {
        const cell = row.locator('[data-field="policyHolderNameEn"]')
        if (!(await cell.textContent())?.includes(memberData.policyHolder)) match = false
      }
      if (memberData.citizenId) {
        const cell = row.locator('[data-field="citizenId"]')
        if (!(await cell.textContent())?.includes(memberData.citizenId)) match = false
      }
      if (memberData.cardNo) {
        const cell = row.locator('[data-field="cardNo"]')
        if (!(await cell.textContent())?.includes(memberData.cardNo)) match = false
      }
      if (memberData.memberEffectiveDate && memberData.memberExpiryDate) {
        const startDate = memberData.memberEffectiveDate.split(' ')[0]
        const endDate = memberData.memberExpiryDate.split(' ')[0]
        const cell = row.locator('[data-field="effectiveAt"]')
        if (!(await cell.textContent())?.includes(`${startDate} - ${endDate}`)) match = false
      }

      if (match) candidateIndices.push(rowIndex)
    }

    // --- Pass 2: scroll right, check right-side columns for each candidate ---
    await this.policyGridVirtualScroller.evaluate(el => { el.scrollLeft = el.scrollWidth })
    await this.page.waitForTimeout(500)

    let targetRowIndex = -1
    for (const idx of candidateIndices) {
      const row = this.policyGridLocator.locator(`[role="row"][data-rowindex="${idx}"]`)
      let match = true

      if (memberData.plan) {
        const cell = row.locator('[data-field="planName"]')
        if (!(await cell.textContent())?.includes(memberData.plan)) match = false
      }
      if (memberData.policyStatus) {
        const cell = row.locator('[data-field="status"]')
        if (!(await cell.textContent())?.includes(memberData.policyStatus)) match = false
      }

      if (match) { targetRowIndex = idx; break }
    }

    if (targetRowIndex === -1) {
      throw new Error(`No policy found matching the criteria: ${JSON.stringify(memberData)}`)
    }

    // Scroll back to left so the row's click target is visible
    await this.policyGridVirtualScroller.evaluate(el => { el.scrollLeft = 0 })
    await this.page.waitForTimeout(500)

    await this.policyGridLocator.locator(`[role="row"][data-rowindex="${targetRowIndex}"]`).click()
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
