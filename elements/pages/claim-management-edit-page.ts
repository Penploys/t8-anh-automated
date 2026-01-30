import { Locator, expect } from '@playwright/test'
import { BasePage } from '../base-page'
import * as fs from 'fs'
import * as path from 'path'

export class ClaimManagementEditPage extends BasePage {
  // Tabs
  readonly mainBenefitInfoTabLocator: Locator = this.page.getByRole('tab', { name: /Main benefit information/ })
  readonly treatmentInfoTabLocator: Locator = this.page.getByRole('tab', { name: /Treatment information \/ Billing/ })
  readonly uploadDocumentsTabLocator: Locator = this.page.getByRole('tab', { name: /Upload documents/ })

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

  // Common Inputs in Treatment information tab
  readonly physicianNameInputLocator: Locator = this.page.locator('#physicianName')
  readonly medicalLicenseNumberInputLocator: Locator = this.page.locator('#physicianLicenseNumber')
  readonly billingNumberInputLocator: Locator = this.page.locator('#billingNumber')
  readonly billingDateInputLocator: Locator = this.page.locator('input[name="billingDate"]')
  readonly billSubmitterTypeSelectLocator: Locator = this.page.locator('#mui-component-select-billSubmitterType')
  readonly billingRemarkInputLocator: Locator = this.page.locator('#billingRemark')

  // Dropdown list
  readonly ListBoxLocator: Locator = this.page.getByRole('listbox')

  // Grid cell
  readonly gridVirtualScroller: Locator = this.page.locator('.MuiDataGrid-virtualScroller').last()

  // File input for uploading documents
  readonly fileInputLocator: Locator = this.page.locator('input[type="file"]').first()

  // Actions
  readonly addItemBtnIcd10Locator: Locator = this.page
    .locator('div.MuiPaper-root:has(h6:text-is("ICD-10"))')
    .getByRole('button', { name: /\+ Add item|\+ เพิ่มรายการ/ })
    .first()
  readonly addItemBtnIcd9Locator: Locator = this.page
    .locator('div.MuiPaper-root:has(h6:text-is("ICD-9"))')
    .getByRole('button', { name: /\+ Add item|\+ เพิ่มรายการ/ })
    .last()
  readonly addItemBtnBillingLocator: Locator = this.page
    .locator('section#billing')
    .getByRole('button', { name: /\+ Add item|\+ เพิ่มรายการ/ })
    .last()
  readonly saveBtnLocator: Locator = this.page.getByRole('button', { name: /Save|บันทึก/ })
  readonly saveChangesBtnLocator: Locator = this.page.getByRole('button', { name: /Save changes|บันทึกการเปลี่ยนแปลง/ })
  readonly viewDetailBtnLocator: Locator = this.page.getByRole('button', { name: /View detail|ดูรายละเอียด/ })
  readonly resubmitBtnLocator: Locator = this.page.getByRole('button', { name: /Re-submit|ส่งใหม่/ })
  readonly confirmResubmitBtnLocator: Locator = this.page.getByRole('button', { name: /Re-submit/ }).last()

  // Helper methods for dynamic locators
  getIcd10CodeInputLocator(index: number): Locator {
    return this.page.locator(`input[name="icd10[${index}]"]`)
  }

  getIcd10RemarkInputLocator(index: number): Locator {
    return this.page.locator(`input[id="icd10Remark.${index}"]`)
  }

  getIcd9CodeInputLocator(index: number): Locator {
    return this.page.locator(`input[name="icd9[${index}]"]`)
  }

  getIcd9RemarkInputLocator(index: number): Locator {
    return this.page.locator(`input[id="icd9Remark.${index}"]`)
  }

  getBillingCodeInputLocator(index: number): Locator {
    return this.page
      .locator(
        'div[data-field="simbOption"][role="gridcell"] input[placeholder="Input at least 2 characters to search"]'
      )
      .nth(index)
  }

  getBillingItemBenefitLocator(index: number): Locator {
    return this.page.locator(`div[data-field="benefitCoverageOption"][role="gridcell"].MuiDataGrid-cell`).nth(index)
  }

  getBillingItemCopayLocator(index: number): Locator {
    return this.page.locator(`div[data-field="copay"][role="gridcell"].MuiDataGrid-cell`).nth(index)
  }

  getBillingItemNetAmountLocator(index: number): Locator {
    return this.page.locator(`div[data-field="net"][role="gridcell"].MuiDataGrid-cell`).nth(index)
  }

  getBillingItemDeductLocator(index: number): Locator {
    return this.page.locator(`div[data-field="deductAmount"][role="gridcell"].MuiDataGrid-cell`).nth(index)
  }

  getBillingItemPayableAmountLocator(index: number): Locator {
    return this.page.locator(`div[data-field="payableAmount"][role="gridcell"].MuiDataGrid-cell`).nth(index)
  }

  getBillingItemMajorMedicalLocator(index: number): Locator {
    return this.page.locator(`div[data-field="majorMedAmount"][role="gridcell"].MuiDataGrid-cell`).nth(index)
  }

  getBillingItemExceededLimitLocator(index: number): Locator {
    return this.page.locator(`div[data-field="exceedLimit"][role="gridcell"].MuiDataGrid-cell`).nth(index)
  }

  getBillingItemRecoveryLocator(index: number): Locator {
    return this.page.locator(`div[data-field="recovery"][role="gridcell"].MuiDataGrid-cell`).nth(index)
  }

  getBillingItemInputLocator(index: number, fieldName: string): Locator {
    return this.page.locator(`input[id="billingItems[${index}].${fieldName}"]`)
  }

  async fillTreatmentInformation(claimData: {
    physicianName?: string
    medicalLicenseNumber?: string
    icd10?: Array<{ code: string; name: string; remark?: string }>
    icd9?: Array<{ code: string; name: string; remark?: string }>
  }) {
    await this.treatmentInfoTabLocator.click()
    await this.page.waitForTimeout(5000)

    // Fill physician name
    if (claimData.physicianName?.trim()) {
      await this.physicianNameInputLocator.fill(claimData.physicianName)
    }

    // Fill physician license number
    if (claimData.medicalLicenseNumber?.trim()) {
      await this.medicalLicenseNumberInputLocator.fill(claimData.medicalLicenseNumber)
    }

    // Fill ICD10 codes
    if (claimData.icd10 && claimData.icd10.length > 0) {
      for (let i = 0; i < claimData.icd10.length; i++) {
        const icd10Item = claimData.icd10[i]
        const icd10CodeInputLocator = this.getIcd10CodeInputLocator(i)
        const icd10RemarkInputLocator = this.getIcd10RemarkInputLocator(i)

        if (icd10Item.code?.trim()) {
          await icd10CodeInputLocator.click()
          await icd10CodeInputLocator.pressSequentially(icd10Item.code, { delay: 100 })

          // Click option by name
          if (icd10Item.name?.trim()) {
            await this.ListBoxLocator.waitFor({ state: 'visible', timeout: 5000 })
            const optionLocator = this.ListBoxLocator.getByRole('option', { name: icd10Item.name, exact: true })
            await optionLocator.waitFor({ state: 'visible', timeout: 5000 })
            await optionLocator.click()
          }
        }

        if (icd10Item.remark?.trim()) {
          await icd10RemarkInputLocator.fill(icd10Item.remark)
        }

        // Click + Add item button if not the last ICD10 item
        if (i < claimData.icd10.length - 1) {
          await this.addItemBtnIcd10Locator.waitFor({ state: 'visible' })
          await this.addItemBtnIcd10Locator.click()
        }
      }
    }

    // Fill ICD9 codes
    if (claimData.icd9 && claimData.icd9.length > 0) {
      for (let i = 0; i < claimData.icd9.length; i++) {
        const icd9Item = claimData.icd9[i]
        const icd9CodeInputLocator = this.getIcd9CodeInputLocator(i)
        const icd9RemarkInputLocator = this.getIcd9RemarkInputLocator(i)

        if (icd9Item.code?.trim()) {
          await icd9CodeInputLocator.click()
          await icd9CodeInputLocator.pressSequentially(icd9Item.code, { delay: 100 })

          // Click option by name
          if (icd9Item.name?.trim()) {
            await this.ListBoxLocator.waitFor({ state: 'visible', timeout: 5000 })
            const optionLocator = this.ListBoxLocator.getByRole('option', { name: icd9Item.name, exact: true })
            await optionLocator.waitFor({ state: 'visible', timeout: 5000 })
            await optionLocator.click()
          }
        }

        if (icd9Item.remark?.trim()) {
          await icd9RemarkInputLocator.fill(icd9Item.remark)
        }

        // Click + Add item button if not the last ICD9 item
        if (i < claimData.icd9.length - 1) {
          await this.addItemBtnIcd9Locator.waitFor({ state: 'visible' })
          await this.addItemBtnIcd9Locator.click()
        }
      }
    }
  }

  async fillBillingDetailsSurveyor(claimData: {
    billingNo?: string
    billingDate?: string
    billSubmitterType?: string
    billingItems?: Array<{
      billingCode?: string
      billingName?: string
      benefit?: string
      schedule?: string
      copay?: string
      noOfDays?: string
      incurredAmount?: string
      discount?: string
      netAmount?: string
      deduct?: string
      decline?: string
      coveredByOtherParties?: string
      payableAmount?: string
      majorMedical?: string
      exceededLimit?: string
      recovery?: string
      remark?: string
    }>
    billingRemark?: string
  }) {
    // Fill billing number
    if (claimData.billingNo?.trim()) {
      await this.billingNumberInputLocator.fill(claimData.billingNo)
    }

    // Fill billing date
    if (claimData.billingDate?.trim()) {
      await this.billingDateInputLocator.fill(claimData.billingDate)
    }

    // Expect bill submitter type
    if (claimData.billSubmitterType?.trim()) {
      await expect(this.billSubmitterTypeSelectLocator).toHaveText(new RegExp(claimData.billSubmitterType, 'i'))
    }

    // Fill billing items
    if (claimData.billingItems && claimData.billingItems.length > 0) {
      for (let i = 0; i < claimData.billingItems.length; i++) {
        const item = claimData.billingItems[i]

        // Fill billing code
        if (item.billingCode?.trim()) {
          const billingCodeInput = this.getBillingCodeInputLocator(i)
          await billingCodeInput.click()
          await billingCodeInput.pressSequentially(item.billingCode, { delay: 100 })

          // Click option by billing name if available
          if (item.billingName?.trim()) {
            await this.ListBoxLocator.waitFor({ state: 'visible', timeout: 5000 })
            const optionLocator = this.ListBoxLocator.getByRole('option', { name: item.billingName, exact: true })
            await optionLocator.waitFor({ state: 'visible', timeout: 5000 })
            await optionLocator.click()
          }
        }

        // Expect benefit
        if (item.benefit?.trim()) {
          const benefitLocator = this.getBillingItemBenefitLocator(i)
          await expect(benefitLocator).toHaveText(new RegExp(item.benefit, 'i'), { timeout: 5000 })
        }

        // Fill schedule
        if (item.schedule?.trim()) {
          const scheduleLocator = this.getBillingItemInputLocator(i, 'schedule')
          await scheduleLocator.fill(item.schedule)
          await scheduleLocator.blur()
        }

        // Expect copay
        if (item.copay?.trim()) {
          const copayLocator = this.getBillingItemCopayLocator(i)
          const expectedText = parseFloat(item.copay).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
          await expect(copayLocator).toHaveText(expectedText, { timeout: 5000 })
        }

        // Fill no of days
        if (item.noOfDays?.trim()) {
          const noOfDaysLocator = this.getBillingItemInputLocator(i, 'noOfDays')
          await noOfDaysLocator.fill(item.noOfDays)
          await noOfDaysLocator.blur()
        }

        // Fill incurred amount
        if (item.incurredAmount?.trim()) {
          const incurredAmountLocator = this.getBillingItemInputLocator(i, 'amount')
          await incurredAmountLocator.fill(item.incurredAmount)
          await incurredAmountLocator.blur()
        }

        // Fill discount
        if (item.discount?.trim()) {
          const discountLocator = this.getBillingItemInputLocator(i, 'discount')
          await discountLocator.fill(item.discount)
          await discountLocator.blur()
        }

        // Expect net amount
        if (item.netAmount?.trim()) {
          const expectedText = parseFloat(item.netAmount).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
          await expect(this.getBillingItemNetAmountLocator(i)).toHaveText(expectedText, { timeout: 5000 })
        }

        await this.gridVirtualScroller.evaluate(element => {
          element.scrollLeft = 1500
        })
        await this.page.waitForTimeout(1000)

        // Expect deduct
        if (item.deduct?.trim()) {
          const expectedText = parseFloat(item.deduct).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
          await expect(this.getBillingItemDeductLocator(i)).toHaveText(expectedText, { timeout: 5000 })
        }

        // Fill decline
        if (item.decline?.trim()) {
          const declineLocator = this.getBillingItemInputLocator(i, 'nonCovered')
          await declineLocator.fill(item.decline)
          await declineLocator.blur()
        }

        // Fill covered by parties
        if (item.coveredByOtherParties?.trim()) {
          const coveredByOtherPartiesLocator = this.getBillingItemInputLocator(i, 'coveredByOtherParties')
          await coveredByOtherPartiesLocator.fill(item.coveredByOtherParties)
          await coveredByOtherPartiesLocator.blur()
        }

        // Expect payable amount
        if (item.payableAmount?.trim()) {
          const expectedText = parseFloat(item.payableAmount).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
          await expect(this.getBillingItemPayableAmountLocator(i)).toHaveText(expectedText, { timeout: 5000 })
        }

        // Expect major medical
        if (item.majorMedical?.trim()) {
          const expectedText = parseFloat(item.majorMedical).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
          await expect(this.getBillingItemMajorMedicalLocator(i)).toHaveText(expectedText, { timeout: 5000 })
        }

        // Expect exceeded limit
        if (item.exceededLimit?.trim()) {
          const expectedText = parseFloat(item.exceededLimit).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
          await expect(this.getBillingItemExceededLimitLocator(i)).toHaveText(expectedText, { timeout: 5000 })
        }

        // Expect recovery
        if (item.recovery?.trim()) {
          const expectedText = parseFloat(item.recovery).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
          await expect(this.getBillingItemRecoveryLocator(i)).toHaveText(expectedText, { timeout: 5000 })
        }

        // Fill remark
        if (item.remark?.trim()) {
          const remarkLocator = this.getBillingItemInputLocator(i, 'remark')
          await remarkLocator.fill(item.remark)
        }

        await this.gridVirtualScroller.evaluate(element => {
          element.scrollLeft = 0
        })
        await this.page.waitForTimeout(1000)

        // Click + Add item button if not the last item
        if (i < claimData.billingItems.length - 1) {
          await this.addItemBtnBillingLocator.waitFor({ state: 'visible' })
          await this.addItemBtnBillingLocator.click()
        }
      }
    }

    // Fill billing remark
    if (claimData.billingRemark?.trim()) {
      await this.billingRemarkInputLocator.fill(claimData.billingRemark)
    }
  }

