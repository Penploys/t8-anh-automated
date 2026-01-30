import { test } from '@fixtures/e2e-fixture'
import { E2EConfiguration } from '@services/configurations/e2e-configuration'
import { DateHelper } from '@utils/date-helper'

test.describe.configure({ mode: 'serial' })

test.describe.skip('Test', () => {
  test('test randomBilling', async ({ claimManagementEditPage }) => {
    await test.step('test', async () => {
      // await claimManagementEditPage.calculateBillingCopay('ipdPreAuth', 'claim_coverage_copay_OTH.json', 'claim_coverage_copay_IPD.json')

      // Before draft edit
      // await claimManagementEditPage.calculateBillingSchedule('ipdDischarge', 'claim_coverage_schedule_IPD.json')
      // await claimManagementEditPage.calculateBillingSchedule('opdDischarge', 'claim_coverage_schedule_IPD.json', 'claim_coverage_schedule_OPD.json')
      // await claimManagementEditPage.calculateBillingSchedule('er72Discharge', 'claim_coverage_schedule_IPD.json', 'claim_coverage_schedule_ER.json')
      // Before schedule edit
      // await claimManagementEditPage.calculateBillingSchedule('ipdDischargeSchedule', 'claim_coverage_schedule_IPD.json')
      // await claimManagementEditPage.calculateBillingSchedule('opdDischargeSchedule', 'claim_coverage_schedule_IPD.json', 'claim_coverage_schedule_OPD.json')
      // await claimManagementEditPage.calculateBillingSchedule('er72DischargeSchedule', 'claim_coverage_schedule_IPD.json', 'claim_coverage_schedule_ER.json')

      // await claimManagementEditPage.calculateBillingCopay('ipdDischarge', 'claim_coverage_copay_OTH.json', 'claim_coverage_copay_IPD.json')
      // await claimManagementEditPage.calculateBillingCopay('opdDischarge', 'claim_coverage_copay_OTH.json', 'claim_coverage_copay_OPD.json')
      // await claimManagementEditPage.calculateBillingCopay('er24Discharge', 'claim_coverage_copay_OTH.json', 'claim_coverage_copay_ER.json')

      // TODO: test data
      // await claimManagementEditPage.calculateBillingDeductNotEr('ipdDischarge')
      // await claimManagementEditPage.calculateBillingDeductNotEr('opdDischarge')
      // await claimManagementEditPage.calculateBillingDeductNotEr('er24Discharge')
      // await claimManagementEditPage.calculateBillingDeductRoom('hb')

      await claimManagementEditPage.calculateBillingMajorMedPh('ipdDischarge', 'claim_coverage_majorMed_IPD.json')
      // await claimManagementEditPage.calculateBillingMajorMedPh('opdDischarge', 'claim_coverage_majorMed_OPD.json')
      // await claimManagementEditPage.calculateBillingMajorMedPh('maternityDischarge', 'claim_coverage_majorMed_IPD.json')
      // await claimManagementEditPage.calculateBillingMajorMedPh('er24Discharge', 'claim_coverage_majorMed_ER.json')
      // await claimManagementEditPage.calculateBillingMajorMedPh('dentalOpd', 'claim_coverage_majorMed_OPD.json')

      // TODO: test data
      // await claimManagementEditPage.calculateBillingMajorMedHa('er72Discharge')
      // BUG: cannot edit Cause of loss
      // await claimManagementEditPage.calculateBillingMajorMedHa('hbIncentive')

      // TODO: test data
      // await claimManagementEditPage.calculateBillingPa('paSurgeryDischarge')
      // await claimManagementEditPage.calculateBillingPa('paHolidayDischarge')
      // await claimManagementEditPage.calculateBillingPa('paGeneralDischarge')
      // await claimManagementEditPage.calculateBillingPa('hb')
    })
  })
})

