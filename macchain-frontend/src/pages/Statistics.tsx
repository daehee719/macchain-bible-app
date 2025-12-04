import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Card from '../components/Card'
import { BarChart3, Calendar, Target, TrendingUp, BookOpen, Clock, Award, Star, Loader, Flame } from 'lucide-react'
import { apiService } from '../services/api'

interface ReadingStats {
  totalDays: number
  currentStreak: number
  longestStreak: number
  completionRate: number
  totalChapters: number
  totalTime: number
  favoriteBook: string
  monthlyProgress: { month: string; days: number }[]
}

const Statistics: React.FC = () => {
  const { user, isLoggedIn } = useAuth()
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<ReadingStats>({
    totalDays: 0,
    currentStreak: 0,
    longestStreak: 0,
    completionRate: 0,
    totalChapters: 0,
    totalTime: 0,
    favoriteBook: '없음',
    monthlyProgress: []
  })

  useEffect(() => {
    if (isLoggedIn && user) {
      loadStatistics()
    } else {
      setLoading(false)
    }
  }, [isLoggedIn, user, timeRange])

  const loadStatistics = async () => {
    try {
      setLoading(true)
      
      // 사용자 통계 조회
      const userStats = await apiService.getUserStatistics(user!.id)
      
      if (userStats) {
        // 월별 진행률 계산
        const currentYear = new Date().getFullYear()
        const monthlyProgress: { month: string; days: number }[] = []
        
        for (let month = 1; month <= 12; month++) {
          const monthData = await apiService.getMonthlyStatistics(user!.id, currentYear, month)
          const uniqueDays = new Set(monthData.map((d: any) => d.plan_date)).size
          monthlyProgress.push({
            month: `${month}월`,
            days: uniqueDays
          })
        }

        setStats({
          totalDays: userStats.total_days_read || 0,
          currentStreak: userStats.current_streak || 0,
          longestStreak: userStats.longest_streak || 0,
          completionRate: userStats.total_days_read ? Math.round((userStats.total_days_read / 365) * 100) : 0,
          totalChapters: userStats.total_days_read * 4, // 매일 4개 읽기
          totalTime: userStats.total_days_read * 30, // 평균 30분 가정
          favoriteBook: '시편', // TODO: 실제 데이터에서 계산
          monthlyProgress
        })
      }
    } catch (error) {
      console.error('Failed to load statistics:', error)
    } finally {
      setLoading(false)
    }
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

  const getCompletionColor = (rate: number) => {
    if (rate >= 90) return '#10b981'
    if (rate >= 70) return '#3b82f6'
    if (rate >= 50) return '#f59e0b'
    return '#ef4444'
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center py-12">
        <div className="max-w-md mx-auto px-4">
          <Card className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">로그인이 필요합니다</h2>
            <p className="text-gray-600 dark:text-gray-300">통계를 보려면 먼저 로그인해주세요.</p>
          </Card>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center py-12">
        <div className="text-center">
          <Loader size={48} className="animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">통계를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            읽기 통계
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            나의 성경 읽기 여정을 한눈에 보세요
          </p>
        </header>

        {/* 핵심 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card title="총 읽은 날" className="text-center">
            <div className="flex flex-col items-center gap-3">
              <Calendar size={40} className="text-primary-600" />
              <div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white">{stats.totalDays}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">일</div>
              </div>
            </div>
          </Card>

          <Card title="현재 연속 읽기" className="text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2">
                <Flame size={40} className="text-orange-500" />
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600">{stats.currentStreak}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">일</div>
              </div>
              <div className="text-sm text-primary-600 font-medium">
                {getStreakStatus(stats.currentStreak).level} {getStreakStatus(stats.currentStreak).message}
              </div>
            </div>
          </Card>

          <Card title="최장 연속 기록" className="text-center">
            <div className="flex flex-col items-center gap-3">
              <Award size={40} className="text-yellow-500" />
              <div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white">{stats.longestStreak}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">일</div>
              </div>
            </div>
          </Card>

          <Card title="완주율" className="text-center">
            <div className="flex flex-col items-center gap-3">
              <Target size={40} style={{ color: getCompletionColor(stats.completionRate) }} />
              <div>
                <div className="text-4xl font-bold" style={{ color: getCompletionColor(stats.completionRate) }}>
                  {stats.completionRate}%
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${stats.completionRate}%`,
                    backgroundColor: getCompletionColor(stats.completionRate)
                  }}
                ></div>
              </div>
            </div>
          </Card>
        </div>

        {/* 상세 통계 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <Card title="읽기 활동">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <BookOpen size={32} className="text-primary-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalChapters}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">총 읽은 장</div>
              </div>
              <div className="text-center">
                <Clock size={32} className="text-primary-600 dark:text-primary-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatTime(stats.totalTime)}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">총 읽기 시간</div>
              </div>
              <div className="text-center">
                <Star size={32} className="text-yellow-500 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.favoriteBook}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">가장 많이 읽은 책</div>
              </div>
            </div>
          </Card>

          <Card title="월별 진행률">
            <div className="flex gap-2 mb-6">
              <button 
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  timeRange === 'week' 
                    ? 'bg-gradient-primary text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                onClick={() => setTimeRange('week')}
              >
                주간
              </button>
              <button 
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  timeRange === 'month' 
                    ? 'bg-gradient-primary text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                onClick={() => setTimeRange('month')}
              >
                월간
              </button>
              <button 
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  timeRange === 'year' 
                    ? 'bg-gradient-primary text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                onClick={() => setTimeRange('year')}
              >
                연간
              </button>
            </div>
            
            <div className="flex items-end justify-between gap-2 h-48">
              {stats.monthlyProgress.map((month) => {
                const maxDays = Math.max(...stats.monthlyProgress.map(m => m.days), 1)
                const percentage = (month.days / maxDays) * 100
                
                return (
                  <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-t-lg h-40 flex items-end">
                      <div 
                        className="w-full bg-gradient-primary rounded-t-lg transition-all duration-500"
                        style={{ height: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{month.month}</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{month.days}일</span>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* 성취 및 목표 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="성취 배지">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { icon: '🏆', name: '첫 읽기', desc: '첫 성경 읽기 완료', earned: true },
                { icon: '🔥', name: '연속 읽기', desc: '7일 연속 읽기', earned: true },
                { icon: '📖', name: '책 완주', desc: '첫 책 완주', earned: true },
                { icon: '🎯', name: '마라톤', desc: '100일 연속 읽기', earned: false },
                { icon: '⭐', name: '완벽주의', desc: '1년 완주율 100%', earned: false },
                { icon: '🌟', name: '전문가', desc: '성경 전체 읽기', earned: false },
              ].map((badge, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border-2 text-center transition-all ${
                    badge.earned 
                      ? 'border-primary-300 dark:border-primary-600 bg-primary-50 dark:bg-primary-900/30' 
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-60'
                  }`}
                >
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <div className="font-semibold text-gray-900 dark:text-white mb-1">{badge.name}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{badge.desc}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="목표 설정">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">일일 읽기 목표</h4>
                  <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
                    진행 중
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                  <div className="bg-gradient-primary h-3 rounded-full" style={{ width: '80%' }}></div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">8/10 일</span>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">월간 완주율 목표</h4>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                    달성!
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                  <div className="bg-green-500 dark:bg-green-600 h-3 rounded-full" style={{ width: '100%' }}></div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">78/75%</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Statistics
