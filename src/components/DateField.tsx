import { useEffect, useRef, useState } from 'react'
import { formatDateInput } from '../lib/dateInput'
import {
  daysInMonth,
  firstWeekday,
  formatDate,
  parseDate,
  type DateParts,
} from '../lib/calendar'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

function todayParts(): DateParts {
  const now = new Date()
  return { year: now.getFullYear(), month: now.getMonth(), day: now.getDate() }
}

// iOS Safari has a long-standing rendering bug where empty/partial
// <input type="date"> elements show overlapping placeholder segments and a
// duplicated calendar icon in Korean locale. A plain auto-formatting text
// input plus a custom calendar popover avoids the native date picker
// entirely, so it renders consistently everywhere.
export function DateField({
  value,
  onChange,
  className,
}: {
  value: string
  onChange: (value: string) => void
  className: string
}) {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<DateParts>(() => parseDate(value) ?? todayParts())
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  function openCalendar() {
    setView(parseDate(value) ?? todayParts())
    setOpen(true)
  }

  function changeMonth(delta: number) {
    setView((v) => {
      const date = new Date(v.year, v.month + delta, 1)
      return { year: date.getFullYear(), month: date.getMonth(), day: v.day }
    })
  }

  function pickDay(day: number) {
    onChange(formatDate(view.year, view.month, day))
    setOpen(false)
  }

  const selected = parseDate(value)
  const today = todayParts()
  const total = daysInMonth(view.year, view.month)
  const leadingBlanks = firstWeekday(view.year, view.month)
  const cells: (number | null)[] = [
    ...Array<null>(leadingBlanks).fill(null),
    ...Array.from({ length: total }, (_, i) => i + 1),
  ]

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          placeholder="YYYY-MM-DD"
          value={value}
          onChange={(e) => onChange(formatDateInput(e.target.value))}
          maxLength={10}
          className={`${className} pr-9`}
        />
        <button
          type="button"
          onClick={openCalendar}
          aria-label="달력 열기"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="absolute z-20 mt-1 w-64 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              className="rounded p-1 text-gray-500 hover:bg-gray-100"
              aria-label="이전 달"
            >
              ‹
            </button>
            <span className="text-sm font-medium text-gray-900">
              {view.year}년 {view.month + 1}월
            </span>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              className="rounded p-1 text-gray-500 hover:bg-gray-100"
              aria-label="다음 달"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-0.5 text-center text-xs text-gray-400">
            {WEEKDAYS.map((w) => (
              <div key={w} className="py-1">
                {w}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((day, i) => {
              if (day === null) return <div key={`b${i}`} />
              const isSelected =
                selected &&
                selected.year === view.year &&
                selected.month === view.month &&
                selected.day === day
              const isToday =
                today.year === view.year &&
                today.month === view.month &&
                today.day === day
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => pickDay(day)}
                  className={`aspect-square rounded-md text-sm hover:bg-gray-100 ${
                    isSelected
                      ? 'bg-gray-900 text-white hover:bg-gray-800'
                      : isToday
                        ? 'font-semibold text-gray-900 ring-1 ring-inset ring-gray-300'
                        : 'text-gray-700'
                  }`}
                >
                  {day}
                </button>
              )
            })}
          </div>

          <button
            type="button"
            onClick={() => {
              onChange('')
              setOpen(false)
            }}
            className="mt-2 w-full rounded-md py-1 text-xs text-gray-400 hover:bg-gray-50 hover:text-red-600"
          >
            지우기
          </button>
        </div>
      )}
    </div>
  )
}
