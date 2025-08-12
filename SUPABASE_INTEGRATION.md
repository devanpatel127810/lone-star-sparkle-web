# Supabase Integration Guide for Lone Star Wash & Dry

## Overview
This guide will help you integrate Supabase to add user authentication, customer profiles, and recurring pickup/delivery functionality to your laundromat website.

## Step 1: Set Up Supabase Project

### 1.1 Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project
4. Note your project URL and anon public key

### 1.2 Install Dependencies
```bash
npm install @supabase/supabase-js
```

## Step 2: Environment Configuration

### 2.1 Create Environment File
Create `.env.local` in your project root:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2.2 Update Vite Config
Ensure your `vite.config.ts` loads environment variables:
```typescript
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {}
  }
})
```

## Step 3: Database Schema Setup

### 3.1 Run SQL in Supabase SQL Editor

```sql
-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create customer profiles table
CREATE TABLE customer_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create addresses table
CREATE TABLE customer_addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customer_profiles(id) ON DELETE CASCADE,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recurring services table
CREATE TABLE recurring_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customer_profiles(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL CHECK (service_type IN ('pickup', 'delivery', 'both')),
  frequency TEXT NOT NULL CHECK (frequency IN ('weekly', 'biweekly', 'monthly')),
  pickup_day TEXT NOT NULL,
  pickup_time TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pickup requests table
CREATE TABLE pickup_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customer_profiles(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL CHECK (service_type IN ('pickup', 'delivery', 'both')),
  pickup_date DATE NOT NULL,
  pickup_time TIME NOT NULL,
  address_id UUID REFERENCES customer_addresses(id),
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE pickup_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON customer_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON customer_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON customer_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Similar policies for other tables...
CREATE POLICY "Users can view own addresses" ON customer_addresses
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Users can manage own addresses" ON customer_addresses
  FOR ALL USING (auth.uid() = customer_id);

CREATE POLICY "Users can view own recurring services" ON recurring_services
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Users can manage own recurring services" ON recurring_services
  FOR ALL USING (auth.uid() = customer_id);

CREATE POLICY "Users can view own pickup requests" ON pickup_requests
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Users can manage own pickup requests" ON pickup_requests
  FOR ALL USING (auth.uid() = customer_id);

-- Create indexes for better performance
CREATE INDEX idx_customer_profiles_email ON customer_profiles(email);
CREATE INDEX idx_customer_addresses_customer_id ON customer_addresses(customer_id);
CREATE INDEX idx_recurring_services_customer_id ON recurring_services(customer_id);
CREATE INDEX idx_pickup_requests_customer_id ON pickup_requests(customer_id);
```

## Step 4: Supabase Client Setup

### 4.1 Create Supabase Client
Create `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface CustomerProfile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  created_at: string
  updated_at: string
}

export interface CustomerAddress {
  id: string
  customer_id: string
  address_line_1: string
  address_line_2: string | null
  city: string
  state: string
  zip_code: string
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface RecurringService {
  id: string
  customer_id: string
  service_type: 'pickup' | 'delivery' | 'both'
  frequency: 'weekly' | 'biweekly' | 'monthly'
  pickup_day: string
  pickup_time: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PickupRequest {
  id: string
  customer_id: string
  service_type: 'pickup' | 'delivery' | 'both'
  pickup_date: string
  pickup_time: string
  address_id: string | null
  notes: string | null
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}
```

## Step 5: Authentication Context

### 5.1 Create Auth Context
Create `src/contexts/AuthContext.tsx`:

```typescript
import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, userData: any) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signUp = async (email: string, password: string, userData: any) => {
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: userData
      }
    })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
```

## Step 6: Authentication Components

### 6.1 Create Login Modal
Create `src/components/auth/LoginModal.tsx`:

```typescript
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

export const LoginModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSignUp) {
        await signUp(email, password, { full_name: fullName, phone })
        toast.success('Account created! Please check your email to verify your account.')
      } else {
        await signIn(email, password)
        toast.success('Welcome back!')
        setIsOpen(false)
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Login
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isSignUp ? 'Create Account' : 'Sign In'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </Button>
        </form>
        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-muted-foreground hover:text-accent"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

## Step 7: Update App.tsx

### 7.1 Wrap App with AuthProvider
Update `src/App.tsx`:

```typescript
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BookPickup from "./pages/BookPickup";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/book-pickup" element={<BookPickup />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
```

## Step 8: Update Navigation Components

### 8.1 Replace Login Button with LoginModal
Update all navigation components to use the LoginModal instead of the static Login button.

## Step 9: Enhanced BookPickup Page

### 9.1 Add User Profile Integration
Update the BookPickup page to:
- Pre-fill form with saved addresses
- Show recurring service options
- Save customer preferences

## Step 10: Testing

### 10.1 Test Authentication Flow
1. Test user registration
2. Test user login
3. Test password reset
4. Test profile creation

### 10.2 Test Database Operations
1. Test address saving
2. Test recurring service setup
3. Test pickup request creation

## Security Considerations

1. **Row Level Security (RLS)** is enabled on all tables
2. **User authentication** is required for all customer operations
3. **Input validation** using Zod schemas
4. **Environment variables** for sensitive configuration

## Next Steps

1. Implement user profile management
2. Add recurring service scheduling
3. Create admin dashboard for staff
4. Add payment processing integration
5. Implement notification system

## Troubleshooting

- Ensure environment variables are properly set
- Check Supabase project settings
- Verify RLS policies are working
- Test authentication flow in development
