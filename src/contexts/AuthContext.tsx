import { createContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { clearRememberMe, shouldAutoSignOut } from '../lib/auth'
import type { UserProfile } from '../types'

interface AuthContextValue {
  session: Session | null
  user: User | null
  profile: UserProfile | null
  loading: boolean
  refreshProfile: () => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const fetchProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    console.error('프로필 조회 실패:', error.message)
    return null
  }

  return data as UserProfile | null
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = async (userId: string) => {
    const data = await fetchProfile(userId)
    setProfile(data)
  }

  const refreshProfile = async () => {
    if (session?.user) {
      await loadProfile(session.user.id)
    }
  }

  useEffect(() => {
    let active = true

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return
      if (data.session && shouldAutoSignOut()) {
        await supabase.auth.signOut()
        clearRememberMe()
        setLoading(false)
        return
      }
      setSession(data.session)
      if (data.session?.user) {
        await loadProfile(data.session.user.id)
      }
      setLoading(false)
    })

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (!active) return
      setSession(nextSession)
      if (nextSession?.user) {
        await loadProfile(nextSession.user.id)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => {
      active = false
      subscription.subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    clearRememberMe()
    await supabase.auth.signOut()
    setProfile(null)
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        loading,
        refreshProfile,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
