import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

interface CardProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  onClick?: () => void
  children?: React.ReactNode
  style?: any
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  icon,
  onClick,
  children,
  style
}) => {
  const CardComponent = onClick ? TouchableOpacity : View

  return (
    <CardComponent
      style={[
        styles.card,
        onClick && styles.cardClickable,
        style
      ]}
      onPress={onClick}
      activeOpacity={onClick ? 0.7 : 1}
    >
      {(icon || title || description) && (
        <View style={styles.header}>
          {icon && (
            <View style={styles.iconContainer}>
              {icon}
            </View>
          )}
          {title && (
            <Text style={styles.title}>{title}</Text>
          )}
          {description && (
            <Text style={styles.description}>{description}</Text>
          )}
        </View>
      )}
      {children && (
        <View style={styles.content}>
          {children}
        </View>
      )}
    </CardComponent>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardClickable: {
    // TouchableOpacity는 activeOpacity로 처리
  },
  header: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
  },
  content: {
    padding: 24,
  },
})

export default Card

