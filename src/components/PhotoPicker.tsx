import { useId, useState, type ChangeEvent } from 'react'
import { resizeImageToDataUrl } from '../lib/image'
import { Avatar } from './Avatar'

export function PhotoPicker({
  name,
  photoUrl,
  onChange,
}: {
  name: string
  photoUrl: string
  onChange: (photoUrl: string) => void
}) {
  const [error, setError] = useState('')
  const albumId = useId()
  const cameraId = useId()

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setError('')
    try {
      const dataUrl = await resizeImageToDataUrl(file)
      onChange(dataUrl)
    } catch {
      setError('사진을 처리하지 못했습니다. 다른 파일로 시도해주세요.')
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar name={name || '?'} photoUrl={photoUrl} size="lg" />
      <div>
        <div className="flex flex-wrap gap-2">
          <label
            htmlFor={albumId}
            className="inline-block cursor-pointer rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            앨범에서 선택
          </label>
          <input
            id={albumId}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />

          <label
            htmlFor={cameraId}
            className="inline-block cursor-pointer rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            카메라로 촬영
          </label>
          <input
            id={cameraId}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFile}
            className="hidden"
          />

          {photoUrl && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-sm text-gray-400 hover:text-red-600"
            >
              제거
            </button>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    </div>
  )
}
