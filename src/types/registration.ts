import type { MemberGender } from './member'

export type RegistrationStatus = 'pending' | 'approved' | 'rejected'

export interface RegistrationInput {
  name: string
  gender: MemberGender
  birthDate: string
  phone: string
  address: string
  email: string
  photoUrl: string
  memo: string
}

export interface Registration extends RegistrationInput {
  id: string
  status: RegistrationStatus
  submittedAt: number
}

export const emptyRegistrationInput: RegistrationInput = {
  name: '',
  gender: '남',
  birthDate: '',
  phone: '',
  address: '',
  email: '',
  photoUrl: '',
  memo: '',
}
