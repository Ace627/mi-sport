// 将对象序列化成 URL 的形式
export function toUrlEncode(data: { [key: string]: any }): string {
  const list: string[] = []
  for (const key in data) list.push(`${key}=${data[key]}`)
  return list.join('&')
}

// 延时函数
export function sleep(delay: number): Promise<void> {
  return new Promise((resolve, reject) => setTimeout(() => resolve(), delay))
}
