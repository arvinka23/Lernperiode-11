// OpenStreetMap Overpass API Integration
// Lädt Parkplätze aus OSM basierend auf Koordinaten

interface OSMParkingSpot {
  id: string
  lat: number
  lon: number
  tags: {
    amenity?: string
    name?: string
    capacity?: string
    access?: string
    fee?: string
    [key: string]: string | undefined
  }
}

// Cache für OSM-Abfragen (verhindert wiederholte Requests)
const osmCache = new Map<string, { data: OSMParkingSpot[], timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 Minuten Cache

// Mehrere Overpass-Server als Fallback
const OVERPASS_SERVERS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.openstreetmap.fr/api/interpreter',
]

export async function fetchOSMParkingSpots(
  lat: number,
  lng: number,
  radius: number = 500 // Reduzierter Radius (500m statt 1000m)
): Promise<OSMParkingSpot[]> {
  // Cache-Check
  const cacheKey = `${lat.toFixed(4)}_${lng.toFixed(4)}_${radius}`
  const cached = osmCache.get(cacheKey)
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }

  // Optimierte Query: Nur nodes (schneller als ways/relations)
  // Reduzierter Timeout für schnellere Fehlerbehandlung
  const overpassQuery = `
    [out:json][timeout:10];
    (
      node["amenity"="parking"](around:${radius},${lat},${lng});
    );
    out tags;
  `
  
  // Versuche verschiedene Server
  for (const server of OVERPASS_SERVERS) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 Sekunden Timeout
      
      const response = await fetch(server, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: `data=${encodeURIComponent(overpassQuery)}`,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        // Wenn Server nicht verfügbar, versuche nächsten
        if (response.status === 504 || response.status === 503) {
          console.warn(`Overpass server ${server} timeout, trying next...`)
          continue
        }
        throw new Error(`OSM API error: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (!data.elements || data.elements.length === 0) {
        // Cache leeres Ergebnis
        osmCache.set(cacheKey, { data: [], timestamp: Date.now() })
        return []
      }

      // Transformiere OSM-Daten zu unserem Format
      const spots = data.elements
        .map((element: any) => {
          const spotLat = element.lat || element.center?.lat
          const spotLon = element.lon || element.center?.lon
          
          if (!spotLat || !spotLon) return null

          return {
            id: `osm_${element.id}`,
            lat: spotLat,
            lon: spotLon,
            tags: element.tags || {},
          }
        })
        .filter((spot: any) => spot !== null) as OSMParkingSpot[]

      // Cache erfolgreiches Ergebnis
      osmCache.set(cacheKey, { data: spots, timestamp: Date.now() })
      return spots
      
    } catch (error: any) {
      // Wenn AbortError (Timeout), versuche nächsten Server
      if (error.name === 'AbortError') {
        console.warn(`Overpass server timeout, trying next...`)
        continue
      }
      
      // Andere Fehler: Loggen und nächsten Server versuchen
      if (server !== OVERPASS_SERVERS[OVERPASS_SERVERS.length - 1]) {
        console.warn(`Error fetching from ${server}:`, error.message)
        continue
      }
      
      // Letzter Server fehlgeschlagen
      console.error('All Overpass servers failed:', error)
      return []
    }
  }

  // Alle Server fehlgeschlagen
  return []
}

export function transformOSMToParkingSpot(osmSpot: OSMParkingSpot): {
  id: string
  lat: number
  lng: number
  status: 'free' | 'occupied'
  reportedAt?: Date
  name?: string
  capacity?: string
} {
  return {
    id: osmSpot.id,
    lat: osmSpot.lat,
    lng: osmSpot.lon,
    status: 'free', // Standard: frei (nutzer können Status ändern)
    reportedAt: new Date(),
    name: osmSpot.tags.name || `Parkplatz ${osmSpot.id.slice(-6)}`,
    capacity: osmSpot.tags.capacity,
  }
}

