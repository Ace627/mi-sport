import ora from 'ora'
import dayjs from 'dayjs'
import ZeepLife from './modules/ZeppLife'
import { randomFullClose } from './utils'
import { isEmail, isPhone } from './utils/validate'

/* ---------------------------------- 执行刷步 ---------------------------------- */
;(async () => {
  const spinner = ora('正在刷步中...').start()
  try {
    const account = `123421`
    const password = `23456789`
    const step = randomFullClose(18650, 36906) // 根据指定范围生成随机步数
    if (!isPhone(account) && !isEmail(account)) throw new Error(`请检查账号是否为手机号或邮箱`)
    const zeppLife = new ZeepLife(account, password, step)
    const data = await zeppLife.main()
    spinner.succeed(`${data.date} ${data.account} 刷步完成 ${data.step}`)
  } catch (error: any) {
    spinner.fail(`${dayjs().format('YYYY-MM-DD HH:mm:ss')} [Error]: ${error.message || '未知异常'}`)
  }
})()
