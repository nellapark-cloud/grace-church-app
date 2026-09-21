import { useEffect, useState } from 'react'
import { saveSettings, subscribeSettings } from '../lib/settings'
import { defaultSettings, type AppSettings } from '../types/settings'

function TagList({
  title,
  items,
  onAdd,
  onRemove,
  placeholder,
}: {
  title: string
  items: string[]
  onAdd: (value: string) => void
  onRemove: (value: string) => void
  placeholder: string
}) {
  const [input, setInput] = useState('')

  function handleAdd() {
    const value = input.trim()
    if (!value || items.includes(value)) return
    onAdd(value)
    setInput('')
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h2 className="mb-3 text-sm font-semibold text-gray-900">{title}</h2>

      {items.length === 0 ? (
        <p className="mb-3 text-sm text-gray-400">등록된 항목이 없습니다.</p>
      ) : (
        <div className="mb-3 flex flex-wrap gap-2">
          {items.map((item) => (
            <span
              key={item}
              className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 py-1 pl-3 pr-2 text-sm text-gray-700"
            >
              {item}
              <button
                type="button"
                onClick={() => onRemove(item)}
                className="text-gray-400 hover:text-red-600"
                aria-label={`${item} 삭제`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleAdd()
            }
          }}
          placeholder={placeholder}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="shrink-0 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          추가
        </button>
      </div>
    </div>
  )
}

export function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const unsubscribe = subscribeSettings(
      (s) => {
        setSettings(s)
        setLoading(false)
      },
      () => {
        setError('설정을 불러오지 못했습니다.')
        setLoading(false)
      },
    )
    return unsubscribe
  }, [])

  function addPosition(value: string) {
    saveSettings({ ...settings, positions: [...settings.positions, value] })
  }
  function removePosition(value: string) {
    saveSettings({
      ...settings,
      positions: settings.positions.filter((p) => p !== value),
    })
  }
  function addGroup(value: string) {
    saveSettings({ ...settings, groups: [...settings.groups, value] })
  }
  function removeGroup(value: string) {
    saveSettings({
      ...settings,
      groups: settings.groups.filter((g) => g !== value),
    })
  }

  if (loading) {
    return <p className="py-10 text-center text-sm text-gray-400">불러오는 중...</p>
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-5">
        <h1 className="text-lg font-semibold text-gray-900">설정</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          교인 등록 화면에서 선택할 직분/소속 목록을 관리합니다.
        </p>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="flex flex-col gap-4">
        <TagList
          title="직분"
          items={settings.positions}
          onAdd={addPosition}
          onRemove={removePosition}
          placeholder="예: 안수집사"
        />
        <TagList
          title="소속 (구역/목장)"
          items={settings.groups}
          onAdd={addGroup}
          onRemove={removeGroup}
          placeholder="예: 4구역"
        />
      </div>
    </div>
  )
}
