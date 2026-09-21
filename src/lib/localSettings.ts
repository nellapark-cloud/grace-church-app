import { defaultSettings, type AppSettings } from '../types/settings'

const STORAGE_KEY = 'grace-church-demo-settings'

type Listener = (settings: AppSettings) => void
const listeners = new Set<Listener>()

function readSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as AppSettings
  } catch {
    // ignore corrupt data
  }
  return defaultSettings
}

export function subscribeSettings(
  onChange: Listener,
  _onError: (error: Error) => void,
) {
  listeners.add(onChange)
  onChange(readSettings())
  return () => {
    listeners.delete(onChange)
  }
}

export async function saveSettings(settings: AppSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  listeners.forEach((listener) => listener(settings))
}
