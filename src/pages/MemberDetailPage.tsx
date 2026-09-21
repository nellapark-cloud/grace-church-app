import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteMember, getFamilyMembers, getMember } from '../lib/members'
import type { Member } from '../types/member'

const fieldRows: { label: string; key: keyof Member }[] = [
  { label: '성별', key: 'gender' },
  { label: '생년월일', key: 'birthDate' },
  { label: '연락처', key: 'phone' },
  { label: '주소', key: 'address' },
  { label: '이메일', key: 'email' },
  { label: '직분', key: 'position' },
  { label: '소속(구역/목장)', key: 'group' },
  { label: '세례일', key: 'baptismDate' },
  { label: '등록일', key: 'registeredDate' },
  { label: '가족 내 관계', key: 'familyRole' },
  { label: '비고', key: 'memo' },
]

export function MemberDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [member, setMember] = useState<Member | null>(null)
  const [family, setFamily] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getMember(id)
      .then(async (data) => {
        if (!data) {
          setError('교인 정보를 찾을 수 없습니다.')
          return
        }
        setMember(data)

        if (data.familyName) {
          setFamily(await getFamilyMembers(data.familyName, data.id))
        }
      })
      .catch(() => setError('교인 정보를 불러오지 못했습니다.'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleDelete() {
    if (!id) return
    if (!confirm('정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return
    await deleteMember(id)
    navigate('/')
  }

  if (loading) {
    return <p className="py-10 text-center text-sm text-gray-400">불러오는 중...</p>
  }
  if (error || !member) {
    return <p className="py-10 text-center text-sm text-red-600">{error}</p>
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            {member.name}
            <span className="ml-2 text-sm font-normal text-gray-400">
              {member.gender}
            </span>
          </h1>
          <span className="mt-1 inline-block rounded-full border border-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
            {member.status}
          </span>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/members/${member.id}/edit`}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            수정
          </Link>
          <button
            onClick={handleDelete}
            className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            삭제
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <dl className="divide-y divide-gray-100 text-sm">
          {fieldRows.map(({ label, key }) => (
            <div
              key={key}
              className="grid grid-cols-3 gap-4 px-4 py-3"
            >
              <dt className="text-gray-500">{label}</dt>
              <dd className="col-span-2 text-gray-900">
                {(member[key] as string) || '-'}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {member.familyName && (
        <div className="mt-4">
          <h2 className="mb-2 text-sm font-semibold text-gray-900">
            {member.familyName} 가족 구성원
          </h2>
          {family.length === 0 ? (
            <p className="text-sm text-gray-400">
              같은 가족으로 등록된 다른 교인이 없습니다.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {family.map((f) => (
                <Link
                  key={f.id}
                  to={`/members/${f.id}`}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 hover:bg-gray-50"
                >
                  <span className="text-sm font-medium text-gray-900">
                    {f.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {f.familyRole || '-'}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      <Link
        to="/"
        className="mt-5 inline-block text-sm text-gray-500 hover:text-gray-900"
      >
        ← 목록으로
      </Link>
    </div>
  )
}
