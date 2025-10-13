import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { BookOpen, Brain, Users, BarChart3, LogIn, LogOut } from 'lucide-react'
import './Header.css'

const Header: React.FC = () => {
  const { user, isLoggedIn, logout } = useAuth()
  const location = useLocation()

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <BookOpen size={24} />
          <span>MacChain</span>
        </Link>

        <nav className="nav">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            대시보드
          </Link>
          <Link 
            to="/reading-plan" 
            className={`nav-link ${location.pathname === '/reading-plan' ? 'active' : ''}`}
          >
            읽기 계획
          </Link>
          {isLoggedIn && (
            <>
              <Link 
                to="/ai-analysis" 
                className={`nav-link ${location.pathname === '/ai-analysis' ? 'active' : ''}`}
              >
                <Brain size={16} />
                AI 분석
              </Link>
              <Link 
                to="/community" 
                className={`nav-link ${location.pathname === '/community' ? 'active' : ''}`}
              >
                <Users size={16} />
                커뮤니티
              </Link>
              <Link 
                to="/statistics" 
                className={`nav-link ${location.pathname === '/statistics' ? 'active' : ''}`}
              >
                <BarChart3 size={16} />
                통계
              </Link>
            </>
          )}
        </nav>

        <div className="auth-section">
          {isLoggedIn ? (
            <div className="user-info">
              <span className="user-name">{user?.name || user?.email}</span>
              <button onClick={logout} className="logout-btn">
                <LogOut size={16} />
                로그아웃
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-btn">
              <LogIn size={16} />
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
