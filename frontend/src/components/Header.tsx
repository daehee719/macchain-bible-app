import Button from 'src/components/ui/Button';
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { BookOpen, Brain, Users, BarChart3, Settings, LogIn, LogOut } from 'lucide-react'

const Header: React.FC = () => {
  const { user, isLoggedIn, logout } = useAuth()
  const location = useLocation()

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur border-b border-gray-100 z-50 h-20">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-full">
        <Link to="/" className="flex items-center gap-2 text-gray-800 text-xl font-bold no-underline">
          <BookOpen size={24} />
          <span className="hidden sm:inline">MacChain</span>
        </Link>

        <nav className="flex gap-6 items-center">
          <Link to="/" className={`flex items-center gap-2 px-3 py-1 rounded-lg font-medium ${location.pathname === '/' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'}`}>
            대시보드
          </Link>
          <Link to="/reading-plan" className={`flex items-center gap-2 px-3 py-1 rounded-lg font-medium ${location.pathname === '/reading-plan' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'}`}>
            읽기 계획
          </Link>
          {isLoggedIn && (
            <>
              <Link to="/ai-analysis" className={`flex items-center gap-2 px-3 py-1 rounded-lg font-medium ${location.pathname === '/ai-analysis' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'}`}>
                <Brain size={16} />
                <span className="hidden sm:inline">AI 분석</span>
              </Link>
              <Link to="/community" className={`flex items-center gap-2 px-3 py-1 rounded-lg font-medium ${location.pathname === '/community' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'}`}>
                <Users size={16} />
                <span className="hidden sm:inline">커뮤니티</span>
              </Link>
              <Link to="/statistics" className={`flex items-center gap-2 px-3 py-1 rounded-lg font-medium ${location.pathname === '/statistics' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'}`}>
                <BarChart3 size={16} />
                <span className="hidden sm:inline">통계</span>
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Link to="/settings" className={`flex items-center gap-2 px-3 py-1 rounded-lg font-medium ${location.pathname === '/settings' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'}`}>
                <Settings size={16} />
                <span className="hidden sm:inline">설정</span>
              </Link>
              <span className="text-gray-800 font-medium hidden sm:inline">{user?.name || user?.email}</span>
              <Button onClick={logout}>
                <LogOut size={16} />
                <span className="hidden sm:inline">로그아웃</span>
              </Button>
            </div>
          ) : (
            <Link to="/login" className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-500 no-underline">
              <LogIn size={16} />
              <span className="hidden sm:inline">로그인</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header
