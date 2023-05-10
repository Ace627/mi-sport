import dotenv from 'dotenv'
import ZeepLife from './common/ZeppLife'
dotenv.config()
;(async () => {
  try {
    const account = process.env.Mi_Account as string
    const password = process.env.Mi_Password as string
    const step = process.env.Mi_Step as string
    const zeppLife = new ZeepLife(account, password, parseInt(step))
    const data = await zeppLife.main()
    console.log(data)
  } catch (error: any) {
    console.log(error.message || error)
  }
})()
