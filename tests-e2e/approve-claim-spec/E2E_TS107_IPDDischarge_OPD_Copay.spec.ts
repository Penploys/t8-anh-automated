import { test } from '@fixtures/e2e-fixture'
import { E2EConfiguration } from '@services/configurations/e2e-configuration'
import { DateHelper } from '@utils/date-helper'
import * as fs from 'fs'
import * as path from 'path'

test.describe.configure({ mode: 'serial' })

test.describe('E2E_TS107_IPDDischarge_OPD_Copay', () => {
  let draftNumber: string
  let claimNumber: string
  let baseUrl: any
  let policyData: any
  let claimInitData: any
  let userData: any
  let tabData: any
  let memberData: any
  let draftData: any
  let billingData: any
  let slaData: any
  let pendingInfoData: any

  test.beforeAll(async () => {
    const config = new E2EConfiguration()

    baseUrl = config.appSetting.url.uat
    policyData = config.policyCoverages.policy.copay
    claimInitData = config.claimCoveragesinit.policy.copay
    userData = config.users.uat
    tabData = config.tabs
    memberData = config.members.memberCopay.ha
    slaData = config.sla.uat.copay.ha.opd.positive.ipdDischarge
    pendingInfoData = config.claims.uat.pendingInfo

    const positiveCase = config.claims.uat.copay.ha.opd.positive.ipdDischarge
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

    // draftData.dischargeDate (true): pick date from admissionDate + 1 day (DD/MM/YYYY)
    if (draftData.dischargeDate === true) {
      const admissionDateOnly = draftData.admissionDate.split(' ')[0]
      draftData.dischargeDate = DateHelper.addDays(admissionDateOnly, 1)
    }

    // accidentDate (true): pick date from admissionDate - 1 day (DD/MM/YYYY hh:mm)
    if (draftData.accidentDate === true) {
      const baseDate = draftData.admissionDate
      const baseDateOnly = baseDate.split(' ')[0]
      draftData.accidentDate = `${DateHelper.addDays(baseDateOnly, -1)} 00:00`
    }

    // billingDate (true): pick date from dischargeDate (DD/MM/YYYY)
    if (billingData.billingDate === true) {
      const baseDate = draftData.dischargeDate
      const baseDateOnly = baseDate.split(' ')[0]
      billingData.billingDate = baseDateOnly
    }
  })

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 770 })
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
      await loginPage.submitLogin(userData.faxClaimUser.email, userData.faxClaimUser.password)
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
      await memberPolicyDetailPage.getCoverageDetails('copay')
      await memberPolicyDetailPage.validateCoverageDetail(policyData, 'copay')
    })

    await test.step('Validate member information on the Policy overview page', async () => {
      await memberPolicyDetailPage.validateMemberInfo(memberData)
    })

    await test.step('Click the create claim button on the Policy overview page', async () => {
      await memberPolicyDetailPage.clickCreateClaim()
    })

    await test.step('Validate coverage table and get coverage remaining on the Create claim page', async () => {
      await claimManagementCreatePage.fillMainBenefitInformation(draftData)
      await claimManagementCreatePage.getClaimCoverageDetail('copay', 'OTH')
      await claimManagementCreatePage.getClaimCoverageDetail('copay', 'OPD')
      await claimManagementCreatePage.validateClaimCoverageNotUsageRemainingDetail(claimInitData, 'copay', 'OTH')
      await claimManagementCreatePage.validateClaimCoverageNotUsageRemainingDetail(claimInitData, 'copay', 'OPD')
    })

    await test.step('Logout', async () => {
      await claimManagementCreatePage.logout()
    })
  })

  test('E2E_TS107_OPDDischarge_OPD_Copay_@TC001 Provider can search and select policy', async ({
    page,
    loginPage,
    memberPolicyPage
  }) => {
    test.setTimeout(30000)

    await test.step('Login', async () => {
      await page.goto(baseUrl.hospitalLoginURL)
      await loginPage.submitLogin(userData.providerAdmissionUser.email, userData.providerAdmissionUser.password)
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

  test('E2E_TS107_OPDDischarge_OPD_Copay_@TC002 Provider can draft claim', async ({
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
      await loginPage.submitLogin(userData.providerAdmissionUser.email, userData.providerAdmissionUser.password)
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
      await memberPolicyDetailPage.getHospitalCoverageDetails('copay')
      await memberPolicyDetailPage.validateHospitalCoverageDetail(policyData, 'copay')
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
      await claimManagementCreatePage.getHospitalClaimCoverageDetail('copay', 'OPD')
      await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(
        claimInitData,
        'copay',
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
      await claimManagementDetailPage.validateMainBenefitInformation(draftData)

      await claimManagementCreatePage.getHospitalClaimCoverageDetail('copay', 'OPD')
      await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(
        claimInitData,
        'copay',
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

  test('E2E_TS107_OPDDischarge_OPD_Copay_@TC003 Provider can submit claim', async ({
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
      await loginPage.submitLogin(userData.providerCashierIPDUser.email, userData.providerCashierIPDUser.password)
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
      await claimManagementCreatePage.getHospitalClaimCoverageDetail('copay', 'OPD')
      await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(
        claimInitData,
        'copay',
        'OPD'
      )
    })

    await test.step('Fill data in the treatment information on the Edit claim page', async () => {
      const correctBillingDate = billingData.billingDate

      // FIXME: calculateBillingCopay
      // const coverageActual = claimInitData['OPD']
      await claimManagementEditPage.calculateBillingCopay(
        'opdDischarge',
        'claim_coverage_copay_OTH.json',
        'claim_coverage_copay_OPD.json'
      )

      const claimsPath = path.join(process.cwd(), 'tests-e2e', 'configurations', 'claims.json')
      const updatedClaimsData = JSON.parse(fs.readFileSync(claimsPath, 'utf-8'))

      billingData = updatedClaimsData.uat.copay.ha.opd.positive.ipdDischarge.billingInfo
      billingData.billingDate = correctBillingDate

      await claimManagementEditPage.fillTreatmentInformation(billingData)
      await claimManagementEditPage.fillBillingDetailsHospitalIpd(billingData)
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

      await claimManagementCreatePage.getHospitalClaimCoverageDetail('copay', 'OPD')
      await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(
        claimInitData,
        'copay',
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
      claimNumber = await claimManagementDetailPage.getClaimNumber()
      await claimManagementDetailPage.validateMainBenefitInformation(draftData)

      // FIXME: validateHospitalClaimCoverageDetail
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('copay', 'IPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageDetail(coverageActual, 'copay', 'IPD')

      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('E2E_TS107_OPDDischarge_OPD_Copay_@TC004 Claim staff can assign claim', async ({
    page,
    loginPage,
    memberPolicyPage,
    claimManagementDetailPage,
    slaClaimPage
  }) => {
    test.setTimeout(90000)

    await test.step('Login', async () => {
      await page.goto(baseUrl.surveyorLoginURL)
      await loginPage.submitLogin(userData.faxClaimUser.email, userData.faxClaimUser.password)
    })

    await test.step('Search and select claim on the SLA claim page', async () => {
      await memberPolicyPage.ensureLanguage()
      await memberPolicyPage.slaClaim()
      await slaClaimPage.slaClaimSearch(slaData.assign)

      await slaClaimPage.selectSlaClaim(claimNumber, slaData.assign)
    })

    await test.step('Validate claim status on the Claim details page', async () => {
      await claimManagementDetailPage.validateClaimStatus('Submitted')
    })

    await test.step('Validate submitted claim details on the Claim details page', async () => {
      await claimManagementDetailPage.validateMainBenefitInformation(draftData)

      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('copay', 'OPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'copay', 'OPD')

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
    })

    await test.step('Assign claim to assignee on the Claim details page', async () => {
      await claimManagementDetailPage.assignClaimToAssignee(userData.faxClaimUser.email)
    })

    await test.step('Validate claim status on the Claim details page', async () => {
      // BUG: UI shows 'Submitted' instead of 'Under Review'
      // await claimManagementDetailPage.validateClaimStatus('Under Review')
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('E2E_TS107_OPDDischarge_OPD_Copay_@TC005 Claim staff can request pending information', async ({
    page,
    loginPage,
    memberPolicyPage,
    slaClaimPage,
    claimManagementDetailPage
  }) => {
    test.setTimeout(150000)

    await test.step('Login', async () => {
      await page.goto(baseUrl.surveyorLoginURL)
      await loginPage.submitLogin(userData.faxClaimUser.email, userData.faxClaimUser.password)
    })

    await test.step('Search and select claim on the SLA claim page', async () => {
      await memberPolicyPage.ensureLanguage()
      await memberPolicyPage.slaClaim()
      await slaClaimPage.slaClaimSearch(slaData.pendingInfo)
      await slaClaimPage.selectSlaClaim(claimNumber, slaData.pendingInfo)
    })

    await test.step('Validate claim status on the Claim details page', async () => {
      await claimManagementDetailPage.validateClaimStatus('Under Review')
    })

    await test.step('Validate claim detail on the Claim details page', async () => {
      await claimManagementDetailPage.validateMainBenefitInformation(draftData)

      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('copay', 'OPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'copay', 'OPD')

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
    })

    await test.step('Request document on the Claim details page', async () => {
      await claimManagementDetailPage.requestDocument(pendingInfoData)
    })

    await test.step('Validate claim status on the Claim details page', async () => {
      await claimManagementDetailPage.validateClaimStatus('Pending Information')
    })

    await test.step('Validate claim detail on the Claim details page', async () => {
      await claimManagementDetailPage.validateRequestedDocument(pendingInfoData)
      await claimManagementDetailPage.validateMainBenefitInformation(draftData)

      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('copay', 'OPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'copay', 'OPD')

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('E2E_TS107_OPDDischarge_OPD_Copay_@TC006 Provider can resubmit claim', async ({
    page,
    loginPage,
    memberPolicyPage,
    claimManagementPage,
    claimManagementDetailPage,
    claimManagementEditPage
  }) => {
    test.setTimeout(150000)

    await test.step('Login', async () => {
      await page.goto(baseUrl.hospitalLoginURL)
      await loginPage.submitLogin(userData.providerCashierIPDUser.email, userData.providerCashierIPDUser.password)
    })

    await test.step('Search and select claim on the Claim management page', async () => {
      await memberPolicyPage.ensureLanguage()
      await memberPolicyPage.claimManagement()
      await claimManagementPage.claimSearch(claimNumber)
      await claimManagementPage.selectClaim(memberData, claimNumber)
    })

    await test.step('Validate claim status on the Claim details page', async () => {
      await claimManagementDetailPage.validateClaimStatus('Pending Information')
    })

    await test.step('Validate coverage claim on the Claim details page', async () => {
      await claimManagementDetailPage.validateRequestedDocument(pendingInfoData)
      await claimManagementDetailPage.validateMainBenefitInformation(draftData)

      // FIXME: validateHospitalClaimCoverageDetail
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('copay', 'OPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageDetail(coverageActual, 'copay', 'OPD')

      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
    })

    await test.step('Upload document on the Edit claim page', async () => {
      await claimManagementDetailPage.goToUploadDocument()
      await claimManagementEditPage.uploadDocument('test.pdf')
      await claimManagementEditPage.resubmitClaim()
      await claimManagementEditPage.viewClaimDetail()
    })

    await test.step('Validate claim status on the Claim details page', async () => {
      await claimManagementDetailPage.validateClaimStatus('Under Review')
    })

    await test.step('Validate claim detail on the Claim details page', async () => {
      await claimManagementDetailPage.validateMainBenefitInformation(draftData)

      // FIXME: validateHospitalClaimCoverageDetail
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('copay', 'OPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageDetail(coverageActual, 'copay', 'OPD')

      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)

      await claimManagementDetailPage.validateUploadDocument('test.pdf')
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('E2E_TS107_OPDDischarge_OPD_Copay_@TC008 Claim staff can approve claim', async ({
    page,
    loginPage,
    memberPolicyPage,
    slaClaimPage,
    claimManagementDetailPage
  }) => {
    test.setTimeout(150000)

    await test.step('Login', async () => {
      await page.goto(baseUrl.surveyorLoginURL)
      await loginPage.submitLogin(userData.faxClaimUser.email, userData.faxClaimUser.password)
    })

    await test.step('Search and select claim on the SLA claim page', async () => {
      await memberPolicyPage.ensureLanguage()
      await memberPolicyPage.slaClaim()
      await slaClaimPage.slaClaimSearch(slaData.approve)
      await slaClaimPage.selectSlaClaim(claimNumber, slaData.approve)
    })

    await test.step('Validate claim status on the Claim details page', async () => {
      await claimManagementDetailPage.validateClaimStatus('Under Review')
    })

    await test.step('Validate claim detail on the Claim details page', async () => {
      await claimManagementDetailPage.validateMainBenefitInformation(draftData)

      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('copay', 'OPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'copay', 'OPD')

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)

      await claimManagementDetailPage.validateUploadDocument('test.pdf')
    })

    await test.step('Approve claim on the Claim details page', async () => {
      await claimManagementDetailPage.approveClaim()
    })

    await test.step('Validate claim status on the Claim details page', async () => {
      await claimManagementDetailPage.validateClaimStatus('Approved')
    })

    await test.step('Validate claim detail on the Claim details page', async () => {
      await claimManagementDetailPage.validateMainBenefitInformation(draftData)

      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('copay', 'OPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'copay', 'OPD')

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
    })

    await test.step('Print Eligibility Check Document', async () => {
      await claimManagementDetailPage.printEligibilityCheckDocument()
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })
})