  async fillBillingDetailsHospitalIpd(claimData: {
    billingNo?: string
    billingDate?: string
    billSubmitterType?: string
    billingItems?: Array<{
      billingCode?: string
      billingName?: string
      benefit?: string
      noOfDays?: string
      incurredAmount?: string
      discount?: string
      netAmount?: string
      deduct?: string
      payableAmount?: string
    }>
    billingRemark?: string
  }) {
    // Fill billing number
    if (claimData.billingNo?.trim()) {
      await this.billingNumberInputLocator.fill(claimData.billingNo)
    }

    // Fill billing date
    if (claimData.billingDate?.trim()) {
      await this.billingDateInputLocator.fill(claimData.billingDate)
    }

    // Expect bill submitter type
    if (claimData.billSubmitterType?.trim()) {
      await expect(this.billSubmitterTypeSelectLocator).toHaveText(new RegExp(claimData.billSubmitterType, 'i'))
    }

    // Fill billing items
    if (claimData.billingItems && claimData.billingItems.length > 0) {
      for (let i = 0; i < claimData.billingItems.length; i++) {
        const item = claimData.billingItems[i]

        // Fill billing code
        if (item.billingCode?.trim()) {
          const billingCodeInput = this.getBillingCodeInputLocator(i)
          await billingCodeInput.click()
          await billingCodeInput.pressSequentially(item.billingCode, { delay: 100 })

          // Click option by billing name if available
          if (item.billingName?.trim()) {
            await this.ListBoxLocator.waitFor({ state: 'visible', timeout: 5000 })
            const optionLocator = this.ListBoxLocator.getByRole('option', { name: item.billingName, exact: true })
            await optionLocator.waitFor({ state: 'visible', timeout: 5000 })
            await optionLocator.click()
          }
        }

        // Expect benefit
        if (item.benefit?.trim()) {
          const benefitLocator = this.getBillingItemBenefitLocator(i)
          await expect(benefitLocator).toHaveText(new RegExp(item.benefit, 'i'), { timeout: 5000 })
        }

        // Fill no of days
        if (item.noOfDays?.trim()) {
          const noOfDaysLocator = this.getBillingItemInputLocator(i, 'noOfDays')
          await noOfDaysLocator.fill(item.noOfDays)
          await noOfDaysLocator.blur()
        }

        // Fill incurred amount
        if (item.incurredAmount?.trim()) {
          const incurredAmountLocator = this.getBillingItemInputLocator(i, 'amount')
          await incurredAmountLocator.fill(item.incurredAmount)
          await incurredAmountLocator.blur()
        }

        // Fill discount
        if (item.discount?.trim()) {
          const discountLocator = this.getBillingItemInputLocator(i, 'discount')
          await discountLocator.fill(item.discount)
          await discountLocator.blur()
        }

        // Expect net amount
        if (item.netAmount?.trim()) {
          const expectedText = parseFloat(item.netAmount).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
          await expect(this.getBillingItemNetAmountLocator(i)).toHaveText(expectedText, { timeout: 5000 })
        }

        await this.gridVirtualScroller.evaluate(element => {
          element.scrollLeft = 1500
        })
        await this.page.waitForTimeout(1000)

        // Expect deduct
        if (item.deduct?.trim()) {
          const expectedText = parseFloat(item.deduct).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
          await expect(this.getBillingItemDeductLocator(i)).toHaveText(expectedText, { timeout: 5000 })
        }

        // Expect payable amount
        if (item.payableAmount?.trim()) {
          const expectedText = parseFloat(item.payableAmount).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
          await expect(this.getBillingItemPayableAmountLocator(i)).toHaveText(expectedText, { timeout: 5000 })
        }

        await this.gridVirtualScroller.evaluate(element => {
          element.scrollLeft = 0
        })
        await this.page.waitForTimeout(1000)

        // Click + Add item button if not the last item
        if (i < claimData.billingItems.length - 1) {
          await this.addItemBtnBillingLocator.waitFor({ state: 'visible' })
          await this.addItemBtnBillingLocator.click()
        }
      }
    }

    // Fill billing remark
    if (claimData.billingRemark?.trim()) {
      await this.billingRemarkInputLocator.fill(claimData.billingRemark)
    }
  }

  parseCoverageValue(value: string | number | undefined): number {
    if (value === undefined || value === null || value === '') return 0
    if (typeof value === 'number') return value

    if (value.includes(':')) {
      const parts = value.split(':')
      const num = parseFloat(parts[0].trim())
      return isNaN(num) ? 0 : num
    }

    const cleanVal = value.replace(/,/g, '')
    const match = cleanVal.match(/(\d+(\.\d+)?)/)
    return match ? parseFloat(match[0]) : 0
  }

  loadCoverageData(rootDir: string, files: string[] = []) {
    const actualDataDir = path.join(rootDir, 'test-data', 'actual-data')

    const defaultFiles = [
      'claim_coverage_copay_OTH.json',
      'claim_coverage_copay_IPD.json',
      'claim_coverage_copay_OPD.json'
    ]
    const targetFiles = files.length > 0 ? files : defaultFiles

    const processedData: any = {
      OTH: [],
      IPD: [],
      OPD: [],
      ER: []
    }

    for (const fileName of targetFiles) {
      const filePath = path.join(actualDataDir, fileName)

      if (fs.existsSync(filePath)) {
        try {
          const rawData = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

          const keys = ['IPD', 'OPD', 'OTH', 'ER']
          for (const key of keys) {
            if (rawData[key]) {
              processedData[key] = rawData[key].map((item: any) => ({
                ...item,
                limit: this.parseCoverageValue(item.limit),
                usage: this.parseCoverageValue(item.usage),
                remaining: this.parseCoverageValue(item.remaining),
                combinedSub: this.parseCoverageValue(item.combinedSub),
                combinedSubRemaining: this.parseCoverageValue(item.combinedSubRemaining),
                combined: this.parseCoverageValue(item.combined),
                combinedRemaining: this.parseCoverageValue(item.combinedRemaining)
              }))
            }
          }
        } catch (error) {
          console.error(`Error parsing file ${fileName}:`, error)
        }
      }
    }
    return processedData
  }

  calculateBillingTotal(billingItems: any[], billingTotal: any) {
    let totalIncurredAmount = 0
    let totalDiscount = 0
    let totalNetAmount = 0
    let totalDeduct = 0
    let totalDecline = 0
    let totalCoveredByOtherParties = 0
    let totalPayableAmount = 0
    let totalMajorMedical = 0
    let totalExceededLimit = 0
    let totalRecovery = 0

    const parse = (val: string | number | undefined) => {
      if (!val) return 0
      const num = typeof val === 'string' ? parseFloat(val.replace(/,/g, '')) : val
      return isNaN(num) ? 0 : num
    }

    if (billingItems && Array.isArray(billingItems)) {
      for (const item of billingItems) {
        totalIncurredAmount += parse(item.incurredAmount)
        totalDiscount += parse(item.discount)
        totalNetAmount += parse(item.netAmount)
        totalDeduct += parse(item.deduct)
        totalDecline += parse(item.decline)
        totalCoveredByOtherParties += parse(item.coveredByOtherParties)
        totalPayableAmount += parse(item.payableAmount)
        totalMajorMedical += parse(item.majorMedical)
        totalExceededLimit += parse(item.exceededLimit)
        totalRecovery += parse(item.recovery)
      }
    }

    if (!billingTotal) {
      billingTotal = {}
    }

    billingTotal.incurredAmount = totalIncurredAmount.toFixed(2)
    billingTotal.discount = totalDiscount.toFixed(2)
    billingTotal.netAmount = totalNetAmount.toFixed(2)
    billingTotal.deduct = totalDeduct.toFixed(2)
    billingTotal.decline = totalDecline.toFixed(2)
    billingTotal.coveredByOtherParties = totalCoveredByOtherParties.toFixed(2)
    billingTotal.payableAmount = totalPayableAmount.toFixed(2)
    billingTotal.majorMedical = totalMajorMedical.toFixed(2)
    billingTotal.exceededLimit = totalExceededLimit.toFixed(2)
    billingTotal.recovery = totalRecovery.toFixed(2)

    console.log(' ')
    console.log('✓ Calculated Total:', billingTotal)
  }

