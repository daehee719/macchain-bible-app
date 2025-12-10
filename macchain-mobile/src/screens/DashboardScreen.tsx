import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useAuth } from '../contexts/AuthContext'
import { Ionicons } from '@expo/vector-icons'
import { apiService, TodayPlanResponse, UserStatistics } from '../services/api'
import { Loading } from '../components/Loading'
import { RootStackParamList } from '../components/Header'

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

export default function DashboardScreen() {
  const navigation = useNavigation<NavigationProp>()
  const { isLoggedIn, user } = useAuth()

  // 오늘의 읽기 계획 조회 (1시간 캐시)
  const { data: todayReading, isLoading: planLoading } = useQuery<TodayPlanResponse>({
    queryKey: ['today-plan'],
    queryFn: async () => {
      return await apiService.getTodayPlan()
    },
    staleTime: 60 * 60 * 1000, // 1시간
    gcTime: 2 * 60 * 60 * 1000, // 2시간
  })

  // 사용자 통계 조회 (30분 캐시)
  const { data: statistics, isLoading: statsLoading } = useQuery<UserStatistics | null>({
    queryKey: ['user-statistics', user?.id],
    queryFn: async () => {
      if (!user?.id) return null
      return await apiService.getUserStatistics(user.id)
    },
    staleTime: 30 * 60 * 1000, // 30분
    gcTime: 60 * 60 * 1000, // 1시간
    enabled: !!user?.id,
  })

  const loading = planLoading || statsLoading

  const today = new Date()
  const formattedDate = today.toLocaleDateString('ko-KR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    weekday: 'long'
  })

  const stats = {
    totalDays: statistics?.total_days_read || 0,
    streak: statistics?.current_streak || 0,
    longestStreak: statistics?.longest_streak || 0,
    completionRate: statistics?.total_days_read ? Math.round((statistics.total_days_read / 365) * 100) : 0
  }

  if (loading) {
    return <Loading fullScreen text="데이터를 불러오는 중..." />
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View style={{ paddingHorizontal: 16, paddingVertical: 32 }}>
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <View style={{ 
            paddingHorizontal: 16, 
            paddingVertical: 8, 
            backgroundColor: '#F3E8FF', 
            borderRadius: 999, 
            marginBottom: 24 
          }}>
            <Text style={{ color: '#7C3AED', fontSize: 14, fontWeight: '500' }}>
              {formattedDate}
            </Text>
          </View>
          <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#111827', marginBottom: 24, textAlign: 'center' }}>
            MacChain 성경 읽기
          </Text>
          <Text style={{ fontSize: 18, color: '#4B5563', marginBottom: 32, textAlign: 'center', maxWidth: 600 }}>
            매일 함께하는 성경 읽기 여정{'\n'}
            <Text style={{ color: '#8B5CF6', fontWeight: '600' }}>
              McCheyne 읽기 계획
            </Text>
            으로 1년에 성경을 두 번 읽어보세요
          </Text>
        </View>

        {!isLoggedIn ? (
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#4B5563', marginBottom: 16 }}>로그인이 필요합니다</Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Login')}
              style={{ paddingHorizontal: 32, paddingVertical: 16, backgroundColor: '#8B5CF6', borderRadius: 8 }}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>시작하기</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, padding: 24, marginBottom: 24 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 8 }}>
                환영합니다, {user?.name || user?.email}님!
              </Text>
              <Text style={{ color: '#4B5563' }}>
                오늘의 읽기 계획을 확인하세요
              </Text>
            </View>

            {todayReading?.plan && (
              <TouchableOpacity 
                onPress={() => navigation.navigate('ReadingPlan')}
                style={{ backgroundColor: '#F9FAFB', borderRadius: 12, padding: 24, marginBottom: 24 }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>
                    오늘의 읽기 계획
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                </View>
                <Text style={{ color: '#4B5563' }}>
                  {todayReading.plan.reading1_book || '계획이 없습니다'}
                </Text>
              </TouchableOpacity>
            )}

            <View style={{ flexDirection: 'row', gap: 16, marginBottom: 24 }}>
              <TouchableOpacity 
                onPress={() => navigation.navigate('AIAnalysis')}
                style={{ flex: 1, backgroundColor: '#F3E8FF', borderRadius: 12, padding: 24 }}
              >
                <Ionicons name="bulb" size={24} color="#8B5CF6" />
                <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827', marginTop: 8 }}>
                  AI 분석
                </Text>
                <Text style={{ color: '#4B5563', fontSize: 14, marginTop: 4 }}>
                  읽은 구절 분석
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => navigation.navigate('Community')}
                style={{ flex: 1, backgroundColor: '#DBEAFE', borderRadius: 12, padding: 24 }}
              >
                <Ionicons name="people" size={24} color="#3B82F6" />
                <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827', marginTop: 8 }}>
                  커뮤니티
                </Text>
                <Text style={{ color: '#4B5563', fontSize: 14, marginTop: 4 }}>
                  성도들과 공유
                </Text>
              </TouchableOpacity>
            </View>

            {statistics && (
              <TouchableOpacity 
                onPress={() => navigation.navigate('Statistics')}
                style={{ backgroundColor: '#F9FAFB', borderRadius: 12, padding: 24 }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>
                    나의 통계
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
                  <View style={{ flex: 1, minWidth: 120 }}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#8B5CF6' }}>
                      {stats.totalDays}
                    </Text>
                    <Text style={{ color: '#6B7280', fontSize: 14 }}>읽은 날</Text>
                  </View>
                  <View style={{ flex: 1, minWidth: 120 }}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#8B5CF6' }}>
                      {stats.streak}
                    </Text>
                    <Text style={{ color: '#6B7280', fontSize: 14 }}>연속 일수</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  )
}
