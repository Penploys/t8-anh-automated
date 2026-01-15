import { Locator, expect } from '@playwright/test'
import { BasePage } from '../base-page'

export class ClaimManagementDetailPage extends BasePage {
  // Chip Locators
  readonly claimStatusChipLocator: Locator = this.page
    .locator('div', { hasText: /Claim details|รายละเอียดเคลม/ })
    .locator('.MuiChip-label')
    .first()
  readonly draftChipLocator: Locator = this.page
    .locator('.MuiChip-label', { hasText: /Claim [Dd]raft|^ร่างเคลม/ })
    .first()
  readonly claimNumberLocator: Locator = this.page
    .locator('.MuiChip-label', { hasText: /^Claim [Nn]umber|^หมายเลขเคลม/ })
    .first()

  // Tabs
  readonly mainBenefitInfoTabLocator: Locator = this.page.getByRole('tab', { name: /Main benefit information/ })

  // Header Sections
  readonly mainBenefitInfoSection: Locator = this.page
    .locator('.MuiPaper-root')
    .filter({ has: this.page.getByRole('heading', { name: /Main benefit information|ข้อมูลผลประโยชน์/ }) })
  readonly claimInfoSection: Locator = this.page
    .locator('.MuiPaper-root')
    .filter({ has: this.page.getByRole('heading', { name: /Claim information|ข้อมูลการเคลม/ }) })
  readonly accidentSectionHeader: Locator = this.page.getByRole('heading', { name: /Accident cas|กรณีอุบัติเหตุ/ })

  // Field Locators (Value Only)
  readonly claimTypeValue: Locator = this.mainBenefitInfoSection
    .locator('.MuiBox-root')
    .filter({ has: this.page.getByText(/Claim type|ประเภท/) })
    .last()
    .locator('p')
    .last()
  readonly benefitTypeValue: Locator = this.mainBenefitInfoSection
    .locator('.MuiBox-root')
    .filter({ has: this.page.getByText(/Benefit type|ประเภทผลประโยชน์/) })
    .filter({ hasNot: this.page.locator('table') })
    .last()
    .locator('p')
    .last()
  readonly providerNameValue: Locator = this.claimInfoSection
    .locator('.MuiBox-root')
    .filter({ has: this.page.getByText(/Provider name \/ id|ชื่อผู้ให้บริการ \/ รหัส/) })
    .last()
    .locator('p')
    .last()
  readonly causeOfLossValue: Locator = this.claimInfoSection
    .locator('.MuiBox-root')
    .filter({ has: this.page.getByText(/Cause of loss|สาเหตุของความเสียหาย/) })
    .last()
    .locator('p')
    .last()
  readonly appointmentDateValue: Locator = this.claimInfoSection
    .locator('.MuiBox-root')
    .filter({
      has: this.page.getByText(/Appointment date|วันที่นัดหมาย|Visit\/Admission date|วันที่มาตรวจ\/เข้ารับการรักษา/)
    })
    .last()
    .locator('p')
    .last()
  readonly estimatedLengthOfStayValue: Locator = this.claimInfoSection
    .locator('.MuiBox-root')
    .filter({ has: this.page.getByText(/Estimated length of stay/) })
    .last()
    .locator('p')
    .last()
  readonly estimatedCostValue: Locator = this.claimInfoSection
    .locator('.MuiBox-root')
    .filter({ has: this.page.getByText(/^Estimated cost|^ค่าใช้จ่ายโดยประมาณ/) })
    .last()
    .locator('p')
    .last()
  readonly accidentDateValue: Locator = this.claimInfoSection
    .locator('.MuiBox-root')
    .filter({ has: this.page.getByText(/Accident date|วันที่เกิดอุบัติเหตุ/) })
    .last()
    .locator('p')
    .last()
  readonly dischargeDateValue: Locator = this.claimInfoSection
    .locator('.MuiBox-root')
    .filter({ has: this.page.getByText(/Discharge date|วันที่จำหน่าย/) })
    .last()
    .locator('p')
    .last()
  readonly alcoholValue: Locator = this.claimInfoSection
    .locator('.MuiBox-root')
    .filter({ has: this.page.getByText(/Alcohol or narcotic|สุราหรือสารเสพติด/) })
    .last()
    .locator('p')
    .last()
  readonly symptomValue: Locator = this.claimInfoSection
    .locator('.MuiBox-root')
    .filter({ has: this.page.getByText(/Accident\/Symptom detail|รายละเอียดอุบัติเหตุ/) })
    .last()
    .locator('p')
    .last()

