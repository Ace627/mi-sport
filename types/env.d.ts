export {}

declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      Mi_Account: string | undefined
      Mi_Password: string | undefined
      Mi_Step: string | undefined
    }
  }
}
