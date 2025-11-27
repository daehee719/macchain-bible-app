import React from 'react'
import ThemeToggle from './ThemeToggle'
import { User } from 'lucide-react'

const Topbar: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div />
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
              <User size={18} />
              <span>Guest</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Topbar
