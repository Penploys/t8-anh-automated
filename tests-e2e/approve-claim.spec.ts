import { test } from '@fixtures/e2e-fixture'
import { E2EConfiguration } from '@services/configurations/e2e-configuration'
import { DateHelper } from '@utils/date-helper'

test.describe.configure({ mode: 'serial' })

test.describe('E2E_TC002_Pre-Arrangement_IPD_Copay', () => {
  let draftNumber: string
  let claimNumber: string
  let appSetting: any
  // let policyData: any
  let userData: any
  let tabData: any
  let memberData: any
  let draftData: any
  let billingData: any
  let slaData: any
  let pendingInfoData: any

  test.beforeAll(async () => {
    const config = new E2EConfiguration()

    appSetting = config.appSetting
    // policyData = config.policyCoverages.policy.copay
    userData = config.users.uat
    tabData = config.tabs
    memberData = config.members.memberCopay
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

    // accidentDate (true): pick date from appointmentDate or admissionDate - 1 day (DD/MM/YYYY hh:mm)
    if (draftData.accidentDate === true) {
      const baseDate = draftData.appointmentDate || draftData.admissionDate
      const baseDateOnly = baseDate.split(' ')[0]
      draftData.accidentDate = `${DateHelper.addDays(baseDateOnly, -1)} 00:00`
    }

    // billingDate (true): pick date from appointmentDate or admissionDate - 1 day (DD/MM/YYYY)
    if (billingData.billingDate === true) {
      const baseDate = draftData.appointmentDate || draftData.admissionDate
      const baseDateOnly = baseDate.split(' ')[0]
      billingData.billingDate = DateHelper.addDays(baseDateOnly, -1)
    }

    // Temp: for test.only
    // draftNumber = 'DRAFT1768818938310'
    // claimNumber = 'PRE1768890143149'
  })

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
  })

  test.afterAll(async () => {
    // TODO: cancel claim
  })

  test.skip('Validate coverage details and get remaining', async ({
    page,
    loginPage,
    memberPolicyPage,
    memberPolicyDetailPage,
    claimManagementCreatePage
  }) => {
    test.setTimeout(90000)

    await test.step('Login', async () => {
      await page.goto(appSetting.url.uat.surveyorLoginURL)
      await loginPage.submitLogin(userData.faxClaimUser.email, userData.faxClaimUser.password)
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

    await test.step('Validate tabs on the Policy overview page', async () => {
      await memberPolicyDetailPage.validateTabs(tabData.memberPolicyDetailTabs.surveyor)
    })

    await test.step('Validate coverage table on the Policy overview page', async () => {
      // TODO: validate coverage details (surveyor)
      // await memberPolicyDetailPage.validateCoverageDetailSurveyor(policyData)
    })

    await test.step('Validate member information on the Policy overview page', async () => {
      await memberPolicyDetailPage.validateMemberInfo(memberData)
    })

    await test.step('Click the create claim button on the Policy overview page', async () => {
      await memberPolicyDetailPage.clickCreateClaim()
    })

    await test.step('Validate coverage table and get coverage remaining on the Create claim page', async () => {
      await claimManagementCreatePage.fillMainBenefitInformation(draftData)
      // TODO: validate coverage claim (surveyor)
      // await claimManagementCreatePage.validateCoverageClaimSurveyor(policyData.ipd)
      // TODO: get remaining coverage claim (surveyor)
      // const coverageRemaining = await claimManagementCreatePage.getCoverageRemaining()
      // console.log('Coverage Remaining:', JSON.stringify(coverageRemaining, null, 2))
    })

    await test.step('Logout', async () => {
      await claimManagementCreatePage.logout()
    })
  })

  test('@E2E_Claim_Draft_001 Provider can draft  claim', async ({
    page,
    loginPage,
    memberPolicyPage,
    memberPolicyDetailPage,
    claimManagementCreatePage,
    claimManagementDetailPage
  }) => {
    test.setTimeout(90000)

    await test.step('Login', async () => {
      await page.goto(appSetting.url.uat.hospitalLoginURL)
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

    await test.step('Validate tabs on the Policy overview page', async () => {
      await memberPolicyDetailPage.validateTabs(tabData.memberPolicyDetailTabs.hospital)
    })

    await test.step('Validate coverage table on the Policy overview page', async () => {
      // TODO: validate coverage details (hospital)
      // await memberPolicyDetailPage.validateCoverageDetailHospital(policyData)
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
      // TODO: check hospital user cannot see ipd coverage
      // await claimManagementCreatePage.validateCoverageClaimHospital(policyData.ipd)
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
      // TODO: check hospital user cannot see ipd coverage
      // await claimManagementDetailPage.validateCoverageClaimHospital(policyData.ipd)
    })

    await test.step('Print Eligibility Check Document', async () => {
      await claimManagementDetailPage.printEligibilityCheckDocument()
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_Claim_Submit_001 Provider admission can submit claim', async ({
    page,
    loginPage,
    memberPolicyPage,
    claimManagementPage,
    claimManagementDetailPage,
    claimManagementEditPage
  }) => {
    test.setTimeout(120000)

    await test.step('Login', async () => {
      await page.goto(appSetting.url.uat.hospitalLoginURL)
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
      await claimManagementEditPage.fillTreatmentInformation(billingData)
      await claimManagementEditPage.fillBillingDetailsHospitalIpd(billingData)
    })

    await test.step('Validate coverage claim on the Edit claim page', async () => {
      // TODO: check hospital user cannot see ipd coverage
      // await claimManagementDetailPage.validateCoverageClaimHospital(policyData.ipd)
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
      // TODO: check hospital user cannot see ipd coverage
      // await claimManagementDetailPage.validateCoverageClaimHospital(policyData.ipd)

      // BUG: UI display wrong bill submitter type (Hospital instead of Provider)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // TODO: check hospital user cannot see ipd coverage
      // await claimManagementDetailPage.validateCoverageClaimHospital(policyData.ipd)
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
      // TODO: validate coverage limit (hospital)
      // NOTE: hospital user cannot see ipd coverage, Pre-arrangement claims are not deducted from the coverage limit
      // await claimManagementDetailPage.validateCoverageLimitHospital(policyData.ipd)

      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // TODO: validate coverage limit (hospital)
      // NOTE: hospital user cannot see ipd coverage, Pre-arrangement claims are not deducted from the coverage limit
      // await claimManagementDetailPage.validateCoverageLimitHospital(policyData.ipd)
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_Claim_Assign_001 Fax claim can assign claim to assignee', async ({
    page,
    loginPage,
    memberPolicyPage,
    claimManagementDetailPage,
    slaClaimPage
  }) => {
    test.setTimeout(120000)

    await test.step('Login', async () => {
      await page.goto(appSetting.url.uat.surveyorLoginURL)
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
      // TODO: validate coverage limit (surveyor)
      // await claimManagementDetailPage.validateCoverageLimitSurveyor(policyData.ipd)

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // TODO: validate coverage limit (surveyor)
      // await claimManagementDetailPage.validateCoverageLimitSurveyor(policyData.ipd)
    })

    await test.step('Assign claim to assignee on the Claim details page', async () => {
      await claimManagementDetailPage.assignClaimToAssignee(userData.faxClaimUser.email)
    })

    await test.step('Validate claim status on the Claim details page', async () => {
      await claimManagementDetailPage.validateClaimStatus('Under Review')
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_Claim_Pending_Info_001 Fax claim can pending info claim', async ({
    page,
    loginPage,
    memberPolicyPage,
    slaClaimPage,
    claimManagementDetailPage
  }) => {
    test.setTimeout(120000)

    await test.step('Login', async () => {
      await page.goto(appSetting.url.uat.surveyorLoginURL)
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
      // TODO: validate coverage limit (surveyor)
      // await claimManagementDetailPage.validateCoverageLimitSurveyor(policyData.ipd)

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // TODO: validate coverage limit (surveyor)
      // await claimManagementDetailPage.validateCoverageLimitSurveyor(policyData.ipd)
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
      // TODO: validate coverage limit (surveyor)
      // await claimManagementDetailPage.validateCoverageLimitSurveyor(policyData.ipd)

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // TODO: validate coverage limit (surveyor)
      // await claimManagementDetailPage.validateCoverageLimitSurveyor(policyData.ipd)
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_Claim_Resubmitted_001 Provider can resubmitted claim', async ({
    page,
    loginPage,
    memberPolicyPage,
    claimManagementPage,
    claimManagementDetailPage,
    claimManagementEditPage
  }) => {
    test.setTimeout(120000)

    await test.step('Login', async () => {
      await page.goto(appSetting.url.uat.hospitalLoginURL)
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
      // TODO: validate coverage limit (hospital)
      // NOTE: hospital user cannot see ipd coverage, Pre-arrangement claims are not deducted from the coverage limit
      // await claimManagementDetailPage.validateCoverageLimitHospital(policyData.ipd)

      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // TODO: validate coverage limit (hospital)
      // NOTE: hospital user cannot see ipd coverage, Pre-arrangement claims are not deducted from the coverage limit
      // await claimManagementDetailPage.validateCoverageLimitHospital(policyData.ipd)
    })

    await test.step('Upload document on the Edit claim page', async () => {
      await claimManagementDetailPage.goToUploadDocument()
      await claimManagementEditPage.uploadDocument('test.pdf')
      await claimManagementEditPage.resubmitClaim()
      await claimManagementEditPage.viewClaimDetail()
    })

    await test.step('Validate claim status on the Claim details page', async () => {
      await claimManagementDetailPage.validateClaimStatus('Resubmitted')
    })

    await test.step('Validate claim detail on the Claim details page', async () => {
      await claimManagementDetailPage.validateMainBenefitInformation(draftData)
      // TODO: validate coverage limit (hospital)
      // NOTE: hospital user cannot see ipd coverage, Pre-arrangement claims are not deducted from the coverage limit
      // await claimManagementDetailPage.validateCoverageLimitHospital(policyData.ipd)

      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // TODO: validate coverage limit (hospital)
      // NOTE: hospital user cannot see ipd coverage, Pre-arrangement claims are not deducted from the coverage limit
      // await claimManagementDetailPage.validateCoverageLimitHospital(policyData.ipd)

      await claimManagementDetailPage.validateUploadDocument('test.pdf')
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })

  test('@E2E_Claim_Authorize_001 Assignee can authorize claim', async ({
    page,
    loginPage,
    memberPolicyPage,
    slaClaimPage,
    claimManagementDetailPage
  }) => {
    test.setTimeout(90000)

    await test.step('Login', async () => {
      await page.goto(appSetting.url.uat.surveyorLoginURL)
      await loginPage.submitLogin(userData.uat.faxClaimUser.email, userData.uat.faxClaimUser.password)
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
      // TODO: validate coverage limit (surveyor)
      // await claimManagementDetailPage.validateCoverageLimitSurveyor(policyData.ipd)

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // TODO: validate coverage limit (surveyor)
      // await claimManagementDetailPage.validateCoverageLimitSurveyor(policyData.ipd)

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
      // TODO: validate coverage limit (surveyor)
      // await claimManagementDetailPage.validateCoverageLimitSurveyor(policyData.ipd)

      await claimManagementDetailPage.validateMemberInformation(memberData)
      await claimManagementDetailPage.validateClaimInformation(draftData, billingData)
      await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
      await claimManagementDetailPage.validateSummaryAmount(billingData)
      // TODO: validate coverage limit (surveyor)
      // await claimManagementDetailPage.validateCoverageLimitSurveyor(policyData.ipd)
    })

    await test.step('Print Eligibility Check Document', async () => {
      await claimManagementDetailPage.printEligibilityCheckDocument()
    })

    await test.step('Logout', async () => {
      await claimManagementDetailPage.logout()
    })
  })
})
