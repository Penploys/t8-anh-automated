import { Locator, expect } from '@playwright/test'
import { BasePage } from '../base-page'
import fs from 'fs'
import path from 'path'
import { validateBenefitSection, validateHospitalBenefitSection } from '../../helpers/coverage-validator'

export class MemberPolicyDetailPage extends BasePage {
  // Tabs Locators
  readonly coverageInfoBtnLocator: Locator = this.page
    .getByRole('tab')
    .filter({ hasText: /Coverage information|ข้อมูลความคุ้มครอง/ })
  readonly claimsHistoryBtnLocator: Locator = this.page
    .getByRole('tab')
    .filter({ hasText: /Claim history|ประวัติการเคลม/ })
  readonly memberInfoBtnLocator: Locator = this.page.getByRole('tab').filter({ hasText: /Member information/ })
  readonly memoBtnLocator: Locator = this.page.getByRole('tab').filter({ hasText: /Memo/ })
  readonly incidentBtnLocator: Locator = this.page.getByRole('tab').filter({ hasText: /Incident/ })
  readonly exclusionBtnLocator: Locator = this.page.getByRole('tab').filter({ hasText: /Exclusion/ })
  readonly fileAttachmentsBtnLocator: Locator = this.page.getByRole('tab').filter({ hasText: /File attachments/ })
  readonly medicalRecordBtnLocator: Locator = this.page.getByRole('tab').filter({ hasText: /Medical record/ })
  readonly endorsementBtnLocator: Locator = this.page.getByRole('tab').filter({ hasText: /Endorsement/ })
  readonly simBCodeBtnLocator: Locator = this.page.getByRole('tab').filter({ hasText: /SIM-B code/ })

  // Member Information Locators
  readonly policyStatusLocator: Locator = this.page
    .locator('div', { hasText: /^Policy status|สถานะกรมธรรม์/ })
    .locator('.MuiBox-root')
    .first()
  readonly firstNameTHLocator: Locator = this.page
    .locator('p', { hasText: /First & Middle name \(Thai\)|ชื่อ \/ ชื่อกลาง \(ภาษาไทย\)/ })
    .locator('+ p')
    .first()
  readonly lastNameTHLocator: Locator = this.page
    .locator('p', { hasText: /Last name \(Thai\)|นามสกุล \(ภาษาไทย\)/ })
    .locator('+ p')
    .first()
  readonly firstNameENLocator: Locator = this.page
    .locator('p', { hasText: /First & Middle name \(English\)|ชื่อ \/ ชื่อกลาง \(ภาษาอังกฤษ\)/ })
    .locator('+ p')
    .first()
  readonly lastNameENLocator: Locator = this.page
    .locator('p', { hasText: /Last name \(English\)|นามสกุล \(ภาษาอังกฤษ\)/ })
    .locator('+ p')
    .first()
  readonly citizenIDLocator: Locator = this.page
    .locator('p', { hasText: /Citizen ID \/ Passport|เลขประจำตัวประชาชน \/ หนังสือเดินทาง/ })
    .locator('~ div')
    .first()
  readonly dateOfBirthLocator: Locator = this.page
    .locator('p', { hasText: /Date of birth|วันเดือนปีเกิด/ })
    .locator('+ p')
    .first()
  readonly genderLocator: Locator = this.page
    .locator('p', { hasText: /Gender|เพศ/ })
    .locator('+ p')
    .first()
  readonly phoneNumberLocator: Locator = this.page
    .locator('p', { hasText: /Phone number|หมายเลขโทรศัพท์มือถือ/ })
    .locator('+ p')
    .first()
  readonly emailLocator: Locator = this.page
    .locator('p', { hasText: /Email|อีเมล/ })
    .locator('+ p')
    .first()
  readonly memberEffectiveDateLocator: Locator = this.page
    .locator('p', { hasText: /Member effective date|วันที่เริ่มต้นกรมธรรม์/ })
    .locator('+ p')
    .first()
  readonly memberExpiryDateLocator: Locator = this.page
    .locator('p', { hasText: /Member expiry date|วันที่สิ้นสุดความคุ้มครอง/ })
    .locator('+ p')
    .first()
  readonly policyNumberLocator: Locator = this.page
    .locator('p', { hasText: /Policy number|หมายเลขกรมธรรม์/ })
    .locator('+ p')
    .first()
  readonly subClassLocator: Locator = this.page
    .locator('p', { hasText: /Sub class|คลาสย่อย/ })
    .locator('+ p')
    .first()
  readonly policyEffectiveDateLocator: Locator = this.page
    .locator('p', { hasText: /Policy effective date|วันที่เริ่มต้นกรมธรรม์/ })
    .locator('+ p')
    .first()
  readonly policyExpiryDateLocator: Locator = this.page
    .locator('p', { hasText: /Policy expiry date|วันที่สิ้นสุดกรมธรรม์/ })
    .locator('+ p')
    .first()
  readonly policyHolderLocator: Locator = this.page
    .locator('p', { hasText: /Policy holder|ชื่อบริษัท/ })
    .locator('+ p')
    .first()
  readonly cardNoLocator: Locator = this.page
    .locator('p', { hasText: /Card no.|เลขที่การ์ด/ })
    .locator('+ p')
    .first()
  readonly referencePolicyNo1Locator: Locator = this.page
    .locator('p', { hasText: /Reference policy no. 1/ })
    .locator('+ p')
    .first()
  readonly referencePolicyNo2Locator: Locator = this.page
    .locator('p', { hasText: /Reference policy no. 2/ })
    .locator('+ p')
    .first()
  readonly referencePolicyNo3Locator: Locator = this.page
    .locator('p', { hasText: /Reference policy no. 3/ })
    .locator('+ p')
    .first()
  readonly referencePolicyNo4Locator: Locator = this.page
    .locator('p', { hasText: /Reference policy no. 4/ })
    .locator('+ p')
    .first()
  readonly referencePolicyNo5Locator: Locator = this.page
    .locator('p', { hasText: /Reference policy no. 5/ })
    .locator('+ p')
    .first()

