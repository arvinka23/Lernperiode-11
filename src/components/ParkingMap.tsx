'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { Icon } from 'leaflet'
import { ParkingSpot, supabase } from '@/lib/supabase'
import { Car, MapPin } from 'lucide-react'

// Custom Icon für Parkplätze
const createParkingIcon = (status: 'free' | 'occupied') => {
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="${status === 'free' ? '#10b981' : '#ef4444'}" stroke="white" stroke-width="2"/>
        <path d="M8 8h8v8H8z" fill="white"/>
      </svg>
    `)}`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })
}

// Demo-Daten für den Fall, dass Supabase nicht verfügbar ist
const demoParkingSpots: ParkingSpot[] = [
  {
    id: 'demo-1',
    lat: 47.3769,
    lng: 8.5417,
    status: 'free',
    reported_by: 'demo-user',
    last_updated: new Date().toISOString(),
    confidence_score: 0.8
  },
  {
    id: 'demo-2',
    lat: 47.3789,
    lng: 8.5397,
    status: 'occupied',
    reported_by: 'demo-user',
    last_updated: new Date().toISOString(),
    confidence_score: 0.7
  },
  {
    id: 'demo-3',
    lat: 47.3749,
    lng: 8.5437,
    status: 'free',
    reported_by: 'demo-user',
    last_updated: new Date().toISOString(),
    confidence_score: 0.9
  }
]

// GPS-Tracking Komponente
function LocationTracker({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) {
  const map = useMap()

  useEffect(() => {
    if ('geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          onLocationChange(latitude, longitude)
          
          // Zentriere Karte auf User-Position
          map.setView([latitude, longitude], 16)
        },
        (error) => {
          console.error('GPS Error:', error)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
      )

      return () => navigator.geolocation.clearWatch(watchId)
    }
  }, [map, onLocationChange])

  return null
}

export default function ParkingMap() {
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([])
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)

  // Lade Parkplätze aus Supabase
  useEffect(() => {
    const loadParkingSpots = async () => {
      try {
        const { data, error } = await supabase
          .from('parking_spots')
          .select('*')
          .order('last_updated', { ascending: false })

        if (error) {
          console.log('Supabase nicht verfügbar, verwende Demo-Daten:', error.message)
          setIsDemoMode(true)
          setParkingSpots(demoParkingSpots)
        } else {
          setParkingSpots(data || demoParkingSpots)
        }
      } catch (error) {
        console.log('Fehler beim Laden der Parkplätze, verwende Demo-Daten:', error)
        setIsDemoMode(true)
        setParkingSpots(demoParkingSpots)
      } finally {
        setLoading(false)
      }
    }

    loadParkingSpots()
  }, [])

  const handleLocationChange = (lat: number, lng: number) => {
    setUserLocation([lat, lng])
  }

  const handleSpotClick = async (spot: ParkingSpot) => {
    if (!userLocation) return

    const newStatus = spot.status === 'free' ? 'occupied' : 'free'
    
    try {
      if (!isDemoMode) {
        const { error } = await supabase
          .from('parking_spots')
          .update({ 
            status: newStatus, 
            last_updated: new Date().toISOString(),
            confidence_score: Math.min(spot.confidence_score + 0.1, 1.0)
          })
          .eq('id', spot.id)

        if (error) throw error
      }

      // Update local state
      setParkingSpots(spots => 
        spots.map(s => 
          s.id === spot.id 
            ? { ...s, status: newStatus, last_updated: new Date().toISOString() }
            : s
        )
      )
    } catch (error) {
      console.error('Error updating spot:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden shadow-lg">
      {isDemoMode && (
        <div className="bg-yellow-50 border-b border-yellow-200 p-2 text-center">
          <p className="text-sm text-yellow-800">
            🚧 Demo-Modus: Verwende lokale Daten. 
            <a href="https://supabase.com/dashboard/project/adbfxvbxxqgzssxaxalb/sql" 
               target="_blank" 
               className="text-blue-600 hover:underline ml-1">
              Supabase einrichten
            </a>
          </p>
        </div>
      )}
      
      <MapContainer
        center={userLocation || [47.3769, 8.5417]} // Zürich als Fallback
        zoom={16}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <LocationTracker onLocationChange={handleLocationChange} />

        {/* User Location Marker */}
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>
              <div className="text-center">
                <MapPin className="w-4 h-4 mx-auto mb-1" />
                <p className="text-sm font-medium">Du bist hier</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Parking Spots */}
        {parkingSpots.map((spot) => (
          <Marker
            key={spot.id}
            position={[spot.lat, spot.lng]}
            icon={createParkingIcon(spot.status)}
            eventHandlers={{
              click: () => handleSpotClick(spot),
            }}
          >
            <Popup>
              <div className="text-center">
                <Car className="w-4 h-4 mx-auto mb-1" />
                <p className="text-sm font-medium">
                  {spot.status === 'free' ? 'Frei' : 'Belegt'}
                </p>
                <p className="text-xs text-gray-500">
                  Zuletzt aktualisiert: {new Date(spot.last_updated).toLocaleTimeString()}
                </p>
                <button
                  onClick={() => handleSpotClick(spot)}
                  className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                >
                  Status ändern
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
