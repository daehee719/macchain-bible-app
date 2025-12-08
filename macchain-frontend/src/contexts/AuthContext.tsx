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
  // queryFn에서 Supabase 세션을 확인하여 초기값 설정
  const { data: user } = useQuery<User | null>({
    queryKey: QUERY_KEY_USER,
    queryFn: async () => {
      // Supabase 세션 확인
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        // 세션 정보로 기본 사용자 반환
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
    staleTime: Infinity, // 사용자 정보는 수동으로만 업데이트
    gcTime: Infinity, // 캐시에서 제거하지 않음
    retry: false, // 실패 시 재시도 안 함
  })

  // React Query 캐시에서 토큰 가져오기
  // queryFn에서 Supabase 세션을 확인하여 초기값 설정
  const { data: token } = useQuery<string | null>({
    queryKey: QUERY_KEY_TOKEN,
    queryFn: async () => {
      // Supabase 세션 확인
      const { data: { session } } = await supabase.auth.getSession()
      return session?.access_token || null
    },
    staleTime: Infinity, // 토큰은 수동으로만 업데이트
    gcTime: Infinity, // 캐시에서 제거하지 않음
    retry: false, // 실패 시 재시도 안 함
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
      
      // 타임아웃 처리 (1.5초로 단축, 실패해도 세션 정보로 로그인 유지)
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Query timeout'))
        }, 1500)
      })
      
      // 필요한 컬럼만 선택하여 쿼리 최적화
      // id는 PRIMARY KEY이므로 인덱스가 자동으로 존재함
      // limit(1)을 추가하여 최적화
      const queryPromise = supabase
        .from('users')
        .select('id, email, name, nickname, is_active, avatar_url')
        .eq('id', supabaseUser.id)
        .limit(1)
        .maybeSingle() // single() 대신 maybeSingle() 사용 (더 빠름)

      const result = await Promise.race([
        queryPromise,
        timeoutPromise
      ]) as { data: any; error: any }
      
      const { data: profile, error } = result
      
      const queryDuration = Date.now() - queryStartTime
      // 느린 쿼리 경고 제거 (콘솔을 깔끔하게 유지)

      if (error) {
        // 아직 프로필이 없는 경우(PGRST116)에는 이 시점에서 생성 시도
        if ((error as any).code === 'PGRST116') {
            // 프로필 생성 시도 (조용히 처리)
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
              // 프로필 생성 실패 (조용히 처리, 세션 정보로 기본 사용자 반환)
              // 프로필 생성 실패해도 세션 정보로 기본 사용자 반환
              return {
                id: supabaseUser.id,
                email: supabaseUser.email!,
                name: (supabaseUser.user_metadata as any)?.name || supabaseUser.email!,
                nickname: (supabaseUser.user_metadata as any)?.nickname || '',
              isActive: true,
              avatarUrl: (supabaseUser.user_metadata as any)?.avatar_url || undefined
              } as User
            }

            // 프로필 생성 성공
            return {
              id: created.id,
              email: created.email,
              name: created.name,
              nickname: created.nickname,
            isActive: created.is_active,
            avatarUrl: (supabaseUser.user_metadata as any)?.avatar_url || undefined
            } as User
          } catch (insertErr) {
            // 프로필 생성 중 에러 발생 (조용히 처리)
            // 프로필 생성 실패해도 세션 정보로 기본 사용자 반환
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

        // 에러 로그 제거 (조용히 처리)
        // 프로필 로드 실패해도 세션 정보로 기본 사용자 반환
        return {
          id: supabaseUser.id,
          email: supabaseUser.email!,
          name: (supabaseUser.user_metadata as any)?.name || supabaseUser.email!,
          nickname: (supabaseUser.user_metadata as any)?.nickname || '',
        isActive: true,
        avatarUrl: (supabaseUser.user_metadata as any)?.avatar_url || undefined
        } as User
      }

      // 프로필이 정상적으로 로드됨
      if (!profile) {
        // 프로필 데이터 없음 (조용히 처리)
        return {
          id: supabaseUser.id,
          email: supabaseUser.email!,
          name: (supabaseUser.user_metadata as any)?.name || supabaseUser.email!,
          nickname: (supabaseUser.user_metadata as any)?.nickname || '',
        isActive: true,
        avatarUrl: (supabaseUser.user_metadata as any)?.avatar_url || undefined
        } as User
      }

      // 성능 로그 제거 (콘솔을 깔끔하게 유지)
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
      const totalDuration = Date.now() - startTime
      // 타임아웃이나 네트워크 에러는 조용히 처리 (이미 세션 정보로 로그인 상태 유지됨)
      // 에러 로그를 완전히 제거하여 콘솔을 깔끔하게 유지
      // 타임아웃이나 에러 발생 시에도 세션 정보로 기본 사용자 반환
      // 이렇게 하면 프로필 로드가 실패해도 로그인 상태는 유지됨
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

    // 프로필 로드 헬퍼 함수 (중복 방지)
    const loadProfileIfNeeded = async (session: Session | null) => {
      if (!session?.user || isLoadingProfile || !isMounted) return
      
      isLoadingProfile = true
      try {
        // 먼저 토큰 설정 (로그인 상태 유지)
        setToken(session.access_token)
        
        // 프로필 로드 시도 (실패해도 세션 정보로 기본 사용자 반환)
        const profile = await loadUserProfile(session.user)
        if (profile && isMounted) {
          setUser(profile)
          if (import.meta.env.DEV) {
            console.log('✅ 사용자 프로필 로드 완료:', profile.email)
          }
        } else if (isMounted) {
          // 프로필이 null이어도 세션 정보로 기본 사용자 설정
          const fallbackUser: User = {
            id: session.user.id,
            email: session.user.email!,
            name: (session.user.user_metadata as any)?.name || session.user.email!,
            nickname: (session.user.user_metadata as any)?.nickname || '',
            isActive: true,
            avatarUrl: (session.user.user_metadata as any)?.avatar_url || undefined
          }
          setUser(fallbackUser)
          if (import.meta.env.DEV) {
            console.log('⚠️ 프로필 로드 실패, 세션 정보로 기본 사용자 설정:', fallbackUser.email)
          }
        }
      } catch (error) {
        // 에러 발생 시에도 세션 정보로 기본 사용자 설정 (조용히 처리)
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
          if (import.meta.env.DEV) {
            console.debug('✅ 세션 정보로 기본 사용자 설정:', fallbackUser.email)
          }
        }
      } finally {
        isLoadingProfile = false
      }
    }

    // 초기 세션 확인 (새로고침 시 세션 복원)
    // useQuery가 이미 세션을 확인하므로, 여기서는 프로필만 로드
    const checkInitialSession = async () => {
      try {
        console.log('🔍 초기 세션 확인 시작...')
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
          console.log('✅ 세션 발견:', session.user.email)
          
          // useQuery가 이미 user와 token을 설정했으므로, 세션 확인 완료만 표시
          if (isMounted) {
            setHasCheckedSession(true)
            setLoading(false)
            console.log('✅ 세션 확인 완료, 로딩 상태 해제')
            
            // 프로필은 백그라운드에서 비동기로 로드 (완료되면 업데이트, 실패해도 무시)
            setTimeout(() => {
              if (!isMounted) return
              
              loadUserProfile(session.user)
                .then((profile) => {
                  if (profile && isMounted) {
                    // 프로필이 세션 정보와 다를 때만 업데이트 (불필요한 리렌더링 방지)
                    const prevUser = queryClient.getQueryData<User | null>(QUERY_KEY_USER)
                    if (prevUser?.id !== profile.id || 
                        prevUser?.email !== profile.email ||
                        prevUser?.name !== profile.name) {
                      // 다를 때만 업데이트
                      setUser(profile)
                      if (import.meta.env.DEV) {
                        console.log('✅ 프로필 로드 완료 및 업데이트:', profile.email)
                      }
                    }
                  }
                })
                .catch((error) => {
                  // 프로필 로드 실패는 조용히 처리 (이미 세션 정보로 로그인 상태 유지됨)
                })
            }, 100) // 100ms 지연으로 초기 렌더링 우선
          }
        } else {
          console.log('ℹ️ 저장된 세션 없음 - 로그아웃 상태 유지')
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

    // 초기 세션 확인 실행
    checkInitialSession()

    // Supabase 인증 상태 변경 리스너 (로그인/로그아웃 이벤트 처리)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return

        console.log('🔄 인증 상태 변경:', event, session?.user?.email || 'no user')

        if (event === 'SIGNED_IN') {
          // 새로운 로그인
          if (session?.user) {
            console.log('✅ 로그인:', session.user.email)
            await loadProfileIfNeeded(session)
          }
        } else if (event === 'INITIAL_SESSION') {
          // 초기 세션 - checkInitialSession과 동일한 로직 적용
          if (session?.user && isMounted) {
            console.log('✅ INITIAL_SESSION 이벤트 - 세션 복원:', session.user.email)
            // 세션이 있으면 무조건 로그인 상태 설정 (중복 체크 없이)
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
            console.log('✅ INITIAL_SESSION에서 로그인 상태 설정:', fallbackUser.email, '토큰:', !!session.access_token)
            
            // 프로필은 백그라운드에서 비동기로 로드 (완료되면 업데이트, 실패해도 무시)
            setTimeout(() => {
              if (!isMounted) return
              
              loadUserProfile(session.user)
                .then((profile) => {
                  if (profile && isMounted) {
                    // 이전 사용자 정보 가져오기
                    const prevUser = queryClient.getQueryData<User | null>(QUERY_KEY_USER)
                    if (prevUser?.id !== profile.id || 
                        prevUser?.email !== profile.email ||
                        prevUser?.name !== profile.name) {
                      // 다를 때만 업데이트
                      setUser(profile)
                    }
                    if (import.meta.env.DEV) {
                      console.log('✅ INITIAL_SESSION 프로필 업데이트:', profile.email)
                    }
                  }
                })
                .catch((error) => {
                  // 프로필 로드 실패는 조용히 처리 (에러 로그 출력 안 함)
                })
            }, 100) // 100ms 지연으로 초기 렌더링 우선
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('👋 로그아웃')
          setUser(null)
          setToken(null)
        } else if (event === 'TOKEN_REFRESHED') {
          // 토큰 갱신 시 세션 업데이트
          if (session?.user) {
            console.log('🔄 토큰 갱신')
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
          setHasCheckedSession(true)
          return true
        } else {
          // 프로필 로드 실패 시 세션 정보로 기본 사용자 설정
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
        console.error('Register error details:', {
          message: authError.message,
          status: authError.status,
          code: authError.code,
          name: authError.name
        })
        // 이메일 중복 에러 처리 - Supabase의 다양한 에러 메시지 패턴 확인
        const errorMsg = authError.message?.toLowerCase() || ''
        const errorCode = authError.status || authError.code || ''
        
        if (errorMsg.includes('already registered') || 
            errorMsg.includes('user already registered') ||
            errorMsg.includes('already exists') ||
            errorMsg.includes('email address is already registered') ||
            errorMsg.includes('email already registered') ||
            errorCode === 'signup_disabled' ||
            errorCode === 'user_already_exists') {
          console.error('이메일 중복 에러 감지:', errorMsg, errorCode)
          throw new Error('이미 사용 중인 이메일입니다.')
        }
        throw new Error(authError.message || '회원가입에 실패했습니다.')
      }

      if (authData.user) {
        // 이메일이 이미 인증된 사용자인지 확인
        // email_confirmed_at이 있고 created_at이 오래 전이면 이미 존재하는 사용자일 가능성이 높음
        if (authData.user.email_confirmed_at) {
          const createdAt = new Date(authData.user.created_at)
          const now = new Date()
          const timeDiff = now.getTime() - createdAt.getTime()
          const minutesDiff = timeDiff / (1000 * 60)
          
          // 1분 이내에 생성된 사용자는 새 사용자로 간주
          // 그 외는 이미 존재하는 사용자로 간주
          if (minutesDiff > 1) {
            console.error('이미 존재하는 사용자 감지:', {
              email: authData.user.email,
              created_at: authData.user.created_at,
              email_confirmed_at: authData.user.email_confirmed_at,
              minutesDiff
            })
            throw new Error('중복된 이메일입니다.')
          }
        }
        
        // 세션이 있으면 (이메일 확인 불필요) 바로 로그인 처리
        if (authData.session) {
          setToken(authData.session.access_token)
          // 프로필 로드 (없으면 자동 생성됨)
          const profile = await loadUserProfile(authData.user)
          if (profile) {
            setUser(profile)
            setHasCheckedSession(true)
            return { success: true, user: authData.user }
          } else {
            // 프로필 로드 실패 시 세션 정보로 기본 사용자 설정
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
          // 프로필이 없어도 세션은 있으므로 로그인 성공으로 처리
          // (프로필은 loadUserProfile에서 자동 생성 시도했지만 실패한 경우)
          // 세션만으로도 로그인 상태 유지
          return { success: true, user: authData.user }
        }
        
        // 세션이 없으면 (이메일 확인 필요) false 반환하여
        // Login 페이지에서 안내 메시지 표시 가능하도록
        // Edge Function을 통해 auth.users와 public.users 둘 다 확인
        
        let isExistingUser = false
        try {
          const checkResult = await callEdgeFunction('check-email', { email })
          isExistingUser = checkResult.exists || false
          console.log('Register result - no session (Edge Function check):', {
            email: authData.user.email,
            email_confirmed_at: authData.user.email_confirmed_at,
            created_at: authData.user.created_at,
            checkResult,
            isExistingUser
          })
        } catch (checkError) {
          console.error('Edge Function check error:', checkError)
          // Edge Function 호출 실패 시 기존 로직 사용
          // 1. auth.users 확인: email_confirmed_at이 있으면 이미 존재하는 사용자
          const isExistingInAuth = !!authData.user.email_confirmed_at
          
          // 2. public.users 확인: 직접 조회
          const { data: existingUserInPublic } = await supabase
            .from('users')
            .select('id, email')
            .eq('email', email.toLowerCase().trim())
            .maybeSingle()
          
          const isExistingInPublic = !!existingUserInPublic
          isExistingUser = isExistingInAuth || isExistingInPublic
          
          console.log('Register result - no session (fallback check):', {
            email: authData.user.email,
            isExistingInAuth,
            isExistingInPublic,
            isExistingUser
          })
        }
        
        return { success: false, user: authData.user, isExistingUser }
      }
      
      // authData.user가 없는 경우 (이상한 상황)
      console.error('Register returned user data but no user object:', authData)
      return { success: false, isExistingUser: false }
    } catch (error) {
      console.error('Register error:', error)
      // 에러를 다시 throw하여 Login.tsx에서 처리할 수 있도록 함
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
      // 에러가 발생해도 로컬 상태는 초기화
      setUser(null)
      setToken(null)
      setHasCheckedSession(false)
    }
  }

  const value: AuthContextType = useMemo(() => {
    // 세션이 확인되었고 사용자와 토큰이 있으면 로그인 상태
    // loading 상태와 관계없이 세션이 확인되면 로그인 상태 유지
    const isLoggedIn = hasCheckedSession && !!user && !!token
    console.log('🔍 AuthContext value 계산:', { 
      hasUser: !!user, 
      hasToken: !!token, 
      hasCheckedSession,
      isLoggedIn,
      userEmail: user?.email,
      loading
    })
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
