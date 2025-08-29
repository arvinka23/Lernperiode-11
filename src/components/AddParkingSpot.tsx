'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { MapPin, Plus, X } from 'lucide-react'

interface AddParkingSpotProps {
  userLocation: [number, number] | null
  onSpotAdded: () => void
}

export default function AddParkingSpot({ userLocation, onSpotAdded }: AddParkingSpotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [spotName, setSpotName] = useState('')

  const handleAddSpot = async () => {
    if (!userLocation || !spotName.trim()) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('parking_spots')
        .insert({
          lat: userLocation[0],
          lng: userLocation[1],
          status: 'free',
          reported_by: 'demo-user', // In echter App: user.id
          last_updated: new Date().toISOString(),
          confidence_score: 0.5,
          name: spotName.trim()
        })

      if (error) throw error

      setSpotName('')
      setIsOpen(false)
      onSpotAdded()
    } catch (error) {
      console.error('Error adding parking spot:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!userLocation) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800 text-sm">
          GPS-Standort wird benötigt, um Parkplätze hinzuzufügen
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Parkplatz hinzufügen</span>
        </button>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Neuen Parkplatz hinzufügen</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parkplatz-Name (optional)
            </label>
            <input
              type="text"
              value={spotName}
              onChange={(e) => setSpotName(e.target.value)}
              placeholder="z.B. 'Parkplatz vor dem Supermarkt'"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>Standort: {userLocation[0].toFixed(6)}, {userLocation[1].toFixed(6)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAddSpot}
              disabled={loading}
              className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Wird hinzugefügt...' : 'Hinzufügen'}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
