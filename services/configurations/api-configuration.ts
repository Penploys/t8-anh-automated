import * as AppSetting from '@tests-api/configurations/app-setting.json'
import * as Users from '@tests-api/configurations/users.json'
import { BaseConfiguration } from './base-configurtaion'

export class APIConfiguration extends BaseConfiguration {
  appSetting: typeof AppSetting
  users: typeof Users

  constructor() {
    super({ baseUrl: AppSetting.baseURL, baseApiUrl: AppSetting.baseURL })
    this.appSetting = AppSetting
    this.users = Users
  }
}
