import {
  addDoc,
  collection,
  deleteDoc,
  doc,
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
import type { Member, MemberInput } from '../types/member'

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

export async function createMember(input: MemberInput) {
  await addDoc(membersCol(), {
    ...input,
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

export async function getFamilyMembers(
  familyName: string,
  excludeId: string,
): Promise<Member[]> {
  const q = query(membersCol(), where('familyName', '==', familyName))
  const snap = await getDocs(q)
  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<Member, 'id'>) }))
    .filter((m) => m.id !== excludeId)
}
