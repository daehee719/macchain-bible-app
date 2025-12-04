import React from 'react'

interface CardProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  onClick?: () => void
  className?: string
  children?: React.ReactNode
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  icon,
  onClick,
  className = '',
  children
}) => {
  return (
    <div 
      className={`
        bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 hover:shadow-xl dark:hover:shadow-gray-900 transition-all duration-300
        ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {(icon || title || description) && (
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          {icon && (
            <div className="mb-3 inline-flex p-3 bg-gradient-primary rounded-lg text-white">
              {icon}
            </div>
          )}
          {title && (
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}
      {children && (
        <div className="p-6">
          {children}
        </div>
      )}
    </div>
  )
}

export default Card
