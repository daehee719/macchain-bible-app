import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase, callEdgeFunction } from '../lib/supabase'
import type { User as SupabaseUser, Session } from '@supabase/supabase-js'

interface User {
  id: string
  email: string
  name: string
  nickname?: string
  isActive: boolean
  avatarUrl?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string, nickname?: string) => Promise<{ success: boolean; user?: any; isExistingUser?: boolean }>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

// React Query 키
const QUERY_KEY_USER = ['auth', 'user'] as const
const QUERY_KEY_TOKEN = ['auth', 'token'] as const

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(true)
  const [hasCheckedSession, setHasCheckedSession] = useState(false)

  // React Query 캐시에서 사용자 정보 가져오기
  const { data: user } = useQuery<User | null>({
    queryKey: QUERY_KEY_USER,
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        return {
          id: session.user.id,
          email: session.user.email!,
          name: (session.user.user_metadata as any)?.name || session.user.email!,
          nickname: (session.user.user_metadata as any)?.nickname || '',
          isActive: true,
          avatarUrl: (session.user.user_metadata as any)?.avatar_url || undefined
        } as User
      }
      return null
    },
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
  })

  // React Query 캐시에서 토큰 가져오기
  const { data: token } = useQuery<string | null>({
    queryKey: QUERY_KEY_TOKEN,
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      return session?.access_token || null
    },
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
  })

  // 사용자 정보를 React Query 캐시에 저장
  const setUser = useCallback((userData: User | null) => {
    queryClient.setQueryData<User | null>(QUERY_KEY_USER, userData)
  }, [queryClient])

  // 토큰을 React Query 캐시에 저장
  const setToken = useCallback((tokenData: string | null) => {
    queryClient.setQueryData<string | null>(QUERY_KEY_TOKEN, tokenData)
  }, [queryClient])

  // Supabase 세션 확인 및 사용자 프로필 로드
  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    const startTime = Date.now()
    try {
      const queryStartTime = Date.now()
      
      // 타임아웃 처리 (1.5초)
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Query timeout'))
        }, 1500)
      })
      
      const queryPromise = supabase
        .from('users')
        .select('id, email, name, nickname, is_active, avatar_url')
        .eq('id', supabaseUser.id)
        .limit(1)
        .maybeSingle()

      const result = await Promise.race([
        queryPromise,
        timeoutPromise
      ]) as { data: any; error: any }
      
      const { data: profile, error } = result
      
      if (error) {
        if ((error as any).code === 'PGRST116') {
          // 프로필 생성 시도
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
              return {
                id: supabaseUser.id,
                email: supabaseUser.email!,
                name: (supabaseUser.user_metadata as any)?.name || supabaseUser.email!,
                nickname: (supabaseUser.user_metadata as any)?.nickname || '',
                isActive: true,
                avatarUrl: (supabaseUser.user_metadata as any)?.avatar_url || undefined
              } as User
            }

            return {
              id: created.id,
              email: created.email,
              name: created.name,
              nickname: created.nickname,
              isActive: created.is_active,
              avatarUrl: (supabaseUser.user_metadata as any)?.avatar_url || undefined
            } as User
          } catch (insertErr) {
            return {
              id: supabaseUser.id,
              email: supabaseUser.email!,
              name: (supabaseUser.user_metadata as any)?.name || supabaseUser.email!,
              nickname: (supabaseUser.user_metadata as any)?.nickname || '',
              isActive: true,
              avatarUrl: (supabaseUser.user_metadata as any)?.avatar_url || undefined
            } as User
          }
        }

        return {
          id: supabaseUser.id,
          email: supabaseUser.email!,
          name: (supabaseUser.user_metadata as any)?.name || supabaseUser.email!,
          nickname: (supabaseUser.user_metadata as any)?.nickname || '',
          isActive: true,
          avatarUrl: (supabaseUser.user_metadata as any)?.avatar_url || undefined
        } as User
      }

      if (!profile) {
        return {
          id: supabaseUser.id,
          email: supabaseUser.email!,
          name: (supabaseUser.user_metadata as any)?.name || supabaseUser.email!,
          nickname: (supabaseUser.user_metadata as any)?.nickname || '',
          isActive: true,
          avatarUrl: (supabaseUser.user_metadata as any)?.avatar_url || undefined
        } as User
      }

      return {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        nickname: profile.nickname,
        isActive: profile.is_active,
        avatarUrl:
          (supabaseUser.user_metadata as any)?.avatar_url ||
          (profile as any)?.avatar_url ||
          undefined
      } as User
    } catch (error: any) {
      return {
        id: supabaseUser.id,
        email: supabaseUser.email!,
        name: (supabaseUser.user_metadata as any)?.name || supabaseUser.email!,
        nickname: (supabaseUser.user_metadata as any)?.nickname || '',
        isActive: true,
        avatarUrl: (supabaseUser.user_metadata as any)?.avatar_url || undefined
      } as User
    }
  }

  useEffect(() => {
    let isMounted = true
    let isLoadingProfile = false

    const loadProfileIfNeeded = async (session: Session | null) => {
      if (!session?.user || isLoadingProfile || !isMounted) return
      
      isLoadingProfile = true
      try {
        setToken(session.access_token)
        
        const profile = await loadUserProfile(session.user)
        if (profile && isMounted) {
          setUser(profile)
          if (__DEV__) {
            console.log('✅ 사용자 프로필 로드 완료:', profile.email)
          }
        } else if (isMounted) {
          const fallbackUser: User = {
            id: session.user.id,
            email: session.user.email!,
            name: (session.user.user_metadata as any)?.name || session.user.email!,
            nickname: (session.user.user_metadata as any)?.nickname || '',
            isActive: true,
            avatarUrl: (session.user.user_metadata as any)?.avatar_url || undefined
          }
          setUser(fallbackUser)
        }
      } catch (error) {
        if (isMounted && session?.user) {
          const fallbackUser: User = {
            id: session.user.id,
            email: session.user.email!,
            name: (session.user.user_metadata as any)?.name || session.user.email!,
            nickname: (session.user.user_metadata as any)?.nickname || '',
            isActive: true,
            avatarUrl: (session.user.user_metadata as any)?.avatar_url || undefined
          }
          setUser(fallbackUser)
          if (__DEV__) {
            console.debug('✅ 세션 정보로 기본 사용자 설정:', fallbackUser.email)
          }
        }
      } finally {
        isLoadingProfile = false
      }
    }

    const checkInitialSession = async () => {
      try {
        if (__DEV__) {
          console.log('🔍 초기 세션 확인 시작...')
        }
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ 세션 확인 오류:', error)
          if (isMounted) {
            setLoading(false)
            setHasCheckedSession(true)
          }
          return
        }

        if (session?.user) {
          if (__DEV__) {
            console.log('✅ 세션 발견:', session.user.email)
          }
          
          if (isMounted) {
            setHasCheckedSession(true)
            setLoading(false)
            if (__DEV__) {
              console.log('✅ 세션 확인 완료, 로딩 상태 해제')
            }
            
            setTimeout(() => {
              if (!isMounted) return
              
              loadUserProfile(session.user)
                .then((profile) => {
                  if (profile && isMounted) {
                    const prevUser = queryClient.getQueryData<User | null>(QUERY_KEY_USER)
                    if (prevUser?.id !== profile.id || 
                        prevUser?.email !== profile.email ||
                        prevUser?.name !== profile.name) {
                      setUser(profile)
                      if (__DEV__) {
                        console.log('✅ 프로필 로드 완료 및 업데이트:', profile.email)
                      }
                    }
                  }
                })
                .catch((error) => {
                  // 프로필 로드 실패는 조용히 처리
                })
            }, 100)
          }
        } else {
          if (__DEV__) {
            console.log('ℹ️ 저장된 세션 없음 - 로그아웃 상태 유지')
          }
          if (isMounted) {
            setHasCheckedSession(true)
            setLoading(false)
          }
        }
      } catch (error) {
        console.error('❌ 초기 세션 확인 실패:', error)
        if (isMounted) {
          setLoading(false)
          setHasCheckedSession(true)
        }
      }
    }

    checkInitialSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return

        if (__DEV__) {
          console.log('🔄 인증 상태 변경:', event, session?.user?.email || 'no user')
        }

        if (event === 'SIGNED_IN') {
          if (session?.user) {
            if (__DEV__) {
              console.log('✅ 로그인:', session.user.email)
            }
            await loadProfileIfNeeded(session)
          }
        } else if (event === 'INITIAL_SESSION') {
          if (session?.user && isMounted) {
            if (__DEV__) {
              console.log('✅ INITIAL_SESSION 이벤트 - 세션 복원:', session.user.email)
            }
            setToken(session.access_token)
            const fallbackUser: User = {
              id: session.user.id,
              email: session.user.email!,
              name: (session.user.user_metadata as any)?.name || session.user.email!,
              nickname: (session.user.user_metadata as any)?.nickname || '',
              isActive: true,
              avatarUrl: (session.user.user_metadata as any)?.avatar_url || undefined
            }
            setUser(fallbackUser)
            setToken(session.access_token)
            setHasCheckedSession(true)
            setLoading(false)
            if (__DEV__) {
              console.log('✅ INITIAL_SESSION에서 로그인 상태 설정:', fallbackUser.email, '토큰:', !!session.access_token)
            }
            
            setTimeout(() => {
              if (!isMounted) return
              
              loadUserProfile(session.user)
                .then((profile) => {
                  if (profile && isMounted) {
                    const prevUser = queryClient.getQueryData<User | null>(QUERY_KEY_USER)
                    if (prevUser?.id !== profile.id || 
                        prevUser?.email !== profile.email ||
                        prevUser?.name !== profile.name) {
                      setUser(profile)
                    }
                    if (__DEV__) {
                      console.log('✅ INITIAL_SESSION 프로필 업데이트:', profile.email)
                    }
                  }
                })
                .catch((error) => {
                  // 프로필 로드 실패는 조용히 처리
                })
            }, 100)
          }
        } else if (event === 'SIGNED_OUT') {
          if (__DEV__) {
            console.log('👋 로그아웃')
          }
          setUser(null)
          setToken(null)
        } else if (event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            if (__DEV__) {
              console.log('🔄 토큰 갱신')
            }
            setToken(session.access_token)
          }
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
        
        const profile = await loadUserProfile(data.session.user)
        if (profile) {
          setUser(profile)
          setHasCheckedSession(true)
          return true
        } else {
          const fallbackUser: User = {
            id: data.session.user.id,
            email: data.session.user.email!,
            name: (data.session.user.user_metadata as any)?.name || data.session.user.email!,
            nickname: (data.session.user.user_metadata as any)?.nickname || '',
            isActive: true,
            avatarUrl: (data.session.user.user_metadata as any)?.avatar_url || undefined
          }
          setUser(fallbackUser)
          setHasCheckedSession(true)
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
  ): Promise<{ success: boolean; user?: any; isExistingUser?: boolean }> => {
    try {
      setLoading(true)
      
      // React Native에서는 redirect URL을 다르게 처리
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined, // React Native에서는 필요 없음
          data: {
            name,
            nickname: nickname || name
          }
        }
      })

      if (authError) {
        console.error('Register error:', authError)
        const errorMsg = authError.message?.toLowerCase() || ''
        const errorCode = authError.status || authError.code || ''
        
        if (errorMsg.includes('already registered') || 
            errorMsg.includes('user already registered') ||
            errorMsg.includes('already exists') ||
            errorMsg.includes('email address is already registered') ||
            errorMsg.includes('email already registered') ||
            errorCode === 'signup_disabled' ||
            errorCode === 'user_already_exists') {
          throw new Error('이미 사용 중인 이메일입니다.')
        }
        throw new Error(authError.message || '회원가입에 실패했습니다.')
      }

      if (authData.user) {
        if (authData.user.email_confirmed_at) {
          const createdAt = new Date(authData.user.created_at)
          const now = new Date()
          const timeDiff = now.getTime() - createdAt.getTime()
          const minutesDiff = timeDiff / (1000 * 60)
          
          if (minutesDiff > 1) {
            throw new Error('중복된 이메일입니다.')
          }
        }
        
        if (authData.session) {
          setToken(authData.session.access_token)
          const profile = await loadUserProfile(authData.user)
          if (profile) {
            setUser(profile)
            setHasCheckedSession(true)
            return { success: true, user: authData.user }
          } else {
            const fallbackUser: User = {
              id: authData.user.id,
              email: authData.user.email!,
              name: (authData.user.user_metadata as any)?.name || authData.user.email!,
              nickname: (authData.user.user_metadata as any)?.nickname || '',
              isActive: true,
              avatarUrl: (authData.user.user_metadata as any)?.avatar_url || undefined
            }
            setUser(fallbackUser)
            setHasCheckedSession(true)
            return { success: true, user: authData.user }
          }
        }
        
        let isExistingUser = false
        try {
          const checkResult = await callEdgeFunction('check-email', { email })
          isExistingUser = checkResult.exists || false
        } catch (checkError) {
          const isExistingInAuth = !!authData.user.email_confirmed_at
          
          const { data: existingUserInPublic } = await supabase
            .from('users')
            .select('id, email')
            .eq('email', email.toLowerCase().trim())
            .maybeSingle()
          
          const isExistingInPublic = !!existingUserInPublic
          isExistingUser = isExistingInAuth || isExistingInPublic
        }
        
        return { success: false, user: authData.user, isExistingUser }
      }
      
      return { success: false, isExistingUser: false }
    } catch (error) {
      console.error('Register error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setToken(null)
      setHasCheckedSession(false)
    } catch (error) {
      console.error('Logout error:', error)
      setUser(null)
      setToken(null)
      setHasCheckedSession(false)
    }
  }

  const value: AuthContextType = useMemo(() => {
    const isLoggedIn = hasCheckedSession && !!user && !!token
    if (__DEV__) {
      console.log('🔍 AuthContext value 계산:', { 
        hasUser: !!user, 
        hasToken: !!token, 
        hasCheckedSession,
        isLoggedIn,
        userEmail: user?.email,
        loading
      })
    }
    return {
      user,
      token,
      isLoggedIn,
      login,
      register,
      logout,
      loading
    }
  }, [user, token, hasCheckedSession, loading, login, register, logout])

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

