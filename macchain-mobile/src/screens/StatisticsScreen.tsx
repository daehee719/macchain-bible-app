import React, { useState } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../contexts/AuthContext'
import { Ionicons } from '@expo/vector-icons'
import { apiService, UserStatistics } from '../services/api'
import { Loading } from '../components/Loading'
import Card from '../components/Card'

export default function StatisticsScreen() {
  const { user, isLoggedIn } = useAuth()
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month')

  // 사용자 통계 조회
  const { data: userStats, isLoading: statsLoading } = useQuery<UserStatistics | null>({
    queryKey: ['user-statistics', user?.id],
    queryFn: async () => {
      if (!user?.id) return null
      return await apiService.getUserStatistics(user.id)
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    enabled: isLoggedIn && !!user?.id,
  })

  // 월별 통계 조회
  const { data: monthlyProgress = [], isLoading: monthlyLoading } = useQuery<{ month: string; days: number }[]>({
    queryKey: ['monthly-statistics', user?.id, new Date().getFullYear()],
    queryFn: async () => {
      if (!user?.id) return []
      const currentYear = new Date().getFullYear()
      const progress: { month: string; days: number }[] = []
      
      for (let month = 1; month <= 12; month++) {
        const monthData = await apiService.getMonthlyStatistics(user.id, currentYear, month)
        const uniqueDays = new Set(monthData.map((d: any) => d.plan_date)).size
        progress.push({
          month: `${month}월`,
          days: uniqueDays
        })
      }
      
      return progress
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    enabled: isLoggedIn && !!user?.id,
  })

  const loading = statsLoading || monthlyLoading

  const stats = {
    totalDays: userStats?.total_days_read || 0,
    currentStreak: userStats?.current_streak || 0,
    longestStreak: userStats?.longest_streak || 0,
    completionRate: userStats?.total_days_read ? Math.round((userStats.total_days_read / 365) * 100) : 0,
    totalChapters: (userStats?.total_days_read || 0) * 4,
    totalTime: (userStats?.total_days_read || 0) * 30,
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}시간 ${mins}분`
    }
    return `${mins}분`
  }

  const getStreakStatus = (streak: number) => {
    if (streak >= 30) return { level: '🔥', message: '놀라운 열정!' }
    if (streak >= 14) return { level: '⭐', message: '훌륭한 습관!' }
    if (streak >= 7) return { level: '💪', message: '잘하고 있어요!' }
    return { level: '🌱', message: '시작이 좋아요!' }
  }

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <View style={styles.loginPrompt}>
          <Text style={styles.loginPromptText}>통계를 보려면 로그인이 필요합니다.</Text>
        </View>
      </View>
    )
  }

  if (loading) {
    return <Loading fullScreen text="통계를 불러오는 중..." />
  }

  const streakStatus = getStreakStatus(stats.currentStreak)

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>나의 통계</Text>
          <Text style={styles.subtitle}>성경 읽기 여정을 확인하세요</Text>
        </View>

        {/* Main Stats */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <Ionicons name="calendar" size={32} color="#8B5CF6" />
              <Text style={styles.statValue}>{stats.totalDays}</Text>
              <Text style={styles.statLabel}>읽은 날</Text>
            </View>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <Ionicons name="flame" size={32} color="#F97316" />
              <Text style={styles.statValue}>{stats.currentStreak}</Text>
              <Text style={styles.statLabel}>연속 일수</Text>
            </View>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <Ionicons name="trophy" size={32} color="#F59E0B" />
              <Text style={styles.statValue}>{stats.longestStreak}</Text>
              <Text style={styles.statLabel}>최장 연속</Text>
            </View>
          </Card>

          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <Ionicons name="checkmark-circle" size={32} color="#10B981" />
              <Text style={styles.statValue}>{stats.completionRate}%</Text>
              <Text style={styles.statLabel}>완료율</Text>
            </View>
          </Card>
        </View>

        {/* Streak Status */}
        <Card title="연속 읽기 상태" style={styles.statusCard}>
          <View style={styles.streakStatus}>
            <Text style={styles.streakEmoji}>{streakStatus.level}</Text>
            <Text style={styles.streakMessage}>{streakStatus.message}</Text>
            <Text style={styles.streakDays}>{stats.currentStreak}일 연속으로 읽고 있어요!</Text>
          </View>
        </Card>

        {/* Additional Stats */}
        <View style={styles.additionalStats}>
          <Card style={styles.additionalCard}>
            <View style={styles.additionalRow}>
              <Ionicons name="book" size={24} color="#3B82F6" />
              <View style={styles.additionalInfo}>
                <Text style={styles.additionalLabel}>읽은 장</Text>
                <Text style={styles.additionalValue}>{stats.totalChapters}장</Text>
              </View>
            </View>
          </Card>

          <Card style={styles.additionalCard}>
            <View style={styles.additionalRow}>
              <Ionicons name="time" size={24} color="#8B5CF6" />
              <View style={styles.additionalInfo}>
                <Text style={styles.additionalLabel}>총 읽기 시간</Text>
                <Text style={styles.additionalValue}>{formatTime(stats.totalTime)}</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Monthly Progress */}
        {monthlyProgress.length > 0 && (
          <Card title="월별 진행률" style={styles.monthlyCard}>
            <View style={styles.monthlyContainer}>
              {monthlyProgress.map((item, index) => (
                <View key={index} style={styles.monthlyItem}>
                  <Text style={styles.monthlyLabel}>{item.month}</Text>
                  <View style={styles.monthlyBarContainer}>
                    <View style={[styles.monthlyBar, { width: `${(item.days / 31) * 100}%` }]} />
                  </View>
                  <Text style={styles.monthlyDays}>{item.days}일</Text>
                </View>
              ))}
            </View>
          </Card>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF',
  },
  content: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  loginPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loginPromptText: {
    fontSize: 16,
    color: '#6B7280',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  statusCard: {
    marginBottom: 16,
  },
  streakStatus: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  streakEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  streakMessage: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  streakDays: {
    fontSize: 14,
    color: '#6B7280',
  },
  additionalStats: {
    gap: 12,
    marginBottom: 16,
  },
  additionalCard: {
    marginBottom: 0,
  },
  additionalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 8,
  },
  additionalInfo: {
    flex: 1,
  },
  additionalLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  additionalValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  monthlyCard: {
    marginBottom: 0,
  },
  monthlyContainer: {
    gap: 12,
  },
  monthlyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  monthlyLabel: {
    width: 40,
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  monthlyBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  monthlyBar: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 4,
  },
  monthlyDays: {
    width: 40,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'right',
  },
})