  // Create Claim Button Locators
  readonly createClaimBtnLocator: Locator = this.page.getByRole('button', {
    name: /\+.*(Create claim|Create claim and Eligibility Check Document|สร้างรายการเคลม)/
  })

  // Header Table
  readonly headerTableLocator = this.page
    .locator('section, div')
    .filter({ hasText: 'Coverage details' })
    .locator('h6')
    .filter({ hasText: /OTH|DEDUCTIBLE|IPD|OPD_Follow_IPD|OPD|ER|PA|HB|HB Incentive/ })

  async validateTabs(tabsData: {
    coverageInfo: boolean
    claimsHistory: boolean
    memberInformation: boolean
    memo: boolean
    incident: boolean
    exclusion: boolean
    fileAttachments: boolean
    medicalRecords: boolean
    endorsement: boolean
    simBCode: boolean
  }) {
    // Map tab names to their locators and visibility status
    const tabMappings: Record<string, { locator: Locator; isVisible: boolean }> = {
      coverageInfo: { locator: this.coverageInfoBtnLocator, isVisible: tabsData.coverageInfo },
      claimsHistory: { locator: this.claimsHistoryBtnLocator, isVisible: tabsData.claimsHistory },
      memberInformation: { locator: this.memberInfoBtnLocator, isVisible: tabsData.memberInformation },
      memo: { locator: this.memoBtnLocator, isVisible: tabsData.memo },
      incident: { locator: this.incidentBtnLocator, isVisible: tabsData.incident },
      exclusion: { locator: this.exclusionBtnLocator, isVisible: tabsData.exclusion },
      fileAttachments: { locator: this.fileAttachmentsBtnLocator, isVisible: tabsData.fileAttachments },
      medicalRecords: { locator: this.medicalRecordBtnLocator, isVisible: tabsData.medicalRecords },
      endorsement: { locator: this.endorsementBtnLocator, isVisible: tabsData.endorsement },
      simBCode: { locator: this.simBCodeBtnLocator, isVisible: tabsData.simBCode }
    }

    await this.page.waitForTimeout(1000)

    // Validate each tab's visibility
    for (const tabInfo of Object.values(tabMappings)) {
      if (tabInfo.isVisible) {
        await expect(tabInfo.locator).toBeVisible()
      } else {
        await expect(tabInfo.locator).toBeHidden()
      }
    }
  }

