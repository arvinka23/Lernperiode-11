'use client'

import { useEffect, useState } from 'react'
import { User, supabase } from '@/lib/supabase'
import { Trophy, Star, TrendingUp, Award } from 'lucide-react'

export default function GamificationPanel() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Für Demo-Zwecke verwenden wir einen Mock-User
        // In der echten App würdest du hier den authentifizierten User laden
        const mockUser: User = {
          id: 'demo-user',
          points: 1250,
          reports_count: 47,
          level: 8
        }
        setUser(mockUser)
      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [])

  const getLevelTitle = (level: number) => {
    if (level >= 20) return 'Parkplatz-Meister'
    if (level >= 15) return 'Parkplatz-Experte'
    if (level >= 10) return 'Parkplatz-Kenner'
    if (level >= 5) return 'Parkplatz-Anfänger'
    return 'Parkplatz-Neuling'
  }

  const getNextLevelPoints = (currentLevel: number) => {
    return currentLevel * 100
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-center">Melde dich an, um deine Statistiken zu sehen</p>
      </div>
    )
  }

  const progressToNextLevel = (user.points % 100) / 100

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Deine Statistiken</h3>
        <Trophy className="w-6 h-6 text-yellow-500" />
      </div>

      {/* Level & Titel */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-5 h-5 text-yellow-500" />
          <span className="text-2xl font-bold text-gray-800">Level {user.level}</span>
        </div>
        <p className="text-sm text-gray-600 mb-3">{getLevelTitle(user.level)}</p>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div 
            className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressToNextLevel * 100}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500">
          {user.points % 100} / 100 Punkte zum nächsten Level
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-1" />
          <p className="text-2xl font-bold text-green-600">{user.points}</p>
          <p className="text-xs text-green-600">Gesamtpunkte</p>
        </div>
        
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <Award className="w-6 h-6 text-blue-600 mx-auto mb-1" />
          <p className="text-2xl font-bold text-blue-600">{user.reports_count}</p>
          <p className="text-xs text-blue-600">Reports</p>
        </div>
      </div>

      {/* Achievements */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Aktuelle Achievements</h4>
        <div className="space-y-2">
          {user.reports_count >= 10 && (
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>10 Reports gemacht</span>
            </div>
          )}
          {user.reports_count >= 25 && (
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>25 Reports gemacht</span>
            </div>
          )}
          {user.level >= 5 && (
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Level 5 erreicht</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
