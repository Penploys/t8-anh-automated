import { test as base, expect } from '@playwright/test'

import { E2EConfiguration } from '@services/configurations/e2e-configuration'
import { LoginPage } from '@elements/pages/login-page'
import { MemberPolicyPage } from '@elements/pages/member-policy-page'
import { MemberPolicyDetailPage } from '@elements/pages/member-policy-detail-page'
import { ClaimManagementCreatePage } from '@elements/pages/claim-management-create-page'
import { ClaimManagementDetailPage } from '@elements/pages/claim-management-detail-page'
import { ClaimManagementPage } from '@elements/pages/claim-management-page'
import { ClaimManagementEditPage } from '@elements/pages/claim-management-edit-page'
import { SlaClaimPage } from '@elements/pages/sla-claim-page'

interface E2ETestFixtures {
  configuration: E2EConfiguration

  loginPage: LoginPage
  memberPolicyPage: MemberPolicyPage
  memberPolicyDetailPage: MemberPolicyDetailPage
  claimManagementCreatePage: ClaimManagementCreatePage
  claimManagementDetailPage: ClaimManagementDetailPage
  claimManagementPage: ClaimManagementPage
  claimManagementEditPage: ClaimManagementEditPage
  slaClaimPage: SlaClaimPage
}

const test = base.extend<E2ETestFixtures>({
  configuration: async ({}, use) => {
    const configuration = new E2EConfiguration()
    await use(configuration)
  },
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page)
    await use(loginPage)
  },
  memberPolicyPage: async ({ page }, use) => {
    const memberPolicyPage = new MemberPolicyPage(page)
    await use(memberPolicyPage)
  },
  memberPolicyDetailPage: async ({ page }, use) => {
    const memberPolicyDetailPage = new MemberPolicyDetailPage(page)
    await use(memberPolicyDetailPage)
  },
  claimManagementCreatePage: async ({ page }, use) => {
    const createClaimPage = new ClaimManagementCreatePage(page)
    await use(createClaimPage)
  },
  claimManagementDetailPage: async ({ page }, use) => {
    const claimDetailPage = new ClaimManagementDetailPage(page)
    await use(claimDetailPage)
  },
  claimManagementPage: async ({ page }, use) => {
    const claimManagementPage = new ClaimManagementPage(page)
    await use(claimManagementPage)
  },
  claimManagementEditPage: async ({ page }, use) => {
    const claimManagementEditPage = new ClaimManagementEditPage(page)
    await use(claimManagementEditPage)
  },
  slaClaimPage: async ({ page }, use) => {
    const slaClaimPage = new SlaClaimPage(page)
    await use(slaClaimPage)
  }
})

export { test }
export { expect }
