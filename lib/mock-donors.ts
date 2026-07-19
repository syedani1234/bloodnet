export interface Donor {
  id: string
  name: string
  bloodGroup: string
  city: string
  phone: string
  email: string
  age: number
  lastDonation: string
  health: number
  available: boolean
  lat: number
  lng: number
  donations: number
  verified: boolean
}

const karachiAreas = [
  { name: 'Defence', lat: 24.8014, lng: 67.0289 },
  { name: 'Clifton', lat: 24.7898, lng: 67.0266 },
  { name: 'DHA', lat: 24.769, lng: 67.0455 },
  { name: 'Gulshan', lat: 24.8741, lng: 67.0739 },
  { name: 'Saddar', lat: 24.8589, lng: 67.0104 },
  { name: 'North Nazimabad', lat: 24.9169, lng: 67.1001 },
  { name: 'Malir', lat: 24.9144, lng: 67.2289 },
  { name: 'Korangi', lat: 24.8519, lng: 67.2456 },
  { name: 'Kharadar', lat: 24.8359, lng: 67.0412 },
  { name: 'Liaquatabad', lat: 24.8897, lng: 67.0676 },
]

const firstNames = ['Ahmed', 'Fatima', 'Hassan', 'Zainab', 'Muhammad', 'Aisha', 'Ali', 'Sara', 'Imran', 'Hira', 'Bilal', 'Nida', 'Khalid', 'Rukhsana', 'Naveed']
const lastNames = ['Khan', 'Ali', 'Ahmed', 'Hassan', 'Malik', 'Ibrahim', 'Raza', 'Farooq', 'Hussain', 'Shah']
const bloodGroups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']

function generateRandomDonor(index: number): Donor {
  const area = karachiAreas[index % karachiAreas.length]
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
  const bloodGroup = bloodGroups[Math.floor(Math.random() * bloodGroups.length)]
  
  // Add slight randomization to coordinates within each area
  const lat = area.lat + (Math.random() - 0.5) * 0.01
  const lng = area.lng + (Math.random() - 0.5) * 0.01
  
  const donationDates = ['1 month ago', '2 months ago', '3 months ago', '4 months ago', '5 months ago', '6 months ago']
  
  return {
    id: `donor-${String(index).padStart(3, '0')}`,
    name: `${firstName} ${lastName}`,
    bloodGroup,
    city: 'Karachi',
    phone: `+92-300-${String(Math.floor(Math.random() * 9000000) + 1000000).padStart(7, '0')}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
    age: Math.floor(Math.random() * 30) + 18,
    lastDonation: donationDates[Math.floor(Math.random() * donationDates.length)],
    health: Math.floor(Math.random() * 15) + 85,
    available: Math.random() > 0.2,
    lat,
    lng,
    donations: Math.floor(Math.random() * 20) + 1,
    verified: Math.random() > 0.1,
  }
}

export const MOCK_DONORS: Donor[] = [
  // Abdullah - Special featured donor
  {
    id: 'donor-featured-001',
    name: 'Abdullah',
    bloodGroup: 'O+',
    city: 'Karachi',
    phone: '+92-332-3378691',
    email: 'abdullah@bloodnet.com',
    age: 32,
    lastDonation: '2 months ago',
    health: 94,
    available: true,
    lat: 24.8607,
    lng: 67.0011,
    donations: 25,
    verified: true,
  },
  ...Array.from({ length: 80 }, (_, i) => generateRandomDonor(i))
]

export function getAllDonors(): Donor[] {
  return MOCK_DONORS
}

export function getDonorsByBloodGroup(bloodGroup: string): Donor[] {
  return MOCK_DONORS.filter(donor => donor.bloodGroup === bloodGroup && donor.available)
}

export function getDonorsByCity(city: string): Donor[] {
  return MOCK_DONORS.filter(donor => donor.city === city && donor.available)
}

export function getKarachiDonors(): Donor[] {
  return MOCK_DONORS.filter(donor => donor.city === 'Karachi' && donor.available)
}

export function getKarachiDonorsByBloodGroup(bloodGroup: string): Donor[] {
  return MOCK_DONORS.filter(donor => donor.city === 'Karachi' && donor.bloodGroup === bloodGroup && donor.available)
}

export function getAvailableDonors(): Donor[] {
  return MOCK_DONORS.filter(donor => donor.available)
}

export function getDonorsByLocationRadius(lat: number, lng: number, radiusKm: number = 10): Donor[] {
  const R = 6371 // Earth's radius in km
  
  return MOCK_DONORS.filter(donor => {
    const dLat = (donor.lat - lat) * (Math.PI / 180)
    const dLng = (donor.lng - lng) * (Math.PI / 180)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat * (Math.PI / 180)) * Math.cos(donor.lat * (Math.PI / 180)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c
    
    return distance <= radiusKm && donor.available
  })
}

export function getDonorById(id: string): Donor | undefined {
  return MOCK_DONORS.find(donor => donor.id === id)
}
