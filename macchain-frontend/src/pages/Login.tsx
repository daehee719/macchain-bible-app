import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Card from '../components/Card'
import { LogIn, UserPlus, Mail, Lock, User, Loader, BookOpen, Brain, Users, BarChart3 } from 'lucide-react'

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
  
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let success = false
      
      if (isLogin) {
        success = await login(formData.email, formData.password)
      } else {
        success = await register(
          formData.email, 
          formData.password, 
          formData.name, 
          formData.nickname
        )
      }

      if (success) {
        navigate('/')
      } else {
        if (!isLogin) {
          // 회원가입 실패 시 이메일 확인 필요 여부 안내
          setError('회원가입이 완료되었습니다. 이메일을 확인해주세요.')
        } else {
          setError('로그인에 실패했습니다.')
        }
      }
    } catch (err) {
      setError('오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleAgreementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgreements(prev => ({
      ...prev,
      [e.target.name]: e.target.checked
    }))
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError('')
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
                    <div className="relative">
                      <User size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        placeholder="이름"
                        value={formData.name}
                        onChange={handleInputChange}
                        required={!isLogin}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 outline-none transition-all"
                      />
                    </div>
                    
                    <div className="relative">
                      <User size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="nickname"
                        placeholder="닉네임 (선택사항)"
                        value={formData.nickname}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 outline-none transition-all"
                      />
                    </div>
                  </>
                )}

                <div className="relative">
                  <Mail size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="이메일"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                  />
                </div>

                <div className="relative">
                  <Lock size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    placeholder="비밀번호"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                  />
                </div>

                {!isLogin && (
                  <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="privacy"
                        checked={agreements.privacy}
                        onChange={handleAgreementChange}
                        required
                        className="mt-1 w-4 h-4 text-primary-600 dark:text-primary-400 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 dark:focus:ring-primary-400"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        <a href="/privacy" target="_blank" className="text-primary-600 hover:underline">
                          개인정보 처리방침
                        </a>에 동의합니다 <span className="text-red-500">(필수)</span>
                      </span>
                    </label>

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

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="age"
                        checked={agreements.age}
                        onChange={handleAgreementChange}
                        required
                        className="mt-1 w-4 h-4 text-primary-600 dark:text-primary-400 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 dark:focus:ring-primary-400"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        만 14세 이상입니다 <span className="text-red-500">(필수)</span>
                      </span>
                    </label>
                  </div>
                )}

                {error && (
                  <div className={`p-4 rounded-lg ${
                    error.includes('완료') 
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