  async calculateBillingSchedule(
    claimType:
      | 'ipdDischarge'
      | 'opdDischarge'
      | 'er72Discharge'
      | 'ipdDischargeSchedule'
      | 'opdDischargeSchedule'
      | 'er72DischargeSchedule',
    ...coverageFiles: string[]
  ) {
    // Define Paths
    const rootDir = process.cwd()
    const claimsPath = path.join(rootDir, 'tests-e2e', 'configurations', 'claims.json')

    // Read JSON Files
    const coveragesData = this.loadCoverageData(rootDir, coverageFiles)
    const claimsData = JSON.parse(fs.readFileSync(claimsPath, 'utf-8'))

    // Get Base Limits
    const ipdList = coveragesData.IPD
    const getIpdVal = (index: number, field: string) => (ipdList[index] ? ipdList[index][field] : 0)
    const icuRoomLimit = parseFloat(getIpdVal(0, 'limit'))
    const icuRoomRemaining = parseFloat(getIpdVal(0, 'remaining'))
    const icuRoomDayRemaining = parseFloat(getIpdVal(1, 'remaining'))
    // const icuRoomDayCombinedSub = parseFloat(getIpdVal(1, 'combinedSubRemaining')) // Shared room day pool
    const normalRoomLimit = parseFloat(getIpdVal(2, 'limit'))
    const normalRoomRemaining = parseFloat(getIpdVal(2, 'remaining'))
    const normalRoomDayRemaining = parseFloat(getIpdVal(3, 'remaining'))
    const normalRoomDayCombinedSub = parseFloat(getIpdVal(3, 'combinedSubRemaining')) // Shared room day pool
    const hospitalOrMedicalLimit = parseFloat(getIpdVal(4, 'limit'))
    const hospitalOrMedicalRemaining = parseFloat(getIpdVal(4, 'remaining'))
    const hospitalOrMedicalCombinedSub = parseFloat(getIpdVal(4, 'combinedSubRemaining')) // Shared medical pool
    const nonSurgicalConsultLimit = parseFloat(getIpdVal(5, 'limit'))
    const nonSurgicalConsultRemaining = parseFloat(getIpdVal(5, 'remaining'))
    // const nonSurgicalConsultCombinedSub = parseFloat(getIpdVal(5, 'combinedSubRemaining')) // Shared medical pool
    const surgicalConsultLimit = parseFloat(getIpdVal(6, 'limit'))
    const surgicalConsultRemaining = parseFloat(getIpdVal(6, 'remaining'))
    // const surgicalConsultCombinedSub = parseFloat(getIpdVal(6, 'combinedSubRemaining')) // Shared doctor pool
    const doctorPractitionerFeeLimit = parseFloat(getIpdVal(7, 'limit'))
    const doctorPractitionerFeeRemaining = parseFloat(getIpdVal(7, 'remaining'))
    const doctorPractitionerFeeCombinedSub = parseFloat(getIpdVal(7, 'combinedSubRemaining')) // Shared doctor pool
    const doctorsVisitFeeDayRemaining = parseFloat(getIpdVal(8, 'remaining'))
    const doctorsVisitFeeLimit = parseFloat(getIpdVal(9, 'limit'))
    const doctorsVisitFeeRemaining = parseFloat(getIpdVal(9, 'remaining'))
    const ambulanceLimit = parseFloat(getIpdVal(10, 'limit'))
    const ambulanceRemaining = parseFloat(getIpdVal(10, 'remaining'))
    // const ambulanceCombinedSub = parseFloat(getIpdVal(10, 'combinedSubRemaining')) // Shared medical pool

    const opdList = coveragesData.OPD
    const getOpdVal = (index: number, field: string) => (opdList[index] ? opdList[index][field] : 0)
    const opdVisitYearRemaining = parseFloat(getOpdVal(0, 'remaining'))
    const opdVisitDayRemaining = parseFloat(getOpdVal(1, 'remaining'))
    const opdVisitLimit = parseFloat(getOpdVal(2, 'limit'))
    const opdVisitRemaining = parseFloat(getOpdVal(2, 'remaining'))

    const er72List = coveragesData.ER
    const getEr72Val = (index: number, field: string) => (er72List[index] ? er72List[index][field] : 0)
    const er72HoursLimit = parseFloat(getEr72Val(0, 'limit'))
    const er72HoursRemaining = parseFloat(getEr72Val(0, 'remaining'))
    // const er72HoursCombinedSub = parseFloat(getEr72Val(0, 'combinedSubRemaining')) // Shared medical pool

    // Initialize Pool State
    const sharedRoomDayPool = {
      remaining: normalRoomDayCombinedSub
    }

    const sharedMedicalPool = {
      remaining: hospitalOrMedicalCombinedSub
    }

    const sharedDoctorPool = {
      remaining: doctorPractitionerFeeCombinedSub
    }

    // Get Target Billing Items
    const billingIpd = claimsData.uat.schedule.ph.ipd.positive.ipdDischarge
    const billingItemsIpd = billingIpd.billingInfo.billingItems
    const billingTotalIpd = billingIpd.billingTotal

    const billingOpd = claimsData.uat.schedule.ph.opd.positive.ipdDischarge
    const billingItemsOpd = billingOpd.billingInfo.billingItems
    const billingTotalOpd = billingOpd.billingTotal

    const billingEr72 = claimsData.uat.schedule.ph.er72.positive.ipdDischarge
    const billingItemsEr = billingEr72.billingInfo.billingItems
    const billingTotalEr = billingEr72.billingTotal

    // Helper Function: Core Logic for Schedule
    const applyCoverageLogic = (netAmountFloat, baseLimit, isSchedule = false, originalSchedule = '0') => {
      let schedulePercent = 0
      let usedSchedule = '0'

      // 1. Determine Schedule Percentage
      if (isSchedule) {
        // Case: Force Schedule 50%
        schedulePercent = 50
        usedSchedule = '50'
      } else {
        // Case: Force Schedule 100%
        const existingSchedule = parseFloat(originalSchedule)
        if (existingSchedule === 0) {
          schedulePercent = 100
        } else {
          schedulePercent = existingSchedule
        }
        usedSchedule = originalSchedule
      }

      // 2. Calculate Payable by Schedule
      // Formula: Net * (Schedule / 100)
      const payableBySchedule = netAmountFloat * (schedulePercent / 100)

      // 3. Apply Base Limit
      const payable = Math.min(payableBySchedule, baseLimit)

      // 4. Calculate Exceeded Limit
      const exceededLimit = (netAmountFloat - payable).toFixed(2)

      console.log(
        `    > Item: Net ${netAmountFloat.toFixed(2)} -> Schedule ${schedulePercent}% -> Pay ${payable.toFixed(2)} -> Exceed ${exceededLimit}`
      )

      return {
        payableAmount: payable.toFixed(2),
        exceededLimit: exceededLimit,
        schedule: usedSchedule
      }
    }

    const calculateBillingItemPerDay = (
      item,
      limitAmountRemaining,
      limitDayRemaining,
      baseForIncurred,
      isSchedule = false,
      sharedDayPool: { remaining: number } | null = null
    ) => {
      const noOfDays = parseFloat(item.noOfDays)

      // 1. Incurred Amount: (Limit / 4) * Days
      const incurredAmount = ((baseForIncurred / 4) * noOfDays).toFixed(2)

      // 2. Discount: 10% of Incurred
      const discount = (parseFloat(incurredAmount) * 0.1).toFixed(2)

      // 3. Net Amount: Incurred - Discount
      const netAmount = (parseFloat(incurredAmount) - parseFloat(discount)).toFixed(2)
      const netAmountFloat = parseFloat(netAmount)

      // 4. Calculated Allowed Days
      let allowedDays = 0

      if (limitDayRemaining > 0) {
        allowedDays = noOfDays
        allowedDays = Math.min(allowedDays, limitDayRemaining)

        if (sharedDayPool) {
          allowedDays = Math.min(allowedDays, sharedDayPool.remaining)
        }
      } else {
        allowedDays = 0
      }

      // 5. Calculate Max Payable based on Allowed Days
      const maxBasePayable = limitAmountRemaining * allowedDays

      // 6. Apply Logic
      const result = applyCoverageLogic(netAmountFloat, maxBasePayable, isSchedule, item.schedule)

      // 7. Deduct from Shared Pool
      if (sharedDayPool) {
        sharedDayPool.remaining -= allowedDays
        if (sharedDayPool.remaining < 0) sharedDayPool.remaining = 0
      }

      // Update items
      item.schedule = result.schedule
      item.incurredAmount = incurredAmount
      item.discount = discount
      item.netAmount = netAmount
      item.payableAmount = result.payableAmount
      item.exceededLimit = result.exceededLimit

      return { ...item }
    }

    const calculateBillingItemPerDis = (
      item,
      limitAmountRemaining,
      baseForIncurred,
      isSchedule = false,
      sharedPool: { remaining: number } | null = null
    ) => {
      const incurredAmount = (baseForIncurred / 4).toFixed(2)
      const discount = (parseFloat(incurredAmount) * 0.1).toFixed(2)
      const netAmount = (parseFloat(incurredAmount) - parseFloat(discount)).toFixed(2)
      const netAmountFloat = parseFloat(netAmount)

      let maxBasePayable = limitAmountRemaining
      if (sharedPool) {
        maxBasePayable = Math.min(limitAmountRemaining, sharedPool.remaining)
      }

      const result = applyCoverageLogic(netAmountFloat, maxBasePayable, isSchedule, item.schedule)

      if (sharedPool) {
        sharedPool.remaining -= parseFloat(result.payableAmount)
        if (sharedPool.remaining < 0) sharedPool.remaining = 0
      }

      item.schedule = result.schedule
      item.incurredAmount = incurredAmount
      item.discount = discount
      item.netAmount = netAmount
      item.payableAmount = result.payableAmount
      item.exceededLimit = result.exceededLimit

      return { ...item }
    }

    const calculateBillingItemPerVisit = (
      item,
      limitAmountRemaining,
      limitVisitDayRemaining,
      limitVisitYearRemaining,
      baseForIncurred,
      isSchedule = false
    ) => {
      const incurredAmount = (baseForIncurred / 4).toFixed(2)
      const discount = (parseFloat(incurredAmount) * 0.1).toFixed(2)
      const netAmount = (parseFloat(incurredAmount) - parseFloat(discount)).toFixed(2)
      const netAmountFloat = parseFloat(netAmount)

      let maxBasePayable = 0
      if (limitVisitYearRemaining > 0) {
        if (limitVisitDayRemaining > 0) {
          maxBasePayable = limitAmountRemaining
        } else {
          maxBasePayable = 0
        }
      } else {
        maxBasePayable = 0
      }

      const result = applyCoverageLogic(netAmountFloat, maxBasePayable, isSchedule, item.schedule)

      item.schedule = result.schedule
      item.incurredAmount = incurredAmount
      item.discount = discount
      item.netAmount = netAmount
      item.payableAmount = result.payableAmount
      item.exceededLimit = result.exceededLimit

      return { ...item }
    }

    // Execute Calculation
    console.log('✓ Updated billing items with Schedule Logic')
    console.log(`  Room day combined sub Pool Initial: ${sharedRoomDayPool.remaining} THB`)
    console.log(`  Medical combined sub Pool Initial: ${sharedMedicalPool.remaining} THB`)
    console.log(`  Doctor practitioner combined sub Pool Initial: ${sharedDoctorPool.remaining} THB`)
    console.log(' ')

    // 1. IPD Items
    if (claimType === 'ipdDischarge') {
      if (billingItemsIpd && billingItemsIpd.length > 0) {
        if (billingItemsIpd[0])
          calculateBillingItemPerDay(
            billingItemsIpd[0],
            icuRoomRemaining,
            icuRoomDayRemaining,
            icuRoomLimit,
            false,
            sharedRoomDayPool
          )
        if (billingItemsIpd[1])
          calculateBillingItemPerDay(
            billingItemsIpd[1],
            normalRoomRemaining,
            normalRoomDayRemaining,
            normalRoomLimit,
            false,
            sharedRoomDayPool
          )
        if (billingItemsIpd[2])
          calculateBillingItemPerDis(
            billingItemsIpd[2],
            hospitalOrMedicalRemaining,
            hospitalOrMedicalLimit,
            false,
            sharedMedicalPool
          )
        if (billingItemsIpd[3])
          calculateBillingItemPerDis(
            billingItemsIpd[3],
            nonSurgicalConsultRemaining,
            nonSurgicalConsultLimit,
            false,
            sharedMedicalPool
          )
        if (billingItemsIpd[4])
          calculateBillingItemPerDis(
            billingItemsIpd[4],
            surgicalConsultRemaining,
            surgicalConsultLimit,
            false,
            sharedDoctorPool
          )
        if (billingItemsIpd[5])
          calculateBillingItemPerDis(
            billingItemsIpd[5],
            doctorPractitionerFeeRemaining,
            doctorPractitionerFeeLimit,
            false,
            sharedDoctorPool
          )
        if (billingItemsIpd[6])
          calculateBillingItemPerDay(
            billingItemsIpd[6],
            doctorsVisitFeeRemaining,
            doctorsVisitFeeDayRemaining,
            doctorsVisitFeeLimit,
            false
          )
        if (billingItemsIpd[7])
          calculateBillingItemPerDis(billingItemsIpd[7], ambulanceRemaining, ambulanceLimit, false, sharedMedicalPool)

        console.log(' ')
        console.log(
          `  [Schedule IPD] Room day combined sub Pool Remaining: ${sharedRoomDayPool.remaining.toFixed(2)} THB`
        )
        console.log(
          `  [Schedule IPD] Medical combined sub Pool Remaining: ${sharedMedicalPool.remaining.toFixed(2)} THB`
        )
        console.log(
          `  [Schedule IPD] Doctor practitioner combined sub Pool Remaining: ${sharedDoctorPool.remaining.toFixed(2)} THB`
        )
      }

      if (billingTotalIpd && billingItemsIpd.length > 0) {
        this.calculateBillingTotal(billingItemsIpd, billingTotalIpd)
      }
    }

    // 2. OPD Items
    if (claimType === 'opdDischarge') {
      if (billingItemsOpd && billingItemsOpd.length > 0) {
        if (billingItemsOpd[0])
          calculateBillingItemPerVisit(
            billingItemsOpd[0],
            opdVisitRemaining,
            opdVisitDayRemaining,
            opdVisitYearRemaining,
            opdVisitLimit,
            false
          )

        console.log(' ')
        console.log(
          `  [Schedule OPD] Room day combined sub Pool Remaining: ${sharedRoomDayPool.remaining.toFixed(2)} THB`
        )
        console.log(
          `  [Schedule OPD] Medical combined sub Pool Remaining: ${sharedMedicalPool.remaining.toFixed(2)} THB`
        )
        console.log(
          `  [Schedule OPD] Doctor practitioner combined sub Pool Remaining: ${sharedDoctorPool.remaining.toFixed(2)} THB`
        )
      }

      if (billingTotalOpd && billingItemsOpd.length > 0) {
        this.calculateBillingTotal(billingItemsOpd, billingTotalOpd)
      }
    }

    // 3. ER Items
    if (claimType === 'er72Discharge') {
      if (billingItemsEr && billingItemsEr.length > 0) {
        if (billingItemsEr[0])
          calculateBillingItemPerDis(billingItemsEr[0], er72HoursRemaining, er72HoursLimit, false, sharedMedicalPool)

        console.log(' ')
        console.log(
          `  [Schedule ER72] Room day combined sub Pool Remaining: ${sharedRoomDayPool.remaining.toFixed(2)} THB`
        )
        console.log(
          `  [Schedule ER72] Medical combined sub Pool Remaining: ${sharedMedicalPool.remaining.toFixed(2)} THB`
        )
        console.log(
          `  [Schedule ER72] Doctor practitioner combined sub Pool Remaining: ${sharedDoctorPool.remaining.toFixed(2)} THB`
        )
      }

      if (billingTotalEr && billingItemsEr.length > 0) {
        this.calculateBillingTotal(billingItemsEr, billingTotalEr)
      }
    }

    // 4. IPD Items with schedule
    if (claimType === 'ipdDischargeSchedule') {
      if (billingItemsIpd && billingItemsIpd.length > 0) {
        if (billingItemsIpd[0])
          calculateBillingItemPerDay(
            billingItemsIpd[0],
            icuRoomRemaining,
            icuRoomDayRemaining,
            icuRoomLimit,
            true,
            sharedRoomDayPool
          )
        if (billingItemsIpd[1])
          calculateBillingItemPerDay(
            billingItemsIpd[1],
            normalRoomRemaining,
            normalRoomDayRemaining,
            normalRoomLimit,
            true,
            sharedRoomDayPool
          )
        if (billingItemsIpd[2])
          calculateBillingItemPerDis(
            billingItemsIpd[2],
            hospitalOrMedicalRemaining,
            hospitalOrMedicalLimit,
            true,
            sharedMedicalPool
          )
        if (billingItemsIpd[3])
          calculateBillingItemPerDis(
            billingItemsIpd[3],
            nonSurgicalConsultRemaining,
            nonSurgicalConsultLimit,
            true,
            sharedMedicalPool
          )
        if (billingItemsIpd[4])
          calculateBillingItemPerDis(
            billingItemsIpd[4],
            surgicalConsultRemaining,
            surgicalConsultLimit,
            true,
            sharedDoctorPool
          )
        if (billingItemsIpd[5])
          calculateBillingItemPerDis(
            billingItemsIpd[5],
            doctorPractitionerFeeRemaining,
            doctorPractitionerFeeLimit,
            true,
            sharedDoctorPool
          )
        if (billingItemsIpd[6])
          calculateBillingItemPerDay(
            billingItemsIpd[6],
            doctorsVisitFeeRemaining,
            doctorsVisitFeeDayRemaining,
            doctorsVisitFeeLimit,
            true
          )
        if (billingItemsIpd[7])
          calculateBillingItemPerDis(billingItemsIpd[7], ambulanceRemaining, ambulanceLimit, true, sharedMedicalPool)

        console.log(' ')
        console.log(
          `  [Schedule IPD] Room day combined sub Pool Remaining: ${sharedRoomDayPool.remaining.toFixed(2)} THB`
        )
        console.log(
          `  [Schedule IPD] Medical combined sub Pool Remaining: ${sharedMedicalPool.remaining.toFixed(2)} THB`
        )
        console.log(
          `  [Schedule IPD] Doctor practitioner combined sub Pool Remaining: ${sharedDoctorPool.remaining.toFixed(2)} THB`
        )
      }

      if (billingTotalIpd && billingItemsIpd.length > 0) {
        this.calculateBillingTotal(billingItemsIpd, billingTotalIpd)
      }
    }

    // 5. OPD Items with schedule
    if (claimType === 'opdDischargeSchedule') {
      if (billingItemsOpd && billingItemsOpd.length > 0) {
        if (billingItemsOpd[0])
          calculateBillingItemPerVisit(
            billingItemsOpd[0],
            opdVisitRemaining,
            opdVisitDayRemaining,
            opdVisitYearRemaining,
            opdVisitLimit,
            true
          )

        console.log(' ')
        console.log(
          `  [Schedule OPD] Room day combined sub Pool Remaining: ${sharedRoomDayPool.remaining.toFixed(2)} THB`
        )
        console.log(
          `  [Schedule OPD] Medical combined sub Pool Remaining: ${sharedMedicalPool.remaining.toFixed(2)} THB`
        )
        console.log(
          `  [Schedule OPD] Doctor practitioner combined sub Pool Remaining: ${sharedDoctorPool.remaining.toFixed(2)} THB`
        )
      }

      if (billingTotalOpd && billingItemsOpd.length > 0) {
        this.calculateBillingTotal(billingItemsOpd, billingTotalOpd)
      }
    }

    // 6. ER Items with schedule
    if (claimType === 'er72DischargeSchedule') {
      if (billingItemsEr && billingItemsEr.length > 0) {
        if (billingItemsEr[0])
          calculateBillingItemPerDis(billingItemsEr[0], er72HoursRemaining, er72HoursLimit, true, sharedMedicalPool)

        console.log(' ')
        console.log(
          `  [Schedule ER72] Room day combined sub Pool Remaining: ${sharedRoomDayPool.remaining.toFixed(2)} THB`
        )
        console.log(
          `  [Schedule ER72] Medical combined sub Pool Remaining: ${sharedMedicalPool.remaining.toFixed(2)} THB`
        )
        console.log(
          `  [Schedule ER72] Doctor practitioner combined sub Pool Remaining: ${sharedDoctorPool.remaining.toFixed(2)} THB`
        )
      }

      if (billingTotalEr && billingItemsEr.length > 0) {
        this.calculateBillingTotal(billingItemsEr, billingTotalEr)
      }
    }

    fs.writeFileSync(claimsPath, JSON.stringify(claimsData, null, 2), 'utf-8')
    console.log(' ')
    console.log('✓ Saved claims.json with Schedule logic')
    console.log('---------------------------------------')
  }

