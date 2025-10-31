'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Car, MapPin, Plus, TrendingUp, Search, Filter, RefreshCw, X, Info, Navigation, Star, List } from 'lucide-react'
import { fetchOSMParkingSpots, transformOSMToParkingSpot } from '@/lib/osm'
import { fetchGooglePlacesParking, transformGooglePlaceToParkingSpot } from '@/lib/google-places'

// Dynamically import map component to avoid SSR issues
const MapContent = dynamic(() => import('@/components/MapContent'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full" style={{ height: '600px' }}>
      <div className="text-center">
        <MapPin className="w-12 h-12 mx-auto mb-4 animate-pulse text-primary-500" />
        <p className="text-lg">Karte wird geladen...</p>
      </div>
    </div>
  )
})

export default function Home() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [parkingSpots, setParkingSpots] = useState<Array<{
    id: string
    lat: number
    lng: number
    status: 'free' | 'occupied'
    reportedAt?: Date
    name?: string
    rating?: number
    address?: string
  }>>([])
  const [showAddSpot, setShowAddSpot] = useState(false)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'free' | 'occupied'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpot, setSelectedSpot] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showListView, setShowListView] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Get user's current location
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
          console.error('Error getting location:', error)
          // Default to Zurich, Switzerland
          setUserLocation([47.3769, 8.5417])
        }
      )
    } else {
      // Default to Zurich, Switzerland
      setUserLocation([47.3769, 8.5417])
    }
  }, [])

  useEffect(() => {
    // Load parking spots from OSM and Google Places
    const loadParkingSpots = async () => {
      if (!userLocation) return
      
      try {
        setLoading(true)
        
        // Load from OSM (OpenStreetMap) - kostenlos
        const osmSpots = await fetchOSMParkingSpots(userLocation[0], userLocation[1], 500)
        
        // Load from Google Places API - sucht nach "Parkplatz"
        const googlePlaces = await fetchGooglePlacesParking(userLocation[0], userLocation[1], 2000)
        
        // Kombiniere alle Datenquellen
        const allSpots: Array<{
          id: string
          lat: number
          lng: number
          status: 'free' | 'occupied'
          reportedAt?: Date
          name?: string
          rating?: number
          address?: string
        }> = []
        
        // OSM Spots hinzufügen
        if (osmSpots.length > 0) {
          const transformedOSMSpots = osmSpots.map(transformOSMToParkingSpot)
          allSpots.push(...transformedOSMSpots)
        }
        
        // Google Places Spots hinzufügen
        if (googlePlaces.length > 0) {
          const transformedGoogleSpots = googlePlaces.map(transformGooglePlaceToParkingSpot)
          allSpots.push(...transformedGoogleSpots)
        }
        
        // Kombiniere mit bereits vorhandenen (Crowdsourcing) und verhindere Duplikate
        setParkingSpots(prevSpots => {
          const existingIds = new Set(prevSpots.map(s => s.id))
          const newSpots = allSpots.filter(s => !existingIds.has(s.id))
          return [...prevSpots, ...newSpots]
        })
        
        // Falls beide APIs fehlschlagen, funktioniert die App weiterhin mit Crowdsourcing-Daten
      } catch (error) {
        console.error('Error loading parking spots:', error)
        // App funktioniert weiterhin ohne API-Daten (nur Crowdsourcing)
      } finally {
        setLoading(false)
      }
    }

    if (userLocation) {
      loadParkingSpots()
    }
  }, [userLocation])

  const handleAddSpot = async (lat: number, lng: number) => {
    const localSpot = {
      id: Date.now().toString(),
      lat,
      lng,
      status: 'free' as const,
      reportedAt: new Date(),
    }
    setParkingSpots([...parkingSpots, localSpot])
  }

  const handleStatusChange = async (id: string, newStatus: 'free' | 'occupied') => {
    setParkingSpots(
      parkingSpots.map((spot) =>
        spot.id === id ? { ...spot, status: newStatus, reportedAt: new Date() } : spot
      )
    )
  }

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }

  const handleCenterMap = () => {
    if (userLocation) {
      // Trigger map center update (would need map ref in real implementation)
      window.location.hash = `#${userLocation[0]},${userLocation[1]}`
    }
  }

  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(id)) {
      newFavorites.delete(id)
    } else {
      newFavorites.add(id)
    }
    setFavorites(newFavorites)
  }

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371 // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lng2 - lng1) * Math.PI / 180
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const filteredSpots = parkingSpots.filter(spot => {
    if (filter === 'free' && spot.status !== 'free') return false
    if (filter === 'occupied' && spot.status !== 'occupied') return false
    if (searchQuery && !searchQuery.toLowerCase().includes('parkplatz')) {
      // Filter by location or other criteria if search is implemented
      // For now, just pass through
    }
    return true
  })

  const sortedSpots = [...filteredSpots].sort((a, b) => {
    if (!userLocation) return 0
    const distA = calculateDistance(userLocation[0], userLocation[1], a.lat, a.lng)
    const distB = calculateDistance(userLocation[0], userLocation[1], b.lat, b.lng)
    return distA - distB
  })

  const selectedSpotData = parkingSpots.find(s => s.id === selectedSpot)

  if (!userLocation || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <MapPin className="w-12 h-12 mx-auto mb-4 animate-pulse text-primary-500" />
          <p className="text-lg">Standort wird geladen...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Mobile-Optimized Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="px-3 py-2.5">
          {/* Top Row - Logo and Actions */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Car className="w-7 h-7 text-primary-600" />
              <h1 className="text-xl font-bold text-gray-800">Parkly</h1>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowListView(!showListView)}
                className={`p-2.5 rounded-lg transition ${showListView ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'}`}
                title="Listenansicht"
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={handleCenterMap}
                className="p-2.5 rounded-lg bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                title="Zu meinem Standort"
              >
                <Navigation className="w-5 h-5" />
              </button>
              <button
                onClick={handleRefresh}
                className="p-2.5 rounded-lg bg-gray-100 text-gray-600 transition hover:bg-gray-200"
                title="Aktualisieren"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Suche Parkplätze..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {/* Filter Chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-full transition text-xs font-medium whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Alle ({parkingSpots.length})
            </button>
            <button
              onClick={() => setFilter('free')}
              className={`px-3 py-1.5 rounded-full transition text-xs font-medium whitespace-nowrap ${
                filter === 'free'
                  ? 'bg-green-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Frei ({parkingSpots.filter(s => s.status === 'free').length})
            </button>
            <button
              onClick={() => setFilter('occupied')}
              className={`px-3 py-1.5 rounded-full transition text-xs font-medium whitespace-nowrap ${
                filter === 'occupied'
                  ? 'bg-red-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Belegt ({parkingSpots.filter(s => s.status === 'occupied').length})
            </button>
            {favorites.size > 0 && (
              <button
                onClick={() => {
                  const favoriteIds = Array.from(favorites)
                  const favoriteSpots = parkingSpots.filter(s => favoriteIds.includes(s.id))
                  if (favoriteSpots.length > 0) {
                    setSelectedSpot(favoriteSpots[0].id)
                    setShowDetails(true)
                  }
                }}
                className="px-3 py-1.5 rounded-full transition text-xs font-medium whitespace-nowrap bg-yellow-100 text-yellow-700 hover:bg-yellow-200 flex items-center gap-1"
              >
                <Star className="w-3 h-3 fill-current" />
                Favoriten ({favorites.size})
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative">
        {/* Mobile Stats Bar - Only on mobile */}
        <div className="md:hidden bg-white border-b border-gray-200 px-3 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-gray-600 font-medium">{parkingSpots.filter(s => s.status === 'free').length} Frei</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-gray-600 font-medium">{parkingSpots.filter(s => s.status === 'occupied').length} Belegt</span>
            </div>
          </div>
          <span className="text-gray-500">{filteredSpots.length} gefunden</span>
        </div>

        {/* Map or List View */}
        {showListView ? (
          <div className="bg-white min-h-[calc(100vh-180px)]">
            <div className="sticky top-[140px] bg-white border-b border-gray-200 px-3 py-2 z-10">
              <h2 className="text-sm font-semibold text-gray-800">{sortedSpots.length} Parkplatz{sortedSpots.length !== 1 ? 'e' : ''} gefunden</h2>
            </div>
            <div className="pb-20">
              {sortedSpots.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-600 mb-2">Keine Parkplätze gefunden</p>
                  <button
                    onClick={() => setShowAddSpot(true)}
                    className="mt-4 px-6 py-3 bg-green-500 text-white rounded-xl font-medium shadow-lg hover:bg-green-600 transition"
                  >
                    Ersten Parkplatz hinzufügen
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {sortedSpots.map((spot) => {
                    const distance = userLocation 
                      ? calculateDistance(userLocation[0], userLocation[1], spot.lat, spot.lng)
                      : 0
                    return (
                      <div
                        key={spot.id}
                        className="p-4 active:bg-gray-50 cursor-pointer transition"
                        onClick={() => {
                          setSelectedSpot(spot.id)
                          setShowDetails(true)
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-4 h-4 rounded-full mt-1 flex-shrink-0 ${
                            spot.status === 'free' ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900 text-base truncate">
                                {spot.name || 'Unbenannter Parkplatz'}
                              </h3>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleFavorite(spot.id)
                                }}
                                className={`flex-shrink-0 p-1.5 rounded-lg transition ${
                                  favorites.has(spot.id)
                                    ? 'text-yellow-500 bg-yellow-50'
                                    : 'text-gray-300 hover:text-yellow-400 hover:bg-gray-50'
                                }`}
                              >
                                <Star className={`w-5 h-5 ${favorites.has(spot.id) ? 'fill-current' : ''}`} />
                              </button>
                            </div>
                            {spot.address && (
                              <p className="text-sm text-gray-600 mb-2 line-clamp-1">{spot.address}</p>
                            )}
                            <div className="flex items-center gap-3 flex-wrap">
                              {spot.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                  <span className="text-xs font-medium text-gray-700">{spot.rating.toFixed(1)}</span>
                                </div>
                              )}
                              {userLocation && (
                                <span className="text-xs text-gray-500 font-medium">
                                  {distance < 1 
                                    ? `${Math.round(distance * 1000)}m`
                                    : `${distance.toFixed(1)}km`
                                  } entfernt
                                </span>
                              )}
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                                spot.status === 'free' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {spot.status === 'free' ? 'Frei' : 'Belegt'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="relative w-full" style={{ height: 'calc(100vh - 180px)', minHeight: '500px' }}>
            <MapContent
              center={userLocation}
              zoom={15}
              parkingSpots={filteredSpots}
              setParkingSpots={setParkingSpots}
              showAddSpot={showAddSpot}
              setShowAddSpot={setShowAddSpot}
              onAddSpot={handleAddSpot}
              onStatusChange={handleStatusChange}
              onSpotClick={(id) => {
                setSelectedSpot(id)
                setShowDetails(true)
              }}
            />
            
            {/* Map Info Badge */}
            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md z-[1000] border border-gray-100">
              <p className="text-xs text-gray-700 font-medium">
                {filteredSpots.length} Parkplatz{filteredSpots.length !== 1 ? 'e' : ''}
              </p>
            </div>
          </div>
        )}

        {/* Floating Action Button - Mobile */}
        <button
          onClick={() => setShowAddSpot(!showAddSpot)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-110 z-40 flex items-center justify-center md:hidden"
          title="Parkplatz hinzufügen"
        >
          <Plus className="w-6 h-6" />
        </button>

        {/* Parkplatz Details Modal - Bottom Sheet auf Mobile */}
        {showDetails && selectedSpotData && (
          <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 p-0 md:p-4" onClick={() => {
            setShowDetails(false)
            setSelectedSpot(null)
          }}>
            <div className="bg-white rounded-t-3xl md:rounded-2xl shadow-2xl w-full md:max-w-md md:w-full p-6 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              {/* Mobile Drag Handle */}
              <div className="md:hidden flex justify-center mb-4">
                <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Parkplatz Details</h3>
                <button
                  onClick={() => {
                    setShowDetails(false)
                    setSelectedSpot(null)
                  }}
                  className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                {selectedSpotData.name && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Name</p>
                    <p className="font-semibold text-lg">{selectedSpotData.name}</p>
                  </div>
                )}
                
                {selectedSpotData.address && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Adresse</p>
                    <p className="font-medium">{selectedSpotData.address}</p>
                  </div>
                )}
                
                {selectedSpotData.rating && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Bewertung</p>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{selectedSpotData.rating.toFixed(1)}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= Math.round(selectedSpotData.rating!)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${
                    selectedSpotData.status === 'free'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    <div className={`w-3 h-3 rounded-full ${
                      selectedSpotData.status === 'free' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <span className="font-semibold">
                      {selectedSpotData.status === 'free' ? 'Frei' : 'Belegt'}
                    </span>
                  </div>
                </div>
                
                {selectedSpotData.reportedAt && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Zuletzt gemeldet</p>
                    <p className="font-medium">
                      {new Date(selectedSpotData.reportedAt).toLocaleString('de-CH')}
                    </p>
                  </div>
                )}
                
                {userLocation && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Entfernung</p>
                    <p className="font-medium">
                      {(() => {
                        const distance = calculateDistance(
                          userLocation[0],
                          userLocation[1],
                          selectedSpotData.lat,
                          selectedSpotData.lng
                        )
                        return distance < 1 
                          ? `${Math.round(distance * 1000)} Meter`
                          : `${distance.toFixed(2)} Kilometer`
                      })()}
                    </p>
                  </div>
                )}
                
                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      handleStatusChange(selectedSpotData.id, 'free')
                      setShowDetails(false)
                    }}
                    className={`flex-1 px-4 py-3 rounded-xl font-medium transition shadow-sm ${
                      selectedSpotData.status === 'free'
                        ? 'bg-green-500 text-white shadow-green-200'
                        : 'bg-green-50 text-green-700 hover:bg-green-100 active:bg-green-200'
                    }`}
                  >
                    Frei
                  </button>
                  <button
                    onClick={() => {
                      handleStatusChange(selectedSpotData.id, 'occupied')
                      setShowDetails(false)
                    }}
                    className={`flex-1 px-4 py-3 rounded-xl font-medium transition shadow-sm ${
                      selectedSpotData.status === 'occupied'
                        ? 'bg-red-500 text-white shadow-red-200'
                        : 'bg-red-50 text-red-700 hover:bg-red-100 active:bg-red-200'
                    }`}
                  >
                    Belegt
                  </button>
                </div>
                
                <button
                  onClick={() => {
                    toggleFavorite(selectedSpotData.id)
                  }}
                  className={`w-full mt-3 px-4 py-3 rounded-xl font-medium transition flex items-center justify-center gap-2 ${
                    favorites.has(selectedSpotData.id)
                      ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 active:bg-yellow-200'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 active:bg-gray-200'
                  }`}
                >
                  <Star className={`w-5 h-5 ${favorites.has(selectedSpotData.id) ? 'fill-current text-yellow-500' : ''}`} />
                  {favorites.has(selectedSpotData.id) ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Info Section - Hidden on mobile */}
        <div className="hidden md:block mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Wie funktioniert Parkly?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2">1. Parkplatz finden</h3>
              <p className="text-sm text-gray-600">
                Nutze die Karte, um freie Parkplätze in deiner Nähe zu finden. Grüne Marker zeigen verfügbare Plätze.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold mb-2">2. Status melden</h3>
              <p className="text-sm text-gray-600">
                Melde den Status eines Parkplatzes, wenn du ihn belegst oder freigibst. Du verdienst dabei Punkte!
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold mb-2">3. Punkte sammeln</h3>
              <p className="text-sm text-gray-600">
                Jeder Report gibt dir 10-50 Punkte. Steige auf und erreiche neue Levels!
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold mb-2">4. Community helfen</h3>
              <p className="text-sm text-gray-600">
                Deine Meldungen helfen anderen Fahrern dabei, schneller einen Parkplatz zu finden.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            Parkly - Kostenlose Parkplatz-Finder App | Made with ❤️ by Arvin Ka
          </p>
          <p className="text-xs mt-2 text-gray-400">
            Powered by OpenStreetMap & Supabase
          </p>
        </div>
      </footer>
    </main>
  )
}
