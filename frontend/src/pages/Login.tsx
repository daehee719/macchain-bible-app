import Button from '../components/ui/Button';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Card from '../components/Card'
import { LogIn, UserPlus, Mail, Lock, User, Loader, BookOpen } from 'lucide-react'
import './Login.css'

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
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-header-left">
            <BookOpen size={24} />
            <div>
              <h1>MacChain</h1>
              <p>성경 읽기와 함께하는 영적 여정</p>
            </div>
          </div>
          <div className="login-nav">
            <Link to="/">대시보드</Link>
            <Link to="/reading-plan">읽기 계획</Link>
            <Link to="/login" className="active">→ 로그인</Link>
          </div>
        </div>

        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <Card className="login-card">
          <div className="login-card-header">
            <h2>
              {isLogin ? (
                <>
                  <LogIn size={24} />
                  로그인
                </>
              ) : (
                <>
                  <UserPlus size={24} />
                  회원가입
                </>
              )}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {!isLogin && (
              <>
                <div className="input-group">
                  <User size={20} className="input-icon" />
                  <input
                    type="text"
                    name="name"
                    placeholder="이름"
                    value={formData.name}
                    onChange={handleInputChange}
                    required={!isLogin}
                    className="form-input"
                  />
                </div>
                
                <div className="input-group">
                  <User size={20} className="input-icon" />
                  <input
                    type="text"
                    name="nickname"
                    placeholder="닉네임 (선택사항)"
                    value={formData.nickname}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </>
            )}

            <div className="input-group">
              <Mail size={20} className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="이메일"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>

            <div className="input-group">
              <Lock size={20} className="input-icon" />
              <input
                type="password"
                name="password"
                placeholder="비밀번호"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>

            {!isLogin && (
              <div className="agreements-section">
                <div className="agreement-item required">
                  <label className="agreement-label">
                    <input
                      type="checkbox"
                      name="privacy"
                      checked={agreements.privacy}
                      onChange={handleAgreementChange}
                      required
                      className="agreement-checkbox"
                    />
                    <span className="checkmark"></span>
                    <span className="agreement-text">
                      <a href="/privacy" target="_blank" className="agreement-link">
                        개인정보 처리방침
                      </a>에 동의합니다 (필수)
                    </span>
                  </label>
                </div>

                <div className="agreement-item">
                  <label className="agreement-label">
                    <input
                      type="checkbox"
                      name="marketing"
                      checked={agreements.marketing}
                      onChange={handleAgreementChange}
                      className="agreement-checkbox"
                    />
                    <span className="checkmark"></span>
                    <span className="agreement-text">
                      마케팅 정보 수신에 동의합니다 (선택)
                    </span>
                  </label>
                </div>

                <div className="agreement-item required">
                  <label className="agreement-label">
                    <input
                      type="checkbox"
                      name="age"
                      checked={agreements.age}
                      onChange={handleAgreementChange}
                      required
                      className="agreement-checkbox"
                    />
                    <span className="checkmark"></span>
                    <span className="agreement-text">
                      만 14세 이상입니다 (필수)
                    </span>
                  </label>
                </div>
              </div>
            )}

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader size={20} className="spinning" />
                  처리 중...
                </>
              ) : (
                isLogin ? '로그인' : '회원가입'
              )}
            </Button>
          </form>

          <div className="login-footer">
            <p>
              {isLogin ? '아직 계정이 없으신가요?' : '이미 계정이 있으신가요?'}
              <Button type="button" onClick={toggleMode}>
                {isLogin ? '회원가입' : '로그인'}
              </Button>
            </p>
            
            <div className="demo-info">
              <p>데모 계정으로 테스트해보세요:</p>
              <p>이메일: test@example.com</p>
              <p>비밀번호: password</p>
            </div>
          </div>
        </Card>
        </div>

        <div className="login-features">
          <Button type="button">
            <h3>AI 성경 분석</h3>
            <p>읽은 구절에 대한 AI의 깊이 있는 분석을 받아보세요</p>
          </Button>
          <Button type="button">
            <h3>커뮤니티</h3>
            <p>다른 성도들과 성경 읽기 경험을 공유하세요</p>
          </Button>
          <Button type="button">
            <h3>상세 통계</h3>
            <p>나의 성경 읽기 여정을 통계로 확인하세요</p>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login
