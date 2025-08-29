'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import ParkingMap from '@/components/ParkingMap'
import GamificationPanel from '@/components/GamificationPanel'
import AddParkingSpot from '@/components/AddParkingSpot'
import { Car, Map, Trophy } from 'lucide-react'

// Dynamischer Import für Leaflet (vermeidet SSR-Probleme)
const ParkingMapDynamic = dynamic(() => import('@/components/ParkingMap'), {
  ssr: false,
  loading: () => (
    <div className="h-96 w-full rounded-lg bg-gray-100 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
    </div>
  )
})

export default function Home() {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleSpotAdded = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Parkly</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Map className="w-4 h-4" />
              <span>Finde kostenlose Parkplätze</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Map Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Parkplätze in deiner Nähe
              </h2>
              <ParkingMapDynamic key={refreshTrigger} />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AddParkingSpot 
                userLocation={userLocation} 
                onSpotAdded={handleSpotAdded}
              />
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Wie es funktioniert
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Grüne Markierungen = freie Parkplätze</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Rote Markierungen = belegte Parkplätze</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Klicke auf Markierungen um Status zu ändern</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <GamificationPanel />
            
            {/* Community Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Community
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Aktive User heute</span>
                  <span className="font-semibold text-gray-800">47</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Reports heute</span>
                  <span className="font-semibold text-gray-800">156</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Freie Parkplätze</span>
                  <span className="font-semibold text-green-600">23</span>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">💡 Tipp</h4>
              <p className="text-sm text-blue-700">
                Melde freie Parkplätze wenn du wegfährst und helfe anderen dabei, 
                schnell einen Platz zu finden!
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>Parkly - Kostenlose Parkplatz-Finder App</p>
            <p className="mt-1">Powered by OpenStreetMap & Crowdsourcing</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
