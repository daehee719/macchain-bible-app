import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  fullScreen?: boolean
  style?: any
}

export const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  text, 
  fullScreen = false,
  style
}) => {
  const sizeMultiplier = {
    sm: 0.6,
    md: 1,
    lg: 1.5
  }

  const multiplier = sizeMultiplier[size]
  const viewSize = 200 * multiplier
  const centerX = viewSize / 2
  const centerY = viewSize / 2

  // React Native에서는 SVG 애니메이션이 제한적이므로 ActivityIndicator 사용
  // 복잡한 SVG 애니메이션은 나중에 react-native-reanimated로 구현 가능
  return (
    <View style={[
      fullScreen ? styles.fullScreen : styles.container,
      style
    ]}>
      <View style={styles.content}>
        {/* 간단한 십자가 아이콘과 ActivityIndicator 조합 */}
        <View style={styles.crossContainer}>
          <View style={[styles.cross, { width: viewSize * 0.3, height: viewSize * 0.6 }]}>
            <View style={[styles.crossVertical, { width: viewSize * 0.16, height: viewSize * 0.7 }]} />
            <View style={[styles.crossHorizontal, { width: viewSize * 0.6, height: viewSize * 0.16 }]} />
          </View>
          <ActivityIndicator 
            size="large" 
            color="#8B5CF6" 
            style={styles.spinner}
          />
        </View>
        
        {text && (
          <Text style={styles.text}>{text}</Text>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  content: {
    alignItems: 'center',
    gap: 16,
  },
  crossContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cross: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  crossVertical: {
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    position: 'absolute',
  },
  crossHorizontal: {
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    position: 'absolute',
  },
  spinner: {
    marginTop: 20,
  },
  text: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
})