  async validateMemberInfo(memberData: {
    policyStatus?: string
    nameTh?: string
    surnameTh?: string
    nameEn?: string
    surnameEn?: string
    citizenId?: string
    dateOfBirth?: string
    gender?: string
    phoneNumber?: string
    email?: string
    memberEffectiveDate?: string
    memberExpiryDate?: string
    policyNumber: string
    subClass?: string
    policyEffectiveDate?: string
    policyExpiryDate?: string
    policyHolder?: string
    cardNo?: string
    referencePolicyNo1?: string
    referencePolicyNo2?: string
    referencePolicyNo3?: string
    referencePolicyNo4?: string
    referencePolicyNo5?: string
  }) {
    await this.memberInfoBtnLocator.waitFor({ state: 'visible' })
    await this.memberInfoBtnLocator.click()

    await this.policyStatusLocator.waitFor({ state: 'visible' })

    // Validate Policy Status
    if (memberData.policyStatus) {
      await expect(this.policyStatusLocator).toContainText(memberData.policyStatus)
    } else {
      await expect(this.policyStatusLocator).toContainText('-')
    }

    // Validate First & Middle name (Thai)
    if (memberData.nameTh) {
      await expect(this.firstNameTHLocator).toHaveText(memberData.nameTh)
    } else {
      await expect(this.firstNameTHLocator).toHaveText('-')
    }

    // Validate Last name (Thai)
    if (memberData.surnameTh) {
      await expect(this.lastNameTHLocator).toHaveText(memberData.surnameTh)
    } else {
      await expect(this.lastNameTHLocator).toHaveText('-')
    }

    // Validate First & Middle name (English)
    if (memberData.nameEn) {
      await expect(this.firstNameENLocator).toHaveText(memberData.nameEn)
    } else {
      await expect(this.firstNameENLocator).toHaveText('-')
    }

    // Validate Last name (English)
    if (memberData.surnameEn) {
      await expect(this.lastNameENLocator).toHaveText(memberData.surnameEn)
    } else {
      await expect(this.lastNameENLocator).toHaveText('-')
    }

    // Validate Citizen ID / Passport
    if (memberData.citizenId) {
      await expect(this.citizenIDLocator).toHaveText(memberData.citizenId)
    } else {
      await expect(this.citizenIDLocator).toHaveText('-')
    }

    // Validate Date of birth
    if (memberData.dateOfBirth) {
      await expect(this.dateOfBirthLocator).toHaveText(memberData.dateOfBirth)
    } else {
      await expect(this.dateOfBirthLocator).toHaveText('-')
    }

    // Validate Gender
    if (memberData.gender) {
      await expect(this.genderLocator).toHaveText(memberData.gender)
    } else {
      await expect(this.genderLocator).toHaveText('-')
    }

    // Validate Phone number
    if (memberData.phoneNumber) {
      await expect(this.phoneNumberLocator).toHaveText(memberData.phoneNumber)
    } else {
      await expect(this.phoneNumberLocator).toHaveText('-')
    }

    // Validate Email
    if (memberData.email) {
      await expect(this.emailLocator).toHaveText(memberData.email)
    } else {
      await expect(this.emailLocator).toHaveText('-')
    }

    // Validate Member effective date
    if (memberData.memberEffectiveDate) {
      await expect(this.memberEffectiveDateLocator).toHaveText(memberData.memberEffectiveDate)
    } else {
      await expect(this.memberEffectiveDateLocator).toHaveText('-')
    }

    // Validate Member expiry date
    if (memberData.memberExpiryDate) {
      await expect(this.memberExpiryDateLocator).toHaveText(memberData.memberExpiryDate)
    } else {
      await expect(this.memberExpiryDateLocator).toHaveText('-')
    }

    // Validate Policy number
    if (memberData.policyNumber) {
      await expect(this.policyNumberLocator).toHaveText(memberData.policyNumber)
    } else {
      await expect(this.policyNumberLocator).toHaveText('-')
    }

    // Validate Sub class
    if (memberData.subClass) {
      await expect(this.subClassLocator).toHaveText(memberData.subClass)
    } else {
      await expect(this.subClassLocator).toHaveText('-')
    }

    // Validate Policy effective date
    if (memberData.policyEffectiveDate) {
      await expect(this.policyEffectiveDateLocator).toHaveText(memberData.policyEffectiveDate)
    } else {
      await expect(this.policyEffectiveDateLocator).toHaveText('-')
    }

    // Validate Policy expiry date
    if (memberData.policyExpiryDate) {
      await expect(this.policyExpiryDateLocator).toHaveText(memberData.policyExpiryDate)
    } else {
      await expect(this.policyExpiryDateLocator).toHaveText('-')
    }

    // Validate Policy holder
    if (memberData.policyHolder) {
      await expect(this.policyHolderLocator).toHaveText(memberData.policyHolder)
    } else {
      await expect(this.policyHolderLocator).toHaveText('-')
    }

    // Validate Card no.
    if (memberData.cardNo) {
      await expect(this.cardNoLocator).toHaveText(memberData.cardNo)
    } else {
      await expect(this.cardNoLocator).toHaveText('-')
    }

    // Validate Reference policy no. 1
    if (memberData.referencePolicyNo1) {
      await expect(this.referencePolicyNo1Locator).toHaveText(memberData.referencePolicyNo1)
    } else {
      await expect(this.referencePolicyNo1Locator).toHaveText('-')
    }

    // Validate Reference policy no. 2
    if (memberData.referencePolicyNo2) {
      await expect(this.referencePolicyNo2Locator).toHaveText(memberData.referencePolicyNo2)
    } else {
      await expect(this.referencePolicyNo2Locator).toHaveText('-')
    }

    // Validate Reference policy no. 3
    if (memberData.referencePolicyNo3) {
      await expect(this.referencePolicyNo3Locator).toHaveText(memberData.referencePolicyNo3)
    } else {
      await expect(this.referencePolicyNo3Locator).toHaveText('-')
    }

    // Validate Reference policy no. 4
    if (memberData.referencePolicyNo4) {
      await expect(this.referencePolicyNo4Locator).toHaveText(memberData.referencePolicyNo4)
    } else {
      await expect(this.referencePolicyNo4Locator).toHaveText('-')
    }

    // Validate Reference policy no. 5
    if (memberData.referencePolicyNo5) {
      await expect(this.referencePolicyNo5Locator).toHaveText(memberData.referencePolicyNo5)
    } else {
      await expect(this.referencePolicyNo5Locator).toHaveText('-')
    }
  }

