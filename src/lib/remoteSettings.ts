import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from './firebase'
import { defaultSettings, type AppSettings } from '../types/settings'

function settingsRef() {
  return doc(db, 'settings', 'options')
}

export function subscribeSettings(
  onChange: (settings: AppSettings) => void,
  onError: (error: Error) => void,
) {
  return onSnapshot(
    settingsRef(),
    (snap) => {
      if (snap.exists()) {
        const data = snap.data() as Partial<AppSettings>
        onChange({
          positions: data.positions ?? defaultSettings.positions,
          groups: data.groups ?? defaultSettings.groups,
        })
      } else {
        onChange(defaultSettings)
      }
    },
    onError,
  )
}

export async function saveSettings(settings: AppSettings) {
  await setDoc(settingsRef(), settings)
}
