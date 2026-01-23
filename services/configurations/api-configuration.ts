import * as AppSetting from '@tests-api/configurations/app-setting.json'
import * as Users from '@tests-api/configurations/users.json'
import * as PayloadCoverage from '@tests-api/configurations/payload-create-claim-policy.json'
import * as Policies from '@tests-api/configurations/policies.json'
import { BaseConfiguration } from './base-configurtaion'

export class APIConfiguration extends BaseConfiguration {
  appSetting: typeof AppSetting
  users: typeof Users
  policies: typeof Policies
  payloadCoverage: typeof PayloadCoverage

  constructor() {
    super({ baseUrl: AppSetting.baseURL, baseApiUrl: AppSetting.baseURL })
    this.appSetting = AppSetting
    this.users = Users
    this.policies = Policies
    this.payloadCoverage = PayloadCoverage
  }
}
