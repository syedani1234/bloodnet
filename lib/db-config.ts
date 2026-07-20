export const DB_PAKISTAN = process.env.MONGODB_DB || 'bloodnet1'
export const DB_KARACHI = process.env.MONGODB_KARACHI_DB || 'bloodnet_karachi1'

export const PAKISTANI_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
] as const

export const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  Karachi: { lat: 24.8607, lng: 67.0011 },
  Lahore: { lat: 31.5204, lng: 74.3587 },
  Islamabad: { lat: 33.6844, lng: 73.0479 },
  Rawalpindi: { lat: 33.5651, lng: 73.0169 },
  Faisalabad: { lat: 31.4504, lng: 73.135 },
  Multan: { lat: 30.1575, lng: 71.5249 },
  Peshawar: { lat: 34.0151, lng: 71.5249 },
  Quetta: { lat: 30.1798, lng: 66.975 },
}

export function getDbNameForCity(city?: string): string {
  return city?.toLowerCase() === 'karachi' ? DB_KARACHI : DB_PAKISTAN
}

export function isKarachi(city?: string): boolean {
  return city?.toLowerCase() === 'karachi'
}