  async calculateBillingCopay(
    claimType: 'ipdPreAuth' | 'ipdDischarge' | 'opdDischarge' | 'er24Discharge',
    ...coverageFiles: string[]
  ) {
    // Define Paths
    const rootDir = process.cwd()
    const claimsPath = path.join(rootDir, 'tests-e2e', 'configurations', 'claims.json')

    // Read JSON Files
    const coveragesData = this.loadCoverageData(rootDir, coverageFiles)
    const claimsData = JSON.parse(fs.readFileSync(claimsPath, 'utf-8'))

    // Get Limit Remaining
    const othList = coveragesData.OTH
    const getOthVal = (index: number, field: string) => (othList[index] ? othList[index][field] : 0)
    const maxPayableRemaining = parseFloat(getOthVal(0, 'remaining'))

    const ipdList = coveragesData.IPD
    const getIpdVal = (index: number, field: string) => (ipdList[index] ? ipdList[index][field] : 0)
    const icuRoomLimit = parseFloat(getIpdVal(1, 'limit'))
    const icuRoomRemaining = parseFloat(getIpdVal(1, 'remaining'))
    const icuRoomCombinedRemaining = parseFloat(getIpdVal(1, 'combinedRemaining')) // currentGlobalIpdRemaining
    const icuRoomDayRemaining = parseFloat(getIpdVal(2, 'remaining'))
    // const icuRoomDayCombinedSub = parseFloat(getIpdVal(2, 'combinedSubRemaining')) // Shared room day pool
    const normalRoomDayRemaining = parseFloat(getIpdVal(3, 'remaining'))
    const normalRoomDayCombinedSub = parseFloat(getIpdVal(3, 'combinedSubRemaining')) // Shared room day pool
    const normalRoomLimit = parseFloat(getIpdVal(4, 'limit'))
    const normalRoomRemaining = parseFloat(getIpdVal(4, 'remaining'))
    const doctorPractitionerFeeLimit = parseFloat(getIpdVal(5, 'limit'))
    const doctorPractitionerFeeRemaining = parseFloat(getIpdVal(5, 'remaining'))
    const anesthetistPractitionerFeeLimit = parseFloat(getIpdVal(6, 'limit'))
    const anesthetistPractitionerFeeRemaining = parseFloat(getIpdVal(6, 'remaining'))
    const operatingRoomLimit = parseFloat(getIpdVal(7, 'limit'))
    const operatingRoomRemaining = parseFloat(getIpdVal(7, 'remaining'))
    const organTransplantationLimit = parseFloat(getIpdVal(8, 'limit'))
    const organTransplantationRemaining = parseFloat(getIpdVal(8, 'remaining'))
    // const daySurgeryLimit = parseFloat(getIpdVal(9, 'limit'))
    // const daySurgeryRemaining = parseFloat(getIpdVal(9, 'remaining'))
    const bloodAndBloodComponentsLimit = parseFloat(getIpdVal(10, 'limit'))
    const bloodAndBloodComponentsRemaining = parseFloat(getIpdVal(10, 'remaining'))
    const medicalSuppliesAndProcedureLimit = parseFloat(getIpdVal(11, 'limit'))
    const medicalSuppliesAndProcedureRemaining = parseFloat(getIpdVal(11, 'remaining'))
    const medicalSuppliesLimit = parseFloat(getIpdVal(12, 'limit'))
    const medicalSuppliesRemaining = parseFloat(getIpdVal(12, 'remaining'))
    const medicalExaminationLimit = parseFloat(getIpdVal(13, 'limit'))
    const medicalExaminationRemaining = parseFloat(getIpdVal(13, 'remaining'))
    const doctorsFeeLimit = parseFloat(getIpdVal(14, 'limit'))
    const doctorsFeeRemaining = parseFloat(getIpdVal(14, 'remaining'))
    const cancerByChemoLimit = parseFloat(getIpdVal(15, 'limit'))
    const cancerByChemoRemaining = parseFloat(getIpdVal(15, 'remaining'))
    const cancerByRadioNuclearLimit = parseFloat(getIpdVal(16, 'limit'))
    const cancerByRadioNuclearRemaining = parseFloat(getIpdVal(16, 'remaining'))
    const chronicKidneyLimit = parseFloat(getIpdVal(17, 'limit'))
    const chronicKidneyRemaining = parseFloat(getIpdVal(17, 'remaining'))
    // const postHospitalLimit = parseFloat(getIpdVal(18, 'limit'))
    // const postHospitalRemaining = parseFloat(getIpdVal(18, 'remaining'))
    const minorOperationLimit = parseFloat(getIpdVal(19, 'limit'))
    const minorOperationRemaining = parseFloat(getIpdVal(19, 'remaining'))
    const suppliesTakeawayLimit = parseFloat(getIpdVal(20, 'limit'))
    const suppliesTakeawayRemaining = parseFloat(getIpdVal(20, 'remaining'))
    // const preAndPostHospitalLimit = parseFloat(getIpdVal(21, 'limit'))
    // const preAndPostHospitalRemaining = parseFloat(getIpdVal(21, 'remaining'))
    const ambulanceLimit = parseFloat(getIpdVal(22, 'limit'))
    const ambulanceRemaining = parseFloat(getIpdVal(22, 'remaining'))

    const opdList = coveragesData.OPD
    const getOpdVal = (index: number, field: string) => (opdList[index] ? opdList[index][field] : 0)
    const rehabLimit = parseFloat(getOpdVal(0, 'limit'))
    const rehabRemaining = parseFloat(getOpdVal(0, 'remaining'))

    const er24List = coveragesData.ER
    const getEr24Val = (index: number, field: string) => (er24List[index] ? er24List[index][field] : 0)
    const er24HoursDayRemaining = parseFloat(getEr24Val(0, 'remaining'))
    const er24HoursLimit = parseFloat(getEr24Val(1, 'limit'))
    const er24HoursRemaining = parseFloat(getEr24Val(1, 'remaining'))

    // Initialize Current Remaining
    let currentGlobalRemaining = maxPayableRemaining
    let currentGlobalIpdRemaining = icuRoomCombinedRemaining

    // Initialize Pool State
    const sharedRoomDayPool = {
      remaining: normalRoomDayCombinedSub
    }

    // Get Target Billing Items (Pointer to array)
    const billingIpdPreAuth = claimsData.uat.copay.ha.ipd.positive.preArrangement
    const billingItemsIpdPreAuth = billingIpdPreAuth.billingInfo.billingItems
    const billingTotalIpdPreAuth = billingIpdPreAuth.billingTotal

    const billingIpd = claimsData.uat.copay.ha.ipd.positive.ipdDischarge
    const billingItemsIpd = billingIpd.billingInfo.billingItems
    const billingTotalIpd = billingIpd.billingTotal

    const billingOpd = claimsData.uat.copay.ha.opd.positive.ipdDischarge
    const billingItemsOpd = billingOpd.billingInfo.billingItems
    const billingTotalOpd = billingOpd.billingTotal

    const billingEr24 = claimsData.uat.copay.ha.er24.positive.ipdDischarge
    const billingItemsEr = billingEr24.billingInfo.billingItems
    const billingTotalEr = billingEr24.billingTotal

    // Helper Function: Core Logic for Copay + Global Limit
    const applyCoverageLogic = (
      netAmountFloat,
      maxItemPayable,
      type: 'ipd' | 'opd' | 'er',
      coveragePercent: number
    ) => {
      let payable = maxItemPayable

      // 1. Check IPD Global Limit (Only for IPD)
      if (type === 'ipd') {
        const effectiveIpdRemaining = currentGlobalIpdRemaining * coveragePercent

        if (currentGlobalIpdRemaining <= 0) {
          payable = 0
        } else {
          payable = Math.min(payable, effectiveIpdRemaining)
        }
      }

      const effectiveGlobalRemaining = currentGlobalRemaining * coveragePercent

      // 2. Check Global Limit (Overall Policy Limit)
      if (currentGlobalRemaining <= 0) {
        payable = 0
      } else {
        payable = Math.min(payable, effectiveGlobalRemaining)
      }

      // 3. Deduct from Limit Pools
      if (payable > 0) {
        const grossUsedRaw = coveragePercent > 0 ? payable / coveragePercent : 0
        const grossUsed = parseFloat(grossUsedRaw.toFixed(2))

        if (type === 'ipd') {
          currentGlobalIpdRemaining -= grossUsed

          if (currentGlobalIpdRemaining < 0) currentGlobalIpdRemaining = 0
        }
        currentGlobalRemaining -= grossUsed
        if (currentGlobalRemaining < 0) currentGlobalRemaining = 0
      }

      // 4. Calculate Exceeded Limit
      const exceededLimit = (netAmountFloat - payable).toFixed(2)

      console.log(
        `    > Item: Net ${netAmountFloat.toFixed(2)} -> Pay ${payable.toFixed(2)} -> Exceed ${exceededLimit}`
      )

      return {
        payableAmount: payable.toFixed(2),
        exceededLimit: exceededLimit
      }
    }

    const calculateBillingItemPerDay = (
      item,
      limitAmountRemaining,
      limitDayRemaining,
      baseForIncurred,
      type: 'ipd' | 'opd' | 'er',
      sharedDayPool: { remaining: number } | null = null
    ) => {
      const noOfDays = parseFloat(item.noOfDays)
      const copayPercent = parseFloat(item.copay)
      const coveragePercent = copayPercent === 0 ? 1.0 : copayPercent / 100

      // 1. Incurred Amount: (Limit / 4) * Days
      const incurredAmount = ((baseForIncurred / 4) * noOfDays).toFixed(2)

      // 2. Discount: 10% of Incurred
      const discount = (parseFloat(incurredAmount) * 0.1).toFixed(2)

      // 3. Net Amount: Incurred - Discount
      const netAmount = (parseFloat(incurredAmount) - parseFloat(discount)).toFixed(2)
      const netAmountFloat = parseFloat(netAmount)

      // 4. Calculate Payable by Policy Condition (Net * Coverage%)
      const payableByPolicy = netAmountFloat * coveragePercent

      // 5. Calculate Allowed Days
      let allowedDays = 0
      if (limitDayRemaining > 0) {
        allowedDays = noOfDays

        allowedDays = Math.min(allowedDays, limitDayRemaining)

        if (sharedDayPool) {
          allowedDays = Math.min(allowedDays, sharedDayPool.remaining)
        }
      } else {
        allowedDays = 0
      }

      // 6. Calculate Max Item Payable based on Allowed Days
      let maxItemPayable = 0
      if (allowedDays > 0) {
        const maxLimit = limitAmountRemaining * allowedDays

        maxItemPayable = Math.min(payableByPolicy, maxLimit)
      } else {
        maxItemPayable = 0
      }

      // 7. Apply Global Logic
      const result = applyCoverageLogic(netAmountFloat, maxItemPayable, type, coveragePercent)

      // 8. Deduct from Shared Pool
      if (sharedDayPool) {
        sharedDayPool.remaining -= allowedDays
        if (sharedDayPool.remaining < 0) sharedDayPool.remaining = 0
      }

      // Update items
      item.incurredAmount = incurredAmount
      item.discount = discount
      item.netAmount = netAmount
      item.payableAmount = result.payableAmount
      item.exceededLimit = result.exceededLimit

      return { ...item }
    }

    const calculateBillingItemPerDis = (item, limitAmountRemaining, baseForIncurred, type: 'ipd' | 'opd' | 'er') => {
      const copayPercent = parseFloat(item.copay)
      const coveragePercent = copayPercent === 0 ? 1.0 : copayPercent / 100

      const incurredAmount = (baseForIncurred / 4).toFixed(2)
      const discount = (parseFloat(incurredAmount) * 0.1).toFixed(2)
      const netAmount = (parseFloat(incurredAmount) - parseFloat(discount)).toFixed(2)
      const netAmountFloat = parseFloat(netAmount)

      const payableByPolicy = netAmountFloat * coveragePercent

      const maxItemPayable = Math.min(payableByPolicy, limitAmountRemaining)

      const result = applyCoverageLogic(netAmountFloat, maxItemPayable, type, coveragePercent)

      item.incurredAmount = incurredAmount
      item.discount = discount
      item.netAmount = netAmount
      item.payableAmount = result.payableAmount
      item.exceededLimit = result.exceededLimit

      return { ...item }
    }

    const calculateBillingItemPerDisWithDay = (
      item,
      limitAmountRemaining,
      limitDayRemaining,
      baseForIncurred,
      type: 'ipd' | 'opd' | 'er'
    ) => {
      const copayPercent = parseFloat(item.copay)
      const coveragePercent = copayPercent === 0 ? 1.0 : copayPercent / 100

      const incurredAmount = (baseForIncurred / 4).toFixed(2)
      const discount = (parseFloat(incurredAmount) * 0.1).toFixed(2)
      const netAmount = (parseFloat(incurredAmount) - parseFloat(discount)).toFixed(2)
      const netAmountFloat = parseFloat(netAmount)

      const payableByPolicy = netAmountFloat * coveragePercent

      let maxItemPayable = 0
      if (limitDayRemaining > 0) {
        maxItemPayable = Math.min(payableByPolicy, limitAmountRemaining)
      } else {
        maxItemPayable = 0
      }

      const result = applyCoverageLogic(netAmountFloat, maxItemPayable, type, coveragePercent)

      item.incurredAmount = incurredAmount
      item.discount = discount
      item.netAmount = netAmount
      item.payableAmount = result.payableAmount
      item.exceededLimit = result.exceededLimit

      return { ...item }
    }

    // Execute Calculation
    console.log('✓ Updated billing items with Copay logic')
    console.log(`  Initial Global Limit: ${maxPayableRemaining}`)
    console.log(' ')

    // 1. IPD (Pre-Authorization)
    if (claimType === 'ipdPreAuth') {
      if (billingItemsIpdPreAuth && billingItemsIpdPreAuth.length > 0) {
        if (billingItemsIpdPreAuth[0])
          calculateBillingItemPerDay(
            billingItemsIpdPreAuth[0],
            icuRoomRemaining,
            icuRoomDayRemaining,
            icuRoomLimit,
            'ipd',
            sharedRoomDayPool
          )
        if (billingItemsIpdPreAuth[1])
          calculateBillingItemPerDay(
            billingItemsIpdPreAuth[1],
            normalRoomRemaining,
            normalRoomDayRemaining,
            normalRoomLimit,
            'ipd',
            sharedRoomDayPool
          )
        if (billingItemsIpdPreAuth[2])
          calculateBillingItemPerDis(
            billingItemsIpdPreAuth[2],
            doctorPractitionerFeeRemaining,
            doctorPractitionerFeeLimit,
            'ipd'
          )
        if (billingItemsIpdPreAuth[3])
          calculateBillingItemPerDis(
            billingItemsIpdPreAuth[3],
            anesthetistPractitionerFeeRemaining,
            anesthetistPractitionerFeeLimit,
            'ipd'
          )
        if (billingItemsIpdPreAuth[4])
          calculateBillingItemPerDis(billingItemsIpdPreAuth[4], operatingRoomRemaining, operatingRoomLimit, 'ipd')
        if (billingItemsIpdPreAuth[5])
          calculateBillingItemPerDis(
            billingItemsIpdPreAuth[5],
            organTransplantationRemaining,
            organTransplantationLimit,
            'ipd'
          )
        // if (billingItemsIpdPreAuth[]) calculateBillingItemPerDis(billingItemsIpdPreAuth[], daySurgeryRemaining, daySurgeryLimit, 'ipd')
        if (billingItemsIpdPreAuth[6])
          calculateBillingItemPerDis(
            billingItemsIpdPreAuth[6],
            bloodAndBloodComponentsRemaining,
            bloodAndBloodComponentsLimit,
            'ipd'
          )
        if (billingItemsIpdPreAuth[7])
          calculateBillingItemPerDis(
            billingItemsIpdPreAuth[7],
            medicalSuppliesAndProcedureRemaining,
            medicalSuppliesAndProcedureLimit,
            'ipd'
          )
        if (billingItemsIpdPreAuth[8])
          calculateBillingItemPerDis(billingItemsIpdPreAuth[8], medicalSuppliesRemaining, medicalSuppliesLimit, 'ipd')
        if (billingItemsIpdPreAuth[9])
          calculateBillingItemPerDis(
            billingItemsIpdPreAuth[9],
            medicalExaminationRemaining,
            medicalExaminationLimit,
            'ipd'
          )
        if (billingItemsIpdPreAuth[10])
          calculateBillingItemPerDis(billingItemsIpdPreAuth[10], doctorsFeeRemaining, doctorsFeeLimit, 'ipd')
        if (billingItemsIpdPreAuth[11])
          calculateBillingItemPerDis(billingItemsIpdPreAuth[11], cancerByChemoRemaining, cancerByChemoLimit, 'ipd')
        if (billingItemsIpdPreAuth[12])
          calculateBillingItemPerDis(
            billingItemsIpdPreAuth[12],
            cancerByRadioNuclearRemaining,
            cancerByRadioNuclearLimit,
            'ipd'
          )
        if (billingItemsIpdPreAuth[13])
          calculateBillingItemPerDis(billingItemsIpdPreAuth[13], chronicKidneyRemaining, chronicKidneyLimit, 'ipd')
        // if (billingItemsIpdPreAuth[]) calculateBillingItemPerDis(billingItemsIpdPreAuth[], postHospitalRemaining, postHospitalLimit, 'opd')
        if (billingItemsIpdPreAuth[14])
          calculateBillingItemPerDis(billingItemsIpdPreAuth[14], minorOperationRemaining, minorOperationLimit, 'ipd')
        if (billingItemsIpdPreAuth[15])
          calculateBillingItemPerDis(
            billingItemsIpdPreAuth[15],
            suppliesTakeawayRemaining,
            suppliesTakeawayLimit,
            'ipd'
          )
        // if (billingItemsIpdPreAuth[]) calculateBillingItemPerDis(billingItemsIpdPreAuth[], preAndPostHospitalRemaining, preAndPostHospitalLimit, 'opd')
        if (billingItemsIpdPreAuth[16])
          calculateBillingItemPerDis(billingItemsIpdPreAuth[16], ambulanceRemaining, ambulanceLimit, 'ipd')

        console.log(' ')
        console.log(`  [Copay IPD] Global Remaining: ${currentGlobalRemaining.toFixed(2)}`)
        console.log(`  [Copay IPD] IPD Global Remaining: ${currentGlobalIpdRemaining.toFixed(2)}`)
        console.log(`  [Copay IPD] Room day combined sub Pool Remaining: ${sharedRoomDayPool.remaining.toFixed(2)}`)
      }

      if (billingTotalIpdPreAuth && billingItemsIpdPreAuth.length > 0) {
        this.calculateBillingTotal(billingItemsIpdPreAuth, billingTotalIpdPreAuth)
      }
    }

    // 2. IPD (IPD Discharge)
    if (claimType === 'ipdDischarge') {
      if (billingItemsIpd && billingItemsIpd.length > 0) {
        if (billingItemsIpd[0])
          calculateBillingItemPerDay(
            billingItemsIpd[0],
            icuRoomRemaining,
            icuRoomDayRemaining,
            icuRoomLimit,
            'ipd',
            sharedRoomDayPool
          )
        if (billingItemsIpd[1])
          calculateBillingItemPerDay(
            billingItemsIpd[1],
            normalRoomRemaining,
            normalRoomDayRemaining,
            normalRoomLimit,
            'ipd',
            sharedRoomDayPool
          )
        if (billingItemsIpd[2])
          calculateBillingItemPerDis(
            billingItemsIpd[2],
            doctorPractitionerFeeRemaining,
            doctorPractitionerFeeLimit,
            'ipd'
          )
        if (billingItemsIpd[3])
          calculateBillingItemPerDis(
            billingItemsIpd[3],
            anesthetistPractitionerFeeRemaining,
            anesthetistPractitionerFeeLimit,
            'ipd'
          )
        if (billingItemsIpd[4])
          calculateBillingItemPerDis(billingItemsIpd[4], operatingRoomRemaining, operatingRoomLimit, 'ipd')
        if (billingItemsIpd[5])
          calculateBillingItemPerDis(
            billingItemsIpd[5],
            organTransplantationRemaining,
            organTransplantationLimit,
            'ipd'
          )
        // if (billingItemsIpd[]) calculateBillingItemPerDis(billingItemsIpd[], daySurgeryRemaining, daySurgeryLimit, 'ipd')
        if (billingItemsIpd[6])
          calculateBillingItemPerDis(
            billingItemsIpd[6],
            bloodAndBloodComponentsRemaining,
            bloodAndBloodComponentsLimit,
            'ipd'
          )
        if (billingItemsIpd[7])
          calculateBillingItemPerDis(
            billingItemsIpd[7],
            medicalSuppliesAndProcedureRemaining,
            medicalSuppliesAndProcedureLimit,
            'ipd'
          )
        if (billingItemsIpd[8])
          calculateBillingItemPerDis(billingItemsIpd[8], medicalSuppliesRemaining, medicalSuppliesLimit, 'ipd')
        if (billingItemsIpd[9])
          calculateBillingItemPerDis(billingItemsIpd[9], medicalExaminationRemaining, medicalExaminationLimit, 'ipd')
        if (billingItemsIpd[10])
          calculateBillingItemPerDis(billingItemsIpd[10], doctorsFeeRemaining, doctorsFeeLimit, 'ipd')
        if (billingItemsIpd[11])
          calculateBillingItemPerDis(billingItemsIpd[11], cancerByChemoRemaining, cancerByChemoLimit, 'ipd')
        if (billingItemsIpd[12])
          calculateBillingItemPerDis(
            billingItemsIpd[12],
            cancerByRadioNuclearRemaining,
            cancerByRadioNuclearLimit,
            'ipd'
          )
        if (billingItemsIpd[13])
          calculateBillingItemPerDis(billingItemsIpd[13], chronicKidneyRemaining, chronicKidneyLimit, 'ipd')
        // if (billingItemsIpd[]) calculateBillingItemPerDis(billingItemsIpd[], postHospitalRemaining, postHospitalLimit, 'opd')
        if (billingItemsIpd[14])
          calculateBillingItemPerDis(billingItemsIpd[14], minorOperationRemaining, minorOperationLimit, 'ipd')
        if (billingItemsIpd[15])
          calculateBillingItemPerDis(billingItemsIpd[15], suppliesTakeawayRemaining, suppliesTakeawayLimit, 'ipd')
        // if (billingItemsIpd[]) calculateBillingItemPerDis(billingItemsIpd[], preAndPostHospitalRemaining, preAndPostHospitalLimit, 'opd')
        if (billingItemsIpd[16])
          calculateBillingItemPerDis(billingItemsIpd[16], ambulanceRemaining, ambulanceLimit, 'ipd')

        console.log(' ')
        console.log(`  [Copay IPD] Global Remaining: ${currentGlobalRemaining.toFixed(2)}`)
        console.log(`  [Copay IPD] IPD Global Remaining: ${currentGlobalIpdRemaining.toFixed(2)}`)
        console.log(`  [Copay IPD] Room day combined sub Pool Remaining: ${sharedRoomDayPool.remaining.toFixed(2)}`)
      }

      if (billingTotalIpd && billingItemsIpd.length > 0) {
        this.calculateBillingTotal(billingItemsIpd, billingTotalIpd)
      }
    }

    // 3. OPD (IPD Discharge)
    if (claimType === 'opdDischarge') {
      if (billingItemsOpd && billingItemsOpd.length > 0) {
        if (billingItemsOpd[0]) calculateBillingItemPerDis(billingItemsOpd[0], rehabRemaining, rehabLimit, 'opd')

        console.log(' ')
        console.log(`  [Copay OPD] Global Remaining: ${currentGlobalRemaining.toFixed(2)}`)
      }
      if (billingTotalOpd && billingItemsOpd.length > 0) {
        this.calculateBillingTotal(billingItemsOpd, billingTotalOpd)
      }
    }

    // 4. ER (IPD Discharge)
    if (claimType === 'er24Discharge') {
      if (billingItemsEr && billingItemsEr.length > 0) {
        if (billingItemsEr[0])
          calculateBillingItemPerDisWithDay(
            billingItemsEr[0],
            er24HoursRemaining,
            er24HoursDayRemaining,
            er24HoursLimit,
            'er'
          )

        console.log(' ')
        console.log(`  [Copay ER24] Global Remaining: ${currentGlobalRemaining.toFixed(2)}`)
      }

      if (billingTotalEr && billingItemsEr.length > 0) {
        this.calculateBillingTotal(billingItemsEr, billingTotalEr)
      }
    }

    fs.writeFileSync(claimsPath, JSON.stringify(claimsData, null, 2), 'utf-8')
    console.log(' ')
    console.log('✓ Saved claims.json with Copay logic')
    console.log('------------------------------------')
  }

