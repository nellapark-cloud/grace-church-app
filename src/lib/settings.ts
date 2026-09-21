import { firebaseConfigured } from './firebase'
import * as remote from './remoteSettings'
import * as local from './localSettings'
import type { AppSettings } from '../types/settings'

const impl = firebaseConfigured ? remote : local

export function subscribeSettings(
  onChange: (settings: AppSettings) => void,
  onError: (error: Error) => void,
) {
  return impl.subscribeSettings(onChange, onError)
}

export function saveSettings(settings: AppSettings) {
  return impl.saveSettings(settings)
}