  // Checkbox Locators
  readonly newLimitCheckbox: Locator = this.claimInfoSection.getByLabel(/เปิดเคลมด้วยวงเงินใหม่/)

  // Actions
  readonly editBtnLocator: Locator = this.page.getByRole('button', { name: /Edit|แก้ไข/ })
  readonly submitBtnLocator: Locator = this.page.getByRole('button', { name: /Submit|ส่งข้อมูล/ })
  readonly confirmSubmitBtnLocator: Locator = this.page
    .locator('.MuiDialog-root')
    .getByRole('button', { name: /Submit|ส่งข้อมูล/ })
    .last()
  readonly discardBtnLocator: Locator = this.page
    .locator('.MuiDialog-root')
    .getByRole('button', { name: /Discard|ละทิ้ง/ })
  readonly viewDetailBtnLocator: Locator = this.page
    .locator('.MuiDialog-root')
    .getByRole('button', { name: /View detail|ดูรายละเอียด/ })
  readonly assignToBtnLocator: Locator = this.page.getByRole('button', { name: /Assign to|มอบหมายให้/ })
  readonly assigneeInputLocator: Locator = this.page.locator('input[name="assignTo"]')
  readonly confirmAssignBtnLocator: Locator = this.page
    .locator('.MuiDialog-root')
    .getByRole('button', { name: /Assign|มอบหมาย/ })
  readonly authorizeBtnLocator: Locator = this.page.getByRole('button', { name: /Authorize|อนุญาต/ })
  readonly confirmAuthorizeBtnLocator: Locator = this.page
    .locator('.MuiDialog-root')
    .getByRole('button', { name: /Authorize|อนุญาต/ })
  readonly printMenuBtnLocator: Locator = this.page
    .locator('button')
    .filter({ has: this.page.locator('img[alt="chevron-down"]') })
  readonly eligibilityCheckDocumentMenuItemLocator: Locator = this.page.getByRole('menuitem', {
    name: /Eligibility Check Document/
  })

  async validateClaimStatus(expectedStatus?: string) {
    await this.page.waitForTimeout(2000)
    await this.claimStatusChipLocator.waitFor({ state: 'visible' })
    const statusText = await this.claimStatusChipLocator.textContent()

    if (expectedStatus) {
      expect(statusText?.trim()).toBe(expectedStatus)
    }

    return statusText?.trim()
  }

  async validateMainBenefitInformation(draftData: {
    claimType?: string
    benefitType?: string
    providerNameTh?: string
    causeOfLoss?: string
    appointmentDate?: string
    estimatedIpdDays?: string
    estimatedExpenses?: string
    dischargeDate?: string
    accidentDate?: string
    isAlcoholInvolved?: boolean | null
    symptom?: string
    openClaimWithNewLimit?: boolean | null
  }) {
    await this.mainBenefitInfoTabLocator.waitFor({ state: 'visible' })
    await this.mainBenefitInfoTabLocator.click()

    // Validate Static Fields
    await expect(this.claimTypeValue).toHaveText(draftData.claimType)
    await expect(this.benefitTypeValue).toHaveText(draftData.benefitType)
    await expect(this.providerNameValue).toHaveText(draftData.providerNameTh)
    await expect(this.causeOfLossValue).toHaveText(draftData.causeOfLoss)
    await expect(this.appointmentDateValue).toHaveText(draftData.appointmentDate)
    await expect(this.estimatedLengthOfStayValue).toHaveText(draftData.estimatedIpdDays)

    // Validate estimated expenses with number formatting
    if (draftData.estimatedExpenses?.trim()) {
      const expectedText = parseFloat(draftData.estimatedExpenses).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
      await expect(this.estimatedCostValue).toHaveText(expectedText)
    } else if (draftData.estimatedExpenses === '') {
      await expect(this.estimatedCostValue).toHaveText(/^0(\.00)?$/)
    }

    // Validate Dynamic Fields
    // A. Accident date
    if (draftData.accidentDate) {
      await expect(this.accidentSectionHeader).toBeVisible()
      await expect(this.accidentDateValue).toHaveText(draftData.accidentDate)

      // A1. Alcohol or narcotic
      if (draftData.isAlcoholInvolved !== undefined && draftData.isAlcoholInvolved !== null) {
        const alcoholText = draftData.isAlcoholInvolved ? /Yes|ใช่/ : /No|ไม่ใช่/
        await expect(this.alcoholValue).toHaveText(alcoholText)
      }
    }

    // B. Discharge date
    if (draftData.dischargeDate) {
      await expect(this.dischargeDateValue).toHaveText(draftData.dischargeDate)
    }

    // C. Open claim with new limit
    if (draftData.openClaimWithNewLimit !== undefined && draftData.openClaimWithNewLimit !== null) {
      await this.newLimitCheckbox.scrollIntoViewIfNeeded()

      if (draftData.openClaimWithNewLimit) {
        await expect(this.newLimitCheckbox).toBeChecked()
      } else {
        await expect(this.newLimitCheckbox).not.toBeChecked()
      }
    }

    // Blocked: UI doesn't display symptom details
    // D. Accident/Symptom detail
    // await expect(this.symptomValue).toContainText(draftData.symptom)
  }

