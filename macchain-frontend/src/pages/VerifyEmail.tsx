import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import Card from '../components/Card'
import { Mail, CheckCircle, XCircle, Loader, ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate()
  const { user, isLoggedIn } = useAuth()
  const [status, setStatus] = useState<'verifying' | 'success' | 'error' | 'expired'>('verifying')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [userEmail, setUserEmail] = useState<string>('')

  useEffect(() => {
    let isMounted = true
    let timeoutId: NodeJS.Timeout

    // URL 해시에서 파라미터 확인
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const error = hashParams.get('error')
    const errorDescription = hashParams.get('error_description')
    const accessToken = hashParams.get('access_token')
    const type = hashParams.get('type')

    // 에러가 있는 경우 즉시 처리
    if (error) {
      console.error('Email verification error:', error, errorDescription)
      
      if (error === 'expired_token' || error === 'token_expired') {
        setStatus('expired')
        setErrorMessage('인증 링크가 만료되었습니다. 새로운 인증 링크를 요청해주세요.')
      } else {
        setStatus('error')
        setErrorMessage(errorDescription || '이메일 인증 중 오류가 발생했습니다.')
      }
      return
    }

    // 이미 로그인된 경우 (이미 인증 완료)
    if (isLoggedIn && user) {
      setUserEmail(user.email || '')
      setStatus('success')
      timeoutId = setTimeout(() => {
        if (isMounted) {
          navigate('/')
        }
      }, 3000) // 3초 후 리다이렉트
      return
    }

    // Supabase 인증 상태 변경 리스너 설정
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return

        console.log('Auth state change:', event, session?.user?.email)

        if (event === 'SIGNED_IN' && session) {
          setUserEmail(session.user.email || '')
          setStatus('success')
          // URL 해시 정리 (보안상 이유로)
          window.history.replaceState(null, '', '/verify-email')
          timeoutId = setTimeout(() => {
            if (isMounted) {
              navigate('/')
            }
          }, 3000) // 3초 후 리다이렉트
        } else if (event === 'TOKEN_REFRESHED' && session) {
          // 토큰이 갱신된 경우도 성공으로 처리
          setUserEmail(session.user.email || '')
          setStatus('success')
          window.history.replaceState(null, '', '/verify-email')
          timeoutId = setTimeout(() => {
            if (isMounted) {
              navigate('/')
            }
          }, 3000)
        }
      }
    )

    // 현재 세션 확인 (이미 처리되었을 수 있음)
    supabase.auth.getSession().then(({ data: { session }, error: sessionError }) => {
      if (!isMounted) return

      if (sessionError) {
        console.error('Session error:', sessionError)
        // 세션 에러가 있어도 해시에 토큰이 있으면 인증 시도
        if (accessToken && type) {
          // Supabase가 자동으로 처리하므로 대기
          return
        }
        setStatus('error')
        setErrorMessage('세션을 확인하는 중 오류가 발생했습니다.')
        return
      }

      if (session && session.user) {
        setUserEmail(session.user.email || '')
        setStatus('success')
        window.history.replaceState(null, '', '/verify-email')
        timeoutId = setTimeout(() => {
          if (isMounted) {
            navigate('/')
          }
        }, 3000)
      } else if (accessToken && type) {
        // 해시에 토큰이 있으면 Supabase가 자동으로 처리하므로 대기
        // 타임아웃 설정
        timeoutId = setTimeout(() => {
          if (isMounted && status === 'verifying') {
            setStatus('error')
            setErrorMessage('인증 링크를 처리할 수 없습니다. 링크가 유효한지 확인해주세요.')
          }
        }, 15000) // 15초 후 타임아웃
      } else {
        // 해시도 없고 세션도 없는 경우
        setStatus('error')
        setErrorMessage('인증 링크가 올바르지 않습니다. 이메일에서 링크를 다시 확인해주세요.')
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [navigate, isLoggedIn, user, status])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 transition-colors">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="text-center">
          {status === 'verifying' && (
            <div className="py-12">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <Loader size={80} className="text-primary-600 dark:text-primary-400 animate-spin" />
                  <Mail size={40} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                이메일 인증 중...
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                잠시만 기다려주세요. 이메일 인증을 처리하고 있습니다.
              </p>
              <div className="flex justify-center">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="py-12">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="p-6 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 rounded-full animate-pulse">
                    <CheckCircle size={72} className="text-green-600 dark:text-green-400" />
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <Sparkles size={32} className="text-yellow-400 animate-bounce" />
                  </div>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                🎉 이메일 인증 완료!
              </h1>
              <p className="text-xl text-gray-700 dark:text-gray-200 mb-2 font-semibold">
                환영합니다!
              </p>
              {userEmail && (
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  <span className="font-semibold text-primary-600 dark:text-primary-400">{userEmail}</span> 계정이 성공적으로 인증되었습니다.
                </p>
              )}
              <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg p-6 mb-8">
                <p className="text-base text-gray-700 dark:text-gray-300">
                  이제 MacChain의 모든 기능을 사용하실 수 있습니다.
                  <br />
                  <span className="text-sm text-gray-500 dark:text-gray-400 mt-2 block">
                    잠시 후 자동으로 대시보드로 이동합니다...
                  </span>
                </p>
              </div>
              <div className="flex justify-center gap-4">
                <Link
                  to="/"
                  className="inline-flex items-center px-8 py-4 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-xl hover:scale-105 transition-all text-lg"
                >
                  대시보드로 이동
                  <ArrowRight size={24} className="ml-2" />
                </Link>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="py-12">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <XCircle size={64} className="text-red-600 dark:text-red-400" />
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                인증 실패
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                {errorMessage}
              </p>
              <div className="mt-8 space-y-4">
                <Link
                  to="/login"
                  className="inline-flex items-center px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all"
                >
                  로그인 페이지로 이동
                  <ArrowRight size={20} className="ml-2" />
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  문제가 계속되면 새로운 인증 링크를 요청해주세요.
                </p>
              </div>
            </div>
          )}

          {status === 'expired' && (
            <div className="py-12">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                  <XCircle size={64} className="text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                인증 링크 만료
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                인증 링크가 만료되었습니다.
                <br />
                새로운 인증 링크를 요청해주세요.
              </p>
              <div className="space-y-4">
                <Link
                  to="/login"
                  className="inline-flex items-center px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all"
                >
                  로그인 페이지로 이동
                  <ArrowRight size={20} className="ml-2" />
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  로그인 페이지에서 "비밀번호 재설정" 또는 "인증 링크 재전송"을 요청할 수 있습니다.
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* 추가 정보 */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            도움이 필요하신가요?{' '}
            <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline">
              로그인 페이지
            </Link>
            로 돌아가세요.
          </p>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail

