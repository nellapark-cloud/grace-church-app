import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { subscribeMembers } from '../lib/members'
import { Avatar } from '../components/Avatar'
import { MEMBER_STATUSES, type Member, type MemberStatus } from '../types/member'

const statusStyles: Record<MemberStatus, string> = {
  재적: 'bg-green-50 text-green-700 border-green-200',
  휴면: 'bg-amber-50 text-amber-700 border-amber-200',
  이명: 'bg-gray-100 text-gray-600 border-gray-200',
  소천: 'bg-gray-100 text-gray-500 border-gray-200',
}

export function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<MemberStatus | '전체'>(
    '전체',
  )
  const [groupFilter, setGroupFilter] = useState('전체')

  useEffect(() => {
    const unsubscribe = subscribeMembers(
      (list) => {
        setMembers(list)
        setLoading(false)
      },
      () => {
        setError('교인 목록을 불러오지 못했습니다.')
        setLoading(false)
      },
    )
    return unsubscribe
  }, [])

  const groups = useMemo(() => {
    const set = new Set(members.map((m) => m.group).filter(Boolean))
    return ['전체', ...Array.from(set).sort()]
  }, [members])

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return members.filter((m) => {
      if (statusFilter !== '전체' && m.status !== statusFilter) return false
      if (groupFilter !== '전체' && m.group !== groupFilter) return false
      if (!keyword) return true
      return (
        m.name.toLowerCase().includes(keyword) ||
        m.phone.includes(keyword) ||
        m.address.toLowerCase().includes(keyword)
      )
    })
  }, [members, search, statusFilter, groupFilter])

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">재적부</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            전체 {members.length}명 · 조회 {filtered.length}명
          </p>
        </div>
        <Link
          to="/members/new"
          className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          + 교인 등록
        </Link>
      </div>

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="이름, 연락처, 주소로 검색"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 sm:max-w-xs"
        />
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as MemberStatus | '전체')
          }
          className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
        >
          <option value="전체">전체 상태</option>
          {MEMBER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={groupFilter}
          onChange={(e) => setGroupFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
        >
          {groups.map((g) => (
            <option key={g} value={g}>
              {g === '전체' ? '전체 구역' : g}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <p className="py-10 text-center text-sm text-gray-400">
          불러오는 중...
        </p>
      )}
      {error && <p className="py-10 text-center text-sm text-red-600">{error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <p className="py-10 text-center text-sm text-gray-400">
          등록된 교인이 없습니다.
        </p>
      )}

      {!loading && !error && filtered.length > 0 && (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-lg border border-gray-200 bg-white md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs text-gray-500">
                <tr>
                  <th className="w-10 px-4 py-2.5"></th>
                  <th className="px-4 py-2.5 font-medium">이름</th>
                  <th className="px-4 py-2.5 font-medium">직분</th>
                  <th className="px-4 py-2.5 font-medium">소속</th>
                  <th className="px-4 py-2.5 font-medium">연락처</th>
                  <th className="px-4 py-2.5 font-medium">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5">
                      <Avatar name={m.name} photoUrl={m.photoUrl} size="sm" />
                    </td>
                    <td className="px-4 py-2.5">
                      <Link
                        to={`/members/${m.id}`}
                        className="font-medium text-gray-900 hover:underline"
                      >
                        {m.name}
                      </Link>
                      <span className="ml-1.5 text-xs text-gray-400">
                        {m.gender}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-gray-600">
                      {m.position || '-'}
                    </td>
                    <td className="px-4 py-2.5 text-gray-600">
                      {m.group || '-'}
                    </td>
                    <td className="px-4 py-2.5 text-gray-600">
                      {m.phone || '-'}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-xs font-medium ${statusStyles[m.status]}`}
                      >
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="flex flex-col gap-2 md:hidden">
            {filtered.map((m) => (
              <Link
                key={m.id}
                to={`/members/${m.id}`}
                className="rounded-lg border border-gray-200 bg-white p-3.5 active:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={m.name} photoUrl={m.photoUrl} size="sm" />
                    <div>
                      <span className="font-medium text-gray-900">
                        {m.name}
                      </span>
                      <span className="ml-1.5 text-xs text-gray-400">
                        {m.gender}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs font-medium ${statusStyles[m.status]}`}
                  >
                    {m.status}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-gray-500">
                  {[m.position, m.group].filter(Boolean).join(' · ') || '-'}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {m.phone || '연락처 없음'}
                </p>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
