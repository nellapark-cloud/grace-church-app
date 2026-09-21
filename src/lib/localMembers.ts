import {
  RECIPROCAL_RELATION,
  type FamilyLink,
  type FamilyRelation,
  type Member,
  type MemberInput,
} from '../types/member'

const STORAGE_KEY = 'grace-church-demo-members'

type Listener = (members: Member[]) => void
const listeners = new Set<Listener>()

function seedData(): Member[] {
  const now = Date.now()
  const base: Omit<Member, 'id' | 'createdAt' | 'updatedAt' | 'familyLinks'>[] = [
    {
      name: '김은혜',
      gender: '여',
      birthDate: '1975-03-12',
      phone: '010-1234-5678',
      address: '서울시 강남구 은혜로 12',
      email: 'eunhye@example.com',
      baptismType: '세례',
      baptismDate: '1998-04-05',
      position: '권사',
      group: '1구역',
      registeredDate: '2005-01-09',
      status: '재적',
      photoUrl: '',
      memo: '',
    },
    {
      name: '박신실',
      gender: '남',
      birthDate: '1972-11-02',
      phone: '010-2345-6789',
      address: '서울시 강남구 은혜로 12',
      email: '',
      baptismType: '세례',
      baptismDate: '1998-04-05',
      position: '장로',
      group: '1구역',
      registeredDate: '2005-01-09',
      status: '재적',
      photoUrl: '',
      memo: '',
    },
    {
      name: '이소망',
      gender: '여',
      birthDate: '1990-07-21',
      phone: '010-3456-7890',
      address: '서울시 서초구 소망길 5',
      email: 'somang@example.com',
      baptismType: '침례',
      baptismDate: '2010-12-25',
      position: '집사',
      group: '2구역',
      registeredDate: '2010-03-14',
      status: '재적',
      photoUrl: '',
      memo: '',
    },
    {
      name: '최사랑',
      gender: '남',
      birthDate: '1988-02-14',
      phone: '010-4567-8901',
      address: '경기도 성남시 분당구 사랑로 88',
      email: '',
      baptismType: '',
      baptismDate: '',
      position: '성도',
      group: '2구역',
      registeredDate: '2022-06-01',
      status: '휴면',
      photoUrl: '',
      memo: '타지역 이주로 출석 저조',
    },
    {
      name: '정믿음',
      gender: '여',
      birthDate: '1965-09-30',
      phone: '010-5678-9012',
      address: '서울시 송파구 믿음대로 3',
      email: '',
      baptismType: '세례',
      baptismDate: '1990-05-06',
      position: '권사',
      group: '3구역',
      registeredDate: '1999-11-20',
      status: '재적',
      photoUrl: '',
      memo: '',
    },
  ]
  const members = base.map((m, i) => ({
    id: `demo-${i}`,
    ...m,
    familyLinks: [] as FamilyLink[],
    createdAt: now,
    updatedAt: now,
  }))
  members[0].familyLinks = [{ memberId: 'demo-1', relation: '배우자' }]
  members[1].familyLinks = [{ memberId: 'demo-0', relation: '배우자' }]
  return members
}

function readAll(): Member[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Member[]
  } catch {
    // fall through to reseed
  }
  const seeded = seedData()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
  return seeded
}

function sortByName(members: Member[]) {
  return [...members].sort((a, b) => a.name.localeCompare(b.name, 'ko'))
}

function writeAll(members: Member[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(members))
  const sorted = sortByName(members)
  listeners.forEach((listener) => listener(sorted))
}

export function subscribeMembers(
  onChange: (members: Member[]) => void,
  _onError: (error: Error) => void,
) {
  listeners.add(onChange)
  onChange(sortByName(readAll()))
  return () => {
    listeners.delete(onChange)
  }
}

export async function listAllMembers(): Promise<Member[]> {
  return sortByName(readAll())
}

export async function createMember(input: MemberInput) {
  const all = readAll()
  const now = Date.now()
  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `local-${now}-${Math.random().toString(36).slice(2)}`
  all.push({ id, ...input, familyLinks: [], createdAt: now, updatedAt: now })
  writeAll(all)
}

export async function updateMember(id: string, input: MemberInput) {
  const all = readAll()
  const index = all.findIndex((m) => m.id === id)
  if (index === -1) return
  all[index] = { ...all[index], ...input, updatedAt: Date.now() }
  writeAll(all)
}

export async function deleteMember(id: string) {
  writeAll(readAll().filter((m) => m.id !== id))
}

export async function getMember(id: string): Promise<Member | null> {
  return readAll().find((m) => m.id === id) ?? null
}

export async function getMembersByIds(ids: string[]): Promise<Member[]> {
  const idSet = new Set(ids)
  return readAll().filter((m) => idSet.has(m.id))
}

function addLink(links: FamilyLink[], link: FamilyLink): FamilyLink[] {
  return [...links.filter((l) => l.memberId !== link.memberId), link]
}

function removeLink(links: FamilyLink[], memberId: string): FamilyLink[] {
  return links.filter((l) => l.memberId !== memberId)
}

export async function linkFamilyMember(
  memberId: string,
  targetId: string,
  relation: FamilyRelation,
) {
  const all = readAll()
  const member = all.find((m) => m.id === memberId)
  const target = all.find((m) => m.id === targetId)
  if (!member || !target) return
  member.familyLinks = addLink(member.familyLinks ?? [], {
    memberId: targetId,
    relation,
  })
  target.familyLinks = addLink(target.familyLinks ?? [], {
    memberId,
    relation: RECIPROCAL_RELATION[relation],
  })
  writeAll(all)
}

export async function unlinkFamilyMember(memberId: string, targetId: string) {
  const all = readAll()
  const member = all.find((m) => m.id === memberId)
  const target = all.find((m) => m.id === targetId)
  if (member) member.familyLinks = removeLink(member.familyLinks ?? [], targetId)
  if (target) target.familyLinks = removeLink(target.familyLinks ?? [], memberId)
  writeAll(all)
}
