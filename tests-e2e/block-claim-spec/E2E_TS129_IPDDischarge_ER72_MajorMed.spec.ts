/*
import { test } from '@fixtures/e2e-fixture'
import { E2EConfiguration } from '@services/configurations/e2e-configuration'
import { DateHelper } from '@utils/date-helper'
import * as fs from 'fs'
import * as path from 'path'

test.describe.configure({ mode: 'serial' })

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