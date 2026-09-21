import { firebaseConfigured } from './firebase'
import * as remote from './remoteRegistrations'
import * as local from './localRegistrations'
import type {
  Registration,
  RegistrationInput,
  RegistrationStatus,
} from '../types/registration'

const impl = firebaseConfigured ? remote : local

export function submitRegistration(input: RegistrationInput) {
  return impl.submitRegistration(input)
}

export function subscribePendingRegistrations(
  onChange: (regs: Registration[]) => void,
  onError: (error: Error) => void,
) {
  return impl.subscribePendingRegistrations(onChange, onError)
}

export function setRegistrationStatus(id: string, status: RegistrationStatus) {
  return impl.setRegistrationStatus(id, status)
}

export function getRegistration(id: string) {
  return impl.getRegistration(id)
}