  // async validateTreatmentInformation(memberData: any, billingData: any) {
  //   // To be implemented if needed in the future
  // }

  async printEligibilityCheckDocument() {
    // Click print menu dropdown
    await this.printMenuBtnLocator.waitFor({ state: 'visible' })
    await this.printMenuBtnLocator.click()

    // Click Eligibility Check Document menu item
    await this.eligibilityCheckDocumentMenuItemLocator.waitFor({ state: 'visible' })

    // Wait for print dialog and save PDF
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.eligibilityCheckDocumentMenuItemLocator.click()
    ])

    // Save the file
    const downloadPath = '/Users/qahive/Documents/t8-anh-automated/test-data/download-data'
    await download.saveAs(`${downloadPath}/${download.suggestedFilename()}`)
  }

  async getDraftNumber(): Promise<string> {
    const draftChip = this.draftChipLocator

    await draftChip.waitFor({ state: 'visible' })
    const text = await draftChip.textContent()

    if (text) {
      // Extract draft number after ": "
      const draftNumber = text.split(':')[1]?.trim()
      return draftNumber || text.trim()
    }

    return ''
  }

  async getClaimNumber(): Promise<string> {
    const claimChip = this.claimNumberLocator

    await claimChip.waitFor({ state: 'visible' })
    const text = await claimChip.textContent()

    if (text) {
      // Extract claim number after ": "
      const claimNumber = text.split(':')[1]?.trim()
      return claimNumber || text.trim()
    }

    return ''
  }

  async clickEditClaim() {
    await this.editBtnLocator.click()

    await expect(this.page).toHaveURL(/\/claim-management\/create\?mode\=edit/i)
  }

  async submitClaim() {
    await this.submitBtnLocator.waitFor({ state: 'visible' })
    await this.submitBtnLocator.click()
    await this.confirmSubmitBtnLocator.waitFor({ state: 'visible' })
    await this.confirmSubmitBtnLocator.click()
    await this.viewDetailBtnLocator.waitFor({ state: 'visible' })
    await this.viewDetailBtnLocator.click()
  }

  async assignClaimToAssignee(assigneeEmail: string) {
    await this.assignToBtnLocator.waitFor({ state: 'visible' })
    await this.assignToBtnLocator.click()

    await this.assigneeInputLocator.waitFor({ state: 'visible' })
    await this.assigneeInputLocator.fill(assigneeEmail)
    await this.page.getByRole('option', { name: assigneeEmail }).click()

    await this.confirmAssignBtnLocator.waitFor({ state: 'visible' })
    await this.confirmAssignBtnLocator.click()
  }

  async authorizeClaim() {
    await this.authorizeBtnLocator.waitFor({ state: 'visible' })
    await this.authorizeBtnLocator.click()

    await this.confirmAuthorizeBtnLocator.waitFor({ state: 'visible' })
    await this.confirmAuthorizeBtnLocator.click()

    await this.viewDetailBtnLocator.waitFor({ state: 'visible' })
    await this.viewDetailBtnLocator.click()
  }
}