  async clickCreateClaim() {
    await this.createClaimBtnLocator.click()

    await expect(this.page).toHaveURL(/\/claim-management\/create/i)
  }

  async extractCoverageTable(sectionName: string) {
    const clean = async (cell: Locator) => (await cell.innerText()).replace(/\s+/g, ' ').trim()

    const table = this.page.locator(
      `//h6[normalize-space()='${sectionName}']/following::table[1]`
    )

    const rows = table.locator('tbody > tr')

    let previousMainGroup = ''
    let previousSubBenefit = ''
    let previousCombinedSub = ''
    let previousCombined = ''

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
      let combinedSub: string | null = null
      let combined: string | null = null

      if (valueCount >= 1) {
        limit = await clean(valueCells.nth(0))
      }

      if (valueCount === 3) {
        combinedSub = await clean(valueCells.nth(1))
        combined = await clean(valueCells.nth(2))
      }

      if (valueCount === 2) {
        combined = await clean(valueCells.nth(1))
      }

      // ---------- carry forward ----------
      if (combinedSub) previousCombinedSub = combinedSub
      else combinedSub = previousCombinedSub

      if (combined) previousCombined = combined
      else combined = previousCombined

      console.log({ mainGroup, subBenefit, limit, combinedSub, combined })

      results.push({
        mainGroup,
        subBenefit,
        limit,
        combinedSub,
        combined
      })
    }

