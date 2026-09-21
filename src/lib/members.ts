import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
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
