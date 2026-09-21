export interface AppSettings {
  positions: string[]
  groups: string[]
}

export const defaultSettings: AppSettings = {
  positions: ['성도', '집사', '권사', '장로', '목사'],
  groups: ['1구역', '2구역', '3구역'],
}
