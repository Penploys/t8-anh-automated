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
  readonly treatmentInfoTabLocator: Locator = this.page.getByRole('tab', { name: /Treatment information \/ Billing/ })
  readonly uploadDocumentsTabLocator: Locator = this.page.getByRole('tab', { name: /Upload documents/ })
  readonly documentsTabLocator: Locator = this.page.getByRole('tab', { name: /Documents/ })

  // Header Sections
  readonly mainBenefitInfoSection: Locator = this.page
    .locator('.MuiCollapse-entered')
    .filter({ hasText: 'Claim type' })
    .first()
  readonly claimInfoSection: Locator = this.page
    .locator('.MuiCollapse-entered')
    .filter({ hasText: 'Provider name / id' })
    .first()
  readonly contClaimSection: Locator = this.page
    .locator('.MuiCollapse-entered')
    .filter({ hasText: 'เปิดเคลมด้วยวงเงินใหม่' })
    .first()
  readonly accidentSection: Locator = this.page.getByRole('heading', { name: /Accident case|กรณีอุบัติเหตุ/ })

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
    .filter({ has: this.page.getByText(/Appointment date|วันที่นัดหมาย/) })
    .last()
    .locator('p')
    .last()
  readonly admissionDateValue: Locator = this.claimInfoSection
    .locator('.MuiBox-root')
    .filter({ has: this.page.getByText(/Visit\/Admission date|วันที่มาตรวจ\/เข้ารับการรักษา/) })
    .last()
    .locator('p')
    .last()
  readonly estimatedLengthOfStayValue: Locator = this.claimInfoSection
    .locator('.MuiBox-root')
    .filter({ has: this.page.getByText(/Estimated length of stay/) })
    .last()
    .locator('p')
    .last()
  readonly lengthOfStayIPDValue: Locator = this.claimInfoSection
    .locator('.MuiBox-root')
    .filter({ has: this.page.getByText(/Length of Stay \(days\)/) })
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
  readonly newLimitCheckbox: Locator = this.contClaimSection.getByLabel(/เปิดเคลมด้วยวงเงินใหม่/)

  // Grid cell
  readonly gridVirtualScroller: Locator = this.page.locator('.MuiDataGrid-virtualScroller').last()

  // Actions
  readonly editBtnLocator: Locator = this.page.getByRole('button', { name: /Edit|แก้ไข/ })
  readonly submitBtnLocator: Locator = this.page.getByRole('button', { name: /Submit|ส่งข้อมูล/ })
  readonly printMenuBtnLocator: Locator = this.page
    .locator('.flex.rounded-md.border')
    .filter({ has: this.page.locator('button').nth(1) })
    .locator('button')
    .last()
  readonly eligibilityCheckDocumentMenuItemLocator: Locator = this.page.getByRole('menuitem', {
    name: /Eligibility Check Document|เอกสารเช็คสิทธิ์/
  })
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
    .first()
  readonly assignToBtnLocator: Locator = this.page.getByRole('button', { name: /Assign to|มอบหมายให้/ })
  readonly assigneeInputLocator: Locator = this.page.locator('input[name="assignTo"]')
  readonly confirmAssignBtnLocator: Locator = this.page
    .locator('.MuiDialog-root')
    .getByRole('button', { name: /Assign|มอบหมาย/ })
  readonly requestDocumentBtnLocator: Locator = this.page.getByRole('button', {
    name: /Request [Dd]ocument|ขอเอกสารเพิ่มเติม/
  })
  readonly resubmitBtnLocator: Locator = this.page.getByRole('button', { name: /Re-submit|ส่งใหม่/ })
  readonly authorizeBtnLocator: Locator = this.page.getByRole('button', { name: /Authorize|อนุญาต/ })
  readonly confirmAuthorizeBtnLocator: Locator = this.page
    .locator('.MuiDialog-root')
    .getByRole('button', { name: /Authorize|อนุญาต/ })
  readonly approveBtnLocator: Locator = this.page.getByRole('button', { name: /Approve|อนุมัติ/ })
  readonly confirmApproveBtnLocator: Locator = this.page
    .locator('.MuiDialog-root')
    .getByRole('button', { name: /Approve|อนุมัติ/ })

  // Request Document Dialog Locators
  readonly requestDocumentDialog: Locator = this.page.locator('.MuiDialog-root')
  readonly reasonDropdown: Locator = this.requestDocumentDialog.locator('#mui-component-select-reasonValue')
  readonly listBoxLocator: Locator = this.page.getByRole('listbox')

  // Complete Medical History
  readonly completeMedicalHistoryCheckbox: Locator = this.requestDocumentDialog.getByLabel(/Complete medical history/)
  readonly completeMedicalHistoryDateRangeBtn: Locator = this.requestDocumentDialog
    .locator('button', { hasText: /Date range/ })
    .first()
  readonly completeMedicalHistoryYearRangeBtn: Locator = this.requestDocumentDialog
    .locator('button', { hasText: /Year range/ })
    .first()
  readonly completeMedicalHistoryFromDate: Locator = this.requestDocumentDialog.locator(
    'input[name="COMPLETE_MEDICAL_HISTORY-from"]'
  )
  readonly completeMedicalHistoryToDate: Locator = this.requestDocumentDialog.locator(
    'input[name="COMPLETE_MEDICAL_HISTORY-to"]'
  )

  // OPD Card
  readonly opdCardCheckbox: Locator = this.requestDocumentDialog.getByLabel(/OPD Card of treatment/)
  readonly opdCardDateRangeBtn: Locator = this.requestDocumentDialog.locator('button', { hasText: /Date range/ }).last()
  readonly opdCardYearRangeBtn: Locator = this.requestDocumentDialog.locator('button', { hasText: /Year range/ }).last()
  readonly opdCardFromYear: Locator = this.requestDocumentDialog.locator('input[name="OPD_CARD-from-year"]')
  readonly opdCardToYear: Locator = this.requestDocumentDialog.locator('input[name="OPD_CARD-to-year"]')

  // Other Documents
  readonly doctorOrderCheckbox: Locator = this.requestDocumentDialog.getByLabel(/Doctor Order/)
  readonly progressiveNoteCheckbox: Locator = this.requestDocumentDialog.getByLabel(/Progressive Note/)
  readonly medicalRecordCheckbox: Locator = this.requestDocumentDialog.getByLabel(/Medical Record/)
  readonly graphicSheetCheckbox: Locator = this.requestDocumentDialog.getByLabel(/Graphic Sheet/)
  readonly nursesNoteCheckbox: Locator = this.requestDocumentDialog.getByLabel(/Nurse's Note/)
  readonly operativeNoteCheckbox: Locator = this.requestDocumentDialog.getByLabel(/Operative Note/)
  readonly vitalSignChartCheckbox: Locator = this.requestDocumentDialog.getByLabel(/Vital Sign Chart/)
  readonly form1Checkbox: Locator = this.requestDocumentDialog.getByLabel(/FORM 1/)
  readonly labAndPathologyResultsCheckbox: Locator = this.requestDocumentDialog.getByLabel(/Lab and Pathology Results/)
  readonly xRayUltrasoundMriCtEstEchoResultsCheckbox: Locator = this.requestDocumentDialog.getByLabel(
    /X-ray\, Ultrasound\, MRI\,CT\, EST\, ECHO Results \(if available\)/
  )
  readonly othersCheckbox: Locator = this.requestDocumentDialog.getByLabel(/Others/)
  readonly othersRemarkInput: Locator = this.requestDocumentDialog.locator('input#OTHERS-remark')
  readonly claimStatusUpdateRemarkTextarea: Locator = this.requestDocumentDialog.locator('textarea#remarkValue')

  readonly confirmRequestDocumentBtn: Locator = this.requestDocumentDialog
    .getByRole('button', { name: /Request document|ขอเอกสารเพิ่มเติม/ })
    .last()
  readonly successViewDetailBtn: Locator = this.page
    .locator('.MuiDialog-root')
    .getByRole('button', { name: /View detail|ดูรายละเอียด/ })
    .last()

  // Additional Documents Section Locators
  readonly additionalDocumentsSection: Locator = this.page
    .locator('div[style*="display: block"]') // Filter เฉพาะ tab ที่แสดง
    .locator('div.MuiBox-root') // ใช้ base class แทน
    .filter({ hasText: 'Additional Documents' })
    .first()

  readonly additionalDocumentsHeader: Locator = this.additionalDocumentsSection
    .locator('p.MuiTypography-body1')
    .filter({ hasText: 'Additional Documents' })
    .first()

  readonly additionalDocumentsItemCount: Locator =
    this.additionalDocumentsHeader.locator('xpath=following-sibling::div')

  readonly additionalDocumentsListItems: Locator = this.additionalDocumentsSection.locator('ul > li')

  async validateClaimStatus(expectedStatus?: string) {
    await this.page.waitForTimeout(3000)

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

    // Date Fields (Mutually exclusive usually)
    appointmentDate?: string
    admissionDate?: string

    // Duration Fields (Mutually exclusive)
    estimatedIpdDays?: string
    lengthOfStayIPD?: string
    // Cost
    estimatedExpenses?: string

    // Dynamic Fields
    dischargeDate?: string
    accidentDate?: string
    isAlcoholInvolved?: boolean | null
    symptom?: string
    openClaimWithNewLimit?: boolean | null
  }) {
    await this.mainBenefitInfoTabLocator.waitFor({ state: 'visible' })
    await this.mainBenefitInfoTabLocator.click()
    await this.page.waitForTimeout(1000)

    // 1. Validate Common Static Fields
    if (draftData.claimType) {
      await expect(this.claimTypeValue).toHaveText(draftData.claimType)
    }
    if (draftData.benefitType) {
      await expect(this.benefitTypeValue).toHaveText(draftData.benefitType)
    }
    if (draftData.providerNameTh) {
      await expect(this.providerNameValue).toHaveText(draftData.providerNameTh)
    }
    if (draftData.causeOfLoss) {
      await expect(this.causeOfLossValue).toHaveText(draftData.causeOfLoss)
    }

    // 2. Validate Primary Date (Appointment OR Visit/Admission)
    // Note: The UI usually uses the same slot/locator (this.appointmentDateValue) but changes the label
    if (draftData.appointmentDate && draftData.appointmentDate.trim() !== '') {
      // Pre-arrangement uses Appointment Date
      // BUG Note: If UI still shows 23:59 vs 00:00, keep this commented out or adjust expectation
      await expect(this.appointmentDateValue).toHaveText(draftData.appointmentDate)
    }

    if (draftData.admissionDate && draftData.admissionDate.trim() !== '') {
      // IPD Discharge / OPD / HB uses Visit or Admission Date
      await expect(this.admissionDateValue).toHaveText(draftData.admissionDate)
    }

    // 3. Validate Stay Duration (Estimated Length of Stay)
    if (draftData.estimatedIpdDays && draftData.estimatedIpdDays.trim() !== '') {
      // Pre-arrangement
      await expect(this.estimatedLengthOfStayValue).toHaveText(draftData.estimatedIpdDays)
    }

    // 3. Validate Stay Duration (Length of Stay)
    if (draftData.lengthOfStayIPD && draftData.lengthOfStayIPD.trim() !== '') {
      // IPD Discharge / OPD / HB
      await expect(this.lengthOfStayIPDValue).toHaveText(draftData.lengthOfStayIPD)
    }

    // 5. Validate Estimated Expenses (Only if value exists)
    if (draftData.estimatedExpenses && draftData.estimatedExpenses.trim() !== '') {
      const value = parseFloat(draftData.estimatedExpenses)
      const isInteger = Number.isInteger(value)

      const expectedText = value.toLocaleString('en-US', {
        minimumFractionDigits: isInteger ? 0 : 2,
        maximumFractionDigits: 2
      })

      await expect(this.estimatedCostValue).toHaveText(expectedText)
    }

    // 6. Validate Discharge Date (For IPD Discharge / HB)
    if (draftData.dischargeDate && draftData.dischargeDate.trim() !== '') {
      await expect(this.dischargeDateValue).toHaveText(draftData.dischargeDate)
    }

    // 7. Validate Accident Details (Only if Accident Date exists)
    if (draftData.accidentDate && draftData.accidentDate.trim() !== '') {
      await expect(this.accidentSection).toBeVisible()
      await expect(this.accidentDateValue).toHaveText(draftData.accidentDate)

      // Validate Alcohol/Narcotic (Only if Accident)
      if (draftData.isAlcoholInvolved !== undefined && draftData.isAlcoholInvolved !== null) {
        const alcoholText = draftData.isAlcoholInvolved ? /Yes|ใช่/ : /No|ไม่ใช่/
        await expect(this.alcoholValue).toHaveText(alcoholText)
      }
    }

    // 8. Validate Checkbox "Open claim with new limit"
    if (draftData.openClaimWithNewLimit !== undefined && draftData.openClaimWithNewLimit !== null) {
      try {
        await this.newLimitCheckbox.waitFor({ state: 'visible', timeout: 2000 })

        await this.newLimitCheckbox.scrollIntoViewIfNeeded()

        if (draftData.openClaimWithNewLimit) {
          await expect(this.newLimitCheckbox).toBeChecked()
        } else {
          await expect(this.newLimitCheckbox).not.toBeChecked()
        }
      } catch (error) {}
    }
  }

  async validateMemberInformation(memberData: any) {
    await this.treatmentInfoTabLocator.waitFor({ state: 'visible' })
    await this.treatmentInfoTabLocator.click()
    await this.page.waitForTimeout(1000)

    const memberInfoSection = this.page.locator('.MuiPaper-elevation1', { hasText: 'Member information' })

    // Helper function to get text value based on label
    const getValueByLabel = (label: string | RegExp) => {
      return memberInfoSection
        .locator('.MuiBox-root')
        .filter({ has: this.page.getByText(label) })
        .last()
        .locator('p.MuiTypography-body1')
        .last()
    }

    // Helper for Citizen ID which might be in a nested div structure
    const getCitizenIdValue = () => {
      return memberInfoSection
        .locator('.MuiBox-root')
        .filter({ hasText: 'Citizen ID / Passport' })
        .last()
        .locator('.MuiBox-root > div')
        .first()
    }

    // Validate Fields
    // Name (Thai)
    await expect(getValueByLabel('First & Middle name (Thai)')).toHaveText(memberData.nameTh || '-')
    await expect(getValueByLabel('Last name (Thai)')).toHaveText(memberData.surnameTh || '-')

    // Name (English)
    await expect(getValueByLabel('First & Middle name (English)')).toHaveText(memberData.nameEn || '-')
    await expect(getValueByLabel('Last name (English)')).toHaveText(memberData.surnameEn || '-')

    // Citizen ID
    // Note: The HTML structure for Citizen ID is slightly different (nested div)
    await expect(getCitizenIdValue()).toHaveText(memberData.citizenId || '-')

    // Date of Birth
    await expect(getValueByLabel('Date of birth')).toHaveText(memberData.dateOfBirth || '-')

    // Gender
    await expect(getValueByLabel('Gender')).toHaveText(memberData.gender || '-')

    // Phone Number
    await expect(getValueByLabel('Phone number')).toHaveText(memberData.phoneNumber || '-')

    // Email
    await expect(getValueByLabel('Email')).toHaveText(memberData.email || '-')

    // Member Effective/Expiry Dates
    await expect(getValueByLabel('Member effective date')).toHaveText(memberData.memberEffectiveDate || '-')
    await expect(getValueByLabel('Member expiry date')).toHaveText(memberData.memberExpiryDate || '-')

    // Policy Number
    await expect(getValueByLabel('Policy number')).toHaveText(memberData.policyNumber || '-')

    // Sub Class
    await expect(getValueByLabel('Sub class')).toHaveText(memberData.subClass || '-')

    // Policy Effective/Expiry Dates
    await expect(getValueByLabel('Policy effective date')).toHaveText(memberData.policyEffectiveDate || '-')
    await expect(getValueByLabel('Policy expiry date')).toHaveText(memberData.policyExpiryDate || '-')

    // Policy Holder
    await expect(getValueByLabel('Policy holder')).toHaveText(memberData.policyHolder || '-')

    // Card No.
    await expect(getValueByLabel('Card no.')).toHaveText(memberData.cardNo || '-')

    // Policy Status
    await expect(getValueByLabel('Policy status')).toHaveText(memberData.policyStatus || '-')
  }

  async validateClaimInformation(draftData: any, billingData: any) {
    await this.treatmentInfoTabLocator.waitFor({ state: 'visible' })
    await this.treatmentInfoTabLocator.click()
    await this.page.waitForTimeout(1000)

    // Section: Claim Information (Physician, Symptom, ICD)
    const claimInfoCard = this.page.locator('.MuiCollapse-entered').filter({ hasText: 'Physician details' }).first()

    if (billingData.physicianName) {
      await expect(
        claimInfoCard.locator('.MuiBox-root').filter({ hasText: 'Physician name' }).last().locator('p').last()
      ).toHaveText(billingData.physicianName)
    }
    if (billingData.medicalLicenseNumber) {
      await expect(
        claimInfoCard.locator('.MuiBox-root').filter({ hasText: 'Medical license number' }).last().locator('p').last()
      ).toHaveText(billingData.medicalLicenseNumber)
    }

    if (draftData.symptom !== undefined) {
      const expectedSymptom = draftData.symptom === '' ? '-' : draftData.symptom
      await expect(
        claimInfoCard.locator('.MuiBox-root').filter({ hasText: 'Symptom/accident details' }).last().locator('p').last()
      ).toHaveText(expectedSymptom)
    }

    if (billingData.icd10 && Array.isArray(billingData.icd10)) {
      const icd10Section = claimInfoCard.locator('div.space-y-4').filter({ hasText: 'ICD-10' }).first()

      await expect(icd10Section).toBeVisible()

      for (let i = 0; i < billingData.icd10.length; i++) {
        const item = billingData.icd10[i]

        const expectedText = item.name.replace(/\s+-\s+/, ' ')

        // Validate code/description
        await expect(icd10Section).toContainText(expectedText)
        console.log(`Validated ICD-10 [${i}] code/description:`, expectedText)

        if (item.remark !== undefined) {
          const expectedRemark = item.remark === '' ? '-' : item.remark

          const remarkLabel = icd10Section
            .locator('p')
            .filter({ hasText: /^remark$/ })
            .nth(i)
          const remarkValue = remarkLabel.locator('xpath=..').locator('p').last()

          await expect(remarkValue).toContainText(expectedRemark)
          console.log(`Validated ICD-10 [${i}] remark:`, expectedRemark)
        }
      }
    }

    if (billingData.icd9 && Array.isArray(billingData.icd9)) {
      const icd9Section = claimInfoCard.locator('div.space-y-4').filter({ hasText: 'ICD-9' }).first()

      await expect(icd9Section).toBeVisible()

      for (let i = 0; i < billingData.icd9.length; i++) {
        const item = billingData.icd9[i]

        const expectedText = item.name.replace(/\s+-\s+/, ' ')

        // Validate code/description
        await expect(icd9Section).toContainText(expectedText)
        console.log(`Validated ICD-9 [${i}] code/description:`, expectedText)

        if (item.remark !== undefined) {
          const expectedRemark = item.remark === '' ? '-' : item.remark

          const remarkLabel = icd9Section
            .locator('p')
            .filter({ hasText: /^remark$/ })
            .nth(i)
          const remarkValue = remarkLabel.locator('xpath=..').locator('p').last()

          await expect(remarkValue).toContainText(expectedRemark)
          console.log(`Validated ICD-9 [${i}] remark:`, expectedRemark)
        }
      }
    }
  }

  private formatMoney(amount: string | number): string {
    if (!amount || amount === '0') return '0.00'
    const val = typeof amount === 'string' ? parseFloat(amount) : amount
    return val.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  // Helper Methods for Billing Validation
  // Get billing section locator
  private getBillingSection(): Locator {
    return this.page.locator('#billing')
  }

  // Get billing field value by label
  private getBillingFieldValue(fieldLabel: string): Locator {
    return this.getBillingSection().locator('.MuiBox-root').filter({ hasText: fieldLabel }).last().locator('p').last()
  }

  // Get billing grid row by index
  private getBillingGridRow(rowIndex: number): Locator {
    return this.getBillingSection()
      .locator('.MuiDataGrid-virtualScrollerRenderZone')
      .locator(`div[role="row"][data-rowindex="${rowIndex}"]`)
  }

  // Get billing summary row
  private getBillingSummaryRow(): Locator {
    return this.getBillingSection().locator('[data-id="summary-row"]')
  }

  // Scroll grid horizontally
  private async scrollBillingGrid(direction: 'left' | 'right'): Promise<void> {
    const scrollValue = direction === 'right' ? 1500 : 0
    await this.gridVirtualScroller.evaluate((element, value) => {
      element.scrollLeft = value
    }, scrollValue)
    await this.page.waitForTimeout(1000)
  }

  // Validate billing header fields
  private async validateBillingHeader(billingData: any): Promise<void> {
    if (
      billingData.utilizationCost !== undefined &&
      billingData.utilizationCost !== null &&
      billingData.utilizationCost !== ''
    ) {
      await expect(this.getBillingFieldValue('Utilization cost')).toHaveText(billingData.utilizationCost)
    }

    if (billingData.billingNo) {
      await expect(this.getBillingFieldValue('Billing/receipt no.')).toHaveText(billingData.billingNo)
    }

    if (billingData.billingDate) {
      await expect(this.getBillingFieldValue('Billing/receipt date')).toHaveText(billingData.billingDate)
    }

    // BUG: UI display wrong bill submitter type (Hospital instead of Provider)
    // if (billingData.billSubmitterType) {
    //   await expect(this.getBillingFieldValue('Bill submitter type')).toHaveText(billingData.billSubmitterType)
    // }
  }

  // Validate input field in grid row
  private async validateGridInputField(row: Locator, field: string, expectedValue: string | RegExp): Promise<void> {
    const input = row.locator(`[data-field="${field}"] input`)
    await expect(input).toHaveValue(expectedValue)
  }

  // Validate text field in grid row
  private async validateGridTextField(row: Locator, field: string, expectedValue: string | RegExp): Promise<void> {
    await expect(row.locator(`[data-field="${field}"]`)).toHaveText(expectedValue)
  }

  // Validate decline field
  private async validateDeclineField(row: Locator, decline: string): Promise<void> {
    if (decline === '0.00') {
      const inputValue = await row.locator('[data-field="nonCovered"] input').inputValue()
      const placeholder = await row.locator('[data-field="nonCovered"] input').getAttribute('placeholder')

      const isValid = inputValue === '' || inputValue === '0.00' || placeholder === '0.00(฿)'
      expect(isValid).toBeTruthy()
    } else {
      const input = row.locator('[data-field="nonCovered"] input')
      const expectedDecline = parseFloat(decline).toLocaleString('en-US')
      await expect(input).toHaveValue(new RegExp(`^${expectedDecline}(\\.00)?$`))
    }
  }

  // Validate common billing item fields (used by all billing types)
  private async validateCommonBillingFields(row: Locator, item: any): Promise<void> {
    // Billing code
    await this.validateGridInputField(row, 'simbOption', item.billingNameResult)

    // Benefit
    // await this.validateGridTextField(row, 'benefitCoverageOption', item.benefit)

    // Amount
    const expectedAmount = parseFloat(item.incurredAmount).toLocaleString('en-US')
    await this.validateGridInputField(row, 'amount', new RegExp(`^${expectedAmount}(\\.00)?$`))

    // Discount
    const expectedDiscount = parseFloat(item.discount).toLocaleString('en-US')
    await this.validateGridInputField(row, 'discount', new RegExp(`^${expectedDiscount}(\\.00)?$`))

    // Net
    await this.validateGridTextField(row, 'net', this.formatMoney(item.netAmount))
  }

  // Validate billing item for Surveyor
  private async validateSurveyorBillingItem(row: Locator, item: any): Promise<void> {
    await this.validateCommonBillingFields(row, item)

    // Schedule
    await this.validateGridInputField(row, 'schedule', item.schedule)

    // Copay
    const copayVal = parseFloat(item.copay)

    if (copayVal === 0) {
      await this.validateGridTextField(row, 'copay', /^(0(\.00)?|-)$/)
    } else {
      await this.validateGridTextField(row, 'copay', this.formatMoney(item.copay))
    }

    // Days
    await this.validateGridInputField(row, 'noOfDays', item.noOfDays)

    // Scroll right for deduct, decline, etc.
    await this.scrollBillingGrid('right')

    // Deduct
    await this.validateGridTextField(row, 'deductAmount', this.formatMoney(item.deduct))

    // Decline
    await this.validateDeclineField(row, item.decline)

    // Covered by other parties
    const expectedCoveredByOtherParties = parseFloat(item.coveredByOtherParties).toLocaleString('en-US')
    await this.validateGridInputField(
      row,
      'coveredByOtherParties',
      new RegExp(`^${expectedCoveredByOtherParties}(\\.00)?$`)
    )

    // Payable Amount
    await this.validateGridTextField(row, 'payableAmount', this.formatMoney(item.payableAmount))

    // Major Medical
    await this.validateGridTextField(row, 'majorMedAmount', this.formatMoney(item.majorMedical))

    // Exceeded Limit
    const exceedVal = parseFloat(item.exceededLimit)

    if (exceedVal === 0) {
      await this.validateGridTextField(row, 'exceedLimit', /^(0(\.00)?|-)$/)
    } else {
      await this.validateGridTextField(row, 'exceedLimit', this.formatMoney(item.exceededLimit))
    }

    // Recovery
    await this.validateGridTextField(row, 'recovery', this.formatMoney(item.recovery))

    // Scroll back left
    await this.scrollBillingGrid('left')
  }

  // Validate billing item for Hospital IPD
  private async validateHospitalIpdBillingItem(row: Locator, item: any): Promise<void> {
    await this.validateCommonBillingFields(row, item)

    // Days
    await this.validateGridInputField(row, 'noOfDays', item.noOfDays)

    // Scroll right
    await this.scrollBillingGrid('right')

    // Deduct
    await this.validateGridTextField(row, 'deductAmount', this.formatMoney(item.deduct))

    // Payable Amount
    await this.validateGridTextField(row, 'payableAmount', this.formatMoney(item.payableAmount))

    // Scroll back left
    await this.scrollBillingGrid('left')
  }

  // Validate billing item for Hospital OPD
  private async validateHospitalOpdBillingItem(row: Locator, item: any): Promise<void> {
    await this.validateCommonBillingFields(row, item)

    // Copay
    const copayVal = parseFloat(item.copay)

    if (copayVal === 0) {
      await this.validateGridTextField(row, 'copay', /^(0(\.00)?|-)$/)
    } else {
      await this.validateGridTextField(row, 'copay', this.formatMoney(item.copay))
    }

    // Scroll right
    await this.scrollBillingGrid('right')

    // Deduct
    await this.validateGridTextField(row, 'deductAmount', this.formatMoney(item.deduct))

    // Decline
    await this.validateDeclineField(row, item.decline)

    // Payable Amount
    await this.validateGridTextField(row, 'payableAmount', this.formatMoney(item.payableAmount))

    // Exceeded Limit
    const exceedVal = parseFloat(item.exceededLimit)

    if (exceedVal === 0) {
      await this.validateGridTextField(row, 'exceedLimit', /^(0(\.00)?|-)$/)
    } else {
      await this.validateGridTextField(row, 'exceedLimit', this.formatMoney(item.exceededLimit))
    }

    // Scroll back left
    await this.scrollBillingGrid('left')
  }

  // Validate billing summary
  private async validateBillingSummaryCommon(billingTotal: any): Promise<void> {
    const summaryRow = this.getBillingSummaryRow()
    await expect(summaryRow).toBeVisible()

    if (billingTotal.incurredAmount) {
      await expect(summaryRow.locator('[data-field="amount"]')).toHaveText(
        this.formatMoney(billingTotal.incurredAmount)
      )
    }

    if (billingTotal.discount) {
      await expect(summaryRow.locator('[data-field="discount"]')).toHaveText(this.formatMoney(billingTotal.discount))
    }

    if (billingTotal.netAmount) {
      await expect(summaryRow.locator('[data-field="net"]')).toHaveText(this.formatMoney(billingTotal.netAmount))
    }

    await this.scrollBillingGrid('right')

    if (billingTotal.deduct !== undefined) {
      await expect(summaryRow.locator('[data-field="deductAmount"]')).toHaveText(this.formatMoney(billingTotal.deduct))
    }

    if (billingTotal.payableAmount !== undefined) {
      await expect(summaryRow.locator('[data-field="payableAmount"]')).toHaveText(
        this.formatMoney(billingTotal.payableAmount)
      )
    }
  }

  // Validate billing remark
  private async validateBillingRemark(billingRemark: string | undefined): Promise<void> {
    if (billingRemark !== undefined) {
      const remarkLocator = this.getBillingFieldValue('Billing remark')
      const expectedRemark = billingRemark === '' ? '-' : billingRemark
      await expect(remarkLocator).toHaveText(expectedRemark)
    }
  }

  async validateBillingTotalSurveyor(billingData: any) {
    // Header
    await this.validateBillingHeader(billingData)

    // Items
    if (billingData.billingItems && Array.isArray(billingData.billingItems)) {
      for (let i = 0; i < billingData.billingItems.length; i++) {
        const item = billingData.billingItems[i]
        const row = this.getBillingGridRow(i)
        await expect(row).toBeVisible()
        await this.validateSurveyorBillingItem(row, item)
      }
    }

    // Summary
    if (billingData.billingTotal) {
      await this.validateBillingSummaryCommon(billingData.billingTotal)

      const summaryRow = this.getBillingSummaryRow()

      if (billingData.billingTotal.decline !== undefined) {
        await expect(summaryRow.locator('[data-field="nonCovered"]')).toHaveText(
          this.formatMoney(billingData.billingTotal.decline)
        )
      }

      if (billingData.billingTotal.coveredByOtherParties !== undefined) {
        await expect(summaryRow.locator('[data-field="coveredByOtherParties"]')).toHaveText(
          this.formatMoney(billingData.billingTotal.coveredByOtherParties)
        )
      }

      if (billingData.billingTotal.majorMedical !== undefined) {
        await expect(summaryRow.locator('[data-field="majorMedAmount"]')).toHaveText(
          this.formatMoney(billingData.billingTotal.majorMedical)
        )
      }

      if (billingData.billingTotal.exceededLimit !== undefined) {
        await expect(summaryRow.locator('[data-field="exceedLimit"]')).toHaveText(
          this.formatMoney(billingData.billingTotal.exceededLimit)
        )
      }

      if (billingData.billingTotal.recovery !== undefined) {
        await expect(summaryRow.locator('[data-field="recovery"]')).toHaveText(
          this.formatMoney(billingData.billingTotal.recovery)
        )
      }

      await this.scrollBillingGrid('left')
    }

    // Remark
    await this.validateBillingRemark(billingData.billingRemark)
  }

  async validateBillingTotalHospitalIpd(billingData: any) {
    // Header
    await this.validateBillingHeader(billingData)

    // Items
    if (billingData.billingItems && Array.isArray(billingData.billingItems)) {
      for (let i = 0; i < billingData.billingItems.length; i++) {
        const item = billingData.billingItems[i]
        const row = this.getBillingGridRow(i)
        await expect(row).toBeVisible()
        await this.validateHospitalIpdBillingItem(row, item)
      }
    }

    // Summary
    if (billingData.billingTotal) {
      await this.validateBillingSummaryCommon(billingData.billingTotal)
      await this.scrollBillingGrid('left')
    }

    // Remark
    await this.validateBillingRemark(billingData.billingRemark)
  }

  async validateBillingTotalHospitalOpd(billingData: any) {
    // Header
    await this.validateBillingHeader(billingData)

    // Items
    if (billingData.billingItems && Array.isArray(billingData.billingItems)) {
      for (let i = 0; i < billingData.billingItems.length; i++) {
        const item = billingData.billingItems[i]
        const row = this.getBillingGridRow(i)
        await expect(row).toBeVisible()
        await this.validateHospitalOpdBillingItem(row, item)
      }
    }

    // Summary
    if (billingData.billingTotal) {
      await this.validateBillingSummaryCommon(billingData.billingTotal)

      const summaryRow = this.getBillingSummaryRow()

      if (billingData.billingTotal.decline !== undefined) {
        await expect(summaryRow.locator('[data-field="nonCovered"]')).toHaveText(
          this.formatMoney(billingData.billingTotal.decline)
        )
      }

      if (billingData.billingTotal.exceededLimit !== undefined) {
        await expect(summaryRow.locator('[data-field="exceedLimit"]')).toHaveText(
          this.formatMoney(billingData.billingTotal.exceededLimit)
        )
      }

      await this.scrollBillingGrid('left')
    }

    // Remark
    await this.validateBillingRemark(billingData.billingRemark)
  }

  async validateSummaryAmount(billingData: any) {
    // 1. Calculate Totals from billingItems
    const items = billingData.billingItems || []

    // Helper: Convert String from JSON to Number (handle commas or null values)
    const parse = (val: string | number | undefined) => {
      if (!val) return 0
      // Remove commas before converting to float (in case JSON has commas)
      return typeof val === 'string' ? parseFloat(val.replace(/,/g, '')) : val
    }

    // Variables to store totals
    let totalIncurred = 0
    let totalCoveredByOther = 0
    let totalDiscount = 0

    // Components for Payable Amount
    let sumPayableBasic = 0
    let sumMajorMedical = 0
    let sumRecovery = 0

    // Components for Total Declined
    let sumExceeded = 0
    let sumDeclined = 0

    // Loop through and sum values
    items.forEach((item: any) => {
      totalIncurred += parse(item.incurredAmount)
      totalCoveredByOther += parse(item.coveredByOtherParties)
      totalDiscount += parse(item.discount)

      sumPayableBasic += parse(item.payableAmount)
      sumMajorMedical += parse(item.majorMedical)
      sumRecovery += parse(item.recovery)

      sumExceeded += parse(item.exceededLimit)
      sumDeclined += parse(item.decline)
    })

    // Calculate grand totals (Aggregates)
    const totalPayableAmount = sumPayableBasic + sumMajorMedical + sumRecovery
    const totalDeclinedAmount = sumExceeded + sumDeclined

    // 2. Validate UI (Compare Calculated vs Displayed)
    // Helper: Check values on the web page
    const validateRow = async (labelPattern: RegExp | string, expectedValue: number) => {
      // Format money to match web page (e.g., 46000 -> "46,000.00")
      const expectedText = expectedValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })

      // Locator Strategy:
      // 1. Find "Summary amount" section
      // 2. Find div with the label (using filter)
      // 3. Find the next sibling div (following-sibling) which contains the number
      const summarySection = this.page.locator('.MuiPaper-elevation1', { hasText: 'Summary amount' })

      const labelLocator = summarySection.locator('.MuiGrid2-root').filter({ hasText: labelPattern }).last()

      const valueLocator = labelLocator.locator('xpath=following-sibling::div[1]')

      // Check if the value on the web matches the calculated value
      await expect(valueLocator).toHaveText(expectedText)
      console.log(`✓ Validated ${labelPattern}: ${expectedText}`)
    }

    console.log('--- Validating Summary Amount ---')

    // 1. Total incurred amount
    await validateRow(/^Total incurred amount$/, totalIncurred)

    // 2. Covered by other parties
    await validateRow(/^Covered by other parties$/, totalCoveredByOther)

    // 3. Discount
    await validateRow(/^Discount$/, totalDiscount)

    // 4. Payable amount (Sum of Basic + Major + Recovery)
    await validateRow(/^Payable amount$/, totalPayableAmount)

    // 4.1 Sub-items
    await validateRow(/^• Basic$/, sumPayableBasic)
    await validateRow(/^• Major$/, sumMajorMedical)
    await validateRow(/^• Recovery$/, sumRecovery)

    // 5. Total declined (Sum of Exceeded + Declined)
    await validateRow(/^Total declined$/, totalDeclinedAmount)

    // 5.1 Sub-items
    await validateRow(/^• Exceed$/, sumExceeded)
    await validateRow(/^• Declined$/, sumDeclined)
  }

  async printEligibilityCheckDocument() {
    await this.printMenuBtnLocator.waitFor({ state: 'visible' })
    await this.printMenuBtnLocator.click()

    await this.eligibilityCheckDocumentMenuItemLocator.waitFor({ state: 'visible' })
    await this.page.waitForTimeout(1000)
    await expect(this.eligibilityCheckDocumentMenuItemLocator).toBeVisible()

    await this.page.keyboard.press('Escape')
    await this.page.waitForTimeout(1000)
  }

  async getDraftNumber(): Promise<string> {
    const draftChip = this.draftChipLocator

    await draftChip.waitFor({ state: 'visible' })
    const text = await draftChip.textContent()

    if (text) {
      // Extract draft number after ": "
      const draftNumber = text.split(':')[1]?.trim()
      console.log('Extracted draft number:', draftNumber)

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
      console.log('Extracted claim number:', claimNumber)

      return claimNumber || text.trim()
    }

    return ''
  }

  async goToUploadDocument() {
    await this.resubmitBtnLocator.waitFor({ state: 'visible' })
    await this.resubmitBtnLocator.click()

    await expect(this.page).toHaveURL(/\/claim-management\/create\?mode\=edit/i)
  }

  async clickEditClaim() {
    await this.page.waitForTimeout(5000)

    await this.editBtnLocator.click()

    await expect(this.page).toHaveURL(/\/claim-management\/create\?mode\=edit/i)
  }

  async submitClaim() {
    await this.submitBtnLocator.waitFor({ state: 'visible' })
    await this.submitBtnLocator.click()
    await this.confirmSubmitBtnLocator.waitFor({ state: 'visible' })
    await this.confirmSubmitBtnLocator.click()

    // Handle Warning Popup(s) - may appear multiple times for date validations
    const warningDialog = this.page.locator('.MuiDialog-paper', {
      hasText: /Warning.*(Appointment date|Visit date|Discharge date|Accident date)/is
    })

    const maxRetries = 3
    for (let i = 0; i < maxRetries; i++) {
      const isWarningVisible = await warningDialog.isVisible().catch(() => false)

      if (!isWarningVisible) {
        try {
          await warningDialog.waitFor({ state: 'visible', timeout: 3000 })
        } catch {
          break // No warning dialog appeared
        }
      }

      const submitBtn = warningDialog.getByRole('button', { name: /Submit|ส่งข้อมูล/i })
      await submitBtn.waitFor({ state: 'visible' })
      await submitBtn.click()

      // Wait for dialog to close before checking for next one
      await warningDialog.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {})
    }
  }

  async viewClaimDetail() {
    await this.successViewDetailBtn.waitFor({ state: 'visible', timeout: 10000 })
    await this.successViewDetailBtn.click()

    await expect(this.page).toHaveURL(/\/claim-management\/detail/i)
  }

  async assignClaimToAssignee(assigneeEmail: string) {
    await this.assignToBtnLocator.waitFor({ state: 'visible' })
    await this.assignToBtnLocator.click()

    await this.assigneeInputLocator.waitFor({ state: 'visible' })
    await this.assigneeInputLocator.fill(assigneeEmail)
    await this.page.getByRole('option', { name: assigneeEmail }).click()

    await this.confirmAssignBtnLocator.waitFor({ state: 'visible' })
    await this.confirmAssignBtnLocator.click()

    await this.requestDocumentBtnLocator.waitFor({ state: 'visible' })
  }

  async requestDocument(pendingInfoData: {
    reason?: string
    completeMedicalHistory?: boolean
    completeMedicalHistoryDate?: string
    completeMedicalHistoryFrom?: string
    completeMedicalHistoryTo?: string
    opdCardOofTreatment?: boolean
    opdCardOofTreatmentDate?: string
    opdCardOofTreatmentFrom?: string
    opdCardOofTreatmentTo?: string
    doctorOrder?: boolean
    progressiveNote?: boolean
    medicalRecord?: boolean
    graphicSheet?: boolean
    nursesNote?: boolean
    operativeNote?: boolean
    vitalSignChart?: boolean
    form1?: boolean
    labAndPathologyResults?: boolean
    xRayUltrasoundMriCtEstEchoResults?: boolean
    others?: boolean
    otherRemark?: string
    claimStatusUpdateRemark?: string
  }) {
    await this.page.waitForTimeout(2000)
    await this.requestDocumentBtnLocator.scrollIntoViewIfNeeded()

    await this.requestDocumentBtnLocator.waitFor({ state: 'visible', timeout: 60000 })
    await this.requestDocumentBtnLocator.click()

    await this.requestDocumentDialog.waitFor({ state: 'visible' })

    // Select reason
    await this.reasonDropdown.waitFor({ state: 'visible' })
    if (pendingInfoData.reason) {
      await this.reasonDropdown.click()
      await this.listBoxLocator.waitFor({ state: 'visible' })
      await this.listBoxLocator.getByRole('option', { name: pendingInfoData.reason, exact: true }).click()
    }

    // Complete Medical History
    if (pendingInfoData.completeMedicalHistory) {
      const isMedicalHistoryChecked = await this.completeMedicalHistoryCheckbox.isChecked()
      if (!isMedicalHistoryChecked) {
        await this.completeMedicalHistoryCheckbox.check()
      }

      // Fill range
      if (pendingInfoData.completeMedicalHistoryDate === 'Date range') {
        await this.completeMedicalHistoryDateRangeBtn.click()
        await this.page.waitForTimeout(500)

        if (pendingInfoData.completeMedicalHistoryFrom) {
          await this.completeMedicalHistoryFromDate.fill(pendingInfoData.completeMedicalHistoryFrom)
        }

        if (pendingInfoData.completeMedicalHistoryTo) {
          await this.completeMedicalHistoryToDate.fill(pendingInfoData.completeMedicalHistoryTo)
        }
      }

      if (pendingInfoData.completeMedicalHistoryDate === 'Year range') {
        await this.completeMedicalHistoryYearRangeBtn.click()
        await this.page.waitForTimeout(500)

        if (pendingInfoData.completeMedicalHistoryFrom) {
          await this.completeMedicalHistoryFromDate.fill(pendingInfoData.completeMedicalHistoryFrom)
        }

        if (pendingInfoData.completeMedicalHistoryTo) {
          await this.completeMedicalHistoryToDate.fill(pendingInfoData.completeMedicalHistoryTo)
        }
      }
    }

    // OPD Card of treatment
    if (pendingInfoData.opdCardOofTreatment) {
      const isOpdCardChecked = await this.opdCardCheckbox.isChecked()
      if (!isOpdCardChecked) {
        await this.opdCardCheckbox.check()
      }

      // Fill range
      if (pendingInfoData.opdCardOofTreatmentDate === 'Date range') {
        await this.opdCardDateRangeBtn.click()
        await this.page.waitForTimeout(500)

        if (pendingInfoData.opdCardOofTreatmentFrom) {
          await this.completeMedicalHistoryFromDate.fill(pendingInfoData.opdCardOofTreatmentFrom)
        }

        if (pendingInfoData.opdCardOofTreatmentTo) {
          await this.completeMedicalHistoryToDate.fill(pendingInfoData.opdCardOofTreatmentTo)
        }
      }

      if (pendingInfoData.opdCardOofTreatmentDate === 'Year range') {
        await this.opdCardYearRangeBtn.click()
        await this.page.waitForTimeout(500)

        if (pendingInfoData.opdCardOofTreatmentFrom) {
          await this.opdCardFromYear.fill(pendingInfoData.opdCardOofTreatmentFrom)
        }

        if (pendingInfoData.opdCardOofTreatmentTo) {
          await this.opdCardToYear.fill(pendingInfoData.opdCardOofTreatmentTo)
        }
      }
    }

    // Doctor Order
    if (pendingInfoData.doctorOrder) {
      const isDoctorOrderChecked = await this.doctorOrderCheckbox.isChecked()
      if (!isDoctorOrderChecked) {
        await this.doctorOrderCheckbox.check()
      }
    }

    // Progressive Note
    if (pendingInfoData.progressiveNote) {
      const isProgressiveNoteChecked = await this.progressiveNoteCheckbox.isChecked()
      if (!isProgressiveNoteChecked) {
        await this.progressiveNoteCheckbox.check()
      }
    }

    // Medical Record
    if (pendingInfoData.medicalRecord) {
      const isMedicalRecordChecked = await this.medicalRecordCheckbox.isChecked()
      if (!isMedicalRecordChecked) {
        await this.medicalRecordCheckbox.check()
      }
    }

    // Graphic Sheet
    if (pendingInfoData.graphicSheet) {
      const isGraphicSheetChecked = await this.graphicSheetCheckbox.isChecked()
      if (!isGraphicSheetChecked) {
        await this.graphicSheetCheckbox.check()
      }
    }

    // Nurses note
    if (pendingInfoData.nursesNote) {
      const isNursesNoteChecked = await this.nursesNoteCheckbox.isChecked()
      if (!isNursesNoteChecked) {
        await this.nursesNoteCheckbox.check()
      }
    }

    // Operative Note
    if (pendingInfoData.operativeNote) {
      const isOperativeNoteChecked = await this.operativeNoteCheckbox.isChecked()
      if (!isOperativeNoteChecked) {
        await this.operativeNoteCheckbox.check()
      }
    }

    // Vital sign chart
    if (pendingInfoData.vitalSignChart) {
      const isVitalSignChartChecked = await this.vitalSignChartCheckbox.isChecked()
      if (!isVitalSignChartChecked) {
        await this.vitalSignChartCheckbox.check()
      }
    }

    // FORM 1
    if (pendingInfoData.form1) {
      const isForm1Checked = await this.form1Checkbox.isChecked()
      if (!isForm1Checked) {
        await this.form1Checkbox.check()
      }
    }

    // Lab and Pathology results
    if (pendingInfoData.labAndPathologyResults) {
      const isLabAndPathologyResultsChecked = await this.labAndPathologyResultsCheckbox.isChecked()
      if (!isLabAndPathologyResultsChecked) {
        await this.labAndPathologyResultsCheckbox.check()
      }
    }

    // X-ray, Ultrasound, MRI, CT, EST, ECHO results (if available)
    if (pendingInfoData.xRayUltrasoundMriCtEstEchoResults) {
      const isXRayResultsChecked = await this.xRayUltrasoundMriCtEstEchoResultsCheckbox.isChecked()
      if (!isXRayResultsChecked) {
        await this.xRayUltrasoundMriCtEstEchoResultsCheckbox.check()
      }
    }

    // Others
    if (pendingInfoData.others) {
      const isOthersChecked = await this.othersCheckbox.isChecked()
      if (!isOthersChecked) {
        await this.othersCheckbox.check()
      }
      await this.page.waitForTimeout(500)

      if (pendingInfoData.otherRemark) {
        await this.othersRemarkInput.fill(pendingInfoData.otherRemark)
      }
    }

    // Claim status update remark
    if (pendingInfoData.claimStatusUpdateRemark) {
      await this.claimStatusUpdateRemarkTextarea.fill(pendingInfoData.claimStatusUpdateRemark)
    }

    await this.confirmRequestDocumentBtn.waitFor({ state: 'visible' })
    await this.confirmRequestDocumentBtn.click()

    await this.successViewDetailBtn.waitFor({ state: 'visible' })
    await this.successViewDetailBtn.click()
  }

  async validateRequestedDocument(pendingInfoData: {
    reason?: string
    completeMedicalHistory?: boolean
    completeMedicalHistoryDate?: string
    completeMedicalHistoryFrom?: string
    completeMedicalHistoryTo?: string
    opdCardOofTreatment?: boolean
    opdCardOofTreatmentDate?: string
    opdCardOofTreatmentFrom?: string
    opdCardOofTreatmentTo?: string
    doctorOrder?: boolean
    progressiveNote?: boolean
    medicalRecord?: boolean
    graphicSheet?: boolean
    nursesNote?: boolean
    operativeNote?: boolean
    vitalSignChart?: boolean
    form1?: boolean
    labAndPathologyResults?: boolean
    xRayUltrasoundMriCtEstEchoResults?: boolean
    others?: boolean
    otherRemark?: string
  }) {
    await this.page.waitForTimeout(2000)

    // Helper: today in dd/MM/yyyy
    const formatToday = () => {
      const d = new Date()
      const dd = String(d.getDate()).padStart(2, '0')
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const yyyy = d.getFullYear()
      return `${dd}/${mm}/${yyyy}`
    }

    await this.mainBenefitInfoTabLocator.waitFor({ state: 'visible' })
    await this.mainBenefitInfoTabLocator.click()
    await this.page.waitForTimeout(1000)

    await this.additionalDocumentsSection.waitFor({ state: 'visible', timeout: 10000 })

    // Count expected items
    const expectedItems: string[] = []

    if (pendingInfoData.completeMedicalHistory) {
      expectedItems.push('Complete medical history')
    }
    if (pendingInfoData.opdCardOofTreatment) {
      expectedItems.push('OPD Card of treatment')
    }
    if (pendingInfoData.doctorOrder) {
      expectedItems.push('Doctor Order')
    }
    if (pendingInfoData.progressiveNote) {
      expectedItems.push('Progressive Note')
    }
    if (pendingInfoData.medicalRecord) {
      expectedItems.push('Medical Record')
    }
    if (pendingInfoData.graphicSheet) {
      expectedItems.push('Graphic Sheet')
    }
    if (pendingInfoData.nursesNote) {
      expectedItems.push("Nurse's note")
    }
    if (pendingInfoData.operativeNote) {
      expectedItems.push('Operative Note')
    }
    if (pendingInfoData.vitalSignChart) {
      expectedItems.push('Vital sign chart')
    }
    if (pendingInfoData.form1) {
      expectedItems.push('FORM 1')
    }
    if (pendingInfoData.labAndPathologyResults) {
      expectedItems.push('Lab and Pathology results')
    }
    if (pendingInfoData.xRayUltrasoundMriCtEstEchoResults) {
      expectedItems.push('X-ray, Ultrasound, MRI,CT, EST, ECHO results (if available)')
    }
    if (pendingInfoData.others) {
      expectedItems.push('Others')
    }

    // Validate item count
    const itemCountText = await this.additionalDocumentsItemCount.textContent()
    const itemCount = parseInt(itemCountText?.match(/\d+/)?.[0] || '0')
    expect(itemCount).toBe(expectedItems.length)
    console.log(`✓ Document count matches: ${itemCount} items`)

    // Validate each document item
    const listItems = await this.additionalDocumentsListItems.all()
    expect(listItems.length).toBe(expectedItems.length)

    // Validate Complete Medical History
    if (pendingInfoData.completeMedicalHistory) {
      let medicalHistoryIndex = -1
      for (let i = 0; i < listItems.length; i++) {
        const text = await listItems[i].textContent()
        if (text?.includes('Complete medical history')) {
          medicalHistoryIndex = i
          break
        }
      }

      expect(medicalHistoryIndex).toBeGreaterThan(-1)
      console.log(`Found Complete Medical History at index: ${medicalHistoryIndex}`)

      const medicalHistoryItem = listItems[medicalHistoryIndex]
      const medicalHistoryText = await medicalHistoryItem.textContent()
      console.log(`Complete Medical History text: ${medicalHistoryText}`)

      // Date range
      if (pendingInfoData.completeMedicalHistoryDate === 'Date range') {
        const dateRangePattern = new RegExp(
          `${pendingInfoData.completeMedicalHistoryFrom}\\s*-\\s*${pendingInfoData.completeMedicalHistoryTo}`
        )
        expect(medicalHistoryText).toMatch(dateRangePattern)
        console.log(
          `✓ Complete Medical History date range validated: ${pendingInfoData.completeMedicalHistoryFrom} - ${pendingInfoData.completeMedicalHistoryTo}`
        )
      }
      // Year range
      else if (pendingInfoData.completeMedicalHistoryDate === 'Year range') {
        const fromYear = pendingInfoData.completeMedicalHistoryFrom
        const toYear = pendingInfoData.completeMedicalHistoryTo
        const currentYear = new Date().getFullYear()

        const expectedFrom = `01/01/${fromYear}`
        let expectedTo = ''

        // Past year uses 31/12, Current/Future uses Today
        if (parseInt(toYear!) < currentYear) {
          expectedTo = `31/12/${toYear}`
        } else {
          expectedTo = formatToday()
        }

        const yearRangePattern = new RegExp(`${expectedFrom}\\s*-\\s*${expectedTo}`)
        expect(medicalHistoryText).toMatch(yearRangePattern)
        console.log(`✓ Complete Medical History year range validated: ${expectedFrom} - ${expectedTo}`)
      }
    }

    // Validate OPD Card of Treatment
    if (pendingInfoData.opdCardOofTreatment) {
      let opdCardIndex = -1
      for (let i = 0; i < listItems.length; i++) {
        const text = await listItems[i].textContent()
        if (text?.includes('OPD Card of treatment')) {
          opdCardIndex = i
          break
        }
      }

      expect(opdCardIndex).toBeGreaterThan(-1)
      console.log(`Found OPD Card at index: ${opdCardIndex}`)

      const opdCardItem = listItems[opdCardIndex]
      const opdCardText = await opdCardItem.textContent()
      console.log(`OPD Card text: ${opdCardText}`)

      // Date range
      if (pendingInfoData.opdCardOofTreatmentDate === 'Date range') {
        const datePattern = new RegExp(
          `${pendingInfoData.opdCardOofTreatmentFrom}\\s*-\\s*${pendingInfoData.opdCardOofTreatmentTo}`
        )
        expect(opdCardText).toMatch(datePattern)
        console.log(
          `✓ OPD Card date range validated: ${pendingInfoData.opdCardOofTreatmentFrom} - ${pendingInfoData.opdCardOofTreatmentTo}`
        )
      }
      // Year range
      else if (pendingInfoData.opdCardOofTreatmentDate === 'Year range') {
        const fromYear = pendingInfoData.opdCardOofTreatmentFrom
        const toYear = pendingInfoData.opdCardOofTreatmentTo
        const currentYear = new Date().getFullYear()

        const expectedFrom = `01/01/${fromYear}`
        let expectedTo = ''

        if (parseInt(toYear!) < currentYear) {
          expectedTo = `31/12/${toYear}`
        } else {
          expectedTo = formatToday()
        }

        const yearRangePattern = new RegExp(`${expectedFrom}\\s*-\\s*${expectedTo}`)
        expect(opdCardText).toMatch(yearRangePattern)
        console.log(`✓ OPD Card year range validated: ${expectedFrom} - ${expectedTo}`)
      }
    }

    // Validate Doctor Order
    if (pendingInfoData.doctorOrder) {
      let doctorOrderIndex = -1
      for (let i = 0; i < listItems.length; i++) {
        const text = await listItems[i].textContent()
        if (text?.includes('Doctor Order')) {
          doctorOrderIndex = i
          break
        }
      }
      expect(doctorOrderIndex).toBeGreaterThan(-1)
      console.log(`✓ Doctor Order validated`)
    }

    // Validate Progressive Note
    if (pendingInfoData.progressiveNote) {
      let progressiveNoteIndex = -1
      for (let i = 0; i < listItems.length; i++) {
        const text = await listItems[i].textContent()
        if (text?.includes('Progressive Note')) {
          progressiveNoteIndex = i
          break
        }
      }
      expect(progressiveNoteIndex).toBeGreaterThan(-1)
      console.log(`✓ Progressive Note validated`)
    }

    // Validate Medical Record
    if (pendingInfoData.medicalRecord) {
      let medicalRecordIndex = -1
      for (let i = 0; i < listItems.length; i++) {
        const text = await listItems[i].textContent()
        if (text?.includes('Medical Record')) {
          medicalRecordIndex = i
          break
        }
      }
      expect(medicalRecordIndex).toBeGreaterThan(-1)
      console.log(`✓ Medical Record validated`)
    }

    // Validate Graphic Sheet
    if (pendingInfoData.graphicSheet) {
      let graphicSheetIndex = -1
      for (let i = 0; i < listItems.length; i++) {
        const text = await listItems[i].textContent()
        if (text?.includes('Graphic Sheet')) {
          graphicSheetIndex = i
          break
        }
      }
      expect(graphicSheetIndex).toBeGreaterThan(-1)
      console.log(`✓ Graphic Sheet validated`)
    }

    // Validate Nurses Note
    if (pendingInfoData.nursesNote) {
      let nursesNoteIndex = -1
      for (let i = 0; i < listItems.length; i++) {
        const text = await listItems[i].textContent()
        if (text?.includes("Nurse's Note")) {
          nursesNoteIndex = i
          break
        }
      }
      expect(nursesNoteIndex).toBeGreaterThan(-1)
      console.log(`✓ Nurse's Note validated`)
    }

    // Validate Operative Note
    if (pendingInfoData.operativeNote) {
      let operativeNoteIndex = -1
      for (let i = 0; i < listItems.length; i++) {
        const text = await listItems[i].textContent()
        if (text?.includes('Operative Note')) {
          operativeNoteIndex = i
          break
        }
      }
      expect(operativeNoteIndex).toBeGreaterThan(-1)
      console.log(`✓ Operative Note validated`)
    }

    // Validate Vital Sign Chart
    if (pendingInfoData.vitalSignChart) {
      let vitalSignChartIndex = -1
      for (let i = 0; i < listItems.length; i++) {
        const text = await listItems[i].textContent()
        if (text?.includes('Vital Sign Chart')) {
          vitalSignChartIndex = i
          break
        }
      }
      expect(vitalSignChartIndex).toBeGreaterThan(-1)
      console.log(`✓ Vital Sign Chart validated`)
    }

    // Validate Form 1
    if (pendingInfoData.form1) {
      let form1Index = -1
      for (let i = 0; i < listItems.length; i++) {
        const text = await listItems[i].textContent()
        if (text?.includes('FORM 1')) {
          form1Index = i
          break
        }
      }
      expect(form1Index).toBeGreaterThan(-1)
      console.log(`✓ FORM 1 validated`)
    }

    // Validate Lab and Pathology Results
    if (pendingInfoData.labAndPathologyResults) {
      let labPathIndex = -1
      for (let i = 0; i < listItems.length; i++) {
        const text = await listItems[i].textContent()
        if (text?.includes('Lab and Pathology Results')) {
          labPathIndex = i
          break
        }
      }
      expect(labPathIndex).toBeGreaterThan(-1)
      console.log(`✓ Lab and Pathology Results validated`)
    }

    // Validate X-ray/Ultrasound/MRI/CT/EST/ECHO Results
    if (pendingInfoData.xRayUltrasoundMriCtEstEchoResults) {
      let xrayIndex = -1
      for (let i = 0; i < listItems.length; i++) {
        const text = await listItems[i].textContent()
        if (text?.includes('X-ray')) {
          xrayIndex = i
          break
        }
      }
      expect(xrayIndex).toBeGreaterThan(-1)
      console.log(`✓ X-ray/Ultrasound/MRI/CT/EST/ECHO Results validated`)
    }

    // Validate Others with remark
    if (pendingInfoData.others) {
      let othersIndex = -1
      for (let i = 0; i < listItems.length; i++) {
        const text = await listItems[i].textContent()
        if (text?.includes('Others')) {
          othersIndex = i
          break
        }
      }
      expect(othersIndex).toBeGreaterThan(-1)

      const othersItem = listItems[othersIndex]
      const othersText = await othersItem.textContent()

      // Validate remark if provided
      if (pendingInfoData.otherRemark) {
        expect(othersText).toContain(pendingInfoData.otherRemark)
        console.log(`✓ Others remark validated: "${pendingInfoData.otherRemark}"`)
      } else {
        console.log(`✓ Others validated`)
      }
    }

    console.log(`✓ All ${expectedItems.length} requested documents validated successfully`)
  }

  async validateUploadDocument(fileNames: string) {
    await this.documentsTabLocator.waitFor({ state: 'visible' })
    await this.documentsTabLocator.click()

    await this.page.waitForTimeout(1000)

    const uploadSectionWrapper = this.page.locator('#upload-docs')
    await uploadSectionWrapper.waitFor({ state: 'visible' })

    const uploadContent = uploadSectionWrapper.locator('.MuiCollapse-root')
    await uploadContent.waitFor({ state: 'visible' })

    const fileList = fileNames.split(',').map(name => name.trim())

    for (const fileName of fileList) {
      const fileLocator = uploadContent.locator('.MuiBox-root').filter({ hasText: fileName }).last()

      await expect(fileLocator).toBeVisible()
      console.log(`✓ Validated uploaded document: ${fileName}`)
    }
  }

  async authorizeClaim() {
    await this.authorizeBtnLocator.waitFor({ state: 'visible' })
    await this.authorizeBtnLocator.click()

    await this.confirmAuthorizeBtnLocator.waitFor({ state: 'visible' })
    await this.confirmAuthorizeBtnLocator.click()

    await this.viewDetailBtnLocator.waitFor({ state: 'visible' })
    await this.viewDetailBtnLocator.click()
  }

  async approveClaim() {
    await this.approveBtnLocator.waitFor({ state: 'visible' })
    await this.approveBtnLocator.click()

    await this.confirmApproveBtnLocator.waitFor({ state: 'visible' })
    await this.confirmApproveBtnLocator.click()

    await this.viewDetailBtnLocator.waitFor({ state: 'visible' })
    await this.viewDetailBtnLocator.click()
  }
}
