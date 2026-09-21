export function formatDateInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  const parts = [digits.slice(0, 4), digits.slice(4, 6), digits.slice(6, 8)].filter(
    Boolean,
  )
  return parts.join('-')
}
