import { Locator, expect } from '@playwright/test'
import { BasePage } from '../base-page'
import path from 'path'
import fs from 'fs'
import {
  validateClaimBenefitNotUsageRemainingSection,
  validateHospitalClaimBenefitNotUsageRemainingSection,
  validateClaimBenefitSection,
  validateHospitalClaimBenefitSection
} from '../../helpers/coverage-validator'

export class ClaimManagementCreatePage extends BasePage {
  // Tabs
  readonly mainBenefitInfoTabLocator: Locator = this.page.getByRole('tab', { name: /Main benefit information/ })
  readonly treatmentInfoTabLocator: Locator = this.page.getByRole('tab', { name: /Treatment information \/ Billing/ })

  // Dropdowns (MUI Select Triggers) in Main benefit information tab
  readonly claimTypeSelectLocator: Locator = this.page.locator('#mui-component-select-caseType')
  readonly benefitTypeSelectLocator: Locator = this.page.locator('#mui-component-select-benefitType')
  readonly causeOfLossSelectLocator: Locator = this.page.locator('#mui-component-select-causeOfLoss')
  readonly alcoholSelectLocator: Locator = this.page.locator('#mui-component-select-alcoholOrNarcotic')

  // Common Inputs in Main benefit information tab
  readonly providerNameInputLocator: Locator = this.page.locator('input[name="providerId"]')
  // Used for both Appointment Date and Visit/Admission Date
  readonly admissionDateInputLocator: Locator = this.page.locator('input[name="admissionDate"]')
  readonly appointmentDateInputLocator: Locator = this.page.locator('input[name="appointmentAt"]')
  readonly estimatedIpdDaysInputLocator: Locator = this.page.locator('#estimatedIpdDays')
  readonly estimatedExpensesInputLocator: Locator = this.page.locator('#estimatedExpenses')
  readonly symptomInputLocator: Locator = this.page.locator('#importantSymptom')

  // Dynamic Inputs (Conditional) in Main benefit information tab
  readonly accidentDateInputLocator: Locator = this.page.locator('input[name="accidentDate"]')
  readonly dischargeDateInputLocator: Locator = this.page.locator('input[name="dischargeDate"]')

  // Checkboxes in Main benefit information tab
  readonly newLimitCheckboxLocator: Locator = this.page.locator('input[name="isNewCoverageQuota"]')

  // Dropdown list
  readonly listBoxLocator: Locator = this.page.getByRole('listbox')

  // Header Table
  readonly headerTableLocator = this.page
    .locator('section, div')
    .filter({ hasText: 'Coverage details' })
    .locator('h6')
    .filter({ hasText: /OTH|DEDUCTIBLE|IPD|OPD_Follow_IPD|OPD|ER|PA|HB|HB Incentive/ })

  // Actions
  readonly saveDraftBtnLocator: Locator = this.page.getByRole('button', { name: /Save draft|บันทึกฉบับร่าง/ })
  readonly saveAsDraftBtnLocator: Locator = this.page.getByRole('button', { name: /Save as draft|บันทึกเป็นฉบับร่าง/ })
  readonly viewDetailBtnLocator: Locator = this.page.getByRole('button', { name: /View detail/ })