  async calculateBillingDeductNotEr(claimType: 'ipdDischarge' | 'opdDischarge' | 'er24Discharge') {
    // Define Paths
    const rootDir = process.cwd()
    const coveragesPath = path.join(rootDir, 'tests-e2e', 'configurations', 'claim-coverages-init.json')
    const claimsPath = path.join(rootDir, 'tests-e2e', 'configurations', 'claims.json')

    // Read JSON Files
    const coveragesData = JSON.parse(fs.readFileSync(coveragesPath, 'utf-8'))
    const claimsData = JSON.parse(fs.readFileSync(claimsPath, 'utf-8'))

    // Get Limit Remaining
    const othCoverages = coveragesData.policy.deductNotER.OTH
    const maxPayableRemaining = parseFloat(othCoverages[0].remaining)
    const maxPayableIpdRemaining = parseFloat(othCoverages[1].remaining)

    const ipdCoverages = coveragesData.policy.deductNotER.IPD
    const icuRoomLimit = parseFloat(ipdCoverages[0].limit)
    const icuRoomRemaining = parseFloat(ipdCoverages[0].remaining)
    const icuRoomDayRemaining = parseFloat(ipdCoverages[1].remaining)
    // const icuRoomDayCombinedSub = parseFloat(ipdCoverages[1].combinedSubDayRemaining) // Shared room day pool
    const normalRoomDayRemaining = parseFloat(ipdCoverages[2].remaining)
    const normalRoomDayCombinedSub = parseFloat(ipdCoverages[2].combinedSubDayRemaining) // Shared room day pool
    const normalRoomLimit = parseFloat(ipdCoverages[3].limit)
    const normalRoomRemaining = parseFloat(ipdCoverages[3].remaining)
    const doctorPractitionerFeeLimit = parseFloat(ipdCoverages[4].limit)
    const doctorPractitionerFeeRemaining = parseFloat(ipdCoverages[4].remaining)
    const anesthetistPractitionerFeeLimit = parseFloat(ipdCoverages[5].limit)
    const anesthetistPractitionerFeeRemaining = parseFloat(ipdCoverages[5].remaining)
    const operatingRoomLimit = parseFloat(ipdCoverages[6].limit)
    const operatingRoomRemaining = parseFloat(ipdCoverages[6].remaining)
    const organTransplantationLimit = parseFloat(ipdCoverages[7].limit)
    const organTransplantationRemaining = parseFloat(ipdCoverages[7].remaining)
    const daySurgeryLimit = parseFloat(ipdCoverages[8].limit)
    const daySurgeryRemaining = parseFloat(ipdCoverages[8].remaining)
    const bloodAndBloodComponentsLimit = parseFloat(ipdCoverages[9].limit)
    const bloodAndBloodComponentsRemaining = parseFloat(ipdCoverages[9].remaining)
    const medicalSuppliesAndProcedureLimit = parseFloat(ipdCoverages[10].limit)
    const medicalSuppliesAndProcedureRemaining = parseFloat(ipdCoverages[10].remaining)
    const medicalSuppliesLimit = parseFloat(ipdCoverages[11].limit)
    const medicalSuppliesRemaining = parseFloat(ipdCoverages[11].remaining)
    const medicalExaminationLimit = parseFloat(ipdCoverages[12].limit)
    const medicalExaminationRemaining = parseFloat(ipdCoverages[12].remaining)
    const doctorsFeeLimit = parseFloat(ipdCoverages[13].limit)
    const doctorsFeeRemaining = parseFloat(ipdCoverages[13].remaining)
    const cancerByChemoLimit = parseFloat(ipdCoverages[14].limit)
    const cancerByChemoRemaining = parseFloat(ipdCoverages[14].remaining)
    const cancerByRadioNuclearLimit = parseFloat(ipdCoverages[15].limit)
    const cancerByRadioNuclearRemaining = parseFloat(ipdCoverages[15].remaining)
    const chronicKidneyLimit = parseFloat(ipdCoverages[16].limit)
    const chronicKidneyRemaining = parseFloat(ipdCoverages[16].remaining)
    // FIXME: deduct data
    // const minorOperationLimit = parseFloat(ipdCoverages[17].limit)
    // const minorOperationRemaining = parseFloat(ipdCoverages[17].remaining)
    const suppliesTakeawayLimit = parseFloat(ipdCoverages[18].limit)
    const suppliesTakeawayRemaining = parseFloat(ipdCoverages[18].remaining)
    // FIXME: deduct data
    // const vaccinationLimit = parseFloat(ipdCoverages[19].limit)
    // const vaccinationRemaining = parseFloat(ipdCoverages[19].remaining)
    const ambulanceLimit = parseFloat(ipdCoverages[20].limit)
    const ambulanceRemaining = parseFloat(ipdCoverages[20].remaining)

    const opdCoverages = coveragesData.policy.deductNotER.OPD
    // FIXME: deduct data
    // const postHospitalLimit = parseFloat(opdCoverages[0].limit)
    // const postHospitalRemaining = parseFloat(ipdCoverages[0].remaining)
    // const preAndPostHospitalLimit = parseFloat(opdCoverages[1].limit)
    // const preAndPostHospitalRemaining = parseFloat(ipdCoverages[1].remaining)
    // const rehabLimit = parseFloat(opdCoverages[2].limit)
    // const rehabRemaining = parseFloat(opdCoverages[2].remaining)
    const opdLimit = parseFloat(opdCoverages[3].limit)
    const opdRemaining = parseFloat(opdCoverages[3].remaining)
    const opdVisitYearRemaining = parseFloat(opdCoverages[4].remaining)
    const opdVisitDayRemaining = parseFloat(opdCoverages[5].remaining)

    const erCoverages = coveragesData.policy.deductNotER.ER
    const er24HoursLimit = parseFloat(erCoverages[0].limit)
    const er24HoursRemaining = parseFloat(erCoverages[0].remaining)
    const er24HoursDayRemaining = parseFloat(erCoverages[1].remaining)

    // Initialize Current Remaining
    let currentGlobalRemaining = maxPayableRemaining
    let currentIpdGlobalRemaining = maxPayableIpdRemaining

    // Initialize Deductible State
    const deductState = {
      ipd: 10000.0,
      opd: 10000.0,
      er: 0.0
    }

    // Initialize Pool State
    const sharedRoomDayPool = {
      remaining: normalRoomDayCombinedSub
    }

    // Get Target Billing Items
    const billingIpd = claimsData.uat.deduct.ha.notIncludedEr.ipd.positive.ipdDischarge
    const billingItemsIpd = billingIpd.billingInfo.billingItems
    const billingTotalIpd = billingIpd.billingTotal

    const billingOpd = claimsData.uat.deduct.ha.notIncludedEr.opd.positive.ipdDischarge
    const billingItemsOpd = billingOpd.billingInfo.billingItems
    const billingTotalOpd = billingOpd.billingTotal

    const billingEr24 = claimsData.uat.deduct.ha.notIncludedEr.er24.positive.ipdDischarge
    const billingItemsEr = billingEr24.billingInfo.billingItems
    const billingTotalEr = billingEr24.billingTotal

    // Helper Function: Core Logic for Deductible (Not included ER) + Global Limit
    const applyCoverageLogic = (netAmountFloat, maxItemPayable, deductibleKey: 'ipd' | 'opd' | 'er') => {
      const currentDeductible = deductState[deductibleKey]

      // 1. Deduct Deductible first (only for IPD/OPD with value > 0)
      let amountToDeduct = 0
      if (currentDeductible > 0) {
        amountToDeduct = Math.min(netAmountFloat, currentDeductible)
        deductState[deductibleKey] -= amountToDeduct
      }

      // Amount remaining after deducting Deductible (Claimable)
      const amountAfterDeduct = netAmountFloat - amountToDeduct

      // 2. Check Item Limit
      let payable = Math.min(amountAfterDeduct, maxItemPayable)

      // 3. Check IPD Global Limit (IPD only)
      if (deductibleKey === 'ipd') {
        if (currentIpdGlobalRemaining <= 0) {
          payable = 0
        } else {
          payable = Math.min(payable, currentIpdGlobalRemaining)
        }
      }

      // 4. Check Global Limit
      if (currentGlobalRemaining <= 0) {
        payable = 0
      } else {
        payable = Math.min(payable, currentGlobalRemaining)
      }

      // Update Global Remaining
      if (payable > 0) {
        if (deductibleKey === 'ipd') {
          currentIpdGlobalRemaining -= payable
        }
        currentGlobalRemaining -= payable
      }

      // 5. Calculate Exceeded Limit
      // Exceeded = Net Amount - Payable Amount
      // (This includes both Deductible and amount exceeding the Limit as per the requirement)
      const exceededLimit = (netAmountFloat - payable).toFixed(2)

      console.log(
        `    > Item: Net ${netAmountFloat.toFixed(2)} -> Pay ${payable.toFixed(2)} -> Deduct ${amountToDeduct.toFixed(2)} -> Exceed ${exceededLimit}`
      )

      return {
        payableAmount: payable.toFixed(2),
        exceededLimit: exceededLimit,
        deductedAmount: amountToDeduct.toFixed(2)
      }
    }

    const calculateBillingItemPerDay = (
      item,
      limitAmountRemaining,
      limitDayRemaining,
      baseForIncurred,
      type: 'ipd' | 'opd' | 'er',
      sharedDayPool: { remaining: number } | null = null
    ) => {
      const noOfDays = parseFloat(item.noOfDays)

      // 1. Incurred Amount: (Limit / 4) * Days
      const incurredAmount = ((baseForIncurred / 4) * noOfDays).toFixed(2)

      // 2. Discount: 10% of Incurred
      const discount = (parseFloat(incurredAmount) * 0.1).toFixed(2)

      // 3. Net Amount: Incurred - Discount
      const netAmount = (parseFloat(incurredAmount) - parseFloat(discount)).toFixed(2)
      const netAmountFloat = parseFloat(netAmount)

      // 4. Calculate Allowed Days (Shared Pool Logic)
      let allowedDays = 0
      if (limitDayRemaining > 0) {
        allowedDays = noOfDays

        allowedDays = Math.min(allowedDays, limitDayRemaining)

        if (sharedDayPool) {
          allowedDays = Math.min(allowedDays, sharedDayPool.remaining)
        }
      } else {
        allowedDays = 0
      }

      // 5. Calculate Max Item Payable based on Allowed Days
      let maxItemPayable = 0
      if (allowedDays > 0) {
        maxItemPayable = limitAmountRemaining * allowedDays
      } else {
        maxItemPayable = 0
      }

      // 6. Apply Logic (Deductible -> Limit -> Global)
      const result = applyCoverageLogic(netAmountFloat, maxItemPayable, type)

      // 7. Deduct from Shared Pool (Cut Days)
      if (sharedDayPool) {
        sharedDayPool.remaining -= allowedDays
        if (sharedDayPool.remaining < 0) sharedDayPool.remaining = 0
      }

      // Update items
      item.incurredAmount = incurredAmount
      item.discount = discount
      item.netAmount = netAmount
      item.deduct = result.deductedAmount
      item.payableAmount = result.payableAmount
      item.exceededLimit = result.exceededLimit

      return { ...item }
    }

    const calculateBillingItemPerDis = (item, limitAmountRemaining, baseForIncurred, type: 'ipd' | 'opd' | 'er') => {
      const incurredAmount = (baseForIncurred / 4).toFixed(2)
      const discount = (parseFloat(incurredAmount) * 0.1).toFixed(2)
      const netAmount = (parseFloat(incurredAmount) - parseFloat(discount)).toFixed(2)
      const netAmountFloat = parseFloat(netAmount)

      const maxItemPayable = limitAmountRemaining

      const result = applyCoverageLogic(netAmountFloat, maxItemPayable, type)

      item.incurredAmount = incurredAmount
      item.discount = discount
      item.netAmount = netAmount
      item.deduct = result.deductedAmount
      item.payableAmount = result.payableAmount
      item.exceededLimit = result.exceededLimit

      return { ...item }
    }

    const calculateBillingItemPerDisWithDay = (
      item,
      limitAmountRemaining,
      limitDayRemaining,
      baseForIncurred,
      type: 'ipd' | 'opd' | 'er'
    ) => {
      const incurredAmount = (baseForIncurred / 4).toFixed(2)
      const discount = (parseFloat(incurredAmount) * 0.1).toFixed(2)
      const netAmount = (parseFloat(incurredAmount) - parseFloat(discount)).toFixed(2)
      const netAmountFloat = parseFloat(netAmount)

      let maxItemPayable = 0
      if (limitDayRemaining > 0) {
        maxItemPayable = limitAmountRemaining
      } else {
        maxItemPayable = 0
      }

      const result = applyCoverageLogic(netAmountFloat, maxItemPayable, type)

      item.incurredAmount = incurredAmount
      item.discount = discount
      item.netAmount = netAmount
      item.deduct = result.deductedAmount
      item.payableAmount = result.payableAmount
      item.exceededLimit = result.exceededLimit

      return { ...item }
    }

    const calculateBillingItemPerVisit = (
      item,
      limitAmountRemaining,
      limitVisitDayRemaining,
      limitVisitYearRemaining,
      baseForIncurred,
      type: 'ipd' | 'opd' | 'er'
    ) => {
      const incurredAmount = (baseForIncurred / 4).toFixed(2)
      const discount = (parseFloat(incurredAmount) * 0.1).toFixed(2)
      const netAmount = (parseFloat(incurredAmount) - parseFloat(discount)).toFixed(2)
      const netAmountFloat = parseFloat(netAmount)

      let maxItemPayable = 0
      if (limitVisitYearRemaining > 0) {
        if (limitVisitDayRemaining > 0) {
          maxItemPayable = limitAmountRemaining
        } else {
          maxItemPayable = 0
        }
      } else {
        maxItemPayable = 0
      }

      const result = applyCoverageLogic(netAmountFloat, maxItemPayable, type)

      item.incurredAmount = incurredAmount
      item.discount = discount
      item.netAmount = netAmount
      item.deduct = result.deductedAmount
      item.payableAmount = result.payableAmount
      item.exceededLimit = result.exceededLimit

      return { ...item }
    }

    // Execute Calculation
    console.log('✓ Updated billing items with Deduct (Not included ER) logic:')
    console.log(`  Initial Global Limit: ${maxPayableRemaining}`)
    console.log(`  Initial IPD Global Limit: ${maxPayableIpdRemaining}`)
    console.log('  Initial IPD Deduct: 10000, OPD Deduct: 10000, ER Deduct: 0')
    console.log(' ')

    // 1. IPD Items (Subject to 10,000 Deductible)
    if (claimType === 'ipdDischarge') {
      if (billingItemsIpd && billingItemsIpd.length > 0) {
        if (billingItemsIpd[0])
          calculateBillingItemPerDay(
            billingItemsIpd[0],
            icuRoomRemaining,
            icuRoomDayRemaining,
            icuRoomLimit,
            'ipd',
            sharedRoomDayPool
          )
        if (billingItemsIpd[1])
          calculateBillingItemPerDay(
            billingItemsIpd[1],
            normalRoomRemaining,
            normalRoomDayRemaining,
            normalRoomLimit,
            'ipd',
            sharedRoomDayPool
          )
        if (billingItemsIpd[2])
          calculateBillingItemPerDis(
            billingItemsIpd[2],
            doctorPractitionerFeeRemaining,
            doctorPractitionerFeeLimit,
            'ipd'
          )
        if (billingItemsIpd[3])
          calculateBillingItemPerDis(
            billingItemsIpd[3],
            anesthetistPractitionerFeeRemaining,
            anesthetistPractitionerFeeLimit,
            'ipd'
          )
        if (billingItemsIpd[4])
          calculateBillingItemPerDis(billingItemsIpd[4], operatingRoomRemaining, operatingRoomLimit, 'ipd')
        if (billingItemsIpd[5])
          calculateBillingItemPerDis(
            billingItemsIpd[5],
            organTransplantationRemaining,
            organTransplantationLimit,
            'ipd'
          )
        if (billingItemsIpd[6])
          calculateBillingItemPerDis(billingItemsIpd[6], daySurgeryRemaining, daySurgeryLimit, 'ipd')
        if (billingItemsIpd[7])
          calculateBillingItemPerDis(
            billingItemsIpd[7],
            bloodAndBloodComponentsRemaining,
            bloodAndBloodComponentsLimit,
            'ipd'
          )
        if (billingItemsIpd[8])
          calculateBillingItemPerDis(
            billingItemsIpd[8],
            medicalSuppliesAndProcedureRemaining,
            medicalSuppliesAndProcedureLimit,
            'ipd'
          )
        if (billingItemsIpd[9])
          calculateBillingItemPerDis(billingItemsIpd[9], medicalSuppliesRemaining, medicalSuppliesLimit, 'ipd')
        if (billingItemsIpd[10])
          calculateBillingItemPerDis(billingItemsIpd[10], medicalExaminationRemaining, medicalExaminationLimit, 'ipd')
        if (billingItemsIpd[11])
          calculateBillingItemPerDis(billingItemsIpd[11], doctorsFeeRemaining, doctorsFeeLimit, 'ipd')
        if (billingItemsIpd[12])
          calculateBillingItemPerDis(billingItemsIpd[12], cancerByChemoRemaining, cancerByChemoLimit, 'ipd')
        if (billingItemsIpd[13])
          calculateBillingItemPerDis(
            billingItemsIpd[13],
            cancerByRadioNuclearRemaining,
            cancerByRadioNuclearLimit,
            'ipd'
          )
        if (billingItemsIpd[14])
          calculateBillingItemPerDis(billingItemsIpd[14], chronicKidneyRemaining, chronicKidneyLimit, 'ipd')
        // FIXME: deduct data
        // if (billingItemsIpd[]) calculateBillingItemPerDis(billingItemsIpd[], minorOperationRemaining, minorOperationLimit, 'ipd')
        if (billingItemsIpd[15])
          calculateBillingItemPerDis(billingItemsIpd[15], suppliesTakeawayRemaining, suppliesTakeawayLimit, 'ipd')
        // FIXME: deduct data
        // if (billingItemsIpd[]) calculateBillingItemPerDis(billingItemsIpd[], vaccinationRemaining, vaccinationLimit, 'ipd')
        if (billingItemsIpd[16])
          calculateBillingItemPerDis(billingItemsIpd[16], ambulanceRemaining, ambulanceLimit, 'ipd')

        console.log(' ')
        console.log(`  [Deduct IPD] Global Remaining: ${currentGlobalRemaining.toFixed(2)}`)
        console.log(`  [Deduct IPD] IPD Global Remaining: ${currentIpdGlobalRemaining.toFixed(2)}`)
        console.log(`  [Deduct IPD] Deductible Remaining: ${deductState.ipd}`)
        console.log(`  [Deduct IPD] Room day combined sub Pool Remaining: ${sharedRoomDayPool.remaining.toFixed(2)}`)

        if (billingTotalIpd && billingItemsIpd.length > 0) {
          this.calculateBillingTotal(billingItemsIpd, billingTotalIpd)
        }
      }
    }

    // 2. OPD Items (Subject to 10,000 Deductible)
    if (claimType === 'opdDischarge') {
      if (billingItemsOpd && billingItemsOpd.length > 0) {
        if (billingItemsOpd[0])
          calculateBillingItemPerVisit(
            billingItemsOpd[0],
            opdRemaining,
            opdVisitDayRemaining,
            opdVisitYearRemaining,
            opdLimit,
            'opd'
          )
        // FIXME: deduct data
        // if (billingItemsOpd[]) calculateBillingItemPerDis(billingItemsOpd[], postHospitalRemaining, postHospitalLimit, 'opd')
        // if (billingItemsOpd[]) calculateBillingItemPerDis(billingItemsOpd[], preAndPostHospitalRemaining, preAndPostHospitalLimit, 'opd')
        // if (billingItemsOpd[]) calculateBillingItemPerDis(billingItemsOpd[], rehabRemaining, rehabLimit, 'opd')

        console.log(' ')
        console.log(`  [Deduct IPD] Global Remaining: ${currentGlobalRemaining.toFixed(2)}`)
        console.log(`  [Deduct IPD] IPD Global Remaining: ${currentIpdGlobalRemaining.toFixed(2)}`)
        console.log(`  [Deduct OPD] Deductible Remaining: ${deductState.opd}`)
        console.log(`  [Deduct OPD] Room day combined sub Pool Remaining: ${sharedRoomDayPool.remaining.toFixed(2)}`)

        if (billingTotalOpd && billingItemsOpd.length > 0) {
          this.calculateBillingTotal(billingItemsOpd, billingTotalOpd)
        }
      }
    }

    // 3. ER Items (No Deductible)
    if (claimType === 'er24Discharge') {
      if (billingItemsEr && billingItemsEr.length > 0) {
        if (billingItemsEr[0])
          calculateBillingItemPerDisWithDay(
            billingItemsEr[0],
            er24HoursRemaining,
            er24HoursDayRemaining,
            er24HoursLimit,
            'er'
          )

        console.log(' ')
        console.log(`  [Deduct IPD] Global Remaining: ${currentGlobalRemaining.toFixed(2)}`)
        console.log(`  [Deduct IPD] IPD Global Remaining: ${currentIpdGlobalRemaining.toFixed(2)}`)
        console.log(`  [Deduct ER] Deductible Remaining: ${deductState.er} (Should stay 0)`)
        console.log(`  [Deduct ER] Room day combined sub Pool Remaining: ${sharedRoomDayPool.remaining.toFixed(2)}`)
      }

      if (billingTotalEr && billingItemsEr.length > 0) {
        this.calculateBillingTotal(billingItemsEr, billingTotalEr)
      }
    }

    fs.writeFileSync(claimsPath, JSON.stringify(claimsData, null, 2), 'utf-8')
    console.log(' ')
    console.log('✓ Saved claims.json with Deduct (Not included ER) logic')
    console.log('-------------------------------------')
  }

