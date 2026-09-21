export type MemberStatus = '재적' | '휴면' | '이명' | '소천'

export type MemberGender = '남' | '여'

export type BaptismType = '' | '세례' | '침례'

export const BAPTISM_TYPES: BaptismType[] = ['세례', '침례']

export type FamilyRelation = '배우자' | '부모' | '자녀' | '형제자매' | '기타'

export const FAMILY_RELATIONS: FamilyRelation[] = [
  '배우자',
  '부모',
  '자녀',
  '형제자매',
  '기타',
]

export const RECIPROCAL_RELATION: Record<FamilyRelation, FamilyRelation> = {
  배우자: '배우자',
  부모: '자녀',
  자녀: '부모',
  형제자매: '형제자매',
  기타: '기타',
}

export interface FamilyLink {
  memberId: string
  relation: FamilyRelation
}

export interface Member {
  id: string
  name: string
  gender: MemberGender
  birthDate: string
  phone: string
  address: string
  email: string
  baptismType: BaptismType
  baptismDate: string
  position: string
  group: string
  registeredDate: string
  status: MemberStatus
  photoUrl: string
  familyLinks: FamilyLink[]
  memo: string
  createdAt: number
  updatedAt: unknown
}

export type MemberInput = Omit<
  Member,
  'id' | 'createdAt' | 'updatedAt' | 'familyLinks'
>

export const MEMBER_STATUSES: MemberStatus[] = ['재적', '휴면', '이명', '소천']

export const emptyMemberInput: MemberInput = {
  name: '',
  gender: '남',
  birthDate: '',
  phone: '',
  address: '',
  email: '',
  baptismType: '',
  baptismDate: '',
  position: '',
  group: '',
  registeredDate: '',
  status: '재적',
  photoUrl: '',
  memo: '',
}
