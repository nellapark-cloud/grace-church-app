import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { submitRegistration } from '../lib/registrations'
import { DateField } from '../components/DateField'
import { PhotoPicker } from '../components/PhotoPicker'
import { emptyRegistrationInput, type RegistrationInput } from '../types/registration'

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900'
const labelClass = 'mb-1 block text-sm font-medium text-gray-700'

export function RegisterPage() {
  const [form, setForm] = useState<RegistrationInput>(emptyRegistrationInput)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  function update<K extends keyof RegistrationInput>(
    key: K,
    value: RegistrationInput[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await submitRegistration(form)
      setDone(true)
    } catch {
      setError('신청 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-[env(safe-area-inset-top)]">
        <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-gray-900">
            신청이 접수되었습니다
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            관리자 승인 후 재적부에 등록됩니다.
          </p>
          <Link
            to="/"
            className="mt-4 inline-block text-sm text-gray-500 hover:text-gray-900"
          >
            ← 처음으로
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 pb-[calc(env(safe-area-inset-bottom)+2.5rem)] pt-[calc(env(safe-area-inset-top)+2.5rem)]">
      <div className="mx-auto max-w-lg">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold tracking-tight text-gray-900">
            은혜교회 교인 등록 신청
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            신청하시면 관리자 확인 후 재적부에 등록됩니다.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
        >
          <PhotoPicker
            name={form.name}
            photoUrl={form.photoUrl}
            onChange={(url) => update('photoUrl', url)}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>이름 *</label>
              <input
                required
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>성별</label>
              <select
                value={form.gender}
                onChange={(e) => update('gender', e.target.value as '남' | '여')}
                className={inputClass}
              >
                <option value="남">남</option>
                <option value="여">여</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>생년월일</label>
              <DateField
                value={form.birthDate}
                onChange={(v) => update('birthDate', v)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>연락처 *</label>
              <input
                required
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="010-0000-0000"
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>주소</label>
              <input
                value={form.address}
                onChange={(e) => update('address', e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>이메일</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>하고 싶은 말 (선택)</label>
              <textarea
                value={form.memo}
                onChange={(e) => update('memo', e.target.value)}
                rows={3}
                placeholder="소속 희망 구역, 문의사항 등"
                className={inputClass}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {submitting ? '신청 중...' : '신청하기'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          기독교한국침례회 은혜교회
        </p>
      </div>
    </div>
  )
}
