import path from 'path'
import { readFile } from 'fs/promises'
import { isEmail } from '../utils/validate'
import { toUrlEncode } from '../utils'
import request from '../utils/request'
import type { TokenInfo } from '../../types/ZeepLife'

const Data_Path = path.resolve(process.cwd(), 'src/db/data_json.txt')

export default class ZeepLife {
  private readonly account: string
  private readonly password: string
  private readonly step: number

  constructor(account: string, password: string, step: number) {
    this.account = account
    this.password = password
    this.step = step
  }

  private getSportData() {
    return readFile(Data_Path, 'utf-8')
  }

  private async getAccessCode(): Promise<string> {
    // 兼容邮箱和手机
    const account = isEmail(this.account) ? this.account : `+86${this.account}`
    const url = `https://api-user.huami.com/registrations/${account}/tokens`
    // 配置请求体
    const data = toUrlEncode({
      client_id: 'HuaMi',
      password: this.password,
      redirect_uri: 'https://s3-us-west-2.amazonaws.com/hm-registration/successsignin.html',
      token: 'access',
    })
    // 发请求
    const result = await request.post(url, data)
    const { searchParams } = new URL(result.request.path, url)
    return searchParams.get('access') as string
  }

  private async getTokenInfo(code: string): Promise<TokenInfo> {
    // 配置请求参数
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
    // 发请求
    const response = await request.post(url, data)
    const { token_info } = response.data
    return token_info
  }

  public async main() {
    try {
      const code = await this.getAccessCode()
      const tokenInfo = await this.getTokenInfo(code)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
