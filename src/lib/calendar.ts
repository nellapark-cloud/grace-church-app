export interface DateParts {
  year: number
  month: number // 0-indexed
  day: number
}

export function parseDate(value: string): DateParts | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2]) - 1
  const day = Number(match[3])
  const date = new Date(year, month, day)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null
  }
  return { year, month, day }
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

export function formatDate(year: number, month: number, day: number): string {
  return `${year}-${pad(month + 1)}-${pad(day)}`
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

export function firstWeekday(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}