  async extractClaimCoverageTable(sectionName: string) {
    const clean = async (cell: Locator) => (await cell.innerText()).replace(/\s+/g, ' ').trim()

    const table = this.page.locator(`(//h6[normalize-space()='${sectionName}']/following::table[1])[1]`)

    const rows = table.locator('tbody > tr')

    let previousMainGroup = ''
    let previousSubBenefit = ''
    let previousCombinedSub = ''
    let previousCombined = ''
    let previousCombinedSubRemaining = ''
    let previousCombinedRemaining = ''

    const results = []

    for (let i = 0; i < (await rows.count()); i++) {
      const row = rows.nth(i)

      const valueCells = row.locator("td[class*='css-562xhp']")
      const subBenefitCells = row.locator("td[class*='css-1q43pf6']")
      const mainGroupCells = row.locator("td[class*='css-i88b5x']")

      const valueCount = await valueCells.count()

      // ---------- Main Group ----------
      let mainGroup: string | null = null
      if ((await mainGroupCells.count()) > 0) {
        mainGroup = await clean(mainGroupCells.nth(0))
        if (mainGroup) previousMainGroup = mainGroup
        else mainGroup = previousMainGroup
      } else {
        mainGroup = previousMainGroup
      }

      // ---------- Sub Benefit ----------
      let subBenefit: string | null = null
      if ((await subBenefitCells.count()) > 0) {
        subBenefit = await clean(subBenefitCells.nth(0))
        if (subBenefit) previousSubBenefit = subBenefit
        else subBenefit = previousSubBenefit
      } else {
        subBenefit = previousSubBenefit
      }

      // ---------- Limit / Combined ----------
      let limit: string | null = null
      let usage: string | null = null
      let remaining: string | null = null
      let combinedSub: string | null = null
      let combinedSubRemaining: string | null = null
      let combined: string | null = null
      let combinedRemaining: string | null = null

      if (valueCount >= 1) {
        limit = await clean(valueCells.nth(0))
        usage = await clean(valueCells.nth(1))
        remaining = await clean(valueCells.nth(2))
      }

      if (valueCount === 7) {
        combinedSub = await clean(valueCells.nth(3))
        combinedSubRemaining = await clean(valueCells.nth(4))

        combined = await clean(valueCells.nth(5))
        combinedRemaining = await clean(valueCells.nth(6))
      }

      if (valueCount === 5) {
        combined = await clean(valueCells.nth(3))
        combinedRemaining = await clean(valueCells.nth(4))
      }

      // ---------- carry forward ----------
      if (combinedSub) previousCombinedSub = combinedSub
      else combinedSub = previousCombinedSub

      if (combinedSubRemaining) previousCombinedSubRemaining = combinedSubRemaining
      else combinedSubRemaining = previousCombinedSubRemaining

      if (combined) previousCombined = combined
      else combined = previousCombined

      if (combinedRemaining) previousCombinedRemaining = combinedRemaining
      else combinedRemaining = previousCombinedRemaining

      results.push({
        mainGroup,
        subBenefit,
        limit,
        usage,
        remaining,
        combinedSub,
        combinedSubRemaining,
        combined,
        combinedRemaining
      })
    }

    return results
  }

  async extractHospitalClaimCoverageTable(sectionName: string) {
    const clean = async (cell: Locator) => (await cell.innerText()).replace(/\s+/g, ' ').trim()

    const table = this.page.locator(`(//h6[normalize-space()='${sectionName}']/following::table[1])[1]`)

    const rows = table.locator('tbody > tr')

    let previousMainGroup = ''
    let previousSubBenefit = ''
    ;('')

    const results = []

    for (let i = 0; i < (await rows.count()); i++) {
      const row = rows.nth(i)

      const valueCells = row.locator("td[class*='css-562xhp']")
      const subBenefitCells = row.locator("td[class*='css-1q43pf6']")
      const mainGroupCells = row.locator("td[class*='css-i88b5x']")

      const valueCount = await valueCells.count()

      // ---------- Main Group ----------
      let mainGroup: string | null = null
      if ((await mainGroupCells.count()) > 0) {
        mainGroup = await clean(mainGroupCells.nth(0))
        if (mainGroup) previousMainGroup = mainGroup
        else mainGroup = previousMainGroup
      } else {
        mainGroup = previousMainGroup
      }

      // ---------- Sub Benefit ----------
      let subBenefit: string | null = null
      if ((await subBenefitCells.count()) > 0) {
        subBenefit = await clean(subBenefitCells.nth(0))
        if (subBenefit) previousSubBenefit = subBenefit
        else subBenefit = previousSubBenefit
      } else {
        subBenefit = previousSubBenefit
      }

      // ---------- Limit / Combined ----------
      let limit: string | null = null
      let usage: string | null = null
      let remaining: string | null = null

      if (valueCount >= 1) {
        limit = await clean(valueCells.nth(0))
        usage = await clean(valueCells.nth(1))
        remaining = await clean(valueCells.nth(2))
      }

      results.push({
        mainGroup,
        subBenefit,
        limit,
        usage,
        remaining
      })
    }

    return results
  }

