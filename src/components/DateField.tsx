import { formatDateInput } from '../lib/dateInput'

// iOS Safari has a long-standing rendering bug where empty/partial
// <input type="date"> elements show overlapping placeholder segments and a
// duplicated calendar icon in Korean locale. A plain auto-formatting text
// input avoids the native date picker entirely, so it renders consistently
// everywhere.
export function DateField({
  value,
  onChange,
  className,
}: {
  value: string
  onChange: (value: string) => void
  className: string
}) {
  return (
    <input
      type="text"
      inputMode="numeric"
      placeholder="YYYY-MM-DD"
      value={value}
      onChange={(e) => onChange(formatDateInput(e.target.value))}
      maxLength={10}
      className={className}
    />
  )
}
