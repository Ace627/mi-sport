// 校验是否为手机号
export const isPhone = (phone: string): boolean => /^1[3-9]\d{9}$/.test(phone)

// 校验是否为邮箱
export const isEmail = (email: string): boolean => /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email)
