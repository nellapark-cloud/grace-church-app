import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { createMember, getMember, updateMember } from '../lib/members'
import { subscribeSettings } from '../lib/settings'
import { DateField } from '../components/DateField'
import { PhotoPicker } from '../components/PhotoPicker'
import {
  BAPTISM_TYPES,
  MEMBER_STATUSES,
  emptyMemberInput,
  type BaptismType,
  type MemberInput,
} from '../types/member'
import { defaultSettings, type AppSettings } from '../types/settings'

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900'
const labelClass = 'mb-1 block text-sm font-medium text-gray-700'

export function MemberFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState<MemberInput>(emptyMemberInput)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)

  useEffect(() => {
    const unsubscribe = subscribeSettings(setSettings, () => {})
    return unsubscribe
  }, [])

  useEffect(() => {
    if (!id) return
    getMember(id)
      .then((data) => {
        if (data) {
          setForm({ ...emptyMemberInput, ...data })
        } else {
          setError('교인 정보를 찾을 수 없습니다.')
        }
      })
      .catch(() => setError('교인 정보를 불러오지 못했습니다.'))
      .finally(() => setLoading(false))
  }, [id])

  function update<K extends keyof MemberInput>(key: K, value: MemberInput[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (isEdit && id) {
        await updateMember(id, form)
        navigate(`/members/${id}`)
      } else {
        await createMember(form)
        navigate('/')
      }
    } catch {
      setError('저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="py-10 text-center text-sm text-gray-400">불러오는 중...</p>
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-5 text-lg font-semibold text-gray-900">
        {isEdit ? '교인 정보 수정' : '교인 등록'}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
      >
        <section>
          <h2 className="mb-3 text-sm font-semibold text-gray-900">기본정보</h2>
          <div className="mb-4">
            <PhotoPicker
              name={form.name}
              photoUrl={form.photoUrl}
              onChange={(url) => update('photoUrl', url)}
            />
          </div>
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
              <label className={labelClass}>연락처</label>
              <input
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
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">신앙정보</h2>
            <Link
              to="/settings"
              className="text-xs text-gray-400 hover:text-gray-900 hover:underline"
            >
              직분/소속 목록 관리
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>직분</label>
              <select
                value={form.position}
                onChange={(e) => update('position', e.target.value)}
                className={inputClass}
              >
                <option value="">선택 안 함</option>
                {(form.position && !settings.positions.includes(form.position)
                  ? [form.position, ...settings.positions]
                  : settings.positions
                ).map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>소속 (구역/목장)</label>
              <select
                value={form.group}
                onChange={(e) => update('group', e.target.value)}
                className={inputClass}
              >
                <option value="">선택 안 함</option>
                {(form.group && !settings.groups.includes(form.group)
                  ? [form.group, ...settings.groups]
                  : settings.groups
                ).map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>세례/침례</label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <select
                  value={form.baptismType}
                  onChange={(e) =>
                    update('baptismType', e.target.value as BaptismType)
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 sm:w-28 sm:shrink-0"
                >
                  <option value="">구분 없음</option>
                  {BAPTISM_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <DateField
                  value={form.baptismDate}
                  onChange={(v) => update('baptismDate', v)}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>등록일</label>
              <DateField
                value={form.registeredDate}
                onChange={(v) => update('registeredDate', v)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>재적 상태</label>
              <select
                value={form.status}
                onChange={(e) =>
                  update('status', e.target.value as MemberInput['status'])
                }
                className={inputClass}
              >
                {MEMBER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section>
          <label className={labelClass}>비고</label>
          <textarea
            value={form.memo}
            onChange={(e) => update('memo', e.target.value)}
            rows={3}
            className={inputClass}
          />
        </section>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? '저장 중...' : '저장'}
          </button>
        </div>
      </form>
    </div>
  )
}
