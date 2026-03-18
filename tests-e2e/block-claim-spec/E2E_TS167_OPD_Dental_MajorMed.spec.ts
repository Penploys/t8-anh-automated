import { test } from '@fixtures/e2e-fixture'
import { E2EConfiguration } from '@services/configurations/e2e-configuration'
import { DateHelper } from '@utils/date-helper'
import * as fs from 'fs'
import * as path from 'path'

test.describe.configure({ mode: 'serial' })

// NOTE: OPD need batch claim
test.describe.skip('E2E_TS167_OPD_Dental_MajorMed', () => {
  let draftNumber: string
  // let claimNumber: string
  let baseUrl: any
  let policyData: any
  let claimInitData: any
  let userData: any
  let tabData: any
  let memberData: any
  let draftData: any
  let billingData: any
  // let pendingInfoData: any

  test.beforeAll(async () => {
    const config = new E2EConfiguration()

    baseUrl = config.appSetting.url.uat
    policyData = config.policyCoverages.policy.majorMed
    claimInitData = config.claimCoveragesinit.policy.majorMed
    userData = config.users.uat
    tabData = config.tabs
    memberData = config.members.memberMajorMed.ph
    // pendingInfoData = config.claims.uat.pendingInfo

    const positiveCase = config.claims.uat.majorMed.ph.dental.positive.opd
    draftData = positiveCase.draftInfo
    billingData = positiveCase.billingInfo

    // Calculate lossDate from memberEffectiveDate + 2 months (DD/MM/YYYY)
    if (memberData.lossDate === true) {
      const effectiveDateOnly = memberData.memberEffectiveDate.split(' ')[0]
      memberData.lossDate = DateHelper.addMonths(effectiveDateOnly, 2)
    }

    // draftData.admissionDate (true): pick date from memberEffectiveDate + 2 months (DD/MM/YYYY hh:mm)
    if (draftData.admissionDate === true) {
      const effectiveDateOnly = memberData.memberEffectiveDate.split(' ')[0]
      draftData.admissionDate = `${DateHelper.addMonths(effectiveDateOnly, 2)} 00:00`
    }

    // billingDate (true): pick date from admissionDate (DD/MM/YYYY)
    if (billingData.billingDate === true) {
      const baseDate = draftData.admissionDate
      const baseDateOnly = baseDate.split(' ')[0]
      billingData.billingDate = baseDateOnly
    }
  })

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
  })

  test.afterAll(async () => {
    // TODO: cancel claim
  })

  test('Validate coverage details and get remaining', async ({
    page,
    loginPage,
    memberPolicyPage,
    memberPolicyDetailPage,
    claimManagementCreatePage
  }) => {
    test.setTimeout(45000)

    await test.step('Login', async () => {
      await page.goto(baseUrl.surveyorLoginURL)
      await loginPage.submitLogin(userData.claimManagerUser.email, userData.claimManagerUser.password)
    })

    await test.step('Ensure language on the Member policy page', async () => {
      await memberPolicyPage.ensureLanguage()
    })

    await test.step('Search and select the policy on the Member policy page', async () => {
      await memberPolicyPage.memberSearch(memberData)
      await memberPolicyPage.selectPolicy(memberData)
    })

    await test.step('Validate tabs on the Policy overview page', async () => {
      await memberPolicyDetailPage.validateTabs(tabData.memberPolicyDetailTabs.surveyor)
    })

    await test.step('Validate coverage table on the Policy overview page', async () => {
      await memberPolicyDetailPage.getCoverageDetails('majorMed')
      await memberPolicyDetailPage.validateCoverageDetail(policyData, 'majorMed')
    })

    await test.step('Validate member information on the Policy overview page', async () => {
      await memberPolicyDetailPage.validateMemberInfo(memberData)
    })

    await test.step('Click the create claim button on the Policy overview page', async () => {
      await memberPolicyDetailPage.clickCreateClaim()
    })

    await test.step('Validate coverage table and get coverage remaining on the Create claim page', async () => {
      await claimManagementCreatePage.fillMainBenefitInformation(draftData)
      await claimManagementCreatePage.getClaimCoverageDetail('majorMed', 'OPD')
      await claimManagementCreatePage.validateClaimCoverageNotUsageRemainingDetail(claimInitData, 'majorMed', 'OPD')
    })

    await test.step('Logout', async () => {
      await claimManagementCreatePage.logout()
    })
  })

  test('E2E_TS167_OPD_Dental_MajorMed_@TC001 Provider can search and select policy', async ({
    page,
    loginPage,
    memberPolicyPage
  }) => {
    test.setTimeout(30000)

    await test.step('Login', async () => {
      await page.goto(baseUrl.hospitalLoginURL)
      await loginPage.submitLogin(userData.providerRegistrationUser.email, userData.providerRegistrationUser.password)
    })

    await test.step('Ensure language on the Member policy page', async () => {
      await memberPolicyPage.ensureLanguage()
    })

    await test.step('Validate search by name only on the Member policy page', async () => {
      await memberPolicyPage.MemberSearchByName(memberData)
      await memberPolicyPage.validateSearchResultsByName(memberData)
    })

    await test.step('Validate search by citizen ID only on the Member policy page', async () => {
      await memberPolicyPage.MemberSearchByCitizenId(memberData)
      await memberPolicyPage.validateSearchResultsByCitizenId(memberData)
    })

    await test.step('Search and select the policy on the Member policy page', async () => {
      await memberPolicyPage.memberSearch(memberData)
      await memberPolicyPage.selectPolicy(memberData)
    })
  })

  test('E2E_TS167_OPD_Dental_MajorMed_@TC002 Provider can draft claim', async ({
    page,
    loginPage,
    memberPolicyPage,
    memberPolicyDetailPage,
    claimManagementCreatePage,
    claimManagementDetailPage
  }) => {
    test.setTimeout(45000)

    await test.step('Login', async () => {
      await page.goto(baseUrl.hospitalLoginURL)
      await loginPage.submitLogin(userData.providerRegistrationUser.email, userData.providerRegistrationUser.password)
    })

    await test.step('Ensure language on the Member policy page', async () => {
      await memberPolicyPage.ensureLanguage()
    })

    await test.step('Search and select the policy on the Member policy page', async () => {
      await memberPolicyPage.memberSearch(memberData)
      await memberPolicyPage.selectPolicy(memberData)
    })

    await test.step('Validate tabs on the Policy overview page', async () => {
      await memberPolicyDetailPage.validateTabs(tabData.memberPolicyDetailTabs.hospital)
    })

    await test.step('Validate coverage table on the Policy overview page', async () => {
      await memberPolicyDetailPage.getHospitalCoverageDetails('majorMed')
      await memberPolicyDetailPage.validateHospitalCoverageDetail(policyData, 'majorMed')
    })

    await test.step('Validate member information on the Policy overview page', async () => {
      await memberPolicyDetailPage.validateMemberInfo(memberData)
    })

    await test.step('Click the create claim button on the Policy overview page', async () => {
      await memberPolicyDetailPage.clickCreateClaim()
    })

    await test.step('Fill data in the claim information on the Create claim page', async () => {
      await claimManagementCreatePage.fillMainBenefitInformation(draftData)
    })

    await test.step('Validate policy coverage on the Create claim page', async () => {
      await claimManagementCreatePage.getHospitalClaimCoverageDetail('majorMed', 'OPD')
      await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(
        claimInitData,
        'majorMed',
        'OPD'
      )
    })

    await test.step('Save draft claim on the Create claim page', async () => {
      await claimManagementCreatePage.saveDraftClaim()
      await claimManagementCreatePage.viewClaimDetail()
    })

    await test.step('Validate claim status on the Claim details page', async () => {
      await claimManagementDetailPage.validateClaimStatus('Draft')
    })

    await test.step('Validate draft claim details on the Claim details page', async () => {
      draftNumber = await claimManagementDetailPage.getDraftNumber()
      // BUG: UI don't show Claim information in Main benefit information tab
      // await claimManagementDetailPage.validateMainBenefitInformation(draftData)

      await claimManagementCreatePage.getHospitalClaimCoverageDetail('majorMed', 'OPD')
      await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(
        claimInitData,
        'majorMed',
        'OPD'
      )
    })

    await test.step('Print Eligibility Check Document', async () => {
      await claimManagementDetailPage.printEligibilityCheckDocument()
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('E2E_TS167_OPD_Dental_MajorMed_@TC003 Provider can submit claim', async ({
    page,
    loginPage,
    memberPolicyPage,
    claimManagementPage,
    claimManagementCreatePage,
    claimManagementDetailPage,
    claimManagementEditPage
  }) => {
    test.setTimeout(360000)

    await test.step('Login', async () => {
      await page.goto(baseUrl.hospitalLoginURL)
      await loginPage.submitLogin(userData.providerCashierOPDUser.email, userData.providerCashierOPDUser.password)
    })

    await test.step('Search and select claim on the Claim management page', async () => {
      await memberPolicyPage.ensureLanguage()
      await memberPolicyPage.claimManagement()
      await claimManagementPage.claimSearch(draftNumber)
      await claimManagementPage.selectClaim(memberData, draftNumber)
    })

    await test.step('Click edit claim on the Claim details page', async () => {
      await claimManagementDetailPage.clickEditClaim()
    })

    await test.step('Validate coverage claim on the Edit claim page', async () => {
      await claimManagementCreatePage.getHospitalClaimCoverageDetail('majorMed', 'OPD')
      await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(
        claimInitData,
        'majorMed',
        'OPD'
      )
    })

    await test.step('Fill data in the treatment information on the Edit claim page', async () => {
      const correctBillingDate = billingData.billingDate

      // FIXME: calculateBillingMajorMedPh
      // const coverageActual = claimInitData['OPD']
      await claimManagementEditPage.calculateBillingMajorMedPh('dentalOpd', 'claim_coverage_majorMed_OPD.json')

      const claimsPath = path.join(process.cwd(), 'tests-e2e', 'configurations', 'claims.json')
      const updatedClaimsData = JSON.parse(fs.readFileSync(claimsPath, 'utf-8'))

      billingData = updatedClaimsData.uat.majorMed.ph.dental.positive.opd.billingInfo
      billingData.billingDate = correctBillingDate

      await claimManagementEditPage.fillTreatmentInformation(billingData)
      await claimManagementEditPage.fillBillingDetailsHospitalOpd(billingData)
    })

    await test.step('Save edit claim on the Edit claim page', async () => {
      await claimManagementEditPage.saveChangeClaim()
      await claimManagementEditPage.viewClaimDetail()
    })

    await test.step('validate claim status on the Claim details page', async () => {
      await claimManagementDetailPage.validateClaimStatus('Draft')
    })

    await test.step('Validate draft claim details on the Claim details page', async () => {
      // BUG: UI displaying wrong appointment date (23:59 instead of 00:00)
      await claimManagementDetailPage.validateMainBenefitInformation(draftData)

      await claimManagementCreatePage.getHospitalClaimCoverageDetail('majorMed', 'OPD')
      await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(
        claimInitData,
        'majorMed',
        'OPD'
      )

      // BUG: UI display wrong bill submitter type (Hospital instead of Provider)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
    })

    await test.step('Submit claim on the Claim details page', async () => {
      await claimManagementDetailPage.submitClaim()
      await claimManagementDetailPage.viewClaimDetail()
    })

    await test.step('Validate claim status on the Claim details page', async () => {
      await claimManagementDetailPage.validateClaimStatus('Submitted')
    })

    await test.step('Validate submitted claim details on the Claim details page', async () => {
      // claimNumber = await claimManagementDetailPage.getClaimNumber()
      await claimManagementDetailPage.validateMainBenefitInformation(draftData)

      // FIXME: validateHospitalClaimCoverageDetail
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('majorMed', 'OPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageDetail(coverageActual, 'majorMed', 'OPD')

      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })
})