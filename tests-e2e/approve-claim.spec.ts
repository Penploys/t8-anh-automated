import { test } from '@fixtures/e2e-fixture'
import { E2EConfiguration } from '@services/configurations/e2e-configuration'
import { DateHelper } from '@utils/date-helper'

test.describe.configure({ mode: 'serial' })

test.describe('E2E_Claim_Pending Info and Approve_Pre-Arrangement_IPD_Copay_Positive', () => {
  let draftNumber: string
  let claimNumber: string
  let appSetting: any
  // let policyData: any
  let lossDateCal: string
  let userData: any
  let tabData: any
  let memberData: any
  let draftData: any
  let billingData: any
  let slaData: any

  test.beforeAll(async () => {
    const config = new E2EConfiguration()

    appSetting = config.appSetting
    // policyData = config.policyCoverages.policy.copay
    userData = config.users
    tabData = config.tabs
    memberData = config.members.memberCopay
    slaData = config.sla.uat.copay.ha.ipd.positive.preArrangement

    const positiveCase = config.claims.uat.copay.ha.ipd.positive.preArrangement
    draftData = positiveCase.draftInfo
    billingData = positiveCase.billingInfo

    // Calculate lossDate from memberEffectiveDate + 1 month (DD/MM/YYYY)
    const effectiveDate = memberData.memberEffectiveDate.split(' ')[0]
    lossDateCal = DateHelper.addMonths(effectiveDate, 1)

    if (memberData.lossDate === true) {
      memberData.lossDate = lossDateCal
    }

    // draftData.appointmentDate (true): pick current date (DD/MM/YYYY hh:mm)
    if (draftData.appointmentDate === true) {
      draftData.appointmentDate = `${DateHelper.getCurrentDate()} 00:00`
    }

    // draftData.admissionDate (true): pick date from memberEffectiveDate + 1 month (DD/MM/YYYY hh:mm)
    if (draftData.admissionDate === true) {
      draftData.admissionDate = `${lossDateCal} 00:00`
    }

    // draftData.dischargeDate (true): pick date from admissionDate + 2 day (DD/MM/YYYY)
    if (draftData.dischargeDate === true) {
      draftData.dischargeDate = DateHelper.addDays(lossDateCal, 2)
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

    // temp
    // claimNumber = 'PRE1768373192661'
  })

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
  })

  test.afterAll(async () => {
    // TODO: cancel claim
  })

  test.describe('Provider admission can submit pre-arrangement claim', () => {
    test('Validate coverage details and get remaining', async ({
      page,
      loginPage,
      memberPolicyPage,
      memberPolicyDetailPage,
      claimManagementCreatePage
    }) => {
      await test.step('Login', async () => {
        await page.goto(appSetting.url.uat.surveyorLoginURL)
        await loginPage.submitLogin(userData.uat.faxClaimUser.email, userData.uat.faxClaimUser.password)
      })

      await test.step('Search and select the policy on the Member policy page', async () => {
        await memberPolicyPage.ensureLanguage()
        await memberPolicyPage.memberSearch(memberData)
        // FIXME: duplicate name case
        await memberPolicyPage.selectPolicy(memberData)
      })

      await test.step('Validate tabs on the Policy overview page', async () => {
        await memberPolicyDetailPage.validateTabs(tabData.memberPolicyDetailTabs.surveyor)
      })

      await test.step('Validate coverage table on the Policy overview page', async () => {
        // TODO: surveyor validate coverage table on the Policy overview page
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
        // TODO: surveyor validate coverage table on the Create claim page
        // await claimManagementCreatePage.validateCoverageClaimSurveyor(policyData.ipd)
        // TODO: surveyor get coverage remaining on the Create claim page (IPD only)
        // await claimManagementCreatePage.getCoverageRemaining()
      })

      await test.step('Logout', async () => {
        await claimManagementCreatePage.logout()
      })
    })

    test('Provider admission can create and draft pre-arrangement claim', async ({
      page,
      loginPage,
      memberPolicyPage,
      memberPolicyDetailPage,
      claimManagementCreatePage,
      claimManagementDetailPage
    }) => {
      await test.step('Login', async () => {
        await page.goto(appSetting.url.uat.hospitalLoginURL)
        await loginPage.submitLogin(
          userData.uat.providerAdmissionUser.email,
          userData.uat.providerAdmissionUser.password
        )
      })

      await test.step('Search and select the policy on the Member policy page', async () => {
        await memberPolicyPage.ensureLanguage()
        await memberPolicyPage.memberSearch(memberData)
        await memberPolicyPage.selectPolicy(memberData)
      })

      await test.step('Validate tabs on the Policy overview page', async () => {
        await memberPolicyDetailPage.validateTabs(tabData.memberPolicyDetailTabs.hospital)
      })

      await test.step('Validate coverage table on the Policy overview page', async () => {
        // TODO: validate coverage details
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
        // NOTE: hospital user cannot see ipd coverage
        // await claimManagementCreatePage.validateCoverageClaimHospital(policyData.ipd)
      })

      await test.step('Save draft claim on the Create claim page', async () => {
        await claimManagementCreatePage.saveDraftClaim()
      })

      await test.step('Validate claim details on the Claim details page', async () => {
        await claimManagementCreatePage.viewClaimDetail()
        await claimManagementDetailPage.validateClaimStatus('Draft')
        draftNumber = await claimManagementDetailPage.getDraftNumber()
        await claimManagementDetailPage.validateMainBenefitInformation(draftData)
        // NOTE: hospital user cannot see ipd coverage
        // await claimManagementDetailPage.validateCoverageClaimHospital(policyData.ipd)

        // BUG: waiting for download
        // await claimManagementDetailPage.printEligibilityCheckDocument()
      })

      await test.step('Logout', async () => {
        await claimManagementDetailPage.logout()
      })
    })

    test('Provider admission can edit pre-arrangement claim and submit', async ({
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
        await loginPage.submitLogin(
          userData.uat.providerAdmissionUser.email,
          userData.uat.providerAdmissionUser.password
        )
      })

      await test.step('Search and select claim on the Claim management page', async () => {
        await memberPolicyPage.ensureLanguage()
        await memberPolicyPage.claimManagement()
        await claimManagementPage.claimSearch(draftNumber)
        // FIXME: validate all
        await claimManagementPage.selectClaim(memberData, draftNumber)
      })

      await test.step('Click edit claim on the Claim details page', async () => {
        await claimManagementDetailPage.clickEditClaim()
      })

      await test.step('Fill data in the treatment information on the Edit claim page', async () => {
        // NOTE: hospital user cannot see ipd coverage
        // await claimManagementDetailPage.validateCoverageClaimHospital(policyData.ipd)
        await claimManagementEditPage.fillTreatmentInformation(billingData)
        await claimManagementEditPage.fillBillingDetailsHospitalIpd(billingData)
      })

      await test.step('Save edit claim on the Edit claim page', async () => {
        await claimManagementEditPage.saveEditClaim()
        await claimManagementEditPage.viewClaimDetail()
      })

      await test.step('Validate draft claim details on the Claim details page', async () => {
        await claimManagementDetailPage.validateClaimStatus('Draft')
        await claimManagementDetailPage.validateMainBenefitInformation(draftData)
        // TODO: validate Treatment information
        // await claimManagementDetailPage.validateTreatmentInformationHospital(billingData)
        // TODO: validate billing details
        // await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
        // await claimManagementDetailPage.validateSummaryAmount(billingData)
      })

      await test.step('Submit claim on the Claim details page', async () => {
        await claimManagementDetailPage.submitClaim()
      })

      await test.step('Validate submitted claim details on the Claim details page', async () => {
        claimNumber = await claimManagementDetailPage.getClaimNumber()
        await claimManagementDetailPage.validateClaimStatus('Submitted')
        await claimManagementDetailPage.validateMainBenefitInformation(draftData)
        // TODO: validate Treatment information
        // await claimManagementDetailPage.validateTreatmentInformationHospital(billingData)
        // NOTE: hospital user cannot see ipd coverage
        // await claimManagementDetailPage.validateCoverageClaimHospital(policyData.ipd)
        // TODO: validate billing details
        // await claimManagementDetailPage.validateBillingTotalHospitalIpd(billingData)
        // await claimManagementDetailPage.validateSummaryAmount(billingData)
        // NOTE: hospital user cannot see ipd coverage
        // await claimManagementDetailPage.validateCoverageClaimHospital(policyData.ipd)
      })

      await test.step('Validate coverage limit on the Claim details page', async () => {
        // NOTE1: hospital user cannot see ipd coverage
        // NOTE2: Pre-arrangement claims are not deducted from the coverage limit
        // await claimManagementDetailPage.validateCoverageLimitHospitalCopayIpd()
      })

      await test.step('Logout', async () => {
        await claimManagementDetailPage.logout()
      })
    })
  })

  test.describe('Assignee claim can request document and authorize claim', () => {
    test('Fax claim search claim and assign claim to assignee', async ({
      page,
      loginPage,
      memberPolicyPage,
      claimManagementDetailPage,
      slaClaimPage
    }) => {
      await test.step('Login', async () => {
        await page.goto(appSetting.url.uat.surveyorLoginURL)
        await loginPage.submitLogin(userData.uat.faxClaimUser.email, userData.uat.faxClaimUser.password)
      })

      await test.step('Search and select claim on the SLA claim page', async () => {
        await memberPolicyPage.ensureLanguage()
        await memberPolicyPage.slaClaim()
        await slaClaimPage.slaClaimSearch(slaData)
        await slaClaimPage.selectSlaClaimAssign(claimNumber, slaData)
      })

      await test.step('Validate submitted claim details on the Claim details page', async () => {
        await claimManagementDetailPage.validateClaimStatus('Submitted')
        // await claimManagementDetailPage.validateMainBenefitInformation(draftData)
        // TODO: validate Treatment information
        // await claimManagementDetailPage.validateTreatmentInformationSurveyor(billingData)
        // TODO: validate coverage claim
        // await claimManagementDetailPage.validateCoverageClaimSurveyor(policyData.ipd)
        // TODO: validate billing details
        // await claimManagementDetailPage.validateBillingTotalSurveyor(billingData)
        // await claimManagementDetailPage.validateSummaryAmount(billingData)
        // TODO: validate coverage claim
        // await claimManagementDetailPage.validateCoverageClaimSurveyor(policyData.ipd)
      })

      await test.step('Assign claim to assignee on the Claim details page', async () => {
        await claimManagementDetailPage.assignClaimToAssignee(userData.uat.faxClaimUser.email)
      })

      await test.step('Validate claim status on the Claim details page', async () => {
        await claimManagementDetailPage.validateClaimStatus('Under Review')
      })
    })

    test('Assignee can pending info claim', async ({ claimManagementDetailPage }) => {
      await test.step('Request document on the Claim details page', async () => {
        // TODO: request document
        // await claimManagementDetailPage.requestDocument()
      })

      await test.step('Validate claim status on the Claim details page', async () => {
        // TODO: validate claim status after request document
        // NOTE: waitFoR status
        // await claimManagementDetailPage.validateClaimStatus('Pending Info')
      })

      await test.step('Logout', async () => {
        await claimManagementDetailPage.logout()
      })
    })

    test('Provider can resubmitted claim', async ({
      page,
      loginPage,
      memberPolicyPage,
      claimManagementPage,
      claimManagementDetailPage
    }) => {
      await test.step('Login', async () => {
        await page.goto(appSetting.url.uat.hospitalLoginURL)
        await loginPage.submitLogin(
          userData.uat.providerAdmissionUser.email,
          userData.uat.providerAdmissionUser.password
        )
      })

      await test.step('Search and select claim on the Claim management page', async () => {
        await memberPolicyPage.ensureLanguage()
        await memberPolicyPage.claimManagement()
        await claimManagementPage.claimSearch(claimNumber)
        await claimManagementPage.selectClaim(memberData, claimNumber)
      })

      await test.step('Click edit claim on the Claim details page', async () => {
        await claimManagementDetailPage.clickEditClaim()
      })

      await test.step('Upload document on the Claim details page', async () => {
        // TODO: upload document
        // await claimManagementEditPage.uploadDocument()
      })

      await test.step('Validate claim detail on the Claim details page', async () => {
        // TODO: validate claim status after upload document
        // await claimManagementDetailPage.validateClaimStatus('Pending Info')
        // TODO: validate document uploaded
        // await claimManagementDetailPage.validateDocumentUploaded('test.pdf')
      })

      await test.step('Resubmit claim on the Claim details page', async () => {
        // TODO: resubmit claim
        // await claimManagementDetailPage.resubmitClaim()
      })

      await test.step('Validate claim detail on the Claim details page', async () => {
        // TODO: validate claim status after upload document
        // await claimManagementDetailPage.validateClaimStatus('Resubmitted')
        // TODO: validate document uploaded
        // await claimManagementDetailPage.validateDocumentUploaded('test.pdf')
      })

      await test.step('Logout', async () => {
        await claimManagementDetailPage.logout()
      })
    })

    test('Assignee can authorize claim', async ({
      page,
      loginPage,
      memberPolicyPage,
      slaClaimPage,
      claimManagementDetailPage
    }) => {
      await test.step('Login', async () => {
        await page.goto(appSetting.url.uat.surveyorLoginURL)
        await loginPage.submitLogin(userData.uat.faxClaimUser.email, userData.uat.faxClaimUser.password)
      })

      await test.step('Search and select claim on the SLA claim page', async () => {
        await memberPolicyPage.ensureLanguage()
        await memberPolicyPage.slaClaim()
        await slaClaimPage.slaClaimSearch(slaData)
        await slaClaimPage.selectSlaClaimAuthorize(claimNumber, slaData)
      })

      await test.step('Validate claim detail on the Claim details page', async () => {
        // TODO: validate claim status after upload document
        // await claimManagementDetailPage.validateClaimStatus('Resubmitted')
        // TODO: validate document uploaded
        // await claimManagementDetailPage.validateDocumentUploaded('test.pdf')
      })

      await test.step('Authorize claim on the Claim details page', async () => {
        await claimManagementDetailPage.authorizeClaim()
      })

      await test.step('Validate claim status on the Claim details page', async () => {
        await claimManagementDetailPage.validateClaimStatus('Authorized')
      })
    })
  })
})
