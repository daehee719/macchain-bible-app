import React, { useEffect, useState } from 'react'

const ThemeToggle: React.FC = () => {
  const [dark, setDark] = useState(() => {
    try {
      return document.documentElement.classList.contains('dark')
    } catch {
      return false
    }
  })

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [dark])

  return (
    <button
      onClick={() => setDark((d) => !d)}
      className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-200"
      aria-pressed={dark}
    >
      {dark ? '다크' : '라이트'}
    </button>
  )
}

export default ThemeToggle