  async calculateBillingMajorMedPh(
    claimType: 'ipdDischarge' | 'opdDischarge' | 'maternityDischarge' | 'er24Discharge' | 'dentalOpd',
    ...coverageFiles: string[]
  ) {
    // Define Paths
    const rootDir = process.cwd()
    const claimsPath = path.join(rootDir, 'tests-e2e', 'configurations', 'claims.json')

    // Read JSON Files
    const coveragesData = this.loadCoverageData(rootDir, coverageFiles)
    const claimsData = JSON.parse(fs.readFileSync(claimsPath, 'utf-8'))

    // Get Base Limits & MM Limits
    const ipdList = coveragesData.IPD
    const getIpdVal = (index: number, field: string) => (ipdList[index] ? ipdList[index][field] : 0)
    const majorMedDayRemaining = parseFloat(getIpdVal(1, 'remaining'))
    const majorMedRemaining = parseFloat(getIpdVal(2, 'remaining'))

    // Base Limits
    const icuRoomLimit = parseFloat(getIpdVal(3, 'limit'))
    const icuRoomRemaining = parseFloat(getIpdVal(3, 'remaining'))
    const icuRoomDayRemaining = parseFloat(getIpdVal(4, 'remaining'))
    // const icuRoomDayCombinedSub = parseFloat(getIpdVal(4, 'combinedSubRemaining')) // Shared room day pool
    const normalRoomLimit = parseFloat(getIpdVal(5, 'limit'))
    const normalRoomRemaining = parseFloat(getIpdVal(5, 'remaining'))
    const normalRoomDayRemaining = parseFloat(getIpdVal(6, 'remaining'))
    const normalRoomDayCombinedSub = parseFloat(getIpdVal(6, 'combinedSubRemaining')) // Shared room day pool
    const hospitalOrMedicalLimit = parseFloat(getIpdVal(7, 'limit'))
    const hospitalOrMedicalRemaining = parseFloat(getIpdVal(7, 'remaining'))
    const hospitalOrMedicalCombinedSub = parseFloat(getIpdVal(7, 'combinedSubRemaining')) // Shared medical pool
    const nonSurgicalConsultLimit = parseFloat(getIpdVal(8, 'limit'))
    const nonSurgicalConsultRemaining = parseFloat(getIpdVal(8, 'remaining'))
    const surgicalConsultLimit = parseFloat(getIpdVal(9, 'limit'))
    const surgicalConsultRemaining = parseFloat(getIpdVal(9, 'remaining'))
    const doctorPractitionerFeeLimit = parseFloat(getIpdVal(10, 'limit'))
    const doctorPractitionerFeeRemaining = parseFloat(getIpdVal(10, 'remaining'))
    const doctorsVisitFeeLimit = parseFloat(getIpdVal(11, 'limit'))
    const doctorsVisitFeeRemaining = parseFloat(getIpdVal(11, 'remaining'))
    const ambulanceLimit = parseFloat(getIpdVal(12, 'limit'))
    const ambulanceRemaining = parseFloat(getIpdVal(12, 'remaining'))
    // const ambulanceCombinedSub = parseFloat(getIpdVal(12, 'combinedSubRemaining')) // Shared medical pool
    const caesareanSectionLimit = parseFloat(getIpdVal(13, 'limit'))
    const caesareanSectionRemaining = parseFloat(getIpdVal(13, 'remaining'))
    const miscarriageLimit = parseFloat(getIpdVal(14, 'limit'))
    const miscarriageRemaining = parseFloat(getIpdVal(14, 'remaining'))
    const normalDeliveryLimit = parseFloat(getIpdVal(15, 'limit'))
    const normalDeliveryRemaining = parseFloat(getIpdVal(15, 'remaining'))
    const emergencyAmbulanceFeeLimit = parseFloat(getIpdVal(16, 'limit'))
    const emergencyAmbulanceFeeRemaining = parseFloat(getIpdVal(16, 'remaining'))

    const opdList = coveragesData.OPD
    const getOpdVal = (index: number, field: string) => (opdList[index] ? opdList[index][field] : 0)
    const opdLimit = parseFloat(getOpdVal(0, 'limit'))
    const opdRemaining = parseFloat(getOpdVal(0, 'remaining'))

    const er24List = coveragesData.ER
    const getEr24Val = (index: number, field: string) => (er24List[index] ? er24List[index][field] : 0)
    const er24HoursLimit = parseFloat(getEr24Val(0, 'limit'))
    const er24HoursRemaining = parseFloat(getEr24Val(0, 'remaining'))

    // Initialize Pool State
    const majorMedPool = {
      amountRemaining: majorMedRemaining,
      daysRemaining: majorMedDayRemaining
    }

    const sharedRoomDayPool = {
      remaining: normalRoomDayCombinedSub
    }

    const sharedMedicalPool = {
      remaining: hospitalOrMedicalCombinedSub
    }

    // Get Target Billing Items
    const billingIpd = claimsData.uat.majorMed.ph.ipd.positive.ipdDischarge
    const billingItemsIpd = billingIpd.billingInfo.billingItems
    const billingTotalIpd = billingIpd.billingTotal

    const billingOpd = claimsData.uat.majorMed.ph.opd.positive.ipdDischarge
    const billingItemsOpd = billingOpd.billingInfo.billingItems
    const billingTotalOpd = billingOpd.billingTotal

    const billingMaternity = claimsData.uat.majorMed.ph.maternity.positive.ipdDischarge
    const billingItemsMaternity = billingMaternity.billingInfo.billingItems
    const billingTotalMaternity = billingMaternity.billingTotal

    const billingEr24 = claimsData.uat.majorMed.ph.er24.positive.ipdDischarge
    const billingItemsEr = billingEr24.billingInfo.billingItems
    const billingTotalEr = billingEr24.billingTotal

    const billingDental = claimsData.uat.majorMed.ph.dental.positive.opd
    const billingItemsDental = billingDental.billingInfo.billingItems
    const billingTotalDental = billingDental.billingTotal

    // Helper Function: Core Logic for Major Medical (PH)
    const applyCoverageLogic = (netAmountFloat, baseLimit, noOfDays = 0, isIpd = false) => {
      // Base Coverage
      const payableBase = Math.min(netAmountFloat, baseLimit)

      // Excess
      const excessAmount = netAmountFloat - payableBase

      let payableMM = 0

      // Major Medical Calculation (Only IPD (Not included room) & If Excess exists)
      if (isIpd && excessAmount > 0) {
        let daysAllowed = true

        // Check Days Remaining
        if (noOfDays > 0) {
          if (majorMedPool.daysRemaining <= 0) {
            daysAllowed = false
          }
        }

        // Check Amount Remaining
        if (daysAllowed && majorMedPool.amountRemaining > 0) {
          // Company pays 80% of excess
          const mmCoverageRaw = excessAmount * 0.8

          // Cap at remaining MM pool
          payableMM = Math.min(mmCoverageRaw, majorMedPool.amountRemaining)

          // Deduct from Pool
          majorMedPool.amountRemaining -= payableMM

          // Deduct Days (if applicable)
          if (noOfDays > 0 && payableMM > 0) {
            majorMedPool.daysRemaining -= noOfDays
          }
        }
      }

      // Summary
      const totalPayable = payableBase + payableMM
      const exceededLimit = (netAmountFloat - totalPayable).toFixed(2)

      console.log(
        `    > Item: Net ${netAmountFloat.toFixed(2)} -> Pay ${payableBase.toFixed(2)} + MM ${payableMM.toFixed(2)} -> Exceed ${exceededLimit}`
      )

      return {
        payableAmount: payableBase.toFixed(2),
        majorMedicalAmount: payableMM.toFixed(2),
        exceededLimit: exceededLimit
      }
    }

    const calculateBillingItemPerDay = (
      item,
      limitAmountRemaining,
      limitDayRemaining,
      baseForIncurred,
      isMM = false,
      sharedDayPool: { remaining: number } | null = null
    ) => {
      const noOfDays = parseFloat(item.noOfDays)

      /// 1. Incurred Amount: (Limit * 1.2) * Days
      const incurredAmount = (baseForIncurred * 1.2 * noOfDays).toFixed(2)

      // 2. Discount: 10% of Incurred
      const discount = (parseFloat(incurredAmount) * 0.1).toFixed(2)

      // 3. Net Amount: Incurred - Discount
      const netAmount = (parseFloat(incurredAmount) - parseFloat(discount)).toFixed(2)
      const netAmountFloat = parseFloat(netAmount)

      // 4. Calculate Allowed Days
      let allowedDays = 0
      if (limitDayRemaining > 0) {
        allowedDays = noOfDays
        allowedDays = Math.min(allowedDays, limitDayRemaining)

        if (sharedDayPool) {
          allowedDays = Math.min(allowedDays, sharedDayPool.remaining)
        }
      } else {
        allowedDays = 0
      }

      // 5. Calculate Max Item Payable based on Allowed Days
      let maxBasePayable = 0
      if (allowedDays > 0) {
        maxBasePayable = limitAmountRemaining * allowedDays
      } else {
        maxBasePayable = 0
      }

      // 6. Apply Logic
      const result = applyCoverageLogic(netAmountFloat, maxBasePayable, noOfDays, isMM)

      // 7. Deduct from Shared Pool
      if (sharedDayPool) {
        sharedDayPool.remaining -= allowedDays
        if (sharedDayPool.remaining < 0) sharedDayPool.remaining = 0
      }

      // Update items
      item.incurredAmount = incurredAmount
      item.discount = discount
      item.netAmount = netAmount
      item.payableAmount = result.payableAmount
      item.majorMedical = result.majorMedicalAmount
      item.exceededLimit = result.exceededLimit

      return { ...item }
    }

    const calculateBillingItemPerDis = (
      item,
      limitAmountRemaining,
      baseForIncurred,
      isIpd = false,
      sharedPool: { remaining: number } | null = null
    ) => {
      const incurredAmount = (baseForIncurred * 1.2).toFixed(2)
      const discount = (parseFloat(incurredAmount) * 0.1).toFixed(2)
      const netAmount = (parseFloat(incurredAmount) - parseFloat(discount)).toFixed(2)
      const netAmountFloat = parseFloat(netAmount)

      let maxBasePayable = limitAmountRemaining
      if (sharedPool) {
        maxBasePayable = Math.min(limitAmountRemaining, sharedPool.remaining)
      }

      const result = applyCoverageLogic(netAmountFloat, maxBasePayable, 0, isIpd)

      if (sharedPool) {
        sharedPool.remaining -= parseFloat(result.payableAmount)
        if (sharedPool.remaining < 0) sharedPool.remaining = 0
      }

      item.incurredAmount = incurredAmount
      item.discount = discount
      item.netAmount = netAmount
      item.payableAmount = result.payableAmount
      item.majorMedical = result.majorMedicalAmount
      item.exceededLimit = result.exceededLimit

      return { ...item }
    }

    // Execute Calculation
    console.log('✓ Updated billing items with Major Medical (PH) Logic')
    console.log(`  MM Pool Initial: ${majorMedPool.amountRemaining} THB, Days: ${majorMedPool.daysRemaining}`)
    console.log(`  Medical combined sub Pool Initial: ${sharedMedicalPool.remaining} THB`)
    console.log(' ')

    // 1. IPD Items
    if (claimType === 'ipdDischarge') {
      if (billingItemsIpd && billingItemsIpd.length > 0) {
        if (billingItemsIpd[0])
          calculateBillingItemPerDay(
            billingItemsIpd[0],
            icuRoomRemaining,
            icuRoomDayRemaining,
            icuRoomLimit,
            false,
            sharedRoomDayPool
          )
        if (billingItemsIpd[1])
          calculateBillingItemPerDay(
            billingItemsIpd[1],
            normalRoomRemaining,
            normalRoomDayRemaining,
            normalRoomLimit,
            false,
            sharedRoomDayPool
          )
        if (billingItemsIpd[2])
          calculateBillingItemPerDis(
            billingItemsIpd[2],
            hospitalOrMedicalRemaining,
            hospitalOrMedicalLimit,
            true,
            sharedMedicalPool
          )
        if (billingItemsIpd[3])
          calculateBillingItemPerDis(billingItemsIpd[3], nonSurgicalConsultRemaining, nonSurgicalConsultLimit, true)
        if (billingItemsIpd[4])
          calculateBillingItemPerDis(billingItemsIpd[4], surgicalConsultRemaining, surgicalConsultLimit, true)
        if (billingItemsIpd[5])
          calculateBillingItemPerDis(
            billingItemsIpd[5],
            doctorPractitionerFeeRemaining,
            doctorPractitionerFeeLimit,
            true
          )
        if (billingItemsIpd[6])
          calculateBillingItemPerDay(billingItemsIpd[6], doctorsVisitFeeRemaining, 365, doctorsVisitFeeLimit, true)
        if (billingItemsIpd[7])
          calculateBillingItemPerDis(billingItemsIpd[7], ambulanceRemaining, ambulanceLimit, true, sharedMedicalPool)

        console.log(' ')
        console.log(`  [Major med IPD] MM Pool Remaining: ${majorMedPool.amountRemaining.toFixed(2)} THB`)
        console.log(
          `  [Major med IPD] Room day combined sub Pool Remaining: ${sharedRoomDayPool.remaining.toFixed(2)} Days`
        )
        console.log(
          `  [Major med IPD] Medical combined sub Pool Remaining: ${sharedMedicalPool.remaining.toFixed(2)} THB`
        )
      }

      if (billingTotalIpd && billingItemsIpd.length > 0) {
        this.calculateBillingTotal(billingItemsIpd, billingTotalIpd)
      }
    }

    // 2. OPD Items
    if (claimType === 'opdDischarge') {
      if (billingItemsOpd && billingItemsOpd.length > 0) {
        if (billingItemsOpd[0]) calculateBillingItemPerDis(billingItemsOpd[0], opdRemaining, opdLimit, false)

        console.log(' ')
      }

      if (billingTotalOpd && billingItemsOpd.length > 0) {
        this.calculateBillingTotal(billingItemsOpd, billingTotalOpd)
      }
    }

    // 3. Maternity Items
    if (claimType === 'maternityDischarge') {
      if (billingItemsMaternity && billingItemsMaternity.length > 0) {
        if (billingItemsMaternity[0])
          calculateBillingItemPerDis(billingItemsMaternity[0], caesareanSectionRemaining, caesareanSectionLimit, false)
        if (billingItemsMaternity[1])
          calculateBillingItemPerDis(billingItemsMaternity[1], miscarriageRemaining, miscarriageLimit, false)
        if (billingItemsMaternity[2])
          calculateBillingItemPerDis(billingItemsMaternity[2], normalDeliveryRemaining, normalDeliveryLimit, false)
        if (billingItemsMaternity[3])
          calculateBillingItemPerDis(
            billingItemsMaternity[3],
            emergencyAmbulanceFeeRemaining,
            emergencyAmbulanceFeeLimit,
            false
          )

        console.log(' ')
      }

      if (billingTotalMaternity && billingItemsMaternity.length > 0) {
        this.calculateBillingTotal(billingItemsMaternity, billingTotalMaternity)
      }
    }

    // 4. ER Items
    if (claimType === 'er24Discharge') {
      if (billingItemsEr && billingItemsEr.length > 0) {
        if (billingItemsEr[0]) calculateBillingItemPerDis(billingItemsEr[0], er24HoursRemaining, er24HoursLimit, false)

        console.log(' ')
      }

      if (billingTotalEr && billingItemsEr.length > 0) {
        this.calculateBillingTotal(billingItemsEr, billingTotalEr)
      }
    }

    // 5. Dental Items
    if (claimType === 'dentalOpd') {
      if (billingItemsDental && billingItemsDental.length > 0) {
        if (billingItemsDental[0]) calculateBillingItemPerDis(billingItemsDental[0], opdRemaining, opdLimit, false)

        console.log(' ')
      }

      if (billingTotalDental && billingItemsDental.length > 0) {
        this.calculateBillingTotal(billingItemsDental, billingTotalDental)
      }
    }

    fs.writeFileSync(claimsPath, JSON.stringify(claimsData, null, 2), 'utf-8')
    console.log(' ')
    console.log('✓ Saved claims.json with Major Medical (PH) logic')
    console.log('--------------------------------------------')
  }

