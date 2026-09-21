export type MemberStatus = '재적' | '휴면' | '이명' | '소천'

export type MemberGender = '남' | '여'

export interface Member {
  id: string
  name: string
  gender: MemberGender
  birthDate: string
  phone: string
  address: string
  email: string
  baptismDate: string
  position: string
  group: string
  registeredDate: string
  status: MemberStatus
  familyName: string
  familyRole: string
  memo: string
  createdAt: number
  updatedAt: unknown
}

export type MemberInput = Omit<Member, 'id' | 'createdAt' | 'updatedAt'>

export const MEMBER_STATUSES: MemberStatus[] = ['재적', '휴면', '이명', '소천']

export const emptyMemberInput: MemberInput = {
  name: '',
  gender: '남',
  birthDate: '',
  phone: '',
  address: '',
  email: '',
  baptismDate: '',
  position: '',
  group: '',
  registeredDate: '',
  status: '재적',
  familyName: '',
  familyRole: '',
  memo: '',
}
