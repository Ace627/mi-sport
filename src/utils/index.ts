/** 将对象序列化成 URL 的形式 */
export function toUrlEncode(data: Record<string, unknown>): string {
  const list: string[] = []
  for (const key in data) list.push(`${key}=${data[key]}`)
  return list.join('&')
}

/** 延时函数 */
export function sleep(delay: number): Promise<void> {
  return new Promise((resolve, reject) => setTimeout(() => resolve(), delay))
}

/** 取得 [n,m] 范围内随机数 */
export function randomFullClose(min: number, max: number): number {
  if (min > max) throw new Error(`min must be less than max!`)
  return Math.floor(Math.random() * (max - min + 1) + min)
}