  async calculateBillingMajorMedHa(claimType: 'er72Discharge' | 'hbIncentive') {
    // Define Paths
    const rootDir = process.cwd()
    const coveragesPath = path.join(rootDir, 'tests-e2e', 'configurations', 'claim-coverages-init.json')
    const claimsPath = path.join(rootDir, 'tests-e2e', 'configurations', 'claims.json')

    // Read JSON Files
    const coveragesData = JSON.parse(fs.readFileSync(coveragesPath, 'utf-8'))
    const claimsData = JSON.parse(fs.readFileSync(claimsPath, 'utf-8'))

    // Base Limits
    const erCoverages = coveragesData.policy.majorMedHa.ER
    const er24HoursLimit = parseFloat(erCoverages[0].limit)
    const er24HoursRemaining = parseFloat(erCoverages[0].remaining)

    const hbIncentiveCoverages = coveragesData.policy.majorMedHa.HB_Incentive
    const hbIncentiveDayRemaining = parseFloat(hbIncentiveCoverages[0].remaining)
    const hbIncentiveLimit = parseFloat(hbIncentiveCoverages[1].limit)
    const hbIncentiveRemaining = parseFloat(hbIncentiveCoverages[1].remaining)

    // Get Target Billing Items
    const billingEr72 = claimsData.uat.majorMed.ha.er72.positive.ipdDischarge
    const billingItemsEr = billingEr72.billingInfo.billingItems
    const billingTotalEr = billingEr72.billingTotal

    const billingHbIncentive = claimsData.uat.majorMed.ha.hbIncentive.positive.hb
    const billingItemsHbIncentive = billingHbIncentive.billingInfo.billingItems
    const billingTotalHbIncentive = billingHbIncentive.billingTotal

    // Helper Function: Core Logic for Major Medical (HA)
    const applyCoverageLogic = (netAmountFloat, baseLimit) => {
      // Base Coverage
      const payableBase = Math.min(netAmountFloat, baseLimit)

      // Excess
      const exceededLimit = (netAmountFloat - payableBase).toFixed(2)

      console.log(
        `    > Item: Net ${netAmountFloat.toFixed(2)} -> Pay ${payableBase.toFixed(2)} -> Exceed ${exceededLimit}`
      )

      return {
        payableAmount: payableBase.toFixed(2),
        exceededLimit: exceededLimit
      }
    }

    const calculateBillingItemPerDay = (item, limitAmountRemaining, limitDayRemaining, baseForIncurred) => {
      const noOfDays = parseFloat(item.noOfDays)

      /// 1. Incurred Amount: (Limit * 1.2) * Days
      const incurredAmount = (baseForIncurred * 1.2 * noOfDays).toFixed(2)

      // 2. Discount: 10% of Incurred
      const discount = (parseFloat(incurredAmount) * 0.1).toFixed(2)

      // 3. Net Amount: Incurred - Discount
      const netAmount = (parseFloat(incurredAmount) - parseFloat(discount)).toFixed(2)
      const netAmountFloat = parseFloat(netAmount)

      // 4. Calculate Max Item Payable based on Day Limit
      let maxBasePayable = 0
      if (limitDayRemaining > 0) {
        maxBasePayable = limitAmountRemaining * noOfDays
      } else {
        maxBasePayable = 0
      }

      // 5. Apply Logic
      const result = applyCoverageLogic(netAmountFloat, maxBasePayable)

      // Update items
      item.incurredAmount = incurredAmount
      item.discount = discount
      item.netAmount = netAmount
      item.payableAmount = result.payableAmount
      item.exceededLimit = result.exceededLimit

      return { ...item }
    }

    const calculateBillingItemPerDis = (item, limitAmountRemaining, baseForIncurred) => {
      const incurredAmount = (baseForIncurred * 1.2).toFixed(2)
      const discount = (parseFloat(incurredAmount) * 0.1).toFixed(2)
      const netAmount = (parseFloat(incurredAmount) - parseFloat(discount)).toFixed(2)
      const netAmountFloat = parseFloat(netAmount)

      const maxBasePayable = limitAmountRemaining

      const result = applyCoverageLogic(netAmountFloat, maxBasePayable)

      item.incurredAmount = incurredAmount
      item.discount = discount
      item.netAmount = netAmount
      item.payableAmount = result.payableAmount
      item.exceededLimit = result.exceededLimit

      return { ...item }
    }

    // Execute Calculation
    console.log('✓ Updated billing items with Major Medical (HA) Logic')
    console.log(' ')

    // 1. ER Items
    if (claimType === 'er72Discharge') {
      if (billingItemsEr && billingItemsEr.length > 0) {
        if (billingItemsEr[0]) calculateBillingItemPerDis(billingItemsEr[0], er24HoursRemaining, er24HoursLimit)

        console.log(' ')
      }

      if (billingTotalEr && billingItemsEr.length > 0) {
        this.calculateBillingTotal(billingItemsEr, billingTotalEr)
      }
    }

    // 2. HB Incentive Items
    if (claimType === 'hbIncentive') {
      if (billingItemsHbIncentive && billingItemsHbIncentive.length > 0) {
        if (billingItemsHbIncentive[0])
          calculateBillingItemPerDay(
            billingItemsHbIncentive[0],
            hbIncentiveRemaining,
            hbIncentiveDayRemaining,
            hbIncentiveLimit
          )

        console.log(' ')
      }

      if (billingTotalHbIncentive && billingItemsHbIncentive.length > 0) {
        this.calculateBillingTotal(billingItemsHbIncentive, billingTotalHbIncentive)
      }
    }

    fs.writeFileSync(claimsPath, JSON.stringify(claimsData, null, 2), 'utf-8')
    console.log(' ')
    console.log('✓ Saved claims.json with Major Medical (HA) logic')
    console.log('--------------------------------------------')
  }

