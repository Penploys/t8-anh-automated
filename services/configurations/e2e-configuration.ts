import * as AppSetting from '@tests-e2e/configurations/app-setting.json'
import * as policyCoverages from '@tests-e2e/configurations/policy-coverages.json'
import * as claimCoveragesinit from '@tests-e2e/configurations/claim-coverages-init.json'
import * as Users from '@tests-e2e/configurations/users.json'
import * as Tabs from '@tests-e2e/configurations/tabs.json'
import * as Members from '@tests-e2e/configurations/members.json'

import * as Claims from '@tests-e2e/configurations/claims.json'
import * as Sla from '@tests-e2e/configurations/sla.json'

export class E2EConfiguration {
  appSetting: typeof AppSetting
  policyCoverages: typeof policyCoverages
  claimCoveragesinit: typeof claimCoveragesinit
  users: typeof Users
  tabs: typeof Tabs
  members: typeof Members
  claims: typeof Claims
  sla: typeof Sla
  constructor() {
    this.appSetting = AppSetting
    this.policyCoverages = policyCoverages
    this.claimCoveragesinit = claimCoveragesinit
    this.users = Users
    this.tabs = Tabs
    this.members = Members
    this.claims = Claims
    this.sla = Sla
  }
}
