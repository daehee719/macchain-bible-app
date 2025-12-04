import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import type { User as SupabaseUser, Session } from '@supabase/supabase-js'

interface User {
  id: string
  email: string
  name: string
  nickname?: string
  isActive: boolean
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string, nickname?: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Supabase 세션 확인 및 사용자 프로필 로드
  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    const startTime = Date.now()
    try {
      const queryStartTime = Date.now()
      
      // 타임아웃 처리 (10초)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Query timeout after 10 seconds'))
        }, 10000)
      })
      
      const queryPromise = supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single()

      const { data: profile, error } = await Promise.race([
        queryPromise,
        timeoutPromise
      ]) as any
      
      const queryDuration = Date.now() - queryStartTime
      if (queryDuration > 500) {
        console.warn(`⚠️ Slow profile query: ${queryDuration}ms`)
      }

      if (error) {
        // 아직 프로필이 없는 경우(PGRST116)에는 이 시점에서 생성 시도
        if ((error as any).code === 'PGRST116') {
          console.log('User profile not found (PGRST116), creating on demand...')
          try {
            const { data: created, error: insertError } = await supabase
              .from('users')
              .insert({
                id: supabaseUser.id,
                email: supabaseUser.email!,
                name:
                  (supabaseUser.user_metadata as any)?.name ||
                  supabaseUser.email!,
                nickname:
                  (supabaseUser.user_metadata as any)?.nickname ||
                  (supabaseUser.user_metadata as any)?.name ||
                  supabaseUser.email!,
                is_active: true
              })
              .select('*')
              .single()

            if (insertError || !created) {
              console.error('Failed to create user profile on demand:', insertError)
              console.error('Insert error details:', JSON.stringify(insertError, null, 2))
              return null
            }

            console.log('User profile created successfully:', created.email)
            return {
              id: created.id,
              email: created.email,
              name: created.name,
              nickname: created.nickname,
              isActive: created.is_active
            } as User
          } catch (insertErr) {
            console.error('Error creating user profile on demand:', insertErr)
            return null
          }
        }

        console.error('Failed to load user profile:', error)
        console.error('Error details:', JSON.stringify(error, null, 2))
        return null
      }

      // 프로필이 정상적으로 로드됨
      if (!profile) {
        console.warn('Profile query returned no data')
        return null
      }

      const totalDuration = Date.now() - startTime
      if (totalDuration > 1000) {
        console.warn(`⚠️ Slow profile load: ${totalDuration}ms`)
      }
      return {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        nickname: profile.nickname,
        isActive: profile.is_active
      } as User
    } catch (error: any) {
      const totalDuration = Date.now() - startTime
      console.error(`❌ Error loading user profile (took ${totalDuration}ms):`, error)
      if (error?.message?.includes('timeout')) {
        console.error('Profile load timed out')
      }
      // 네트워크 에러인 경우 상세 정보 출력
      if (error?.message) {
        console.error('Error message:', error.message)
      }
      if (error?.code) {
        console.error('Error code:', error.code)
      }
      if (error?.stack) {
        console.error('Error stack:', error.stack)
      }
      return null
    }
  }

  useEffect(() => {
    let isMounted = true
    let isLoadingProfile = false

    // 프로필 로드 헬퍼 함수 (중복 방지)
    const loadProfileIfNeeded = async (session: Session | null) => {
      if (!session?.user || isLoadingProfile || !isMounted) return
      
      isLoadingProfile = true
      try {
        setToken(session.access_token)
        const profile = await loadUserProfile(session.user)
        if (profile && isMounted) {
          setUser(profile)
        }
      } catch (error) {
        console.error('Failed to load profile:', error)
      } finally {
        isLoadingProfile = false
      }
    }

    // Supabase 인증 상태 변경 리스너 (초기 세션과 변경 모두 처리)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return

        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
          if (session?.user) {
            await loadProfileIfNeeded(session)
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setToken(null)
        }
        
        if (isMounted) {
          setLoading(false)
        }
      }
    )

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      
      // Supabase Auth를 통한 로그인
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('Login error:', error)
        return false
      }

      if (data.session?.user) {
        setToken(data.session.access_token)
        
        // 사용자 프로필 로드
        const profile = await loadUserProfile(data.session.user)
        if (profile) {
          setUser(profile)
          return true
        }
      }
      
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (
    email: string, 
    password: string, 
    name: string, 
    nickname?: string
  ): Promise<boolean> => {
    try {
      setLoading(true)
      
      // Supabase Auth를 통한 회원가입
      // 이메일 인증 후 리다이렉트 URL 설정
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email`,
          data: {
            name,
            nickname: nickname || name
          }
        }
      })

      if (authError) {
        console.error('Register error:', authError)
        return false
      }

      if (authData.user) {
        // 세션이 있으면 (이메일 확인 불필요) 바로 로그인 처리
        if (authData.session) {
          setToken(authData.session.access_token)
          // 프로필 로드 (없으면 자동 생성됨)
          const profile = await loadUserProfile(authData.user)
          if (profile) {
            setUser(profile)
            return true
          }
          // 프로필이 없어도 세션은 있으므로 로그인 성공으로 처리
          // (프로필은 loadUserProfile에서 자동 생성 시도했지만 실패한 경우)
          // 세션만으로도 로그인 상태 유지
          return true
        }
        
        // 세션이 없으면 (이메일 확인 필요) false 반환하여
        // Login 페이지에서 안내 메시지 표시 가능하도록
        return false
      }
      
      return false
    } catch (error) {
      console.error('Register error:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setToken(null)
    } catch (error) {
      console.error('Logout error:', error)
      // 에러가 발생해도 로컬 상태는 초기화
      setUser(null)
      setToken(null)
    }
  }

  const value: AuthContextType = useMemo(() => ({
    user,
    token,
    isLoggedIn: !!user && !!token,
    login,
    register,
    logout,
    loading
  }), [user, token, loading, login, register, logout])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
