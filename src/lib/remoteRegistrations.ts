import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from './firebase'
import type {
  Registration,
  RegistrationInput,
  RegistrationStatus,
} from '../types/registration'

function registrationsCol() {
  return collection(db, 'registrations')
}

function sortBySubmitted(regs: Registration[]) {
  return [...regs].sort((a, b) => a.submittedAt - b.submittedAt)
}

export async function submitRegistration(input: RegistrationInput) {
  await addDoc(registrationsCol(), {
    ...input,
    status: 'pending',
    submittedAt: Date.now(),
  })
}

export function subscribePendingRegistrations(
  onChange: (regs: Registration[]) => void,
  onError: (error: Error) => void,
) {
  const q = query(registrationsCol(), where('status', '==', 'pending'))
  return onSnapshot(
    q,
    (snapshot) => {
      const regs = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Registration, 'id'>),
      }))
      onChange(sortBySubmitted(regs))
    },
    onError,
  )
}

export async function setRegistrationStatus(
  id: string,
  status: RegistrationStatus,
) {
  await updateDoc(doc(db, 'registrations', id), { status })
}

export async function getRegistration(id: string): Promise<Registration | null> {
  const snap = await getDoc(doc(db, 'registrations', id))
  if (!snap.exists()) return null
  return { id: snap.id, ...(snap.data() as Omit<Registration, 'id'>) }
}