  async calculateBillingPa(claimType: 'paSurgeryDischarge' | 'paHolidayDischarge' | 'paGeneralDischarge' | 'hb') {
    // Define Paths
    const rootDir = process.cwd()
    const coveragesPath = path.join(rootDir, 'tests-e2e', 'configurations', 'claim-coverages-init.json')
    const claimsPath = path.join(rootDir, 'tests-e2e', 'configurations', 'claims.json')

    // Read JSON Files
    const coveragesData = JSON.parse(fs.readFileSync(coveragesPath, 'utf-8'))
    const claimsData = JSON.parse(fs.readFileSync(claimsPath, 'utf-8'))

    // Get Base Limits
    const paCoverages = coveragesData.policy.pa.PA
    const surgeryCarAccLimit = parseFloat(paCoverages[0].limit)
    const surgeryCarAccRemaining = parseFloat(paCoverages[0].remaining)
    const generalAccHolidayLimit = parseFloat(paCoverages[1].limit)
    const generalAccHolidayRemaining = parseFloat(paCoverages[1].remaining)
    const generalAccLimit = parseFloat(paCoverages[2].limit)
    const generalAccRemaining = parseFloat(paCoverages[2].remaining)

    const hbCoverages = coveragesData.policy.pa.HB
    const generalAccBenefitYearRemaining = parseFloat(hbCoverages[0].remaining)
    const generalAccBenefitLimit = parseFloat(hbCoverages[1].limit)
    const generalAccBenefitRemaining = parseFloat(hbCoverages[1].remaining)
    const generalAccBenefitDayRemaining = parseFloat(hbCoverages[2].remaining)

    // Get Target Billing Items
    const billingPaSurgery = claimsData.uat.pa.surgery.pa.positive.ipdDischarge
    const billingItemsPaSurgery = billingPaSurgery.billingInfo.billingItems
    const billingTotalPaSurgery = billingPaSurgery.billingTotal

    const billingPaHoliday = claimsData.uat.pa.holiday.pa.positive.ipdDischarge
    const billingItemsPaHoliday = billingPaHoliday.billingInfo.billingItems
    const billingTotalPaHoliday = billingPaHoliday.billingTotal

    const billingPaGeneral = claimsData.uat.pa.general.pa.positive.ipdDischarge
    const billingItemsPaGeneral = billingPaGeneral.billingInfo.billingItems
    const billingTotalPaGeneral = billingPaGeneral.billingTotal

    const billingHb = claimsData.uat.pa.holiday.hb.positive.hb
    const billingItemsHb = billingHb.billingInfo.billingItems
    const billingTotalHb = billingHb.billingTotal

    // Helper Function: Core Logic for PA Holiday
    const applyCoverageLogic = (netAmountFloat, baseLimit) => {
      let payable = Math.min(netAmountFloat, baseLimit)

      if (payable < 0) payable = 0

      const exceededLimit = (netAmountFloat - payable).toFixed(2)

      console.log(
        `    > Item: Net ${netAmountFloat.toFixed(2)} -> Pay ${payable.toFixed(2)} -> Exceed ${exceededLimit}`
      )

      return {
        payableAmount: payable.toFixed(2),
        exceededLimit: exceededLimit
      }
    }

    const calculateBillingItemPerDis = (item, limitAmountRemaining, baseForIncurred) => {
      // 1. Incurred Amount: (Limit * 1.2) * Days
      const incurredAmount = (baseForIncurred * 1.2).toFixed(2)

      // 2. Discount: 10% of Incurred
      const discount = (parseFloat(incurredAmount) * 0.1).toFixed(2)

      // 3. Net Amount: Incurred - Discount
      const netAmount = (parseFloat(incurredAmount) - parseFloat(discount)).toFixed(2)
      const netAmountFloat = parseFloat(netAmount)

      // 4. Max Item Payable based
      const maxItemPayable = limitAmountRemaining

      // 5. Apply Logic
      const result = applyCoverageLogic(netAmountFloat, maxItemPayable)

      // Update items
      item.incurredAmount = incurredAmount
      item.discount = discount
      item.netAmount = netAmount
      item.payableAmount = result.payableAmount
      item.exceededLimit = result.exceededLimit

      return { ...item }
    }

    const calculateBillingItemPerDayWithDisYear = (
      item,
      limitAmountRemaining,
      limitDayRemaining,
      limitYearRemaining,
      baseForIncurred
    ) => {
      const noOfDays = parseFloat(item.noOfDays)

      const incurredAmount = (baseForIncurred * 1.2 * noOfDays).toFixed(2)
      const discount = (parseFloat(incurredAmount) * 0.1).toFixed(2)
      const netAmount = (parseFloat(incurredAmount) - parseFloat(discount)).toFixed(2)
      const netAmountFloat = parseFloat(netAmount)

      let allowedDays = 0

      // Calculate Allowed Days based on Day & Year Limit
      if (limitDayRemaining > 0 && limitYearRemaining > 0) {
        allowedDays = Math.min(noOfDays, limitDayRemaining, limitYearRemaining)
      } else {
        allowedDays = 0
      }

      const maxBasePayable = limitAmountRemaining * allowedDays

      const result = applyCoverageLogic(netAmountFloat, maxBasePayable)

      item.incurredAmount = incurredAmount
      item.discount = discount
      item.netAmount = netAmount
      item.payableAmount = result.payableAmount
      item.exceededLimit = result.exceededLimit

      return { ...item }
    }

    // Execute Calculation
    console.log('✓ Updated billing items with PA Holiday Logic')
    console.log(' ')

    // 1. PA Surgery Items
    if (claimType === 'paSurgeryDischarge') {
      if (billingItemsPaSurgery && billingItemsPaSurgery.length > 0) {
        if (billingItemsPaSurgery[0])
          calculateBillingItemPerDis(billingItemsPaSurgery[0], surgeryCarAccRemaining, surgeryCarAccLimit)

        console.log('[PA Surgery]')
      }

      if (billingTotalPaSurgery && billingItemsPaSurgery.length > 0) {
        this.calculateBillingTotal(billingItemsPaSurgery, billingTotalPaSurgery)
      }
    }

    // 2. PA Holiday Items
    if (claimType === 'paHolidayDischarge') {
      if (billingItemsPaHoliday && billingItemsPaHoliday.length > 0) {
        if (billingItemsPaHoliday[0])
          calculateBillingItemPerDis(billingItemsPaHoliday[0], generalAccHolidayRemaining, generalAccHolidayLimit)

        console.log('[PA Holiday]')
      }

      if (billingTotalPaHoliday && billingItemsPaHoliday.length > 0) {
        this.calculateBillingTotal(billingItemsPaHoliday, billingTotalPaHoliday)
      }
    }

    // 3. PA General Items
    if (claimType === 'paGeneralDischarge') {
      if (billingItemsPaGeneral && billingItemsPaGeneral.length > 0) {
        if (billingItemsPaGeneral[0])
          calculateBillingItemPerDis(billingItemsPaGeneral[0], generalAccRemaining, generalAccLimit)

        console.log('[PA General]')
      }

      if (billingTotalPaGeneral && billingItemsPaGeneral.length > 0) {
        this.calculateBillingTotal(billingItemsPaGeneral, billingTotalPaGeneral)
      }
    }

    // 4. HB Items
    if (claimType === 'hb') {
      if (billingItemsHb && billingItemsHb.length > 0) {
        if (billingItemsHb[0])
          calculateBillingItemPerDayWithDisYear(
            billingItemsHb[0],
            generalAccBenefitRemaining,
            generalAccBenefitDayRemaining,
            generalAccBenefitYearRemaining,
            generalAccBenefitLimit
          )

        console.log('[PA HB]')
      }

      if (billingTotalHb && billingItemsHb.length > 0) {
        this.calculateBillingTotal(billingItemsHb, billingTotalHb)
      }
    }

    fs.writeFileSync(claimsPath, JSON.stringify(claimsData, null, 2), 'utf-8')
    console.log(' ')
    console.log('✓ Saved claims.json with PA logic')
    console.log('--------------------------------------------')
  }

  async uploadDocument(fileName: string) {
    await this.uploadDocumentsTabLocator.waitFor({ state: 'visible' })
    await this.uploadDocumentsTabLocator.click()

    await this.page.waitForTimeout(3000)

    await this.fileInputLocator.waitFor({ state: 'attached' })

    const filePath = path.join(process.cwd(), 'test-data', 'upload-data', fileName)
    await this.fileInputLocator.setInputFiles(filePath)

    const fileRow = this.page.getByText(fileName, { exact: false }).first()
    await expect(fileRow).toBeVisible({ timeout: 10000 })

    await this.page.waitForTimeout(5000)

    console.log(`✓ Uploaded ${fileName} successfully (Progress 100%)`)
  }

  async saveChangeClaim() {
    await this.saveBtnLocator.waitFor({ state: 'visible' })
    await this.saveBtnLocator.click()
    await this.saveChangesBtnLocator.waitFor({ state: 'visible' })
    await this.saveChangesBtnLocator.click()
  }

  async resubmitClaim() {
    await this.resubmitBtnLocator.waitFor({ state: 'visible' })
    await this.resubmitBtnLocator.click()
    await this.confirmResubmitBtnLocator.waitFor({ state: 'visible' })
    await this.confirmResubmitBtnLocator.click()

    // Handle Warning Popup (Optional)
    try {
      const warningDialog = this.page.locator('.MuiDialog-paper', {
        hasText: /Warning.*Visit date/s
      })

      await warningDialog.waitFor({ state: 'visible', timeout: 2000 })

      const submitBtn = warningDialog.getByRole('button', { name: /Submit|ส่งข้อมูล/ })
      await submitBtn.click()
    } catch (error) {}
  }

  async viewClaimDetail() {
    await this.viewDetailBtnLocator.waitFor({ state: 'visible' })
    await this.viewDetailBtnLocator.click()
    await this.page.waitForTimeout(1000)

    await expect(this.page).toHaveURL(/\/claim-management\/detail/i)
  }
}
