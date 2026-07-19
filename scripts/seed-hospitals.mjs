import './load-env.mjs'
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'
const dbName = process.env.MONGODB_DB || 'bloodnet'

const sampleHospitals = [
  // Karachi Hospitals
  {
    name: 'Aga Khan University Hospital',
    address: 'Stadium Road, Karachi',
    phone: '+92-21-3486-0000',
    email: 'info@aku.edu',
    bloodBankAvailability: 'All types available',
    city: 'Karachi',
    lat: 24.8504,
    lng: 67.0117,
    capacity: 500,
    operatingHours: '24/7',
    services: ['Emergency', 'Blood Bank', 'ICU', 'Surgery'],
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Jinnah Postgraduate Medical Centre',
    address: 'Rafiqui H.J. Road, Karachi',
    phone: '+92-21-9920-1000',
    email: 'info@jpmc.edu.pk',
    bloodBankAvailability: 'Emergency stock',
    city: 'Karachi',
    lat: 24.9667,
    lng: 67.0833,
    capacity: 600,
    operatingHours: '24/7',
    services: ['Emergency', 'Blood Bank', 'ICU', 'Trauma'],
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Liaquat National Hospital',
    address: 'Kemari Road, Karachi',
    phone: '+92-21-3441-3000',
    email: 'info@lnh.com.pk',
    bloodBankAvailability: 'Limited stock',
    city: 'Karachi',
    lat: 24.8247,
    lng: 67.0389,
    capacity: 300,
    operatingHours: '24/7',
    services: ['Emergency', 'Blood Bank', 'ICU'],
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Dow University Hospital',
    address: 'Baba-e-Urdu Road, Karachi',
    phone: '+92-21-9926-1300',
    email: 'info@dow.edu.pk',
    bloodBankAvailability: 'Well stocked',
    city: 'Karachi',
    lat: 24.9496,
    lng: 67.0822,
    capacity: 400,
    operatingHours: '24/7',
    services: ['Emergency', 'Blood Bank', 'Surgery', 'ICU'],
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Mamji Hospital',
    address: 'Plot 123, Block 4, Clifton, Karachi',
    phone: '+92-21-3586-2222',
    email: 'info@mamjihospital.com.pk',
    bloodBankAvailability: 'All types available',
    city: 'Karachi',
    lat: 24.7899,
    lng: 67.0202,
    capacity: 250,
    operatingHours: '24/7',
    services: ['Emergency', 'Blood Bank', 'ICU'],
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Patal Hospital',
    address: 'Plot 456, Tauheed Commercial, Karachi',
    phone: '+92-21-3451-7777',
    email: 'info@patalhospital.com.pk',
    bloodBankAvailability: 'Well stocked',
    city: 'Karachi',
    lat: 24.8345,
    lng: 67.0456,
    capacity: 280,
    operatingHours: '24/7',
    services: ['Emergency', 'Blood Bank', 'ICU'],
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Indus Hospital',
    address: 'Plot C-76, Sector 31, Karachi',
    phone: '+92-21-3664-1100',
    email: 'info@indusobgy.org',
    bloodBankAvailability: 'All types available',
    city: 'Karachi',
    lat: 24.8888,
    lng: 67.1024,
    capacity: 350,
    operatingHours: '24/7',
    services: ['Emergency', 'Blood Bank', 'ICU'],
    createdAt: new Date().toISOString(),
  },

  // Lahore Hospitals
  {
    name: 'Mayo Hospital',
    address: 'The Mall, Lahore',
    phone: '+92-42-9921-3000',
    email: 'info@mayo.edu.pk',
    bloodBankAvailability: 'All types available',
    city: 'Lahore',
    lat: 31.5497,
    lng: 74.3245,
    capacity: 700,
    operatingHours: '24/7',
    services: ['Emergency', 'Blood Bank', 'ICU', 'Surgery'],
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Services Hospital Lahore',
    address: 'Lahore, Punjab',
    phone: '+92-42-9923-1000',
    email: 'info@services.edu.pk',
    bloodBankAvailability: 'Well stocked',
    city: 'Lahore',
    lat: 31.5469,
    lng: 74.3234,
    capacity: 500,
    operatingHours: '24/7',
    services: ['Emergency', 'Blood Bank', 'ICU'],
    createdAt: new Date().toISOString(),
  },

  // Islamabad Hospitals
  {
    name: 'Pakistan Institute of Medical Sciences (PIMS)',
    address: 'Chak Shazad, Islamabad',
    phone: '+92-51-9261-000',
    email: 'info@pims.edu.pk',
    bloodBankAvailability: 'All types available',
    city: 'Islamabad',
    lat: 33.7294,
    lng: 73.2275,
    capacity: 600,
    operatingHours: '24/7',
    services: ['Emergency', 'Blood Bank', 'ICU', 'Surgery'],
    createdAt: new Date().toISOString(),
  },
]

async function main() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    const db = client.db(dbName)
    const hospitals = db.collection('hospitals')

    const count = await hospitals.countDocuments()
    if (count > 0) {
      console.log(`✓ Hospitals already seeded (${count} records found)`)
      return
    }

    const result = await hospitals.insertMany(sampleHospitals)
    console.log(`✓ ${result.insertedIds.length} hospitals seeded successfully`)
    console.log('  Cities covered: Karachi (8), Lahore (2), Islamabad (1)')
  } finally {
    await client.close()
  }
}

main().catch((error) => {
  console.error('✗ Connection failed. Check MongoDB:')
  console.error(`  URI: ${uri}`)
  console.error(`  DB: ${dbName}`)
  if (error.message && error.message.includes('ECONNREFUSED')) {
    console.error('\n  MongoDB is not running!')
    console.error('  Option 1: Start MongoDB locally with: mongod')
    console.error('  Option 2: Use MongoDB Atlas and update MONGODB_URI in .env.local')
  }
  console.error('\nFull error:', error.message)
  process.exit(1)
})