// Pre-Auth: not show IPD coverage on create claim page (not deducted amount)
test.describe.skip('E2E_TS002_PreArrangement_IPD_Copay', () => {
  let draftNumber: string
  let claimNumber: string
  let baseUrl: any
  let policyData: any
  // let claimInitData: any
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
    // claimInitData = config.claimCoveragesinit.policy.copay
    userData = config.users.uat
    tabData = config.tabs
    memberData = config.members.memberCopay.ha
    slaData = config.sla.uat.copay.ha.ipd.positive.preArrangement
    pendingInfoData = config.claims.uat.pendingInfo

    const positiveCase = config.claims.uat.copay.ha.ipd.positive.preArrangement
    draftData = positiveCase.draftInfo
    billingData = positiveCase.billingInfo

    // Calculate lossDate from memberEffectiveDate + 2 months (DD/MM/YYYY)
    if (memberData.lossDate === true) {
      const effectiveDateOnly = memberData.memberEffectiveDate.split(' ')[0]
      memberData.lossDate = DateHelper.addMonths(effectiveDateOnly, 2)
    }

    // draftData.appointmentDate (true): pick current date (DD/MM/YYYY hh:mm)
    if (draftData.appointmentDate === true) {
      draftData.appointmentDate = `${DateHelper.getCurrentDate()} 00:00`
    }

    // accidentDate (true): pick date from appointmentDate - 1 day (DD/MM/YYYY hh:mm)
    if (draftData.accidentDate === true) {
      const baseDate = draftData.appointmentDate
      const baseDateOnly = baseDate.split(' ')[0]
      draftData.accidentDate = `${DateHelper.addDays(baseDateOnly, -1)} 00:00`
    }

    // billingDate (true): pick date from appointmentDate (DD/MM/YYYY)
    if (billingData.billingDate === true) {
      const baseDate = draftData.appointmentDate
      const baseDateOnly = baseDate.split(' ')[0]
      billingData.billingDate = baseDateOnly
    }

    // Temp: for test
    // draftNumber = 'DRAFT1768818938310'
    // claimNumber = 'PRE1768890143149'
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
    test.setTimeout(120000)

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
      // Surveyor
      // await memberPolicyDetailPage.getCoverageDetails('schedule')
      // await memberPolicyDetailPage.validateCoverageDetail(policyData, 'schedule')

      await memberPolicyDetailPage.getCoverageDetails('copay')
      await memberPolicyDetailPage.validateCoverageDetail(policyData, 'copay')

      // await memberPolicyDetailPage.getCoverageDetails('deduct')
      // await memberPolicyDetailPage.validateCoverageDetail(policyData, 'deduct')

      // await memberPolicyDetailPage.getCoverageDetails('majorMed')
      // await memberPolicyDetailPage.validateCoverageDetail(policyData, 'majorMed')

      // Hospital
      // await memberPolicyDetailPage.getHospitalCoverageDetails('copay')
      // await memberPolicyDetailPage.validateHospitalCoverageDetail(policyData, 'copay')
    })

    await test.step('Validate member information on the Policy overview page', async () => {
      await memberPolicyDetailPage.validateMemberInfo(memberData)
    })

    await test.step('Click the create claim button on the Policy overview page', async () => {
      await memberPolicyDetailPage.clickCreateClaim()
    })

    await test.step('Validate coverage table and get coverage remaining on the Create claim page', async () => {
      await claimManagementCreatePage.fillMainBenefitInformation(draftData)
      // Surveyor
      // await claimManagementCreatePage.getClaimCoverageDetail('copay', 'OTH')
      // await claimManagementCreatePage.getClaimCoverageDetail('copay', 'IPD')
      // await claimManagementCreatePage.validateClaimCoverageNotUsageRemainingDetail(claimInitData, 'copay', 'IPD')

      // Hospital
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('copay', 'IPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'copay', 'IPD')

      // ตัวอย่างการเรียกใช้ เพื่อทำ Expect result หลัง save claim
      // const coverageActual = claimInitData['IPD']

      // console.log(coverageActual.usage)
      // coverageActual[1].usage = 200000
      // coverageActual[1].remaining = 0

      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('copay', 'IPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageDetail(coverageActual, 'copay', 'IPD')
    })

    await test.step('Logout', async () => {
      await claimManagementCreatePage.logout()
    })
  })

  test('@E2E_TS002_PreArrangement_IPD_Copay_TC001 Provider can search and select policy', async ({
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

  test('@E2E_TS002_PreArrangement_IPD_Copay_TC002 Provider can draft claim', async ({
    page,
    loginPage,
    memberPolicyPage,
    memberPolicyDetailPage,
    claimManagementCreatePage,
    claimManagementDetailPage
  }) => {
    test.setTimeout(90000)

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
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('copay', 'IPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'copay', 'IPD')
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
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('copay', 'IPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'copay', 'IPD')
    })

    await test.step('Print Eligibility Check Document', async () => {
      await claimManagementDetailPage.printEligibilityCheckDocument()
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS002_PreArrangement_IPD_Copay_TC003 Provider can submit claim', async ({
    page,
    loginPage,
    memberPolicyPage,
    claimManagementPage,
    claimManagementDetailPage,
    claimManagementEditPage
  }) => {
    test.setTimeout(360000)

    await test.step('Login', async () => {
      await page.goto(baseUrl.hospitalLoginURL)
      await loginPage.submitLogin(userData.providerAdmissionUser.email, userData.providerAdmissionUser.password)
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

    await test.step('Fill data in the treatment information on the Edit claim page', async () => {
      // FIXME: calculateBillingCopay
      // const coverageActual = claimInitData['IPD']
      // NOTE: Pre-Auth not show IPD coverage
      await claimManagementEditPage.calculateBillingCopay(
        'ipdPreAuth',
        'claim_coverage_copay_OTH.json',
        'claim_coverage_copay_IPD.json'
      )
      await claimManagementEditPage.fillTreatmentInformation(billingData)
      await claimManagementEditPage.fillBillingDetailsHospitalIpd(billingData)
    })

    await test.step('Validate coverage claim on the Edit claim page', async () => {
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('copay', 'IPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'copay', 'IPD')
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

      // BUG: UI display wrong bill submitter type (Hospital instead of Provider)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('copay', 'IPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'copay', 'IPD')
    })

    await test.step('Submit claim on the Claim details page', async () => {
      await claimManagementDetailPage.submitClaim()
    })

    await test.step('Validate claim status on the Claim details page', async () => {
      await claimManagementDetailPage.validateClaimStatus('Submitted')
    })

    await test.step('Validate submitted claim details on the Claim details page', async () => {
      claimNumber = await claimManagementDetailPage.getClaimNumber()
      await claimManagementDetailPage.validateMainBenefitInformation(draftData)

      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('copay', 'IPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageDetail(coverageActual, 'copay', 'IPD')
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS002_PreArrangement_IPD_Copay_TC004 Claim staff can assign claim', async ({
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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getClaimCoverageDetail('copay', 'IPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'copay', 'IPD')
    })

    await test.step('Assign claim to assignee on the Claim details page', async () => {
      await claimManagementDetailPage.assignClaimToAssignee(userData.faxClaimUser.email)
    })

    await test.step('Validate claim status on the Claim details page', async () => {
      // BUG: UI shows "Submitted" instead of "Under Review"
      // await claimManagementDetailPage.validateClaimStatus('Under Review')
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS002_PreArrangement_IPD_Copay_TC005 Claim staff can request pending information', async ({
    page,
    loginPage,
    memberPolicyPage,
    slaClaimPage,
    claimManagementDetailPage
  }) => {
    test.setTimeout(120000)

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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getClaimCoverageDetail('copay', 'IPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'copay', 'IPD')
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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getClaimCoverageDetail('copay', 'IPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'copay', 'IPD')
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS002_PreArrangement_IPD_Copay_TC006 Provider can resubmit claim', async ({
    page,
    loginPage,
    memberPolicyPage,
    claimManagementPage,
    claimManagementDetailPage,
    claimManagementEditPage
  }) => {
    test.setTimeout(120000)

    await test.step('Login', async () => {
      await page.goto(baseUrl.hospitalLoginURL)
      await loginPage.submitLogin(userData.providerAdmissionUser.email, userData.providerAdmissionUser.password)
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

      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('copay', 'IPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageDetail(coverageActual, 'copay', 'IPD')
    })

    await test.step('Upload document on the Edit claim page', async () => {
      await claimManagementDetailPage.goToUploadDocument()
      await claimManagementEditPage.uploadDocument('test.pdf')
      await claimManagementEditPage.resubmitClaim()
      await claimManagementEditPage.viewClaimDetail()
    })

    await test.step('Validate claim status on the Claim details page', async () => {
      // BUG: UI shows "Submitted" instead of "Resubmitted"
      // await claimManagementDetailPage.validateClaimStatus('Resubmitted')
    })

    await test.step('Validate claim detail on the Claim details page', async () => {
      await claimManagementDetailPage.validateMainBenefitInformation(draftData)

      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('copay', 'IPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageDetail(coverageActual, 'copay', 'IPD')

      await claimManagementDetailPage.validateUploadDocument('test.pdf')
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS002_PreArrangement_IPD_Copay_TC007 Claim staff can authorize claim', async ({
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
      await slaClaimPage.slaClaimSearch(slaData.authorize)
      await slaClaimPage.selectSlaClaim(claimNumber, slaData.authorize)
    })

    await test.step('Validate claim status on the Claim details page', async () => {
      await claimManagementDetailPage.validateClaimStatus('Resubmitted')
    })

    await test.step('Validate claim detail on the Claim details page', async () => {
      await claimManagementDetailPage.validateMainBenefitInformation(draftData)

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getClaimCoverageDetail('copay', 'IPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'copay', 'IPD')

      await claimManagementDetailPage.validateUploadDocument('test.pdf')
    })

    await test.step('Authorize claim on the Claim details page', async () => {
      await claimManagementDetailPage.authorizeClaim()
    })

    await test.step('Validate claim status on the Claim details page', async () => {
      await claimManagementDetailPage.validateClaimStatus('Authorized')
    })

    await test.step('Validate claim detail on the Claim details page', async () => {
      await claimManagementDetailPage.validateMainBenefitInformation(draftData)

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getClaimCoverageDetail('copay', 'IPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'copay', 'IPD')
    })

    await test.step('Print Eligibility Check Document', async () => {
      await claimManagementDetailPage.printEligibilityCheckDocument()
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })
})

test.describe.skip('E2E_TS101_IPDDischarge_IPD_Schedule', () => {
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
    policyData = config.policyCoverages.policy.schedule
    claimInitData = config.claimCoveragesinit.policy.schedule
    userData = config.users.uat
    tabData = config.tabs
    memberData = config.members.memberSchedule.ph
    slaData = config.sla.uat.schedule.ph.ipd.positive.ipdDischarge
    pendingInfoData = config.claims.uat.pendingInfo

    const positiveCase = config.claims.uat.schedule.ph.ipd.positive.ipdDischarge
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

    // draftData.dischargeDate (true): pick date from admissionDate + 2 days (DD/MM/YYYY)
    if (draftData.dischargeDate === true) {
      const admissionDateOnly = draftData.admissionDate.split(' ')[0]
      draftData.dischargeDate = DateHelper.addDays(admissionDateOnly, 2)
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
    test.setTimeout(120000)

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
      await memberPolicyDetailPage.getCoverageDetails('schedule')
      await memberPolicyDetailPage.validateCoverageDetail(policyData, 'schedule')
    })

    await test.step('Validate member information on the Policy overview page', async () => {
      await memberPolicyDetailPage.validateMemberInfo(memberData)
    })

    await test.step('Click the create claim button on the Policy overview page', async () => {
      await memberPolicyDetailPage.clickCreateClaim()
    })

    await test.step('Validate coverage table and get coverage remaining on the Create claim page', async () => {
      await claimManagementCreatePage.fillMainBenefitInformation(draftData)
      await claimManagementCreatePage.getClaimCoverageDetail('schedule', 'IPD')
      await claimManagementCreatePage.validateClaimCoverageNotUsageRemainingDetail(claimInitData, 'schedule', 'IPD')
    })

    await test.step('Logout', async () => {
      await claimManagementCreatePage.logout()
    })
  })

  test('@E2E_TS101_IPDDischarge_IPD_Schedule_TC001 Provider can search and select policy', async ({
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

  test('@E2E_TS101_IPDDischarge_IPD_Schedule_TC002 Provider can draft claim', async ({
    page,
    loginPage,
    memberPolicyPage,
    memberPolicyDetailPage,
    claimManagementCreatePage,
    claimManagementDetailPage
  }) => {
    test.setTimeout(90000)

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
      await memberPolicyDetailPage.getHospitalCoverageDetails('schedule')
      await memberPolicyDetailPage.validateHospitalCoverageDetail(policyData, 'schedule')
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
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('schedule', 'IPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'schedule', 'IPD')
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
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('schedule', 'IPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'schedule', 'IPD')
    })

    await test.step('Print Eligibility Check Document', async () => {
      await claimManagementDetailPage.printEligibilityCheckDocument()
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS101_IPDDischarge_IPD_Schedule_TC003 Provider can submit claim', async ({
    page,
    loginPage,
    memberPolicyPage,
    claimManagementPage,
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

    await test.step('Fill data in the treatment information on the Edit claim page', async () => {
      // FIXME: calculateBillingSchedule
      // const coverageActual = claimInitData['IPD']
      await claimManagementEditPage.calculateBillingSchedule('ipdDischarge', 'claim_coverage_schedule_IPD.json')
      await claimManagementEditPage.fillTreatmentInformation(billingData)
      await claimManagementEditPage.fillBillingDetailsHospitalIpd(billingData)
    })

    await test.step('Validate coverage claim on the Edit claim page', async () => {
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('schedule', 'IPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'schedule', 'IPD')
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

      // BUG: UI display wrong bill submitter type (Hospital instead of Provider)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('schedule', 'IPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'schedule', 'IPD')
    })

    await test.step('Submit claim on the Claim details page', async () => {
      await claimManagementDetailPage.submitClaim()
    })

    await test.step('Validate claim status on the Claim details page', async () => {
      await claimManagementDetailPage.validateClaimStatus('Submitted')
    })

    await test.step('Validate submitted claim details on the Claim details page', async () => {
      claimNumber = await claimManagementDetailPage.getClaimNumber()
      await claimManagementDetailPage.validateMainBenefitInformation(draftData)

      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('schedule', 'IPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageDetail(coverageActual, 'schedule', 'IPD')
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS101_IPDDischarge_IPD_Schedule_TC004 Claim staff can assign claim', async ({
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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)

      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('schedule', 'IPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'schedule', 'IPD')
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

  test('@E2E_TS101_IPDDischarge_IPD_Schedule_TC005 Claim staff can request pending information', async ({
    page,
    loginPage,
    memberPolicyPage,
    slaClaimPage,
    claimManagementDetailPage
  }) => {
    test.setTimeout(120000)

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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)

      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('schedule', 'IPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'schedule', 'IPD')
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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)

      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('schedule', 'IPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'schedule', 'IPD')
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS101_IPDDischarge_IPD_Schedule_TC006 Provider can resubmit claim', async ({
    page,
    loginPage,
    memberPolicyPage,
    claimManagementPage,
    claimManagementDetailPage,
    claimManagementEditPage
  }) => {
    test.setTimeout(120000)

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

      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('schedule', 'IPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageDetail(coverageActual, 'schedule', 'IPD')
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

      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('schedule', 'IPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageDetail(coverageActual, 'schedule', 'IPD')

      await claimManagementDetailPage.validateUploadDocument('test.pdf')
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS101_IPDDischarge_IPD_Schedule_TC008 Claim staff can approve claim', async ({
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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('schedule', 'IPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'schedule', 'IPD')

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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('schedule', 'IPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'schedule', 'IPD')
    })

    await test.step('Print Eligibility Check Document', async () => {
      await claimManagementDetailPage.printEligibilityCheckDocument()
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })
})

test.describe.skip('E2E_TS102_IPDDischarge_IPD_Copay', () => {
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
    slaData = config.sla.uat.copay.ha.ipd.positive.ipdDischarge
    pendingInfoData = config.claims.uat.pendingInfo

    const positiveCase = config.claims.uat.copay.ha.ipd.positive.ipdDischarge
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

    // draftData.dischargeDate (true): pick date from admissionDate + 2 days (DD/MM/YYYY)
    if (draftData.dischargeDate === true) {
      const admissionDateOnly = draftData.admissionDate.split(' ')[0]
      draftData.dischargeDate = DateHelper.addDays(admissionDateOnly, 2)
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
    test.setTimeout(120000)

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
      await claimManagementCreatePage.getClaimCoverageDetail('copay', 'IPD')
      await claimManagementCreatePage.validateClaimCoverageNotUsageRemainingDetail(claimInitData, 'copay', 'IPD')
    })

    await test.step('Logout', async () => {
      await claimManagementCreatePage.logout()
    })
  })

  test('@E2E_TS102_IPDDischarge_IPD_Copay_TC001 Provider can search and select policy', async ({
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

  test('@E2E_TS102_IPDDischarge_IPD_Copay_TC002 Provider can draft claim', async ({
    page,
    loginPage,
    memberPolicyPage,
    memberPolicyDetailPage,
    claimManagementCreatePage,
    claimManagementDetailPage
  }) => {
    test.setTimeout(90000)

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
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('copay', 'IPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'copay', 'IPD')
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
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('copay', 'IPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'copay', 'IPD')
    })

    await test.step('Print Eligibility Check Document', async () => {
      await claimManagementDetailPage.printEligibilityCheckDocument()
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS102_IPDDischarge_IPD_Copay_TC003 Provider can submit claim', async ({
    page,
    loginPage,
    memberPolicyPage,
    claimManagementPage,
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

    await test.step('Fill data in the treatment information on the Edit claim page', async () => {
      // FIXME: calculateBillingCopay
      // const coverageActual = claimInitData['IPD']
      await claimManagementEditPage.calculateBillingCopay(
        'ipdDischarge',
        'claim_coverage_copay_OTH.json',
        'claim_coverage_copay_IPD.json'
      )
      await claimManagementEditPage.fillTreatmentInformation(billingData)
      await claimManagementEditPage.fillBillingDetailsHospitalIpd(billingData)
    })

    await test.step('Validate coverage claim on the Edit claim page', async () => {
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('copay', 'IPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'copay', 'IPD')
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

      // BUG: UI display wrong bill submitter type (Hospital instead of Provider)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('copay', 'IPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'copay', 'IPD')
    })

    await test.step('Submit claim on the Claim details page', async () => {
      await claimManagementDetailPage.submitClaim()
    })

    await test.step('Validate claim status on the Claim details page', async () => {
      await claimManagementDetailPage.validateClaimStatus('Submitted')
    })

    await test.step('Validate submitted claim details on the Claim details page', async () => {
      claimNumber = await claimManagementDetailPage.getClaimNumber()
      await claimManagementDetailPage.validateMainBenefitInformation(draftData)

      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('copay', 'IPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageDetail(coverageActual, 'copay', 'IPD')
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS102_IPDDischarge_IPD_Copay_TC004 Claim staff can assign claim', async ({
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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)

      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('copay', 'IPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'copay', 'IPD')
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

  test('@E2E_TS102_IPDDischarge_IPD_Copay_TC005 Claim staff can request pending information', async ({
    page,
    loginPage,
    memberPolicyPage,
    slaClaimPage,
    claimManagementDetailPage
  }) => {
    test.setTimeout(120000)

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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)

      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('copay', 'IPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'copay', 'IPD')
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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)

      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('copay', 'IPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'copay', 'IPD')
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS102_IPDDischarge_IPD_Copay_TC006 Provider can resubmit claim', async ({
    page,
    loginPage,
    memberPolicyPage,
    claimManagementPage,
    claimManagementDetailPage,
    claimManagementEditPage
  }) => {
    test.setTimeout(120000)

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

      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('copay', 'IPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageDetail(coverageActual, 'copay', 'IPD')
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

      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('copay', 'IPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageDetail(coverageActual, 'copay', 'IPD')

      await claimManagementDetailPage.validateUploadDocument('test.pdf')
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS102_IPDDischarge_IPD_Copay_TC008 Claim staff can approve claim', async ({
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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('copay', 'IPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'copay', 'IPD')

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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('copay', 'IPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'copay', 'IPD')
    })

    await test.step('Print Eligibility Check Document', async () => {
      await claimManagementDetailPage.printEligibilityCheckDocument()
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })
})

// BUG: Major medical calculation issue (Expected: Not include Room and Board)
test.describe.skip('E2E_TS104_IPDDischarge_IPD_MajorMed', () => {
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
    policyData = config.policyCoverages.policy.majorMed
    claimInitData = config.claimCoveragesinit.policy.majorMed
    userData = config.users.uat
    tabData = config.tabs
    memberData = config.members.memberMajorMed.ph
    slaData = config.sla.uat.majorMed.ph.ipd.positive.ipdDischarge
    pendingInfoData = config.claims.uat.pendingInfo

    const positiveCase = config.claims.uat.majorMed.ph.ipd.positive.ipdDischarge
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

    // draftData.dischargeDate (true): pick date from admissionDate + 2 days (DD/MM/YYYY)
    if (draftData.dischargeDate === true) {
      const admissionDateOnly = draftData.admissionDate.split(' ')[0]
      draftData.dischargeDate = DateHelper.addDays(admissionDateOnly, 2)
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
    test.setTimeout(120000)

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
      await claimManagementCreatePage.getClaimCoverageDetail('majorMed', 'IPD')
      await claimManagementCreatePage.validateClaimCoverageNotUsageRemainingDetail(claimInitData, 'majorMed', 'IPD')
    })

    await test.step('Logout', async () => {
      await claimManagementCreatePage.logout()
    })
  })

  test('@E2E_TS104_IPDDischarge_IPD_MajorMed_TC001 Provider can search and select policy', async ({
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

  test('@E2E_TS104_IPDDischarge_IPD_MajorMed_TC002 Provider can draft claim', async ({
    page,
    loginPage,
    memberPolicyPage,
    memberPolicyDetailPage,
    claimManagementCreatePage,
    claimManagementDetailPage
  }) => {
    test.setTimeout(90000)

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
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('majorMed', 'IPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'majorMed', 'IPD')
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
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('majorMed', 'IPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'majorMed', 'IPD')
    })

    await test.step('Print Eligibility Check Document', async () => {
      await claimManagementDetailPage.printEligibilityCheckDocument()
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS104_IPDDischarge_IPD_MajorMed_TC003 Provider can submit claim', async ({
    page,
    loginPage,
    memberPolicyPage,
    claimManagementPage,
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

    await test.step('Fill data in the treatment information on the Edit claim page', async () => {
      // FIXME: calculateBillingMajorMedPh
      // const coverageActual = claimInitData['IPD']
      await claimManagementEditPage.calculateBillingMajorMedPh('ipdDischarge', 'claim_coverage_majorMed_IPD.json')
      await claimManagementEditPage.fillTreatmentInformation(billingData)
      await claimManagementEditPage.fillBillingDetailsHospitalIpd(billingData)
    })

    await test.step('Validate coverage claim on the Edit claim page', async () => {
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('majorMed', 'IPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'majorMed', 'IPD')
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

      // BUG: UI display wrong bill submitter type (Hospital instead of Provider)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('majorMed', 'IPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'majorMed', 'IPD')
    })

    await test.step('Submit claim on the Claim details page', async () => {
      await claimManagementDetailPage.submitClaim()
    })

    await test.step('Validate claim status on the Claim details page', async () => {
      await claimManagementDetailPage.validateClaimStatus('Submitted')
    })

    await test.step('Validate submitted claim details on the Claim details page', async () => {
      claimNumber = await claimManagementDetailPage.getClaimNumber()
      await claimManagementDetailPage.validateMainBenefitInformation(draftData)

      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('majorMed', 'IPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageDetail(coverageActual, 'majorMed', 'IPD')
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS104_IPDDischarge_IPD_MajorMed_TC004 Claim staff can assign claim', async ({
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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)

      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('majorMed', 'IPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'majorMed', 'IPD')
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

  test('@E2E_TS104_IPDDischarge_IPD_MajorMed_TC005 Claim staff can request pending information', async ({
    page,
    loginPage,
    memberPolicyPage,
    slaClaimPage,
    claimManagementDetailPage
  }) => {
    test.setTimeout(120000)

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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)

      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('majorMed', 'IPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'majorMed', 'IPD')
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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)

      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('majorMed', 'IPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'majorMed', 'IPD')
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS104_IPDDischarge_IPD_MajorMed_TC006 Provider can resubmit claim', async ({
    page,
    loginPage,
    memberPolicyPage,
    claimManagementPage,
    claimManagementDetailPage,
    claimManagementEditPage
  }) => {
    test.setTimeout(120000)

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

      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('majorMed', 'IPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageDetail(coverageActual, 'majorMed', 'IPD')
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

      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('majorMed', 'IPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageDetail(coverageActual, 'majorMed', 'IPD')

      await claimManagementDetailPage.validateUploadDocument('test.pdf')
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS104_IPDDischarge_IPD_MajorMed_TC008 Claim staff can approve claim', async ({
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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('majorMed', 'IPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'majorMed', 'IPD')

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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('majorMed', 'IPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'majorMed', 'IPD')
    })

    await test.step('Print Eligibility Check Document', async () => {
      await claimManagementDetailPage.printEligibilityCheckDocument()
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })
})

/*
test.describe.skip('E2E_TS103_IPDDischarge_IPD_Deduct', () => {
  // let draftNumber: string
  // let claimNumber: string
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
    slaData = config.sla.uat.copay.ha.ipd.positive.ipdDischarge
    pendingInfoData = config.claims.uat.pendingInfo

    const positiveCase = config.claims.uat.copay.ha.ipd.positive.ipdDischarge
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

    // draftData.dischargeDate (true): pick date from admissionDate + 2 days (DD/MM/YYYY)
    if (draftData.dischargeDate === true) {
      const admissionDateOnly = draftData.admissionDate.split(' ')[0]
      draftData.dischargeDate = DateHelper.addDays(admissionDateOnly, 2)
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
    await page.setViewportSize({ width: 1920, height: 1080 })
  })

  test.afterAll(async () => {
    // TODO: cancel claim
  })
})
*/

test.describe.skip('E2E_TS106_IPDDischarge_OPD_Schedule', () => {
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
    policyData = config.policyCoverages.policy.schedule
    claimInitData = config.claimCoveragesinit.policy.schedule
    userData = config.users.uat
    tabData = config.tabs
    memberData = config.members.memberSchedule.ph
    slaData = config.sla.uat.schedule.ph.opd.positive.ipdDischarge
    pendingInfoData = config.claims.uat.pendingInfo

    const positiveCase = config.claims.uat.schedule.ph.opd.positive.ipdDischarge
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
    test.setTimeout(120000)

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
      await memberPolicyDetailPage.getCoverageDetails('schedule')
      await memberPolicyDetailPage.validateCoverageDetail(policyData, 'schedule')
    })

    await test.step('Validate member information on the Policy overview page', async () => {
      await memberPolicyDetailPage.validateMemberInfo(memberData)
    })

    await test.step('Click the create claim button on the Policy overview page', async () => {
      await memberPolicyDetailPage.clickCreateClaim()
    })

    await test.step('Validate coverage table and get coverage remaining on the Create claim page', async () => {
      await claimManagementCreatePage.fillMainBenefitInformation(draftData)
      await claimManagementCreatePage.getClaimCoverageDetail('schedule', 'IPD')
      await claimManagementCreatePage.getClaimCoverageDetail('schedule', 'OPD')
      await claimManagementCreatePage.validateClaimCoverageNotUsageRemainingDetail(claimInitData, 'schedule', 'OPD')
    })

    await test.step('Logout', async () => {
      await claimManagementCreatePage.logout()
    })
  })

  test('@E2E_TS106_IPDDischarge_OPD_Schedule_TC001 Provider can search and select policy', async ({
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

  test('@E2E_TS106_IPDDischarge_OPD_Schedule_TC002 Provider can draft claim', async ({
    page,
    loginPage,
    memberPolicyPage,
    memberPolicyDetailPage,
    claimManagementCreatePage,
    claimManagementDetailPage
  }) => {
    test.setTimeout(90000)

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
      await memberPolicyDetailPage.getHospitalCoverageDetails('schedule')
      await memberPolicyDetailPage.validateHospitalCoverageDetail(policyData, 'schedule')
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
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('schedule', 'OPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'schedule', 'OPD')
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
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('schedule', 'OPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'schedule', 'OPD')
    })

    await test.step('Print Eligibility Check Document', async () => {
      await claimManagementDetailPage.printEligibilityCheckDocument()
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS106_IPDDischarge_OPD_Schedule_TC003 Provider can submit claim', async ({
    page,
    loginPage,
    memberPolicyPage,
    claimManagementPage,
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

    await test.step('Fill data in the treatment information on the Edit claim page', async () => {
      // FIXME: calculateBillingSchedule
      // const coverageActual = claimInitData['OPD']
      await claimManagementEditPage.calculateBillingSchedule(
        'opdDischarge',
        'claim_coverage_schedule_IPD.json',
        'claim_coverage_schedule_OPD.json'
      )
      await claimManagementEditPage.fillTreatmentInformation(billingData)
      await claimManagementEditPage.fillBillingDetailsHospitalIpd(billingData)
    })

    await test.step('Validate coverage claim on the Edit claim page', async () => {
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('schedule', 'OPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'schedule', 'OPD')
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

      // BUG: UI display wrong bill submitter type (Hospital instead of Provider)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('schedule', 'OPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'schedule', 'OPD')
    })

    await test.step('Submit claim on the Claim details page', async () => {
      await claimManagementDetailPage.submitClaim()
    })

    await test.step('Validate claim status on the Claim details page', async () => {
      await claimManagementDetailPage.validateClaimStatus('Submitted')
    })

    await test.step('Validate submitted claim details on the Claim details page', async () => {
      claimNumber = await claimManagementDetailPage.getClaimNumber()
      await claimManagementDetailPage.validateMainBenefitInformation(draftData)

      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('schedule', 'OPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageDetail(coverageActual, 'schedule', 'OPD')
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS106_IPDDischarge_OPD_Schedule_TC004 Claim staff can assign claim', async ({
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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)

      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('schedule', 'OPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'schedule', 'OPD')
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

  test('@E2E_TS106_IPDDischarge_OPD_Schedule_TC005 Claim staff can request pending information', async ({
    page,
    loginPage,
    memberPolicyPage,
    slaClaimPage,
    claimManagementDetailPage
  }) => {
    test.setTimeout(120000)

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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)

      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('schedule', 'OPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'schedule', 'OPD')
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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)

      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('schedule', 'OPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'schedule', 'OPD')
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS106_IPDDischarge_OPD_Schedule_TC006 Provider can resubmit claim', async ({
    page,
    loginPage,
    memberPolicyPage,
    claimManagementPage,
    claimManagementDetailPage,
    claimManagementEditPage
  }) => {
    test.setTimeout(120000)

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

      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('schedule', 'OPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageDetail(coverageActual, 'schedule', 'OPD')
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

      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('schedule', 'OPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageDetail(coverageActual, 'schedule', 'OPD')

      await claimManagementDetailPage.validateUploadDocument('test.pdf')
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS106_IPDDischarge_OPD_Schedule_TC008 Claim staff can approve claim', async ({
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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('schedule', 'OPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'schedule', 'OPD')

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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('schedule', 'OPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'schedule', 'OPD')
    })

    await test.step('Print Eligibility Check Document', async () => {
      await claimManagementDetailPage.printEligibilityCheckDocument()
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })
})

test.describe.skip('E2E_TS107_IPDDischarge_OPD_Copay', () => {
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
    test.setTimeout(120000)

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
      await claimManagementCreatePage.validateClaimCoverageNotUsageRemainingDetail(claimInitData, 'copay', 'OPD')
    })

    await test.step('Logout', async () => {
      await claimManagementCreatePage.logout()
    })
  })

  test('@E2E_TS107_OPDDischarge_OPD_Copay_TC001 Provider can search and select policy', async ({
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

  test('@E2E_TS107_OPDDischarge_OPD_Copay_TC002 Provider can draft claim', async ({
    page,
    loginPage,
    memberPolicyPage,
    memberPolicyDetailPage,
    claimManagementCreatePage,
    claimManagementDetailPage
  }) => {
    test.setTimeout(90000)

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
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('copay', 'OPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'copay', 'OPD')
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
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('copay', 'OPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'copay', 'OPD')
    })

    await test.step('Print Eligibility Check Document', async () => {
      await claimManagementDetailPage.printEligibilityCheckDocument()
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS107_OPDDischarge_OPD_Copay_TC003 Provider can submit claim', async ({
    page,
    loginPage,
    memberPolicyPage,
    claimManagementPage,
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

    await test.step('Fill data in the treatment information on the Edit claim page', async () => {
      // FIXME: calculateBillingCopay
      // const coverageActual = claimInitData['OPD']
      await claimManagementEditPage.calculateBillingCopay(
        'opdDischarge',
        'claim',
        'claim_coverage_copay_OTH.json',
        'claim_coverage_copay_OPD.json'
      )
      await claimManagementEditPage.fillTreatmentInformation(billingData)
      await claimManagementEditPage.fillBillingDetailsHospitalIpd(billingData)
    })

    await test.step('Validate coverage claim on the Edit claim page', async () => {
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('copay', 'OPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'copay', 'OPD')
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

      // BUG: UI display wrong bill submitter type (Hospital instead of Provider)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('copay', 'OPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'copay', 'OPD')
    })

    await test.step('Submit claim on the Claim details page', async () => {
      await claimManagementDetailPage.submitClaim()
    })

    await test.step('Validate claim status on the Claim details page', async () => {
      await claimManagementDetailPage.validateClaimStatus('Submitted')
    })

    await test.step('Validate submitted claim details on the Claim details page', async () => {
      claimNumber = await claimManagementDetailPage.getClaimNumber()
      await claimManagementDetailPage.validateMainBenefitInformation(draftData)

      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('copay', 'IPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageDetail(coverageActual, 'copay', 'IPD')
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS107_OPDDischarge_OPD_Copay_TC004 Claim staff can assign claim', async ({
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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)

      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('copay', 'OPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'copay', 'OPD')
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

  test('@E2E_TS107_OPDDischarge_OPD_Copay_TC005 Claim staff can request pending information', async ({
    page,
    loginPage,
    memberPolicyPage,
    slaClaimPage,
    claimManagementDetailPage
  }) => {
    test.setTimeout(120000)

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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)

      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('copay', 'OPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'copay', 'OPD')
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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)

      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('copay', 'OPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'copay', 'OPD')
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS107_OPDDischarge_OPD_Copay_TC006 Provider can resubmit claim', async ({
    page,
    loginPage,
    memberPolicyPage,
    claimManagementPage,
    claimManagementDetailPage,
    claimManagementEditPage
  }) => {
    test.setTimeout(120000)

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

      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('copay', 'OPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageDetail(coverageActual, 'copay', 'OPD')
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

      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('copay', 'OPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageDetail(coverageActual, 'copay', 'OPD')

      await claimManagementDetailPage.validateUploadDocument('test.pdf')
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS107_OPDDischarge_OPD_Copay_TC008 Claim staff can approve claim', async ({
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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('copay', 'OPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'copay', 'OPD')

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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('copay', 'OPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'copay', 'OPD')
    })

    await test.step('Print Eligibility Check Document', async () => {
      await claimManagementDetailPage.printEligibilityCheckDocument()
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })
})

/*
test.describe.skip('E2E_TS108_IPDDischarge_OPD_Deduct', () => {
  // let draftNumber: string
  // let claimNumber: string
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
    slaData = config.sla.uat.copay.ha.ipd.positive.ipdDischarge
    pendingInfoData = config.claims.uat.pendingInfo

    const positiveCase = config.claims.uat.copay.ha.ipd.positive.ipdDischarge
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
    await page.setViewportSize({ width: 1920, height: 1080 })
  })

  test.afterAll(async () => {
    // TODO: cancel claim
  })
})
*/

test.describe.skip('E2E_TS109_IPDDischarge_OPD_MajorMed', () => {
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
    test.setTimeout(120000)

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

  test('@E2E_TS109_IPDDischarge_OPD_MajorMed_TC001 Provider can search and select policy', async ({
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

  test('@E2E_TS109_IPDDischarge_OPD_MajorMed_TC002 Provider can draft claim', async ({
    page,
    loginPage,
    memberPolicyPage,
    memberPolicyDetailPage,
    claimManagementCreatePage,
    claimManagementDetailPage
  }) => {
    test.setTimeout(90000)

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
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('majorMed', 'OPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'majorMed', 'OPD')
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
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('majorMed', 'OPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'majorMed', 'OPD')
    })

    await test.step('Print Eligibility Check Document', async () => {
      await claimManagementDetailPage.printEligibilityCheckDocument()
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS109_IPDDischarge_OPD_MajorMed_TC003 Provider can submit claim', async ({
    page,
    loginPage,
    memberPolicyPage,
    claimManagementPage,
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

    await test.step('Fill data in the treatment information on the Edit claim page', async () => {
      // FIXME: calculateBillingMajorMedPh
      // const coverageActual = claimInitData['OPD']
      await claimManagementEditPage.calculateBillingMajorMedPh('opdDischarge', 'claim_coverage_majorMed_OPD.json')
      await claimManagementEditPage.fillTreatmentInformation(billingData)
      await claimManagementEditPage.fillBillingDetailsHospitalIpd(billingData)
    })

    await test.step('Validate coverage claim on the Edit claim page', async () => {
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('majorMed', 'OPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'majorMed', 'OPD')
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

      // BUG: UI display wrong bill submitter type (Hospital instead of Provider)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('majorMed', 'OPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'majorMed', 'OPD')
    })

    await test.step('Submit claim on the Claim details page', async () => {
      await claimManagementDetailPage.submitClaim()
    })

    await test.step('Validate claim status on the Claim details page', async () => {
      await claimManagementDetailPage.validateClaimStatus('Submitted')
    })

    await test.step('Validate submitted claim details on the Claim details page', async () => {
      claimNumber = await claimManagementDetailPage.getClaimNumber()
      await claimManagementDetailPage.validateMainBenefitInformation(draftData)

      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('majorMed', 'OPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageDetail(coverageActual, 'majorMed', 'OPD')
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS109_IPDDischarge_OPD_MajorMed_TC004 Claim staff can assign claim', async ({
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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)

      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('majorMed', 'OPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'majorMed', 'OPD')
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

  test('@E2E_TS109_IPDDischarge_OPD_MajorMed_TC005 Claim staff can request pending information', async ({
    page,
    loginPage,
    memberPolicyPage,
    slaClaimPage,
    claimManagementDetailPage
  }) => {
    test.setTimeout(120000)

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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)

      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('majorMed', 'OPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'majorMed', 'OPD')
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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)

      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('majorMed', 'OPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'majorMed', 'OPD')
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS109_IPDDischarge_OPD_MajorMed_TC006 Provider can resubmit claim', async ({
    page,
    loginPage,
    memberPolicyPage,
    claimManagementPage,
    claimManagementDetailPage,
    claimManagementEditPage
  }) => {
    test.setTimeout(120000)

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

      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('majorMed', 'OPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageDetail(coverageActual, 'majorMed', 'OPD')
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

      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('majorMed', 'OPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageDetail(coverageActual, 'majorMed', 'OPD')

      await claimManagementDetailPage.validateUploadDocument('test.pdf')
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS109_IPDDischarge_OPD_MajorMed_TC008 Claim staff can approve claim', async ({
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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('majorMed', 'OPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'majorMed', 'OPD')

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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('majorMed', 'OPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'majorMed', 'OPD')
    })

    await test.step('Print Eligibility Check Document', async () => {
      await claimManagementDetailPage.printEligibilityCheckDocument()
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })
})

// BUG: Major medical calculation issue (Expected: Not include Maternity Coverage)
test.describe.skip('E2E_TS119_IPDDischarge_Maternity_MajorMed', () => {
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
    policyData = config.policyCoverages.policy.majorMed
    claimInitData = config.claimCoveragesinit.policy.majorMed
    userData = config.users.uat
    tabData = config.tabs
    memberData = config.members.memberMajorMed.ph
    slaData = config.sla.uat.majorMed.ph.maternity.positive.ipdDischarge
    pendingInfoData = config.claims.uat.pendingInfo

    const positiveCase = config.claims.uat.majorMed.ph.maternity.positive.ipdDischarge
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
    test.setTimeout(120000)

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
      await claimManagementCreatePage.getClaimCoverageDetail('majorMed', 'IPD')
      await claimManagementCreatePage.validateClaimCoverageNotUsageRemainingDetail(claimInitData, 'majorMed', 'IPD')
    })

    await test.step('Logout', async () => {
      await claimManagementCreatePage.logout()
    })
  })

  test('@E2E_TS119_IPDDischarge_Maternity_MajorMed_TC001 Provider can search and select policy', async ({
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

  test('@E2E_TS119_IPDDischarge_Maternity_MajorMed_TC002 Provider can draft claim', async ({
    page,
    loginPage,
    memberPolicyPage,
    memberPolicyDetailPage,
    claimManagementCreatePage,
    claimManagementDetailPage
  }) => {
    test.setTimeout(90000)

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
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('majorMed', 'IPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'majorMed', 'IPD')
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
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('majorMed', 'IPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'majorMed', 'IPD')
    })

    await test.step('Print Eligibility Check Document', async () => {
      await claimManagementDetailPage.printEligibilityCheckDocument()
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  // BUG:
  test('@E2E_TS119_IPDDischarge_Maternity_MajorMed_TC003 Provider can submit claim', async ({
    page,
    loginPage,
    memberPolicyPage,
    claimManagementPage,
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

    await test.step('Fill data in the treatment information on the Edit claim page', async () => {
      // FIXME: calculateBillingMajorMedPh
      // const coverageActual = claimInitData['IPD']
      await claimManagementEditPage.calculateBillingMajorMedPh('maternityDischarge', 'claim_coverage_majorMed_IPD.json')
      await claimManagementEditPage.fillTreatmentInformation(billingData)
      await claimManagementEditPage.fillBillingDetailsHospitalIpd(billingData)
    })

    await test.step('Validate coverage claim on the Edit claim page', async () => {
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('majorMed', 'IPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'majorMed', 'IPD')
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

      // BUG: UI display wrong bill submitter type (Hospital instead of Provider)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('majorMed', 'IPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'majorMed', 'IPD')
    })

    await test.step('Submit claim on the Claim details page', async () => {
      await claimManagementDetailPage.submitClaim()
    })

    await test.step('Validate claim status on the Claim details page', async () => {
      await claimManagementDetailPage.validateClaimStatus('Submitted')
    })

    await test.step('Validate submitted claim details on the Claim details page', async () => {
      claimNumber = await claimManagementDetailPage.getClaimNumber()
      await claimManagementDetailPage.validateMainBenefitInformation(draftData)

      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('majorMed', 'IPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageDetail(coverageActual, 'majorMed', 'IPD')
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS119_IPDDischarge_Maternity_MajorMed_TC004 Claim staff can assign claim', async ({
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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)

      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('majorMed', 'IPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'majorMed', 'IPD')
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

  test('@E2E_TS119_IPDDischarge_Maternity_MajorMed_TC005 Claim staff can request pending information', async ({
    page,
    loginPage,
    memberPolicyPage,
    slaClaimPage,
    claimManagementDetailPage
  }) => {
    test.setTimeout(120000)

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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)

      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('majorMed', 'IPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'majorMed', 'IPD')
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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)

      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('majorMed', 'IPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'majorMed', 'IPD')
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS119_IPDDischarge_Maternity_MajorMed_TC006 Provider can resubmit claim', async ({
    page,
    loginPage,
    memberPolicyPage,
    claimManagementPage,
    claimManagementDetailPage,
    claimManagementEditPage
  }) => {
    test.setTimeout(120000)

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

      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('majorMed', 'IPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageDetail(coverageActual, 'majorMed', 'IPD')
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

      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('majorMed', 'IPD')
      // await claimManagementCreatePage.validateHospitalClaimCoverageDetail(coverageActual, 'majorMed', 'IPD')

      await claimManagementDetailPage.validateUploadDocument('test.pdf')
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS119_IPDDischarge_Maternity_MajorMed_TC008 Claim staff can approve claim', async ({
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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('majorMed', 'IPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'majorMed', 'IPD')

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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('majorMed', 'IPD')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'majorMed', 'IPD')
    })

    await test.step('Print Eligibility Check Document', async () => {
      await claimManagementDetailPage.printEligibilityCheckDocument()
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })
})

test.describe.skip('E2E_TS122_IPDDischarge_ER24_Copay', () => {
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
    slaData = config.sla.uat.copay.ha.er24.positive.ipdDischarge
    pendingInfoData = config.claims.uat.pendingInfo

    const positiveCase = config.claims.uat.copay.ha.er24.positive.ipdDischarge
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
    test.setTimeout(120000)

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
      await claimManagementCreatePage.getClaimCoverageDetail('copay', 'ER')
      await claimManagementCreatePage.validateClaimCoverageNotUsageRemainingDetail(claimInitData, 'copay', 'ER')
    })

    await test.step('Logout', async () => {
      await claimManagementCreatePage.logout()
    })
  })

  test('@E2E_TS122_IPDDischarge_ER24_Copay_TC001 Provider can search and select policy', async ({
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

  test('@E2E_TS122_IPDDischarge_ER24_Copay_TC002 Provider can draft claim', async ({
    page,
    loginPage,
    memberPolicyPage,
    memberPolicyDetailPage,
    claimManagementCreatePage,
    claimManagementDetailPage
  }) => {
    test.setTimeout(90000)

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
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('copay', 'ER')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'copay', 'ER')
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
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('copay', 'ER')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'copay', 'ER')
    })

    await test.step('Print Eligibility Check Document', async () => {
      await claimManagementDetailPage.printEligibilityCheckDocument()
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS122_IPDDischarge_ER24_Copay_TC003 Provider can submit claim', async ({
    page,
    loginPage,
    memberPolicyPage,
    claimManagementPage,
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

    await test.step('Fill data in the treatment information on the Edit claim page', async () => {
      // FIXME: calculateBillingCopay
      // const coverageActual = claimInitData['ER']
      await claimManagementEditPage.calculateBillingCopay(
        'er24Discharge',
        'claim_coverage_copay_OTH.json',
        'claim_coverage_copay_ER.json'
      )
      await claimManagementEditPage.fillTreatmentInformation(billingData)
      await claimManagementEditPage.fillBillingDetailsHospitalIpd(billingData)
    })

    await test.step('Validate coverage claim on the Edit claim page', async () => {
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('copay', 'ER')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'copay', 'ER')
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

      // BUG: UI display wrong bill submitter type (Hospital instead of Provider)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('copay', 'ER')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'copay', 'ER')
    })

    await test.step('Submit claim on the Claim details page', async () => {
      await claimManagementDetailPage.submitClaim()
    })

    await test.step('Validate claim status on the Claim details page', async () => {
      await claimManagementDetailPage.validateClaimStatus('Submitted')
    })

    await test.step('Validate submitted claim details on the Claim details page', async () => {
      claimNumber = await claimManagementDetailPage.getClaimNumber()
      await claimManagementDetailPage.validateMainBenefitInformation(draftData)

      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('copay', 'ER')
      // await claimManagementCreatePage.validateHospitalClaimCoverageDetail(coverageActual, 'copay', 'ER')
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS122_IPDDischarge_ER24_Copay_TC004 Claim staff can assign claim', async ({
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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)

      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('copay', 'ER')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'copay', 'ER')
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

  test('@E2E_TS122_IPDDischarge_ER24_Copay_TC005 Claim staff can request pending information', async ({
    page,
    loginPage,
    memberPolicyPage,
    slaClaimPage,
    claimManagementDetailPage
  }) => {
    test.setTimeout(120000)

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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)

      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('copay', 'ER')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'copay', 'ER')
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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)

      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('copay', 'ER')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'copay', 'ER')
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS122_IPDDischarge_ER24_Copay_TC006 Provider can resubmit claim', async ({
    page,
    loginPage,
    memberPolicyPage,
    claimManagementPage,
    claimManagementDetailPage,
    claimManagementEditPage
  }) => {
    test.setTimeout(120000)

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

      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('copay', 'ER')
      // await claimManagementCreatePage.validateHospitalClaimCoverageDetail(coverageActual, 'copay', 'ER')
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

      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('copay', 'ER')
      // await claimManagementCreatePage.validateHospitalClaimCoverageDetail(coverageActual, 'copay', 'ER')

      await claimManagementDetailPage.validateUploadDocument('test.pdf')
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS122_IPDDischarge_ER24_Copay_TC008 Claim staff can approve claim', async ({
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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('copay', 'ER')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'copay', 'ER')

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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('copay', 'ER')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'copay', 'ER')
    })

    await test.step('Print Eligibility Check Document', async () => {
      await claimManagementDetailPage.printEligibilityCheckDocument()
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })
})

/*
test.describe.skip('E2E_TS123_IPDDischarge_ER24_Deduct', () => {
  // let draftNumber: string
  // let claimNumber: string
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
    slaData = config.sla.uat.copay.ha.ipd.positive.ipdDischarge
    pendingInfoData = config.claims.uat.pendingInfo

    const positiveCase = config.claims.uat.copay.ha.ipd.positive.ipdDischarge
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
    await page.setViewportSize({ width: 1920, height: 1080 })
  })

  test.afterAll(async () => {
    // TODO: cancel claim
  })
})
*/

test.describe.skip('E2E_TS124_IPDDischarge_ER24_MajorMed', () => {
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
    policyData = config.policyCoverages.policy.majorMed
    claimInitData = config.claimCoveragesinit.policy.majorMed
    userData = config.users.uat
    tabData = config.tabs
    memberData = config.members.memberMajorMed.ha
    slaData = config.sla.uat.majorMed.ph.er24.positive.ipdDischarge
    pendingInfoData = config.claims.uat.pendingInfo

    const positiveCase = config.claims.uat.majorMed.ph.er24.positive.ipdDischarge
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
    test.setTimeout(120000)

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
      await claimManagementCreatePage.getClaimCoverageDetail('majorMed', 'ER')
      await claimManagementCreatePage.validateClaimCoverageNotUsageRemainingDetail(claimInitData, 'majorMed', 'ER')
    })

    await test.step('Logout', async () => {
      await claimManagementCreatePage.logout()
    })
  })

  test('@E2E_TS124_IPDDischarge_ER24_MajorMed_TC001 Provider can search and select policy', async ({
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

  test('@E2E_TS124_IPDDischarge_ER24_MajorMed_TC002 Provider can draft claim', async ({
    page,
    loginPage,
    memberPolicyPage,
    memberPolicyDetailPage,
    claimManagementCreatePage,
    claimManagementDetailPage
  }) => {
    test.setTimeout(90000)

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
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('majorMed', 'ER')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'majorMed', 'ER')
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
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('majorMed', 'ER')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'majorMed', 'ER')
    })

    await test.step('Print Eligibility Check Document', async () => {
      await claimManagementDetailPage.printEligibilityCheckDocument()
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS124_IPDDischarge_ER24_MajorMed_TC003 Provider can submit claim', async ({
    page,
    loginPage,
    memberPolicyPage,
    claimManagementPage,
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

    await test.step('Fill data in the treatment information on the Edit claim page', async () => {
      // FIXME: calculateBillingMajorMedPh
      // const coverageActual = claimInitData['ER']
      await claimManagementEditPage.calculateBillingMajorMedPh('er24Discharge', 'claim_coverage_majorMed_ER.json')
      await claimManagementEditPage.fillTreatmentInformation(billingData)
      await claimManagementEditPage.fillBillingDetailsHospitalIpd(billingData)
    })

    await test.step('Validate coverage claim on the Edit claim page', async () => {
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('majorMed', 'ER')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'majorMed', 'ER')
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

      // BUG: UI display wrong bill submitter type (Hospital instead of Provider)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('majorMed', 'ER')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'majorMed', 'ER')
    })

    await test.step('Submit claim on the Claim details page', async () => {
      await claimManagementDetailPage.submitClaim()
    })

    await test.step('Validate claim status on the Claim details page', async () => {
      await claimManagementDetailPage.validateClaimStatus('Submitted')
    })

    await test.step('Validate submitted claim details on the Claim details page', async () => {
      claimNumber = await claimManagementDetailPage.getClaimNumber()
      await claimManagementDetailPage.validateMainBenefitInformation(draftData)

      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('majorMed', 'ER')
      // await claimManagementCreatePage.validateHospitalClaimCoverageDetail(coverageActual, 'majorMed', 'ER')
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS124_IPDDischarge_ER24_MajorMed_TC004 Claim staff can assign claim', async ({
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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)

      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('majorMed', 'ER')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'majorMed', 'ER')
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

  test('@E2E_TS124_IPDDischarge_ER24_MajorMed_TC005 Claim staff can request pending information', async ({
    page,
    loginPage,
    memberPolicyPage,
    slaClaimPage,
    claimManagementDetailPage
  }) => {
    test.setTimeout(120000)

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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)

      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('majorMed', 'ER')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'majorMed', 'ER')
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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)

      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('majorMed', 'ER')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'majorMed', 'ER')
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS124_IPDDischarge_ER24_MajorMed_TC006 Provider can resubmit claim', async ({
    page,
    loginPage,
    memberPolicyPage,
    claimManagementPage,
    claimManagementDetailPage,
    claimManagementEditPage
  }) => {
    test.setTimeout(120000)

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

      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('majorMed', 'ER')
      // await claimManagementCreatePage.validateHospitalClaimCoverageDetail(coverageActual, 'majorMed', 'ER')
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

      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('majorMed', 'ER')
      // await claimManagementCreatePage.validateHospitalClaimCoverageDetail(coverageActual, 'majorMed', 'ER')

      await claimManagementDetailPage.validateUploadDocument('test.pdf')
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS124_IPDDischarge_ER24_MajorMed_TC008 Claim staff can approve claim', async ({
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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('majorMed', 'ER')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'majorMed', 'ER')

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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('majorMed', 'ER')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'majorMed', 'ER')
    })

    await test.step('Print Eligibility Check Document', async () => {
      await claimManagementDetailPage.printEligibilityCheckDocument()
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })
})

test.describe.skip('E2E_TS126_IPDDischarge_ER72_Schedule', () => {
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
    policyData = config.policyCoverages.policy.schedule
    claimInitData = config.claimCoveragesinit.policy.schedule
    userData = config.users.uat
    tabData = config.tabs
    memberData = config.members.memberSchedule.ph
    slaData = config.sla.uat.schedule.ph.er72.positive.ipdDischarge
    pendingInfoData = config.claims.uat.pendingInfo

    const positiveCase = config.claims.uat.schedule.ph.er72.positive.ipdDischarge
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

    // accidentDate (true): pick date from admissionDate - 3 day (DD/MM/YYYY hh:mm)
    if (draftData.accidentDate === true) {
      const baseDate = draftData.admissionDate
      const baseDateOnly = baseDate.split(' ')[0]
      draftData.accidentDate = `${DateHelper.addDays(baseDateOnly, -3)} 00:00`
    }

    // billingDate (true): pick date from dischargeDate (DD/MM/YYYY)
    if (billingData.billingDate === true) {
      const baseDate = draftData.dischargeDate
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
    test.setTimeout(120000)

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
      await memberPolicyDetailPage.getCoverageDetails('schedule')
      await memberPolicyDetailPage.validateCoverageDetail(policyData, 'schedule')
    })

    await test.step('Validate member information on the Policy overview page', async () => {
      await memberPolicyDetailPage.validateMemberInfo(memberData)
    })

    await test.step('Click the create claim button on the Policy overview page', async () => {
      await memberPolicyDetailPage.clickCreateClaim()
    })

    await test.step('Validate coverage table and get coverage remaining on the Create claim page', async () => {
      await claimManagementCreatePage.fillMainBenefitInformation(draftData)
      await claimManagementCreatePage.getClaimCoverageDetail('schedule', 'IPD')
      await claimManagementCreatePage.getClaimCoverageDetail('schedule', 'ER')
      await claimManagementCreatePage.validateClaimCoverageNotUsageRemainingDetail(claimInitData, 'schedule', 'ER')
    })

    await test.step('Logout', async () => {
      await claimManagementCreatePage.logout()
    })
  })

  test('@E2E_TS126_IPDDischarge_ER72_Schedule_TC001 Provider can search and select policy', async ({
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

  test('@E2E_TS126_IPDDischarge_ER72_Schedule_TC002 Provider can draft claim', async ({
    page,
    loginPage,
    memberPolicyPage,
    memberPolicyDetailPage,
    claimManagementCreatePage,
    claimManagementDetailPage
  }) => {
    test.setTimeout(90000)

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
      await memberPolicyDetailPage.getHospitalCoverageDetails('schedule')
      await memberPolicyDetailPage.validateHospitalCoverageDetail(policyData, 'schedule')
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
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('schedule', 'ER')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'schedule', 'ER')
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
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('schedule', 'ER')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'schedule', 'ER')
    })

    await test.step('Print Eligibility Check Document', async () => {
      await claimManagementDetailPage.printEligibilityCheckDocument()
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS126_IPDDischarge_ER72_Schedule_TC003 Provider can submit claim', async ({
    page,
    loginPage,
    memberPolicyPage,
    claimManagementPage,
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

    await test.step('Fill data in the treatment information on the Edit claim page', async () => {
      // FIXME: calculateBillingSchedule
      // const coverageActual = claimInitData['ER']
      await claimManagementEditPage.calculateBillingSchedule(
        'er72Discharge',
        'claim_coverage_schedule_IPD.json',
        'claim_coverage_schedule_ER.json'
      )
      await claimManagementEditPage.fillTreatmentInformation(billingData)
      await claimManagementEditPage.fillBillingDetailsHospitalIpd(billingData)
    })

    await test.step('Validate coverage claim on the Edit claim page', async () => {
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('schedule', 'ER')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'schedule', 'ER')
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

      // BUG: UI display wrong bill submitter type (Hospital instead of Provider)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('schedule', 'ER')
      // await claimManagementCreatePage.validateHospitalClaimCoverageNotUsageRemainingDetail(claimInitData, 'schedule', 'ER')
    })

    await test.step('Submit claim on the Claim details page', async () => {
      await claimManagementDetailPage.submitClaim()
    })

    await test.step('Validate claim status on the Claim details page', async () => {
      await claimManagementDetailPage.validateClaimStatus('Submitted')
    })

    await test.step('Validate submitted claim details on the Claim details page', async () => {
      claimNumber = await claimManagementDetailPage.getClaimNumber()
      await claimManagementDetailPage.validateMainBenefitInformation(draftData)

      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('schedule', 'ER')
      // await claimManagementCreatePage.validateHospitalClaimCoverageDetail(coverageActual, 'schedule', 'ER')
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS126_IPDDischarge_ER72_Schedule_TC004 Claim staff can assign claim', async ({
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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)

      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('schedule', 'ER')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'schedule', 'ER')
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

  test('@E2E_TS126_IPDDischarge_ER72_Schedule_TC005 Claim staff can request pending information', async ({
    page,
    loginPage,
    memberPolicyPage,
    slaClaimPage,
    claimManagementDetailPage
  }) => {
    test.setTimeout(120000)

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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)

      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('schedule', 'ER')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'schedule', 'ER')
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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)

      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('schedule', 'ER')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'schedule', 'ER')
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS126_IPDDischarge_ER72_Schedule_TC006 Provider can resubmit claim', async ({
    page,
    loginPage,
    memberPolicyPage,
    claimManagementPage,
    claimManagementDetailPage,
    claimManagementEditPage
  }) => {
    test.setTimeout(120000)

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

      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('schedule', 'ER')
      // await claimManagementCreatePage.validateHospitalClaimCoverageDetail(coverageActual, 'schedule', 'ER')
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

      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // await claimManagementCreatePage.getHospitalClaimCoverageDetail('schedule', 'ER')
      // await claimManagementCreatePage.validateHospitalClaimCoverageDetail(coverageActual, 'schedule', 'ER')

      await claimManagementDetailPage.validateUploadDocument('test.pdf')
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_TS126_IPDDischarge_ER72_Schedule_TC008 Claim staff can approve claim', async ({
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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('schedule', 'ER')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'schedule', 'ER')

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

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // FIXME: validateClaimCoverageDetail
      // await claimManagementCreatePage.getClaimCoverageDetail('schedule', 'ER')
      // await claimManagementCreatePage.validateClaimCoverageDetail(coverageActual, 'schedule', 'ER')
    })

    await test.step('Print Eligibility Check Document', async () => {
      await claimManagementDetailPage.printEligibilityCheckDocument()
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })
})

/*
test.describe.skip('E2E_TS129_IPDDischarge_ER72_MajorMed', () => {
  // let draftNumber: string
  // let claimNumber: string
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
    slaData = config.sla.uat.copay.ha.ipd.positive.ipdDischarge
    pendingInfoData = config.claims.uat.pendingInfo

    const positiveCase = config.claims.uat.copay.ha.ipd.positive.ipdDischarge
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

    // accidentDate (true): pick date from admissionDate - 3 day (DD/MM/YYYY hh:mm)
    if (draftData.accidentDate === true) {
      const baseDate = draftData.admissionDate
      const baseDateOnly = baseDate.split(' ')[0]
      draftData.accidentDate = `${DateHelper.addDays(baseDateOnly, -3)} 00:00`
    }

    // billingDate (true): pick date from dischargeDate (DD/MM/YYYY)
    if (billingData.billingDate === true) {
      const baseDate = draftData.dischargeDate
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
})
*/

/*
test.describe.skip('E2E_TS145_IPDDischarge_PASurgery_PA', () => {
  // let draftNumber: string
  // let claimNumber: string
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
    slaData = config.sla.uat.copay.ha.ipd.positive.ipdDischarge
    pendingInfoData = config.claims.uat.pendingInfo

    const positiveCase = config.claims.uat.copay.ha.ipd.positive.ipdDischarge
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
    await page.setViewportSize({ width: 1920, height: 1080 })
  })

  test.afterAll(async () => {
    // TODO: cancel claim
  })
})
*/

/*
test.describe.skip('E2E_TS146_IPDDischarge_PAHoliday_PA', () => {
  // let draftNumber: string
  // let claimNumber: string
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
    slaData = config.sla.uat.copay.ha.ipd.positive.ipdDischarge
    pendingInfoData = config.claims.uat.pendingInfo

    const positiveCase = config.claims.uat.copay.ha.ipd.positive.ipdDischarge
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
    await page.setViewportSize({ width: 1920, height: 1080 })
  })

  test.afterAll(async () => {
    // TODO: cancel claim
  })
})
*/

/*
test.describe.skip('E2E_TS147_IPDDischarge_PAGeneral_PA', () => {
  // let draftNumber: string
  // let claimNumber: string
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
    slaData = config.sla.uat.copay.ha.ipd.positive.ipdDischarge
    pendingInfoData = config.claims.uat.pendingInfo

    const positiveCase = config.claims.uat.copay.ha.ipd.positive.ipdDischarge
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
    await page.setViewportSize({ width: 1920, height: 1080 })
  })

  test.afterAll(async () => {
    // TODO: cancel claim
  })
})
*/

/*
test.describe.skip('E2E_TS167_OPD_Dental_MajorMed', () => {
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
    policyData = config.policyCoverages.policy.majorMed
    claimInitData = config.claimCoveragesinit.policy.majorMed
    userData = config.users.uat
    tabData = config.tabs
    memberData = config.members.memberMajorMed.ph
    // slaData = config.sla.uat.majorMed.ph.dental.positive.opd
    pendingInfoData = config.claims.uat.pendingInfo

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
})
*/

/*
test.describe.skip('E2E_TS235_HB_HB_Deduct', () => {
  // let draftNumber: string
  // let claimNumber: string
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
    slaData = config.sla.uat.copay.ha.ipd.positive.ipdDischarge
    pendingInfoData = config.claims.uat.pendingInfo

    const positiveCase = config.claims.uat.copay.ha.ipd.positive.ipdDischarge
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

    // draftData.dischargeDate (true): pick date from admissionDate + 2 days (DD/MM/YYYY)
    if (draftData.dischargeDate === true) {
      const admissionDateOnly = draftData.admissionDate.split(' ')[0]
      draftData.dischargeDate = DateHelper.addDays(admissionDateOnly, 2)
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
    await page.setViewportSize({ width: 1920, height: 1080 })
  })

  test.afterAll(async () => {
    // TODO: cancel claim
  })
})
*/

/*
test.describe.skip('E2E_TS237_HB_HB_PA', () => {
  // let draftNumber: string
  // let claimNumber: string
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
    slaData = config.sla.uat.copay.ha.ipd.positive.ipdDischarge
    pendingInfoData = config.claims.uat.pendingInfo

    const positiveCase = config.claims.uat.copay.ha.ipd.positive.ipdDischarge
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
    await page.setViewportSize({ width: 1920, height: 1080 })
  })

  test.afterAll(async () => {
    // TODO: cancel claim
  })
})
*/

/*
test.describe.skip('E2E_TS241_HB_HBIncentive_MajorMed', () => {
  // let draftNumber: string
  // let claimNumber: string
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
    slaData = config.sla.uat.copay.ha.ipd.positive.ipdDischarge
    pendingInfoData = config.claims.uat.pendingInfo

    const positiveCase = config.claims.uat.copay.ha.ipd.positive.ipdDischarge
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
    await page.setViewportSize({ width: 1920, height: 1080 })
  })

  test.afterAll(async () => {
    // TODO: cancel claim
  })
})
*/
