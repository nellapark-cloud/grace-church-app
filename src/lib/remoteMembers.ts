import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  documentId,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from './firebase'
import {
  RECIPROCAL_RELATION,
  type FamilyLink,
  type FamilyRelation,
  type Member,
  type MemberInput,
} from '../types/member'

function membersCol() {
  return collection(db, 'members')
}

export function subscribeMembers(
  onChange: (members: Member[]) => void,
  onError: (error: Error) => void,
) {
  const q = query(membersCol(), orderBy('name'))
  return onSnapshot(
    q,
    (snapshot) => {
      const members = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Member, 'id'>),
      }))
      onChange(members)
    },
    onError,
  )
}

export async function listAllMembers(): Promise<Member[]> {
  const snap = await getDocs(query(membersCol(), orderBy('name')))
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Member, 'id'>) }))
}

export async function createMember(input: MemberInput) {
  await addDoc(membersCol(), {
    ...input,
    familyLinks: [],
    createdAt: Date.now(),
    updatedAt: serverTimestamp(),
  })
}

export async function updateMember(id: string, input: MemberInput) {
  await updateDoc(doc(db, 'members', id), {
    ...input,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteMember(id: string) {
  await deleteDoc(doc(db, 'members', id))
}

export async function getMember(id: string): Promise<Member | null> {
  const snap = await getDoc(doc(db, 'members', id))
  if (!snap.exists()) return null
  return { id: snap.id, ...(snap.data() as Omit<Member, 'id'>) }
}

export async function getMembersByIds(ids: string[]): Promise<Member[]> {
  if (ids.length === 0) return []
  const snap = await getDocs(
    query(membersCol(), where(documentId(), 'in', ids.slice(0, 30))),
  )
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Member, 'id'>) }))
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
  const [member, target] = await Promise.all([
    getMember(memberId),
    getMember(targetId),
  ])
  if (!member || !target) return
  await Promise.all([
    updateDoc(doc(db, 'members', memberId), {
      familyLinks: addLink(member.familyLinks ?? [], {
        memberId: targetId,
        relation,
      }),
    }),
    updateDoc(doc(db, 'members', targetId), {
      familyLinks: addLink(target.familyLinks ?? [], {
        memberId,
        relation: RECIPROCAL_RELATION[relation],
      }),
    }),
  ])
}

export async function unlinkFamilyMember(memberId: string, targetId: string) {
  const [member, target] = await Promise.all([
    getMember(memberId),
    getMember(targetId),
  ])
  await Promise.all([
    member &&
      updateDoc(doc(db, 'members', memberId), {
        familyLinks: removeLink(member.familyLinks ?? [], targetId),
      }),
    target &&
      updateDoc(doc(db, 'members', targetId), {
        familyLinks: removeLink(target.familyLinks ?? [], memberId),
      }),
  ])
}
