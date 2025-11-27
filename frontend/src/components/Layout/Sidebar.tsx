import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, BookOpen, Brain, Users, BarChart3, Settings } from 'lucide-react'

const routes = [
  { to: '/', label: '대시보드', icon: <Home size={18} /> },
  { to: '/reading-plan', label: '읽기 계획', icon: <BookOpen size={18} /> },
  { to: '/ai-analysis', label: 'AI 분석', icon: <Brain size={18} /> },
  { to: '/community', label: '커뮤니티', icon: <Users size={18} /> },
  { to: '/statistics', label: '통계', icon: <BarChart3 size={18} /> },
  { to: '/settings', label: '설정', icon: <Settings size={18} /> },
]

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">MacChain</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">성경 읽기 대시보드</p>
        </div>

        <nav className="space-y-1">
          {routes.map((r) => (
            <NavLink
              key={r.to}
              to={r.to}
              end
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`
              }
            >
              <span className="mr-3 text-gray-500 dark:text-gray-400">{r.icon}</span>
              <span>{r.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar
