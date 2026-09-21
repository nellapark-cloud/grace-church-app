import { firebaseConfigured } from './firebase'
import * as remote from './remoteMembers'
import * as local from './localMembers'
import type { FamilyRelation, Member, MemberInput } from '../types/member'

const impl = firebaseConfigured ? remote : local

export function subscribeMembers(
  onChange: (members: Member[]) => void,
  onError: (error: Error) => void,
) {
  return impl.subscribeMembers(onChange, onError)
}

export function listAllMembers() {
  return impl.listAllMembers()
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

export function getMembersByIds(ids: string[]) {
  return impl.getMembersByIds(ids)
}

export function linkFamilyMember(
  memberId: string,
  targetId: string,
  relation: FamilyRelation,
) {
  return impl.linkFamilyMember(memberId, targetId, relation)
}

export function unlinkFamilyMember(memberId: string, targetId: string) {
  return impl.unlinkFamilyMember(memberId, targetId)
}
