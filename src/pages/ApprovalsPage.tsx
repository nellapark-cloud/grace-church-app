import { useEffect, useState } from 'react'
import { createMember } from '../lib/members'
import {
  setRegistrationStatus,
  subscribePendingRegistrations,
} from '../lib/registrations'
import { Avatar } from '../components/Avatar'
import { emptyMemberInput, type MemberInput } from '../types/member'
import type { Registration } from '../types/registration'

function toMemberInput(reg: Registration): MemberInput {
  return {
    ...emptyMemberInput,
    name: reg.name,
    gender: reg.gender,
    birthDate: reg.birthDate,
    phone: reg.phone,
    address: reg.address,
    email: reg.email,
    photoUrl: reg.photoUrl,
    memo: reg.memo,
    registeredDate: new Date().toISOString().slice(0, 10),
  }
}

export function ApprovalsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState('')

  useEffect(() => {
    const unsubscribe = subscribePendingRegistrations(
      (regs) => {
        setRegistrations(regs)
        setLoading(false)
      },
      () => {
        setError('신청 목록을 불러오지 못했습니다.')
        setLoading(false)
      },
    )
    return unsubscribe
  }, [])

  async function handleApprove(reg: Registration) {
    setBusyId(reg.id)
    try {
      await createMember(toMemberInput(reg))
      await setRegistrationStatus(reg.id, 'approved')
    } finally {
      setBusyId('')
    }
  }

  async function handleReject(reg: Registration) {
    if (!confirm(`${reg.name}님의 신청을 거절하시겠습니까?`)) return
    setBusyId(reg.id)
    try {
      await setRegistrationStatus(reg.id, 'rejected')
    } finally {
      setBusyId('')
    }
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-lg font-semibold text-gray-900">가입 승인</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          대기 중인 신청 {registrations.length}건
        </p>
      </div>

      {loading && (
        <p className="py-10 text-center text-sm text-gray-400">
          불러오는 중...
        </p>
      )}
      {error && <p className="py-10 text-center text-sm text-red-600">{error}</p>}

      {!loading && !error && registrations.length === 0 && (
        <p className="py-10 text-center text-sm text-gray-400">
          대기 중인 신청이 없습니다.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {registrations.map((reg) => (
          <div
            key={reg.id}
            className="rounded-lg border border-gray-200 bg-white p-4"
          >
            <div className="flex items-start gap-3">
              <Avatar name={reg.name} photoUrl={reg.photoUrl} size="md" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-gray-900">
                    {reg.name}
                    <span className="ml-1.5 text-xs font-normal text-gray-400">
                      {reg.gender}
                    </span>
                  </p>
                  <span className="shrink-0 text-xs text-gray-400">
                    {new Date(reg.submittedAt).toLocaleDateString('ko-KR')} 신청
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  {reg.phone || '연락처 없음'}
                  {reg.address && ` · ${reg.address}`}
                </p>
                {reg.email && (
                  <p className="text-sm text-gray-500">{reg.email}</p>
                )}
                {reg.memo && (
                  <p className="mt-1.5 rounded-md bg-gray-50 px-2.5 py-1.5 text-sm text-gray-600">
                    {reg.memo}
                  </p>
                )}
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleApprove(reg)}
                    disabled={busyId === reg.id}
                    className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                  >
                    승인
                  </button>
                  <button
                    onClick={() => handleReject(reg)}
                    disabled={busyId === reg.id}
                    className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    거절
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
