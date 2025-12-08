import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase, callEdgeFunction } from '../lib/supabase'
import Card from '../components/Card'
import { LogIn, UserPlus, Mail, Lock, User, Loader, BookOpen, Brain, Users, BarChart3, XCircle, RefreshCcw } from 'lucide-react'
import { toast } from 'sonner'

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    nickname: ''
  })
  const [agreements, setAgreements] = useState({
    privacy: false,
    marketing: false,
    age: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string
    email?: string
    password?: string
    privacy?: string
    age?: string
  }>({})
  
  const { login, register } = useAuth()
  const navigate = useNavigate()

  // 비밀번호 재설정 이메일 발송
  const handleResetPassword = async () => {
    if (!formData.email) {
      setFieldErrors({ email: '이메일을 입력해주세요.' })
      return
    }
    try {
      setLoading(true)
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/login`
      })
      if (error) {
        throw error
      }
      toast.success('비밀번호 재설정 메일을 전송했습니다.')
    } catch (err: any) {
      console.error('Reset password error:', err)
      toast.error('재설정 메일 전송에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 이메일 중복 검증 (Edge Function을 통해 auth.users와 public.users 모두 확인)
  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const result = await callEdgeFunction('check-email', { email })
      console.log('Email check result:', result)
      return result.exists || false
    } catch (err) {
      console.error('Email check error:', err)
      // 에러 발생 시 false 반환 (확인 불가)
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setFieldErrors({})

    try {
      if (isLogin) {
        // 로그인 모드
        if (!formData.email) {
          setFieldErrors({ email: '이메일을 입력해주세요.' })
          setLoading(false)
          return
        }
        if (!formData.password) {
          setFieldErrors({ password: '비밀번호를 입력해주세요.' })
          setLoading(false)
          return
        }

        const success = await login(formData.email, formData.password)
        if (success) {
          navigate('/')
        } else {
          setError('로그인에 실패했습니다.')
        }
      } else {
        // 회원가입 모드 - 필수 입력 검증
        const errors: typeof fieldErrors = {}
        
        if (!formData.name || formData.name.trim() === '') {
          errors.name = '이름을 입력해주세요.'
        }
        
        if (!formData.email || formData.email.trim() === '') {
          errors.email = '이메일을 입력해주세요.'
        } else {
          // 이메일 형식 검증
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(formData.email)) {
            errors.email = '올바른 이메일 형식을 입력해주세요.'
          }
        }
        
        if (!formData.password || formData.password.trim() === '') {
          errors.password = '비밀번호를 입력해주세요.'
        } else if (formData.password.length < 6) {
          errors.password = '비밀번호는 최소 6자 이상이어야 합니다.'
        }
        
        if (!agreements.privacy) {
          errors.privacy = '개인정보 처리방침에 동의해주세요.'
        }
        
        if (!agreements.age) {
          errors.age = '만 14세 이상임을 확인해주세요.'
        }

        // 필수 입력 검증 실패 시
        if (Object.keys(errors).length > 0) {
          setFieldErrors(errors)
          setLoading(false)
          return
        }

        // 이메일 중복 검증 (public.users 확인)
        const emailExistsInPublic = await checkEmailExists(formData.email)
        if (emailExistsInPublic) {
          setFieldErrors({ email: '중복된 이메일입니다.' })
          setError('중복된 이메일입니다. 다른 이메일을 사용해주세요.')
          setLoading(false)
          return
        }

        // 회원가입 시도 (auth.users 확인은 회원가입 시도 시 Supabase 에러로 확인)
        try {
          const result = await register(
            formData.email, 
            formData.password, 
            formData.name, 
            formData.nickname
          )

          console.log('Register result:', result)

          if (result.success) {
            navigate('/')
          } else {
            // success가 false인 경우 기본적으로 에러 처리
            if (result.isExistingUser === true) {
              // 중복된 이메일
              setFieldErrors({ email: '중복된 이메일입니다.' })
              setError('중복된 이메일입니다. 다른 이메일을 사용해주세요.')
            } else if (result.isExistingUser === false) {
              // 정상적인 새 회원가입 (이메일 확인 필요) - 성공 메시지
              setError('회원가입이 완료되었습니다. 이메일을 확인해주세요.')
            } else {
              // isExistingUser가 undefined인 경우 에러
              setFieldErrors({ email: '회원가입 중 오류가 발생했습니다.' })
              setError('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.')
            }
          }
        } catch (registerError) {
          // register 함수에서 throw한 에러를 다시 throw하여 외부 catch 블록에서 처리
          console.log('Register threw error:', registerError)
          throw registerError
        }
      }
    } catch (err: any) {
      console.error('Submit error:', err)
      // AuthContext에서 던진 에러 메시지 사용
      if (err instanceof Error) {
        const errorMessage = err.message
        // 이메일 중복 에러인 경우
        if (errorMessage.includes('이미 사용 중인 이메일') || errorMessage.includes('중복된 이메일')) {
          setFieldErrors({ email: '중복된 이메일입니다.' })
          setError('중복된 이메일입니다. 다른 이메일을 사용해주세요.')
        } else {
          setError(errorMessage)
        }
      } else {
        // Supabase 에러 객체인 경우
        const errorMsg = err?.message?.toLowerCase() || ''
        const errorCode = err?.code || err?.status || ''
        
        if (errorMsg.includes('already registered') ||
            errorMsg.includes('already exists') ||
            errorMsg.includes('user already registered') ||
            errorMsg.includes('email address is already registered') ||
            errorMsg.includes('email already registered') ||
            errorCode === 'signup_disabled' ||
            errorCode === 'user_already_exists') {
          setFieldErrors({ email: '중복된 이메일입니다.' })
          setError('중복된 이메일입니다. 다른 이메일을 사용해주세요.')
        } else {
          setError(err?.message || '오류가 발생했습니다. 다시 시도해주세요.')
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    // 입력 시 해당 필드의 에러 메시지 제거
    if (fieldErrors[e.target.name as keyof typeof fieldErrors]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[e.target.name as keyof typeof fieldErrors]
        return newErrors
      })
    }
    setError('')
  }

  const handleAgreementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgreements(prev => ({
      ...prev,
      [e.target.name]: e.target.checked
    }))
    // 체크박스 변경 시 해당 필드의 에러 메시지 제거
    if (fieldErrors[e.target.name as keyof typeof fieldErrors]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[e.target.name as keyof typeof fieldErrors]
        return newErrors
      })
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError('')
    setFieldErrors({})
    setFormData({
      email: '',
      password: '',
      name: '',
      nickname: ''
    })
    setAgreements({
      privacy: false,
      marketing: false,
      age: false
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Features */}
          <div className="hidden lg:block space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-primary rounded-lg">
                  <BookOpen size={32} className="text-white" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">MacChain</h1>
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                성경 읽기와 함께하는 영적 여정
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                    <Brain size={24} className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI 성경 분석</h3>
                  </div>
                <p className="text-gray-600 dark:text-gray-300">읽은 구절에 대한 AI의 깊이 있는 분석을 받아보세요</p>
              </div>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                    <Users size={24} className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">커뮤니티</h3>
                  </div>
                <p className="text-gray-600 dark:text-gray-300">다른 성도들과 성경 읽기 경험을 공유하세요</p>
              </div>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <BarChart3 size={24} className="text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">상세 통계</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">나의 성경 읽기 여정을 통계로 확인하세요</p>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div>
            <Card className="max-w-md mx-auto">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-4">
                  {isLogin ? (
                    <LogIn size={32} className="text-white" />
                  ) : (
                    <UserPlus size={32} className="text-white" />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isLogin ? '로그인' : '회원가입'}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  {isLogin ? 'MacChain에 오신 것을 환영합니다' : '새로운 계정을 만들어보세요'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div>
                      <div className="relative">
                        <User size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                        <input
                          type="text"
                          name="name"
                          placeholder="이름"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-3 border-2 ${
                            fieldErrors.name 
                              ? 'border-red-300 dark:border-red-700' 
                              : 'border-gray-200 dark:border-gray-700'
                          } bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 outline-none transition-all`}
                        />
                      </div>
                      {fieldErrors.name && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <XCircle size={14} />
                          {fieldErrors.name}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <div className="relative">
                        <User size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                        <input
                          type="text"
                          name="nickname"
                          placeholder="닉네임 (선택사항)"
                          value={formData.nickname}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <div className="relative">
                    <Mail size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <input
                      type="email"
                      name="email"
                      placeholder="이메일"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3 border-2 ${
                        fieldErrors.email 
                          ? 'border-red-300 dark:border-red-700' 
                          : 'border-gray-200 dark:border-gray-700'
                      } bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 outline-none transition-all`}
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <XCircle size={14} />
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Lock size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    <input
                      type="password"
                      name="password"
                      placeholder="비밀번호"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-3 border-2 ${
                        fieldErrors.password 
                          ? 'border-red-300 dark:border-red-700' 
                          : 'border-gray-200 dark:border-gray-700'
                      } bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 outline-none transition-all`}
                    />
                  </div>
                  {fieldErrors.password && (
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <XCircle size={14} />
                      {fieldErrors.password}
                    </p>
                  )}
                  {isLogin && (
                    <button
                      type="button"
                      onClick={handleResetPassword}
                      disabled={loading}
                      className="inline-flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:underline self-end"
                    >
                      <RefreshCcw size={16} />
                      비밀번호 재설정 메일 보내기
                    </button>
                  )}
                </div>

                {!isLogin && (
                  <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="privacy"
                          checked={agreements.privacy}
                          onChange={handleAgreementChange}
                          className={`mt-1 w-4 h-4 text-primary-600 dark:text-primary-400 ${
                            fieldErrors.privacy 
                              ? 'border-red-500 dark:border-red-500' 
                              : 'border-gray-300 dark:border-gray-600'
                          } rounded focus:ring-primary-500 dark:focus:ring-primary-400`}
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          <a href="/privacy" target="_blank" className="text-primary-600 hover:underline">
                            개인정보 처리방침
                          </a>에 동의합니다 <span className="text-red-500">(필수)</span>
                        </span>
                      </label>
                      {fieldErrors.privacy && (
                        <p className="mt-1 ml-7 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <XCircle size={14} />
                          {fieldErrors.privacy}
                        </p>
                      )}
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="marketing"
                        checked={agreements.marketing}
                        onChange={handleAgreementChange}
                        className="mt-1 w-4 h-4 text-primary-600 dark:text-primary-400 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 dark:focus:ring-primary-400"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        마케팅 정보 수신에 동의합니다 (선택)
                      </span>
                    </label>

                    <div>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="age"
                          checked={agreements.age}
                          onChange={handleAgreementChange}
                          className={`mt-1 w-4 h-4 text-primary-600 dark:text-primary-400 ${
                            fieldErrors.age 
                              ? 'border-red-500 dark:border-red-500' 
                              : 'border-gray-300 dark:border-gray-600'
                          } rounded focus:ring-primary-500 dark:focus:ring-primary-400`}
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          만 14세 이상입니다 <span className="text-red-500">(필수)</span>
                        </span>
                      </label>
                      {fieldErrors.age && (
                        <p className="mt-1 ml-7 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <XCircle size={14} />
                          {fieldErrors.age}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {error && (
                  <div                   className={`p-4 rounded-lg ${
                    error.includes('완료') && !error.includes('중복된 이메일')
                      ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300' 
                      : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300'
                  }`}>
                    {error}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader size={20} className="animate-spin" />
                      처리 중...
                    </>
                  ) : (
                    isLogin ? '로그인' : '회원가입'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  {isLogin ? '아직 계정이 없으신가요?' : '이미 계정이 있으신가요?'}
                  <button 
                    type="button" 
                    onClick={toggleMode}
                    className="ml-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold"
                  >
                    {isLogin ? '회원가입' : '로그인'}
                  </button>
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
