import * as AppSetting from '@tests-e2e/configurations/app-setting.json'
import * as Users from '@tests-e2e/configurations/users.json'

export class E2EConfiguration {
  appSetting: typeof AppSetting
  users: typeof Users

  constructor() {
    this.appSetting = AppSetting
    this.users = Users
  }
}
