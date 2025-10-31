// Google Places API Integration
// Sucht nach Parkplätzen mit "Parkplatz" im Namen

interface GooglePlace {
  place_id: string
  name: string
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  formatted_address?: string
  rating?: number
  types?: string[]
}

interface GooglePlacesResponse {
  results: GooglePlace[]
  status: string
}

// Cache für Google Places-Abfragen
const googlePlacesCache = new Map<string, { data: GooglePlace[], timestamp: number }>()
const CACHE_DURATION = 10 * 60 * 1000 // 10 Minuten Cache (länger als OSM wegen Kosten)

export async function fetchGooglePlacesParking(
  lat: number,
  lng: number,
  radius: number = 2000 // 2km Radius (Google Places max)
): Promise<GooglePlace[]> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    console.warn('Google Maps API Key nicht gefunden. Überspringe Google Places Suche.')
    return []
  }

  // Cache-Check
  const cacheKey = `google_${lat.toFixed(4)}_${lng.toFixed(4)}_${radius}`
  const cached = googlePlacesCache.get(cacheKey)
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }

  try {
    // Google Places API Text Search
    // Sucht nach "Parkplatz" in der Nähe der Koordinaten
    const searchQuery = 'Parkplatz'
    const location = `${lat},${lng}`
    
    const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json')
    url.searchParams.append('query', searchQuery)
    url.searchParams.append('location', location)
    url.searchParams.append('radius', radius.toString())
    url.searchParams.append('language', 'de')
    url.searchParams.append('key', apiKey)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 Sekunden Timeout

    const response = await fetch(url.toString(), {
      method: 'GET',
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.statusText}`)
    }

    const data: GooglePlacesResponse = await response.json()

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.warn(`Google Places API Status: ${data.status}`)
      return []
    }

    if (!data.results || data.results.length === 0) {
      // Cache leeres Ergebnis
      googlePlacesCache.set(cacheKey, { data: [], timestamp: Date.now() })
      return []
    }

    // Filtere nur Ergebnisse mit "Parkplatz" im Namen (case-insensitive)
    const parkingPlaces = data.results.filter(place => 
      place.name.toLowerCase().includes('parkplatz') ||
      place.name.toLowerCase().includes('parking') ||
      place.name.toLowerCase().includes('parkhaus') ||
      place.name.toLowerCase().includes('park deck') ||
      (place.types && place.types.includes('parking'))
    )

    // Cache erfolgreiches Ergebnis
    googlePlacesCache.set(cacheKey, { data: parkingPlaces, timestamp: Date.now() })
    return parkingPlaces

  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.warn('Google Places API timeout')
    } else {
      console.error('Error fetching Google Places parking spots:', error)
    }
    return []
  }
}

export function transformGooglePlaceToParkingSpot(place: GooglePlace): {
  id: string
  lat: number
  lng: number
  status: 'free' | 'occupied'
  reportedAt?: Date
  name?: string
  rating?: number
  address?: string
} {
  return {
    id: `google_${place.place_id}`,
    lat: place.geometry.location.lat,
    lng: place.geometry.location.lng,
    status: 'free', // Standard: frei (nutzer können Status ändern)
    reportedAt: new Date(),
    name: place.name,
    rating: place.rating,
    address: place.formatted_address,
  }
}

