import type {
  Registration,
  RegistrationInput,
  RegistrationStatus,
} from '../types/registration'

const STORAGE_KEY = 'grace-church-demo-registrations'

type Listener = (regs: Registration[]) => void
const listeners = new Set<Listener>()

function readAll(): Registration[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Registration[]
  } catch {
    // ignore corrupt data
  }
  return []
}

function sortBySubmitted(regs: Registration[]) {
  return [...regs].sort((a, b) => a.submittedAt - b.submittedAt)
}

function writeAll(all: Registration[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  const pending = sortBySubmitted(all.filter((r) => r.status === 'pending'))
  listeners.forEach((listener) => listener(pending))
}

export async function submitRegistration(input: RegistrationInput) {
  const all = readAll()
  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `reg-${Date.now()}-${Math.random().toString(36).slice(2)}`
  all.push({ id, ...input, status: 'pending', submittedAt: Date.now() })
  writeAll(all)
}

export function subscribePendingRegistrations(
  onChange: Listener,
  _onError: (error: Error) => void,
) {
  listeners.add(onChange)
  onChange(sortBySubmitted(readAll().filter((r) => r.status === 'pending')))
  return () => {
    listeners.delete(onChange)
  }
}

export async function setRegistrationStatus(
  id: string,
  status: RegistrationStatus,
) {
  const all = readAll()
  const index = all.findIndex((r) => r.id === id)
  if (index === -1) return
  all[index] = { ...all[index], status }
  writeAll(all)
}

export async function getRegistration(id: string): Promise<Registration | null> {
  return readAll().find((r) => r.id === id) ?? null
}
