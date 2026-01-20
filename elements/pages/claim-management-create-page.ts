import { Locator, expect } from '@playwright/test'
import { BasePage } from '../base-page'

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

  // Actions
  readonly saveDraftBtnLocator: Locator = this.page.getByRole('button', { name: /Save draft|บันทึกฉบับร่าง/ })
  readonly saveAsDraftBtnLocator: Locator = this.page.getByRole('button', { name: /Save as draft|บันทึกเป็นฉบับร่าง/ })
  readonly viewDetailBtnLocator: Locator = this.page.getByRole('button', { name: /View detail/ })

  async fillMainBenefitInformation(claimData: {
    claimType?: string
    benefitType?: string
    providerNameTh?: string
    causeOfLoss?: string

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
      await this.admissionDateInputLocator.fill(claimData.appointmentDate)
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

    // D. Checkbox "เปิดเคลมด้วยวงเงินใหม่"
    if (claimData.openClaimWithNewLimit !== undefined && claimData.openClaimWithNewLimit !== null) {
      const isCurrentlyChecked = await this.newLimitCheckboxLocator.isChecked()

      if (claimData.openClaimWithNewLimit !== isCurrentlyChecked) {
        await this.newLimitCheckboxLocator.click()
      }
    }

    // Symptom
    if (claimData.symptom && claimData.symptom.trim() !== '') {
      await this.symptomInputLocator.fill(claimData.symptom)
    }
  }

  async saveDraftClaim() {
    // Save draft
    await this.saveDraftBtnLocator.waitFor({ state: 'visible' })
    await this.saveDraftBtnLocator.click()
    await this.saveAsDraftBtnLocator.waitFor({ state: 'visible' })
    await this.saveAsDraftBtnLocator.click()
  }

  async viewClaimDetail() {
    // View detail
    await this.viewDetailBtnLocator.waitFor({ state: 'visible' })
    await this.viewDetailBtnLocator.click()

    await expect(this.page).toHaveURL(/\/claim-management\/detail/i)
  }

  async getCoverageRemaining() {
    await this.page.waitForTimeout(1000)

    const coverageRemainingData: any[] = []

    // Find all table rows in Coverage details section
    const tableRows = this.page.locator('table tbody tr')
    const rowCount = await tableRows.count()

    for (let i = 0; i < rowCount; i++) {
      const row = tableRows.nth(i)
      const cells = row.locator('td')
      const cellCount = await cells.count()

      // Skip rows with no cells or only action cells
      if (cellCount < 2) continue

      try {
        // Extract benefit type (first cell)
        const benefitTypeCell = cells.nth(0)
        const benefitType = await benefitTypeCell.textContent()

        // Extract sub benefit (second cell)
        const subBenefitCell = cells.nth(1)
        const subBenefit = await subBenefitCell.textContent()

        // Extract limit, usage, and remaining (columns 3, 4, 5)
        if (cellCount >= 5) {
          const limitCell = cells.nth(2)
          const limitText = await limitCell.textContent()

          const usageCell = cells.nth(3)
          const usageText = await usageCell.textContent()

          const remainingCell = cells.nth(4)
          const remainingText = await remainingCell.textContent()

          if (benefitType && benefitType.trim()) {
            coverageRemainingData.push({
              benefitType: benefitType.trim(),
              subBenefit: subBenefit?.trim() || '-',
              limit: limitText?.trim() || '-',
              usage: usageText?.trim() || '-',
              remaining: remainingText?.trim() || '-'
            })
          }
        }
      } catch (error) {
        // Skip rows that cannot be processed
        continue
      }
    }

    return coverageRemainingData
  }

  // async validateCoverageClaimSurveyor(ipdCoverages: any[]) {}
}
