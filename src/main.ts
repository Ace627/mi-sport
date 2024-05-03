import ora from 'ora'
import dayjs from 'dayjs'
import dotenv from 'dotenv'
import ZeepLife from './modules/ZeppLife'
dotenv.config()

/* ---------------------------------- 执行刷步 ---------------------------------- */
;(async () => {
  try {
    const spinner = ora('正在刷步中...').start()
    const account = process.env.Mi_Account as string
    const password = process.env.Mi_Password as string
    const step = process.env.Mi_Step as string
    const zeppLife = new ZeepLife(account, password, parseInt(step))
    const data = await zeppLife.main()
    console.log(data)
    spinner.succeed(`${data.date} ${data.account} 刷步完成 ${data.step}`)
  } catch (error: any) {
    console.log(`${dayjs().format('YYYY-MM-DD HH:mm:ss')} [warning]: ${error.message || '未知异常'}`)
  }
})()
