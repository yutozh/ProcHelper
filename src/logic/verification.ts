import * as embededFun from './ verificationFun'

export interface VerifyFunsObj {
  [key: string]: VerificationFun
}
export interface VerificationResult {
  result: boolean
  message: string
}

export interface VerificationFun {
  (eleValue: object, envValue: object, confValue: object): VerificationResult
}

function hasDigit(eleValue: any, envValue: any, paramValue: any) {
  const content = eleValue.taskType
  const reg = /[A-Z]/
  return {
    result: reg.test(content),
    message: '请检查',
  }
}

export const verifyFuns: VerifyFunsObj = embededFun