  async getClaimCoverageDetail(productName: string, claimType: string) {
    const coverageSection = this.page.locator('text=Coverage details').first()
    await coverageSection.scrollIntoViewIfNeeded()

    const expandButton = this.page
      .locator('text=Coverage details')
      .locator('..')
      .locator('button[aria-label="expand"]')
      .or(this.page.locator('text=Coverage details').locator('..').locator('button').last())

    try {
      await expandButton.click({ timeout: 3000 })
      await this.page.waitForTimeout(500)
    } catch (error) {
      // Already expanded or button not found
    }

    // await this.headerTableLocator.first().waitFor({ state: 'visible', timeout: 30000 })

    const results = await this.extractClaimCoverageTable(claimType)

    const data = {
      [claimType]: results
    }
    const dirPath = path.resolve(process.cwd(), 'test-data', 'actual-data')
    const filePath = path.join(dirPath, `claim_coverage_${productName}_${claimType}.json`)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
  }

  async getHospitalClaimCoverageDetail(productName: string, claimType: string) {
    const coverageSection = this.page.locator('text=Coverage details').first()
    await coverageSection.scrollIntoViewIfNeeded()

    const expandButton = this.page
      .locator('text=Coverage details')
      .locator('..')
      .locator('button[aria-label="expand"]')
      .or(this.page.locator('text=Coverage details').locator('..').locator('button').last())

    try {
      await expandButton.click({ timeout: 3000 })
      await this.page.waitForTimeout(500)
    } catch (error) {
      // Already expanded or button not found
    }

    // await this.headerTableLocator.first().waitFor({ state: 'visible', timeout: 30000 })

    const results = await this.extractHospitalClaimCoverageTable(claimType)

    const data = {
      [claimType]: results
    }
    const dirPath = path.resolve(process.cwd(), 'test-data', 'actual-data')
    const filePath = path.join(dirPath, `hospital_claim_coverage_${productName}_${claimType}.json`)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
  }

  async validateClaimCoverageDetail(claimCoverageData: any, productName: string, claimType: string) {
    const filePath = path.resolve(
      process.cwd(),
      'test-data',
      'actual-data',
      `claim_coverage_${productName}_${claimType}.json`
    )
    const coverage = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

    validateClaimBenefitSection(claimCoverageData[claimType], coverage[claimType])
  }

  async validateHospitalClaimCoverageDetail(claimCoverageData: any, productName: string, claimType: string) {
    const filePath = path.resolve(
      process.cwd(),
      'test-data',
      'actual-data',
      `claim_coverage_${productName}_${claimType}.json`
    )
    const coverage = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

    validateHospitalClaimBenefitSection(claimCoverageData[claimType], coverage[claimType])
  }

  async validateClaimCoverageNotUsageRemainingDetail(claimCoverageData: any, productName: string, claimType: string) {
    await this.page.waitForTimeout(1000)

    const filePath = path.resolve(
      process.cwd(),
      'test-data',
      'actual-data',
      `claim_coverage_${productName}_${claimType}.json`
    )
    const coverage = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

    validateClaimBenefitNotUsageRemainingSection(claimCoverageData[claimType], coverage[claimType])
  }

  async validateHospitalClaimCoverageNotUsageRemainingDetail(
    claimCoverageData: any,
    productName: string,
    claimType: string
  ) {
    await this.page.waitForTimeout(1000)

    const filePath = path.resolve(
      process.cwd(),
      'test-data',
      'actual-data',
      `claim_coverage_${productName}_${claimType}.json`
    )
    const coverage = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

    validateHospitalClaimBenefitNotUsageRemainingSection(claimCoverageData[claimType], coverage[claimType])
  }

