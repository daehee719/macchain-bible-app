import Button from '../components/ui/Button';
import React from 'react'
import './Card.css'

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
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <div 
      className={`card ${onClick ? 'clickable' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={handleKeyDown}
    >
      {icon && <div className="card-icon">{icon}</div>}
      <div className="card-content">
        {title && <h3 className="card-title">{title}</h3>}
        {description && <p className="card-description">{description}</p>}
        {children}
      </div>
    </div>
  )
}

export default Card
