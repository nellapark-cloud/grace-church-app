import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  deleteMember,
  getMember,
  getMembersByIds,
  linkFamilyMember,
  listAllMembers,
  unlinkFamilyMember,
} from '../lib/members'
import { Avatar } from '../components/Avatar'
import { FAMILY_RELATIONS, type FamilyRelation, type Member } from '../types/member'

const fieldRows: { label: string; key: keyof Member }[] = [
  { label: '성별', key: 'gender' },
  { label: '생년월일', key: 'birthDate' },
  { label: '연락처', key: 'phone' },
  { label: '주소', key: 'address' },
  { label: '이메일', key: 'email' },
  { label: '직분', key: 'position' },
  { label: '소속(구역/목장)', key: 'group' },
  { label: '등록일', key: 'registeredDate' },
  { label: '비고', key: 'memo' },
]

export function MemberDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [member, setMember] = useState<Member | null>(null)
  const [family, setFamily] = useState<Member[]>([])
  const [allMembers, setAllMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [familySearch, setFamilySearch] = useState('')
  const [relation, setRelation] = useState<FamilyRelation>('배우자')
  const [linking, setLinking] = useState(false)

  async function load(memberId: string) {
    const data = await getMember(memberId)
    if (!data) {
      setError('교인 정보를 찾을 수 없습니다.')
      return
    }
    setMember(data)
    const links = data.familyLinks ?? []
    setFamily(
      links.length > 0
        ? await getMembersByIds(links.map((l) => l.memberId))
        : [],
    )
  }

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError('')
    Promise.all([load(id), listAllMembers().then(setAllMembers)])
      .catch(() => setError('교인 정보를 불러오지 못했습니다.'))
      .finally(() => setLoading(false))
  }, [id])

  const linkedIds = useMemo(
    () => new Set((member?.familyLinks ?? []).map((l) => l.memberId)),
    [member],
  )

  const candidates = useMemo(() => {
    const keyword = familySearch.trim()
    if (!keyword || !member) return []
    return allMembers
      .filter(
        (m) =>
          m.id !== member.id && !linkedIds.has(m.id) && m.name.includes(keyword),
      )
      .slice(0, 5)
  }, [allMembers, familySearch, linkedIds, member])

  async function handleDelete() {
    if (!id) return
    if (!confirm('정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return
    await deleteMember(id)
    navigate('/')
  }

  async function handleLink(targetId: string) {
    if (!member || linking) return
    setLinking(true)
    try {
      await linkFamilyMember(member.id, targetId, relation)
      setFamilySearch('')
      await load(member.id)
    } finally {
      setLinking(false)
    }
  }

  async function handleUnlink(targetId: string) {
    if (!member) return
    await unlinkFamilyMember(member.id, targetId)
    await load(member.id)
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
        <div className="flex items-center gap-3">
          <Avatar name={member.name} photoUrl={member.photoUrl} size="lg" />
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
          {fieldRows.slice(0, 6).map(({ label, key }) => (
            <div key={key} className="grid grid-cols-3 gap-4 px-4 py-3">
              <dt className="text-gray-500">{label}</dt>
              <dd className="col-span-2 text-gray-900">
                {(member[key] as string) || '-'}
              </dd>
            </div>
          ))}
          <div className="grid grid-cols-3 gap-4 px-4 py-3">
            <dt className="text-gray-500">세례/침례</dt>
            <dd className="col-span-2 text-gray-900">
              {member.baptismType
                ? `${member.baptismType}${member.baptismDate ? ` · ${member.baptismDate}` : ''}`
                : '-'}
            </dd>
          </div>
          {fieldRows.slice(6).map(({ label, key }) => (
            <div key={key} className="grid grid-cols-3 gap-4 px-4 py-3">
              <dt className="text-gray-500">{label}</dt>
              <dd className="col-span-2 text-gray-900">
                {(member[key] as string) || '-'}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-4">
        <h2 className="mb-2 text-sm font-semibold text-gray-900">가족</h2>

        {family.length > 0 && (
          <div className="mb-3 flex flex-col gap-2">
            {family.map((f) => {
              const link = member.familyLinks.find((l) => l.memberId === f.id)
              return (
                <div
                  key={f.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3.5 py-2.5"
                >
                  <Link
                    to={`/members/${f.id}`}
                    className="flex items-center gap-2.5 hover:underline"
                  >
                    <Avatar name={f.name} photoUrl={f.photoUrl} size="sm" />
                    <span className="text-sm font-medium text-gray-900">
                      {f.name}
                    </span>
                  </Link>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">
                      {link?.relation ?? '-'}
                    </span>
                    <button
                      onClick={() => handleUnlink(f.id)}
                      className="text-xs text-gray-400 hover:text-red-600"
                    >
                      연결 해제
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="rounded-lg border border-gray-200 bg-white p-3.5">
          <p className="mb-2 text-xs font-medium text-gray-500">가족 연결하기</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <select
              value={relation}
              onChange={(e) => setRelation(e.target.value as FamilyRelation)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
            >
              {FAMILY_RELATIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <input
              value={familySearch}
              onChange={(e) => setFamilySearch(e.target.value)}
              placeholder="이름으로 검색"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
          </div>
          {candidates.length > 0 && (
            <div className="mt-2 flex flex-col gap-1">
              {candidates.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  disabled={linking}
                  onClick={() => handleLink(c.id)}
                  className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm hover:bg-gray-50 disabled:opacity-50"
                >
                  <Avatar name={c.name} photoUrl={c.photoUrl} size="sm" />
                  <span className="text-gray-900">{c.name}</span>
                  <span className="text-xs text-gray-400">
                    {[c.position, c.group].filter(Boolean).join(' · ')}
                  </span>
                </button>
              ))}
            </div>
          )}
          {familySearch.trim() && candidates.length === 0 && (
            <p className="mt-2 text-xs text-gray-400">
              일치하는 교인이 없습니다.
            </p>
          )}
        </div>
      </div>

      <Link
        to="/"
        className="mt-5 inline-block text-sm text-gray-500 hover:text-gray-900"
      >
        ← 목록으로
      </Link>
    </div>
  )
}
