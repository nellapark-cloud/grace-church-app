import { firebaseConfigured } from './firebase'
import * as remote from './remoteMembers'
import * as local from './localMembers'
import type { Member, MemberInput } from '../types/member'

const impl = firebaseConfigured ? remote : local

export function subscribeMembers(
  onChange: (members: Member[]) => void,
  onError: (error: Error) => void,
) {
  return impl.subscribeMembers(onChange, onError)
}

export function createMember(input: MemberInput) {
  return impl.createMember(input)
}

export function updateMember(id: string, input: MemberInput) {
  return impl.updateMember(id, input)
}

export function deleteMember(id: string) {
  return impl.deleteMember(id)
}

export function getMember(id: string) {
  return impl.getMember(id)
}

export function getFamilyMembers(familyName: string, excludeId: string) {
  return impl.getFamilyMembers(familyName, excludeId)
}
