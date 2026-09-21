import { useState } from 'react'
import { openDaumPostcode } from '../lib/daumPostcode'

export function AddressField({
  value,
  onChange,
  inputClassName,
}: {
  value: string
  onChange: (address: string) => void
  inputClassName: string
}) {
  const [error, setError] = useState('')
  const [searching, setSearching] = useState(false)

  async function handleSearch() {
    setError('')
    setSearching(true)
    try {
      const result = await openDaumPostcode()
      onChange(result.roadAddress || result.address)
    } catch {
      setError('주소 검색 서비스를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setSearching(false)
    }
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="주소 검색으로 입력하거나 직접 입력"
          className={inputClassName}
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={searching}
          className="shrink-0 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
        >
          {searching ? '불러오는 중...' : '주소 검색'}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}
