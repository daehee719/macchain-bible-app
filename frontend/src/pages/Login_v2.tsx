import Button from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { LogIn, UserPlus, Mail, Lock, User, BookOpen, Eye, EyeOff } from 'lucide-react'

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
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
        if (!agreements.age) {
          setError('14세 이상임을 동의해주세요.')
          setLoading(false)
          return
        }
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
        setError(isLogin ? '로그인에 실패했습니다.' : '회원가입에 실패했습니다.')
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mb-4">
            <BookOpen size={24} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">MacChain</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">성경 읽기와 함께하는 영적 여정</p>
        </div>

        {/* 로그인/회원가입 카드 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
          {/* 타이틀 */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
              {isLogin ? (
                <>
                  <LogIn size={24} className="mr-2 text-blue-600" />
                  로그인
                </>
              ) : (
                <>
                  <UserPlus size={24} className="mr-2 text-blue-600" />
                  회원가입
                </>
              )}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {isLogin
                ? '계정으로 로그인하여 성경 읽기를 시작하세요'
                : '새 계정을 만들고 성경 읽기 여정을 시작하세요'}
            </p>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <Alert variant="danger" onClose={() => setError('')} className="mb-6">
              {error}
            </Alert>
          )}

          {/* 폼 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <Input
                  label="이름"
                  type="text"
                  name="name"
                  placeholder="성명을 입력하세요"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  icon={<User size={18} />}
                />
                
                <Input
                  label="닉네임 (선택)"
                  type="text"
                  name="nickname"
                  placeholder="커뮤니티에서 표시될 이름"
                  value={formData.nickname}
                  onChange={handleInputChange}
                  icon={<User size={18} />}
                />
              </>
            )}

            <Input
              label="이메일"
              type="email"
              name="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleInputChange}
              required
              icon={<Mail size={18} />}
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                비밀번호
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                />
                <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* 약관 동의 (회원가입만) */}
            {!isLogin && (
              <div className="space-y-3 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 my-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="age"
                    name="age"
                    checked={agreements.age}
                    onChange={handleAgreementChange}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    required
                  />
                  <label htmlFor="age" className="ml-3 text-sm cursor-pointer">
                    <span className="font-medium text-gray-900 dark:text-white">
                      14세 이상입니다 <span className="text-red-500">*</span>
                    </span>
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="privacy"
                    name="privacy"
                    checked={agreements.privacy}
                    onChange={handleAgreementChange}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    required
                  />
                  <label htmlFor="privacy" className="ml-3 text-sm cursor-pointer">
                    <span className="text-gray-700 dark:text-gray-300">
                      <Link to="/privacy" className="text-blue-600 hover:text-blue-700">
                        개인정보처리방침
                      </Link>
                      에 동의합니다 <span className="text-red-500">*</span>
                    </span>
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="marketing"
                    name="marketing"
                    checked={agreements.marketing}
                    onChange={handleAgreementChange}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="marketing" className="ml-3 text-sm cursor-pointer">
                    <span className="text-gray-700 dark:text-gray-300">
                      마케팅 정보 수신에 동의합니다
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* 로그인/회원가입 버튼 */}
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full mt-6"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  처리 중...
                </span>
              ) : (
                isLogin ? '로그인' : '회원가입'
              )}
            </Button>
          </form>

          {/* 모드 전환 */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {isLogin ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}
              {' '}
              <button
                type="button"
                onClick={toggleMode}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-colors"
              >
                {isLogin ? '회원가입' : '로그인'}
              </button>
            </p>
          </div>
        </div>

        {/* 하단 안내 */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            로그인하지 않고도{' '}
            <Link to="/" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold">
              대시보드
            </Link>
            를 볼 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
