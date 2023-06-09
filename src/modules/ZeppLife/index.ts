import dayjs from 'dayjs'
import { isEmail } from '@/utils/validate'
import { toUrlEncode } from '@/utils'
import request from '@/utils/request'
import SportData from './data_json'
import type { TokenInfo } from './type'

export default class ZeepLife {
  private account: string
  private password: string
  private step: number

  constructor(account: string, password: string, step: number) {
    this.account = account
    this.password = password
    this.step = step
  }

  // 根据传入的步数获取提交的服务器的最终数据
  private async getSportData(data_json: string): Promise<string> {
    const finddate = data_json.match(/.*?date%22%3A%22(.*?)%22%2C%22data.*?/)![1]
    const findstep = data_json.match(/.*?ttl%5C%22%3A(.*?)%2C%5C%22dis.*?/)![1]
    data_json = data_json.replace(finddate, dayjs().format('YYYY-MM-DD'))
    data_json = data_json.replace(findstep, this.step.toString())
    return data_json
  }

  // 根据账号、密码换取授权码
  private async getAccessCode(): Promise<string> {
    const account = isEmail(this.account) ? this.account : `+86${this.account}`
    const url = `https://api-user.huami.com/registrations/${account}/tokens`
    const data = toUrlEncode({
      client_id: 'HuaMi',
      password: this.password,
      redirect_uri: 'https://s3-us-west-2.amazonaws.com/hm-registration/successsignin.html',
      token: 'access',
    })
    const result = await request.post(url, data)
    const { searchParams } = new URL(result.request.path, url)
    return searchParams.get('access') as string
  }

  // 根据授权码获取用户信息
  private async getTokenInfo(code: string): Promise<TokenInfo> {
    const url = 'https://account.huami.com/v2/client/login'
    const data = toUrlEncode({
      app_name: 'com.xiaomi.hm.health',
      app_version: '6.0.1',
      code,
      country_code: 'unknown',
      device_id: '2C8B4939-0CCD-4E94-8CBA-CB8EA6E613A1',
      device_model: 'android_phone',
      grant_type: 'access_token',
      third_name: 'huami',
      allow_registration: 'false',
      dn: 'account.huami.com%2Capi-user.huami.com%2Capi-watch…m%2Capp-analytics.huami.com%2Capi-mifit.huami.com',
      source: 'com.xiaomi.hm.health%3A6.0.1%3A50545',
      lang: 'zh',
    })
    const response = await request.post(url, data)
    const { token_info } = response.data
    return token_info
  }

  // 执行刷步
  public async main() {
    try {
      if (this.step < 0 || this.step > 98800) throw new Error(`步数范围 0 ~ 98800`)
      const code = await this.getAccessCode()
      if (!code) throw new Error(`账号或者密码异常`)
      const { user_id: userID, app_token: apptoken } = await this.getTokenInfo(code)
      const data_json = await this.getSportData(SportData)
      const url = `https://api-mifit-cn.huami.com/v1/data/band_data.json?&t=${Date.now()}`
      const data = `userid=${userID}&last_sync_data_time=1597306380&device_type=0&last_deviceid=DA932FFFFE8816E7&data_json=${data_json}`
      const response = await request.post(url, data, { headers: { apptoken, 'User-Agent': 'MiFit/5.3.0 (iPhone; iOS 14.7.1; Scale/3.00)' } })
      if (response.data.message === 'success') {
        return { account: this.account, step: this.step, date: dayjs().format('YYYY-MM-DD HH:mm:ss') }
      } else {
        throw new Error(`本次步数提交失败`)
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
