export {}

declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      Mi_Account: string
      Mi_Password: string
      Mi_Step: string
    }
  }
}
