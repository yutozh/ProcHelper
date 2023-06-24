interface VerifyFun {
  [key: string]: Function
}

export const verifyFun: VerifyFun = {
  hasDigit(content: string) {
    const reg = /[A-Z]/
    return [reg.test(content), '请检查']
  },
}
