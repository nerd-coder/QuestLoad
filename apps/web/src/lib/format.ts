const units = ['bytes', 'KB', 'MB', 'GB']

export function formatBytes(bytes: number) {
  if (bytes === 1) return '1 byte'
  let value = bytes
  let unit = 0
  while (value >= 1000 && unit < units.length - 1) {
    value /= 1000
    unit++
  }
  const digits = unit === 0 || value >= 100 ? 0 : 1
  return `${value.toFixed(digits)} ${units[unit]}`
}

export function plural(count: number, one: string, many = `${one}s`) {
  return `${count} ${count === 1 ? one : many}`
}