  async fillMainBenefitInformation(claimData: {
    claimType: string
    benefitType: string
    providerNameTh: string
    causeOfLoss: string

    // Dates
    appointmentDate?: string
    admissionDate?: string
    estimatedIpdDays?: string
    estimatedExpenses?: string
    accidentDate?: string
    dischargeDate?: string

    // Optional Details
    isAlcoholInvolved?: boolean | null
    symptom?: string

    // Checkboxes
    openClaimWithNewLimit?: boolean | null
  }) {
    // Main benefit information tab
    await this.mainBenefitInfoTabLocator.waitFor({ state: 'visible' })
    await this.mainBenefitInfoTabLocator.click()

    // Claim type (Pre-arrangement / IPD Admission / IPD Discharge)
    await this.claimTypeSelectLocator.click()
    await this.listBoxLocator.waitFor({ state: 'visible' })
    await this.listBoxLocator.getByRole('option', { name: claimData.claimType, exact: true }).click()

    // Benefit type (IPD / OTH/ OPD / ER / etc.)
    await this.benefitTypeSelectLocator.click()
    await this.listBoxLocator.waitFor({ state: 'visible' })
    await this.listBoxLocator.getByRole('option', { name: claimData.benefitType, exact: true }).click()

    // Verify Provider
    const currentProviderNameValue = await this.providerNameInputLocator.inputValue()

    if (currentProviderNameValue) {
      await expect(this.providerNameInputLocator).toHaveValue(claimData.providerNameTh)
    } else {
      await this.providerNameInputLocator.fill(claimData.providerNameTh)
      const optionLocator = this.page.getByRole('option', { name: claimData.providerNameTh, exact: true })
      await optionLocator.waitFor({ state: 'visible' })
      await optionLocator.click()
    }

    // Cause of loss (Accident / Illness)
    await this.causeOfLossSelectLocator.click()
    await this.listBoxLocator.waitFor({ state: 'visible' })
    await this.listBoxLocator.getByRole('option', { name: claimData.causeOfLoss, exact: true }).click()

    // Appointment Date
    if (claimData.appointmentDate && claimData.appointmentDate.trim() !== '') {
      await this.appointmentDateInputLocator.fill(claimData.appointmentDate)
    }

    // Visit/Admission Date
    if (claimData.admissionDate && claimData.admissionDate.trim() !== '') {
      await this.admissionDateInputLocator.fill(claimData.admissionDate)
    }

    // Estimated length of stay
    if (claimData.estimatedIpdDays && claimData.estimatedIpdDays.trim() !== '') {
      await this.estimatedIpdDaysInputLocator.fill(claimData.estimatedIpdDays)
    }

    // Estimated cost (฿)
    if (claimData.estimatedExpenses && claimData.estimatedExpenses.trim() !== '') {
      await this.estimatedExpensesInputLocator.fill(claimData.estimatedExpenses)
    }

    // Dynamic Logic
    // A. Discharge Date (Case Type = Discharge)
    if (claimData.dischargeDate && claimData.dischargeDate.trim() !== '') {
      const isVisible = await this.dischargeDateInputLocator.isVisible()
      if (isVisible) {
        await this.dischargeDateInputLocator.fill(claimData.dischargeDate)
      }
    }

    // B. Accident Date (Cause of Loss = Accident)
    if (claimData.accidentDate && claimData.accidentDate.trim() !== '') {
      const isVisible = await this.accidentDateInputLocator.isVisible()
      if (isVisible) {
        await this.accidentDateInputLocator.fill(claimData.accidentDate)
      }
    }

    // C. Alcohol or narcotic (Cause of Loss = Accident)
    if (claimData.isAlcoholInvolved !== undefined && claimData.isAlcoholInvolved !== null) {
      const alcoholOptionText = claimData.isAlcoholInvolved ? /^(Yes|ใช่)$/ : /^(No|ไม่ใช่)$/

      const isVisible = await this.alcoholSelectLocator.isVisible()
      if (isVisible) {
        await this.alcoholSelectLocator.click()
        await this.listBoxLocator.waitFor({ state: 'visible' })
        await this.listBoxLocator.getByRole('option', { name: alcoholOptionText }).click()
      }
    }

    // D. Symptom
    if (claimData.symptom && claimData.symptom.trim() !== '') {
      await this.symptomInputLocator.fill(claimData.symptom)
    }

    // E. Checkbox "เปิดเคลมด้วยวงเงินใหม่"
    if (claimData.openClaimWithNewLimit !== undefined && claimData.openClaimWithNewLimit !== null) {
      try {
        await this.newLimitCheckboxLocator.waitFor({ state: 'visible', timeout: 3000 })

        const isCurrentlyChecked = await this.newLimitCheckboxLocator.isChecked()

        if (claimData.openClaimWithNewLimit !== isCurrentlyChecked) {
          await this.newLimitCheckboxLocator.click()
        }
      } catch (error) {}
    }
  }

