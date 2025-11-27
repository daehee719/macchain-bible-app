import React from 'react'

interface ChartPlaceholderProps {
  height?: number
  children?: React.ReactNode
}

export const ChartPlaceholder: React.FC<ChartPlaceholderProps> = ({ height = 220, children }) => {
  return (
    <div
      role="img"
      aria-label="차트 자리 표시자"
      className="w-full bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-lg flex items-center justify-center text-gray-400"
      style={{ height }}
    >
      {children ?? <span>차트 자리 (차트 라이브러리로 교체 예정)</span>}
    </div>
  )
}

export default ChartPlaceholder
