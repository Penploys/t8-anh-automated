import { Locator, expect } from '@playwright/test'
import { BasePage } from '../base-page'

export class ClaimManagementEditPage extends BasePage {
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

  async saveEditClaim() {
    await this.saveBtnLocator.click()
    await this.saveChangesBtnLocator.waitFor({ state: 'visible' })
    await this.saveChangesBtnLocator.click()
  }

  async viewClaimDetail() {
    await this.viewDetailBtnLocator.waitFor({ state: 'visible' })
    await this.viewDetailBtnLocator.click()

    await expect(this.page).toHaveURL(/\/claim-management\/detail/i)
  }
}