  async selectBenefitCredit(subBenefitName: string) {
    // Wait for Coverage details table to be visible
    const coverageTable = this.page.locator('table').filter({
      has: this.page.locator('th', { hasText: 'Sub benefit' })
    })
    await coverageTable.waitFor({ state: 'visible', timeout: 10000 })

    // Get all rows in tbody
    const rows = coverageTable.locator('tbody tr')
    const rowCount = await rows.count()

    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i)

      // Get all td cells in this row
      const cells = row.locator('td')
      const cellCount = await cells.count()

      for (let j = 0; j < cellCount; j++) {
        const cell = cells.nth(j)
        // Get text and normalize spaces (replace &nbsp; and multiple spaces)
        const cellText = (await cell.textContent()) || ''
        const normalizedCellText = cellText
          .replace(/\u00A0/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
        const normalizedSearchText = subBenefitName.replace(/\s+/g, ' ').trim()

        if (normalizedCellText.includes(normalizedSearchText)) {
          // Found the matching cell, now find the radio button in this row
          const radioButton = row.locator('input[type="radio"]')

          if ((await radioButton.count()) > 0) {
            await radioButton.scrollIntoViewIfNeeded()
            await radioButton.click({ force: true })
            await this.page.waitForTimeout(500)
            return
          }
        }
      }
    }
    throw new Error(`Sub benefit "${subBenefitName}" not found in Coverage details table`)
  }

  async saveDraftClaim() {
    // Save draft
    await this.saveDraftBtnLocator.waitFor({ state: 'visible' })
    await this.saveDraftBtnLocator.click()
    await this.saveAsDraftBtnLocator.waitFor({ state: 'visible' })
    await this.saveAsDraftBtnLocator.click()

    // Handle Warning Popup (Optional)
    const maxRetries = 3

    for (let i = 0; i < maxRetries; i++) {
      try {
        const warningDialog = this.page.locator('.MuiDialog-paper', {
          hasText: /Warning.*(Appointment date|Visit date|Discharge date|Accident date)/is
        })

        await warningDialog.waitFor({ state: 'visible', timeout: 3000 })

        const submitBtn = warningDialog.getByRole('button', { name: /Submit|ส่งข้อมูล/i })

        await submitBtn.waitFor({ state: 'visible' })
        await submitBtn.click()

        await this.page.waitForTimeout(2000)
      } catch (error) {
        break
      }
    }
  }

  async viewClaimDetail() {
    await this.viewDetailBtnLocator.waitFor({ state: 'visible' })
    await this.viewDetailBtnLocator.click()

    await expect(this.page).toHaveURL(/\/claim-management\/detail/i)
  }
}
