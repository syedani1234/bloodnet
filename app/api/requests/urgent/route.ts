import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getDbNameForCity } from '@/lib/db-config'
import { getDb } from '@/lib/mongodb'

interface Hospital {
  id: string
  name: string
  address: string
  phone: string
  bloodBankAvailability: string
  city: string
  lat?: number
  lng?: number
}

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if (auth.response) return auth.response

    const { searchParams } = new URL(req.url)
    const city = searchParams.get('city') || 'Karachi'
    const bloodGroup = searchParams.get('bloodGroup') || 'O+'

    const dbName = getDbNameForCity(city)
    const db = await getDb(dbName)

    let hospitalDocs = await db.collection('hospitals').find({ city }).limit(10).toArray()

    const hospitals: Hospital[] = hospitalDocs.length > 0
      ? hospitalDocs.map((h: any) => ({
          id: h._id?.toString() || h.id,
          name: h.name,
          address: h.address,
          phone: h.phone,
          bloodBankAvailability: h.bloodBankAvailability || `${bloodGroup} available`,
          city: h.city,
          lat: h.lat,
          lng: h.lng,
        }))
      : getDefaultHospitals(city)

    return NextResponse.json({ success: true, hospitals, city, bloodGroup })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch urgent hospitals'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if (auth.response) return auth.response

    const body = await req.json()
    const { city = 'Karachi', bloodGroup, units } = body

    if (!bloodGroup || !units) {
      return NextResponse.json(
        { error: 'Blood group and units are required' },
        { status: 400 }
      )
    }

    const dbName = getDbNameForCity(city)
    const db = await getDb(dbName)

    let hospitalDocs = await db.collection('hospitals').find({ city }).limit(10).toArray()

    let hospitals: Hospital[] = []

    if (hospitalDocs.length > 0) {
      hospitals = hospitalDocs.map((h: any) => ({
        id: h._id?.toString() || h.id,
        name: h.name,
        address: h.address,
        phone: h.phone,
        bloodBankAvailability: h.bloodBankAvailability || `${bloodGroup} available`,
        city: h.city,
        lat: h.lat,
        lng: h.lng,
      }))
    } else {
      hospitals = getDefaultHospitals(city)
    }

    const urgentRequest = {
      patientBloodGroup: bloodGroup,
      unitsRequired: units,
      urgencyLevel: 'emergency',
      city,
      receiverId: auth.user.role === 'receiver' ? auth.user._id.toString() : body.receiverId,
      receiverName: auth.user.role === 'receiver' ? auth.user.name : body.receiverName,
      createdAt: new Date().toISOString(),
    }

    await db.collection('urgent_requests').insertOne(urgentRequest)

    return NextResponse.json(
      {
        success: true,
        message: 'Urgent request created. Emergency: Redirecting to nearby hospitals.',
        urgencyLevel: 'emergency',
        bloodGroup,
        units,
        hospitals,
      },
      { status: 201 }
    )
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to process urgent request'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

function getDefaultHospitals(city: string): Hospital[] {
  const hospitalsByCity: Record<string, Hospital[]> = {
    Karachi: [
      {
        id: 'h1',
        name: 'Aga Khan University Hospital',
        address: 'Stadium Road, Karachi',
        phone: '021-34864802',
        bloodBankAvailability: 'All types available',
        city: 'Karachi',
        lat: 24.8504,
        lng: 67.0117,
      },
      {
        id: 'h2',
        name: 'Liaquat National Hospital',
        address: 'Kemari Road, Karachi',
        phone: '021-34413000',
        bloodBankAvailability: 'Limited stock',
        city: 'Karachi',
        lat: 24.8247,
        lng: 67.0389,
      },
      {
        id: 'h3',
        name: 'Dow University Hospital',
        address: 'Baba-e-Urdu Road, Karachi',
        phone: '021-99261300',
        bloodBankAvailability: 'Well stocked',
        city: 'Karachi',
        lat: 24.9496,
        lng: 67.0822,
      },
      {
        id: 'h4',
        name: 'Jinnah Postgraduate Medical Centre',
        address: 'Rafiqui Shaheed Road, Karachi',
        phone: '021-99261300',
        bloodBankAvailability: 'Emergency stock',
        city: 'Karachi',
        lat: 24.9667,
        lng: 67.0833,
      },
    ],
    Lahore: [
      {
        id: 'h5',
        name: 'Mayo Hospital',
        address: 'The Mall, Lahore',
        phone: '042-99213000',
        bloodBankAvailability: 'All types available',
        city: 'Lahore',
        lat: 31.5497,
        lng: 74.3245,
      },
      {
        id: 'h6',
        name: 'Services Hospital',
        address: 'Lahore, Punjab',
        phone: '042-99231000',
        bloodBankAvailability: 'Well stocked',
        city: 'Lahore',
        lat: 31.5469,
        lng: 74.3234,
      },
    ],
    Islamabad: [
      {
        id: 'h7',
        name: 'Pakistan Institute of Medical Sciences (PIMS)',
        address: 'Chak Shazad, Islamabad',
        phone: '051-9261000',
        bloodBankAvailability: 'All types available',
        city: 'Islamabad',
        lat: 33.7294,
        lng: 73.2275,
      },
    ],
  }

  return hospitalsByCity[city] || hospitalsByCity['Karachi']
}

