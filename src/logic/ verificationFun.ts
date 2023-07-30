export function hasDigit(eleValue: any, envValue: any, paramValue: any) {
  const contentType = eleValue.taskType
  const describe = eleValue.describe
  const reg = /[A-Z]/
  return {
    result: reg.test(describe),
    message: `${contentType}:${describe}`,
  }
}

export function hasDigit2(eleValue: any, envValue: any, paramValue: any) {
  const content = eleValue.taskType
  const reg = /[A-Z]/
  return {
    result: reg.test(content),
    message: '请检查',
  }
}
