import React, { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useSyncManager } from '../hooks/useSyncManager'
import Card from '../components/Card'
import { BookOpen, Brain, Users, BarChart3, Calendar, TrendingUp, ArrowRight, CheckCircle, RefreshCw } from 'lucide-react'
import { apiService, TodayPlanResponse, UserStatistics } from '../services/api'
import { cn } from '../utils/cn'
import { layout, button, card, text, state, link } from '../utils/styles'
import { Loading } from '../components/Loading'
import { toast } from 'sonner'

const Dashboard: React.FC = () => {
  const { isLoggedIn, user } = useAuth()
  const queryClient = useQueryClient()
  const syncManager = useSyncManager()
  const [refreshing, setRefreshing] = useState(false)

  // 오늘의 읽기 계획 조회 (1시간 캐시)
  const { data: todayReading, isLoading: planLoading } = useQuery<TodayPlanResponse>({
    queryKey: ['today-plan'],
    queryFn: async () => {
      return await (apiService as any).getTodayPlan()
    },
    staleTime: 60 * 60 * 1000, // 1시간 (하루에 한 번만 변경)
    gcTime: 2 * 60 * 60 * 1000, // 2시간
  })

  // 사용자 통계 조회 (30분 캐시)
  const { data: statistics, isLoading: statsLoading } = useQuery<UserStatistics | null>({
    queryKey: ['user-statistics', user?.id],
    queryFn: async () => {
      if (!user?.id) return null
      return await (apiService as any).getUserStatistics(user.id)
    },
    staleTime: 30 * 60 * 1000, // 30분
    gcTime: 60 * 60 * 1000, // 1시간
    enabled: !!user?.id,
  })

  const loading = planLoading || statsLoading
  const error = null // React Query가 에러를 자동으로 처리

  // 데이터 새로고침 (SyncManager 사용)
  const handleRefresh = async () => {
    if (!user?.id) {
      toast.error('로그인이 필요합니다.')
      return
    }
    setRefreshing(true)
    try {
      await syncManager.createTask(
        'refresh',
        {
          queryKeys: [
            ['today-plan'],
            ['user-statistics', user.id],
          ],
        },
        'high'
      )
      toast.success('데이터를 새로고침했습니다.')
    } catch (error) {
      console.error('Failed to refresh data:', error)
      toast.error('데이터 새로고침에 실패했습니다.')
    } finally {
      setRefreshing(false)
    }
  }

  const stats = {
    totalDays: statistics?.total_days_read || 0,
    streak: statistics?.current_streak || 0,
    longestStreak: statistics?.longest_streak || 0,
    completionRate: statistics?.total_days_read ? Math.round((statistics.total_days_read / 365) * 100) : 0
  }

  const today = new Date()
  const formattedDate = today.toLocaleDateString('ko-KR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    weekday: 'long'
  })

  return (
    <div className={layout.pageContainer}>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-5 dark:opacity-10"></div>
        <div className={cn(layout.container, 'relative z-10')}>
          <div className={text.center}>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className={cn(
                'inline-flex items-center px-4 py-2 rounded-full text-sm font-medium',
                'bg-primary-100 dark:bg-primary-900/50',
                'text-primary-700 dark:text-primary-300'
              )}>
                <Calendar size={16} className="mr-2" />
                {formattedDate}
              </div>
              {isLoggedIn && (
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className={cn(
                    button.icon,
                    'px-4 py-2 rounded-full',
                    refreshing && 'opacity-50 cursor-not-allowed'
                  )}
                  title="데이터 새로고침"
                >
                  <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                </button>
              )}
            </div>
            <h1 className={cn(
              'text-4xl md:text-6xl font-bold mb-6',
              text.bold
            )}>
              MacChain 성경 읽기
            </h1>
            <p className={cn(
              'text-xl md:text-2xl mb-8 max-w-2xl mx-auto',
              text.secondary
            )}>
              매일 함께하는 성경 읽기 여행
              <br />
              <span className={cn(text.primary, 'font-semibold')}>
                McCheyne 읽기 계획
              </span>
              으로 1년에 성경을 두 번 읽어보세요
            </p>
            {!isLoggedIn && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/login"
                  className={cn(
                    button.primary,
                    'px-8 py-4 hover:shadow-xl hover:scale-105'
                  )}
                >
                  <span>시작하기</span>
                  <ArrowRight size={20} />
                </Link>
                <Link
                  to="/reading-plan"
                  className={cn(
                    button.secondary,
                    'px-8 py-4 text-primary-700 dark:text-primary-300',
                    'hover:border-primary-400 dark:hover:border-primary-500',
                    'hover:bg-primary-50 dark:hover:bg-primary-900/30'
                  )}
                >
                  읽기 계획 보기
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className={cn(layout.container, 'pb-20')}>
        <div className={card.grid}>
          {/* 오늘의 읽기 계획 */}
          <Card
            title="오늘의 읽기 계획"
            description={loading ? "로딩 중..." : error ? "오류 발생" : "McCheyne 읽기 계획"}
            icon={<Calendar size={24} />}
            className="md:col-span-2 lg:col-span-1"
          >
            {loading ? (
              <Loading size="md" text="읽기 계획을 불러오는 중..." />
            ) : error ? (
              <div className={state.error}>
                {error}
              </div>
            ) : todayReading?.plan ? (
              <>
                <div className="space-y-3">
                  {[
                    { book: todayReading.plan.reading1_book, chapter: todayReading.plan.reading1_chapter, verseStart: todayReading.plan.reading1_verse_start, verseEnd: todayReading.plan.reading1_verse_end },
                    { book: todayReading.plan.reading2_book, chapter: todayReading.plan.reading2_chapter, verseStart: todayReading.plan.reading2_verse_start, verseEnd: todayReading.plan.reading2_verse_end },
                    { book: todayReading.plan.reading3_book, chapter: todayReading.plan.reading3_chapter, verseStart: todayReading.plan.reading3_verse_start, verseEnd: todayReading.plan.reading3_verse_end },
                    { book: todayReading.plan.reading4_book, chapter: todayReading.plan.reading4_chapter, verseStart: todayReading.plan.reading4_verse_start, verseEnd: todayReading.plan.reading4_verse_end }
                  ].filter(r => r && r.book && r.chapter && r.verseStart && r.verseEnd).map((reading, index) => (
                    <div 
                      key={index} 
                      className={cn(
                        'flex items-center justify-between p-3 rounded-lg transition-colors',
                        'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <CheckCircle size={18} className="text-primary-500 dark:text-primary-400" />
                        <span className={cn('font-medium', text.bold)}>
                          {reading.book} {reading.chapter}:{reading.verseStart}-{reading.verseEnd}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <Link 
                  to="/reading-plan" 
                  className={cn(link.primary, 'mt-6')}
                >
                  전체 계획 보기
                  <ArrowRight size={18} className={link.icon} />
                </Link>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                읽기 계획을 찾을 수 없습니다.
              </div>
            )}
          </Card>

          {/* 읽기 통계 */}
          <Card
            title="읽기 통계"
            description="나의 성경 읽기 현황"
            icon={<TrendingUp size={24} />}
          >
            <div className={card.grid3}>
              <div className={text.center}>
                <div className={cn('text-3xl font-bold mb-1', text.primary)}>
                  {stats.totalDays}
                </div>
                <div className={text.small}>총 읽은 날</div>
              </div>
              <div className={text.center}>
                <div className={cn('text-3xl font-bold mb-1', text.primary)}>
                  {stats.streak}
                </div>
                <div className={text.small}>연속 읽기</div>
              </div>
              <div className={text.center}>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                  {stats.completionRate}%
                </div>
                <div className={text.small}>완주율</div>
              </div>
            </div>
            {isLoggedIn && (
              <Link 
                to="/statistics" 
                className={cn(link.primary, 'mt-6')}
              >
                상세 통계 보기
                <ArrowRight size={18} className={link.icon} />
              </Link>
            )}
          </Card>

          {/* 기능 카드들 */}
          <Card
            title="AI 성경 분석"
            description="AI가 도와주는 성경 구절 분석"
            icon={<Brain size={24} />}
          >
            <p className="text-gray-600 dark:text-gray-300 mb-4">읽은 구절에 대해 AI의 도움을 받아 더 깊이 이해해보세요.</p>
            {isLoggedIn ? (
              <Link 
                to="/ai-analysis" 
                className="inline-flex items-center px-6 py-3 bg-gradient-primary text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all"
              >
                분석 시작하기
                <ArrowRight size={18} className="ml-2" />
              </Link>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">로그인이 필요합니다</p>
            )}
          </Card>

          <Card
            title="커뮤니티"
            description="다른 성도들과 소통하며 성장하기"
            icon={<Users size={24} />}
          >
            <p className="text-gray-600 dark:text-gray-300 mb-4">성경 읽기 경험을 공유하고 다른 성도들과 교제하세요.</p>
            {isLoggedIn ? (
              <Link 
                to="/community" 
                className="inline-flex items-center px-6 py-3 bg-gradient-primary text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all"
              >
                커뮤니티 참여하기
                <ArrowRight size={18} className="ml-2" />
              </Link>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">로그인이 필요합니다</p>
            )}
          </Card>
        </div>

        {!isLoggedIn && (
          <div className="mt-16 text-center bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              더 많은 기능을 사용하려면 로그인하세요
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              AI 분석, 커뮤니티, 상세 통계 등의 기능을 이용할 수 있습니다.
            </p>
            <Link 
              to="/login" 
              className="inline-flex items-center px-8 py-4 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-xl hover:scale-105 transition-all"
            >
              로그인하기
              <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}

export default Dashboard
