import { createClient } from '@supabase/supabase-js'

// Temporäre Fallback-Werte für Entwicklung
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://adbfxvbxxqgzssxaxalb.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkYmZ4dmJ4eHFnenNzeGF4YWxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NzY5ODYsImV4cCI6MjA3MjA1Mjk4Nn0.Dx462zVYlQFY7kmP9v2Vc2huYpelHUiDmkzQPcE1YeU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Typen für unsere Daten
export interface ParkingSpot {
  id: string
  lat: number
  lng: number
  status: 'free' | 'occupied'
  reported_by: string
  last_updated: string
  confidence_score: number
}

export interface User {
  id: string
  points: number
  reports_count: number
  level: number
}

export interface Report {
  id: string
  spot_id: string
  user_id: string
  status: 'free' | 'occupied'
  timestamp: string
}
