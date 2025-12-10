import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../contexts/AuthContext'
import { Ionicons } from '@expo/vector-icons'
import { apiService, UserStatistics } from '../services/api'
import { Loading } from '../components/Loading'
import Card from '../components/Card'

interface ReadingDay {
  date: string
  plan: any | null
  passages: {
    book: string | null
    chapter: number | null
    verse: string
    readingId: number
    completed: boolean
  }[]
}

export default function ReadingPlanScreen() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [currentWeek, setCurrentWeek] = useState(0)

  // 사용자 통계 조회
  const { data: statistics } = useQuery<UserStatistics | null>({
    queryKey: ['user-statistics', user?.id],
    queryFn: async () => {
      if (!user?.id) return null
      return await apiService.getUserStatistics(user.id)
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    enabled: !!user?.id,
  })

  // 현재 주의 읽기 계획 조회
  const { data: readingData = [], isLoading: loading } = useQuery<ReadingDay[]>({
    queryKey: ['reading-plan-week', currentWeek],
    queryFn: async () => {
      const today = new Date()
      const weekData: ReadingDay[] = []

      for (let i = 0; i < 7; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + (currentWeek * 7) + i)
        const dateString = date.toISOString().split('T')[0]

        const plan = await apiService.getPlanByDate(dateString)
        
        let progress: any[] = []
        if (user?.id) {
          progress = await apiService.getReadingProgress(user.id, dateString)
        }

        const passages = [
          { 
            book: plan?.reading1_book || null, 
            chapter: plan?.reading1_chapter || null, 
            verse: plan ? `${plan.reading1_verse_start}-${plan.reading1_verse_end}` : '',
            readingId: 1,
            completed: progress.find((p: any) => p.reading_id === 1)?.is_completed || false
          },
          { 
            book: plan?.reading2_book || null, 
            chapter: plan?.reading2_chapter || null, 
            verse: plan ? `${plan.reading2_verse_start}-${plan.reading2_verse_end}` : '',
            readingId: 2,
            completed: progress.find((p: any) => p.reading_id === 2)?.is_completed || false
          },
          { 
            book: plan?.reading3_book || null, 
            chapter: plan?.reading3_chapter || null, 
            verse: plan ? `${plan.reading3_verse_start}-${plan.reading3_verse_end}` : '',
            readingId: 3,
            completed: progress.find((p: any) => p.reading_id === 3)?.is_completed || false
          },
          { 
            book: plan?.reading4_book || null, 
            chapter: plan?.reading4_chapter || null, 
            verse: plan ? `${plan.reading4_verse_start}-${plan.reading4_verse_end}` : '',
            readingId: 4,
            completed: progress.find((p: any) => p.reading_id === 4)?.is_completed || false
          }
        ].filter(p => p.book && p.chapter)

        weekData.push({
          date: dateString,
          plan,
          passages
        })
      }

      return weekData
    },
    staleTime: 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
  })

  // 진행률 업데이트 Mutation
  const updateProgressMutation = useMutation({
    mutationFn: async ({ 
      dayIndex, 
      passageIndex, 
      newCompleted 
    }: { 
      dayIndex: number
      passageIndex: number
      newCompleted: boolean
    }) => {
      if (!user?.id) throw new Error('로그인이 필요합니다.')
      const day = readingData[dayIndex]
      const passage = day.passages[passageIndex]
      await apiService.updateReadingProgress(
        user.id,
        day.date,
        passage.readingId,
        newCompleted
      )
      return { dayIndex, passageIndex, newCompleted }
    },
    onMutate: async ({ dayIndex, passageIndex, newCompleted }) => {
      await queryClient.cancelQueries({ queryKey: ['reading-plan-week', currentWeek] })
      const previousData = queryClient.getQueryData<ReadingDay[]>(['reading-plan-week', currentWeek])
      
      queryClient.setQueryData<ReadingDay[]>(['reading-plan-week', currentWeek], (old = []) =>
        old.map((d, dIdx) => 
          dIdx === dayIndex 
            ? {
                ...d,
                passages: d.passages.map((p, pIdx) => 
                  pIdx === passageIndex 
                    ? { ...p, completed: newCompleted }
                    : p
                )
              }
            : d
        )
      )

      return { previousData }
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['reading-plan-week', currentWeek], context.previousData)
      }
      console.error('Failed to update reading progress:', err)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-statistics', user?.id] })
    },
  })

  const togglePassageCompletion = (dayIndex: number, passageIndex: number) => {
    if (!user?.id) return
    const day = readingData[dayIndex]
    const passage = day.passages[passageIndex]
    const newCompleted = !passage.completed
    updateProgressMutation.mutate({ dayIndex, passageIndex, newCompleted })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', { 
      month: 'short', 
      day: 'numeric',
      weekday: 'short'
    })
  }

  const getCompletionRate = () => {
    const totalPassages = readingData.reduce((acc, day) => acc + day.passages.length, 0)
    const completedPassages = readingData.reduce((acc, day) => 
      acc + day.passages.filter(p => p.completed).length, 0
    )
    return totalPassages > 0 ? Math.round((completedPassages / totalPassages) * 100) : 0
  }

  if (loading) {
    return <Loading fullScreen text="읽기 계획을 불러오는 중..." />
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>McCheyne 읽기 계획</Text>
          <Text style={styles.subtitle}>1년에 성경을 두 번 읽는 체계적인 계획</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <Card title="진행률" style={styles.statCard}>
            <View style={styles.statContent}>
              <Text style={styles.percentage}>{getCompletionRate()}%</Text>
            </View>
          </Card>
          
          <Card title="연속 읽기" style={styles.statCard}>
            <View style={styles.statContent}>
              <Ionicons name="flame" size={32} color="#F97316" />
              <Text style={styles.streak}>{user ? (statistics?.current_streak || 0) : 0}일</Text>
              <Text style={styles.streakLabel}>연속으로 읽고 있어요!</Text>
            </View>
          </Card>
        </View>

        {/* Week Navigation */}
        <View style={styles.weekNav}>
          <TouchableOpacity 
            onPress={() => setCurrentWeek(Math.max(0, currentWeek - 1))}
            disabled={currentWeek === 0}
            style={[styles.navButton, currentWeek === 0 && styles.navButtonDisabled]}
          >
            <Ionicons name="chevron-back" size={20} color={currentWeek === 0 ? "#9CA3AF" : "#374151"} />
            <Text style={[styles.navButtonText, currentWeek === 0 && styles.navButtonTextDisabled]}>
              이전 주
            </Text>
          </TouchableOpacity>
          
          <View style={styles.weekBadge}>
            <Text style={styles.weekBadgeText}>{currentWeek + 1}주차</Text>
          </View>
          
          <TouchableOpacity 
            onPress={() => setCurrentWeek(currentWeek + 1)}
            style={styles.navButton}
          >
            <Text style={styles.navButtonText}>다음 주</Text>
            <Ionicons name="chevron-forward" size={20} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Reading Days */}
        <View style={styles.daysContainer}>
          {readingData.length > 0 ? (
            readingData.map((day, dayIndex) => (
              <Card
                key={day.date}
                title={formatDate(day.date)}
                icon={<Ionicons name="calendar" size={20} color="#8B5CF6" />}
                style={styles.dayCard}
              >
                <View style={styles.passagesContainer}>
                  {day.passages.length > 0 ? (
                    day.passages.map((passage, passageIndex) => (
                      <TouchableOpacity
                        key={passageIndex}
                        onPress={() => togglePassageCompletion(dayIndex, passageIndex)}
                        style={[
                          styles.passageItem,
                          passage.completed && styles.passageItemCompleted
                        ]}
                      >
                        <Ionicons
                          name={passage.completed ? 'checkmark-circle' : 'ellipse-outline'}
                          size={20}
                          color={passage.completed ? '#10B981' : '#9CA3AF'}
                        />
                        <Text style={[
                          styles.passageText,
                          passage.completed && styles.passageTextCompleted
                        ]}>
                          {passage.book} {passage.chapter}:{passage.verse}
                        </Text>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <Text style={styles.noPlanText}>이 날짜의 읽기 계획이 없습니다.</Text>
                  )}
                </View>
              </Card>
            ))
          ) : (
            <Text style={styles.noDataText}>읽기 계획 데이터가 없습니다.</Text>
          )}
        </View>
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
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  percentage: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  streak: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#10B981',
    marginTop: 8,
  },
  streakLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  weekNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginHorizontal: 4,
  },
  navButtonTextDisabled: {
    color: '#9CA3AF',
  },
  weekBadge: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
  },
  weekBadgeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  daysContainer: {
    gap: 16,
    marginBottom: 24,
  },
  dayCard: {
    marginBottom: 0,
  },
  passagesContainer: {
    gap: 8,
  },
  passageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  passageItemCompleted: {
    backgroundColor: '#D1FAE5',
    borderColor: '#86EFAC',
  },
  passageText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  passageTextCompleted: {
    color: '#059669',
    textDecorationLine: 'line-through',
  },
  noPlanText: {
    textAlign: 'center',
    paddingVertical: 32,
    color: '#6B7280',
  },
  noDataText: {
    textAlign: 'center',
    paddingVertical: 48,
    color: '#6B7280',
  },
})

