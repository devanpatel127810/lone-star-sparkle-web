import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

console.log('Supabase Config:', {
  url: supabaseUrl ? '✅ Loaded' : '❌ Missing',
  key: supabaseAnonKey ? '✅ Loaded' : '❌ Missing'
});

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// TypeScript type for our Booking object
export interface Booking {
  id: string
  full_name: string
  phone: string
  email?: string
  service_type: 'Wash & Fold' | 'Dry Cleaning' | 'Pickup Only'
  pickup_date: string
  pickup_time: string
  pickup_address: string
  special_instructions?: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}

// Type for creating a new booking (without auto-generated fields)
export type CreateBooking = Omit<Booking, 'id' | 'status' | 'created_at' | 'updated_at'>

// Type for user profile
export interface UserProfile {
  id: string
  full_name: string
  phone: string
  address: string
  created_at: string
  updated_at: string
}