    return results
  }

  async extractHospitalCoverageTable(sectionName: string) {
    const clean = async (cell: Locator) => (await cell.innerText()).replace(/\s+/g, ' ').trim()

    const table = this.page.locator(
      `//h6[normalize-space()='${sectionName}']/following::table[1]`
    )

    const rows = table.locator('tbody > tr')

    let previousMainGroup = ''
    let previousSubBenefit = ''

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

      if (valueCount >= 1) {
        limit = await clean(valueCells.nth(0))
      }

      results.push({
        mainGroup,
        subBenefit,
        limit
      })
    }

    return results
  }

  async getCoverageDetails(productName: string) {
    await this.page.waitForTimeout(3000)
    await this.headerTableLocator.first().waitFor({ state: 'visible', timeout: 10000 })

    const resultsOTH = await this.extractCoverageTable('OTH')
    const resultsDEDUCTIBLE = await this.extractCoverageTable('DEDUCTIBLE')
    const resultsIPD = await this.extractCoverageTable('IPD')
    const resultsOPD_Follow_IPD = await this.extractCoverageTable('OPD_Follow_IPD')
    const resultsOPD = await this.extractCoverageTable('OPD')
    const resultsER = await this.extractCoverageTable('ER')
    const resultsPA = await this.extractCoverageTable('PA')
    const resultsHB = await this.extractCoverageTable('HB')
    const resultsHBIncentive = await this.extractCoverageTable('HB Incentive')

    const data = {
      OTH: resultsOTH,
      DEDUCTIBLE: resultsDEDUCTIBLE,
      IPD: resultsIPD,
      OPD_Follow_IPD: resultsOPD_Follow_IPD,
      OPD: resultsOPD,
      ER: resultsER,
      PA: resultsPA,
      HB: resultsHB,
      HB_Incentive: resultsHBIncentive
    }
    const dirPath = path.resolve(process.cwd(), 'test-data', 'actual-data')
    const filePath = path.join(dirPath, `coverage_${productName}.json`)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
  }

  async getHospitalCoverageDetails(productName: string) {
    await this.page.waitForTimeout(3000)
    await this.headerTableLocator.first().waitFor({ state: 'visible', timeout: 10000 })

    const resultsOTH = await this.extractHospitalCoverageTable('OTH')
    const resultsDEDUCTIBLE = await this.extractHospitalCoverageTable('DEDUCTIBLE')
    const resultsIPD = await this.extractHospitalCoverageTable('IPD')
    const resultsOPD_Follow_IPD = await this.extractHospitalCoverageTable('OPD_Follow_IPD')
    const resultsOPD = await this.extractHospitalCoverageTable('OPD')
    const resultsER = await this.extractHospitalCoverageTable('ER')
    const resultsPA = await this.extractHospitalCoverageTable('PA')
    const resultsHB = await this.extractHospitalCoverageTable('HB')
    const resultsHBIncentive = await this.extractHospitalCoverageTable('HB Incentive')

    const data = {
      OTH: resultsOTH,
      DEDUCTIBLE: resultsDEDUCTIBLE,
      IPD: resultsIPD,
      OPD_Follow_IPD: resultsOPD_Follow_IPD,
      OPD: resultsOPD,
      ER: resultsER,
      PA: resultsPA,
      HB: resultsHB,
      HB_Incentive: resultsHBIncentive
    }
    const dirPath = path.resolve(process.cwd(), 'test-data', 'actual-data')
    const filePath = path.join(dirPath, `hospital_coverage_${productName}.json`)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
  }

  async validateCoverageDetail(policyData: any, productName: string) {
    await this.page.waitForTimeout(3000)
    const filePath = path.resolve(process.cwd(), 'test-data', 'actual-data', `coverage_${productName}.json`)
    const coverage = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

    validateBenefitSection(policyData.OTH, coverage.OTH)
    validateBenefitSection(policyData.DEDUCTIBLE, coverage.DEDUCTIBLE)
    validateBenefitSection(policyData.IPD, coverage.IPD)
    validateBenefitSection(policyData.OPD, coverage.OPD)
    validateBenefitSection(policyData.ER, coverage.ER)
    validateBenefitSection(policyData.OPD_Follow_IPD, coverage.OPD_Follow_IPD)
    validateBenefitSection(policyData.PA, coverage.PA)
    validateBenefitSection(policyData.HB, coverage.HB)
    validateBenefitSection(policyData.HB_Incentive, coverage.HB_Incentive)
  }

  async validateHospitalCoverageDetail(policyData: any, productName: string) {
    await this.page.waitForTimeout(3000)
    const filePath = path.resolve(process.cwd(), 'test-data', 'actual-data', `coverage_${productName}.json`)
    const coverage = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

    validateHospitalBenefitSection(policyData.OTH, coverage.OTH)
    validateHospitalBenefitSection(policyData.DEDUCTIBLE, coverage.DEDUCTIBLE)
    validateHospitalBenefitSection(policyData.IPD, coverage.IPD)
    validateHospitalBenefitSection(policyData.OPD, coverage.OPD)
    validateHospitalBenefitSection(policyData.ER, coverage.ER)
    validateHospitalBenefitSection(policyData.OPD_Follow_IPD, coverage.OPD_Follow_IPD)
    validateHospitalBenefitSection(policyData.PA, coverage.PA)
    validateHospitalBenefitSection(policyData.HB, coverage.HB)
    validateHospitalBenefitSection(policyData.HB_Incentive, coverage.HB_Incentive)
  }
}
