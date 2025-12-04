import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Card from '../components/Card'
import { BookOpen, Brain, Users, BarChart3, Calendar, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react'
import { apiService, TodayPlanResponse, UserStatistics } from '../services/api'

const Dashboard: React.FC = () => {
  const { isLoggedIn, user } = useAuth()
  const [todayReading, setTodayReading] = useState<TodayPlanResponse | null>(null)
  const [statistics, setStatistics] = useState<UserStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // 오늘의 읽기 계획 조회
        const plan = await apiService.getTodayPlan()
        setTodayReading(plan)
        
        // 사용자 통계 조회 (로그인한 경우)
        if (user?.id) {
          const stats = await apiService.getUserStatistics(user.id)
          if (stats) {
            setStatistics(stats)
          }
        }
      } catch (err) {
        setError('데이터를 불러오는데 실패했습니다.')
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-5 dark:opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-primary-100 dark:bg-primary-900/50 rounded-full text-primary-700 dark:text-primary-300 text-sm font-medium mb-6">
              <Calendar size={16} className="mr-2" />
              {formattedDate}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              MacChain 성경 읽기
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              매일 함께하는 성경 읽기 여행
              <br />
              <span className="text-primary-600 dark:text-primary-400 font-semibold">McCheyne 읽기 계획</span>으로 1년에 성경을 두 번 읽어보세요
            </p>
            {!isLoggedIn && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/login"
                  className="px-8 py-4 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center space-x-2"
                >
                  <span>시작하기</span>
                  <ArrowRight size={20} />
                </Link>
                <Link
                  to="/reading-plan"
                  className="px-8 py-4 bg-white dark:bg-gray-800 text-primary-700 dark:text-primary-300 rounded-lg font-semibold border-2 border-primary-200 dark:border-primary-700 hover:border-primary-400 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all"
                >
                  읽기 계획 보기
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 오늘의 읽기 계획 */}
          <Card
            title="오늘의 읽기 계획"
            description={loading ? "로딩 중..." : error ? "오류 발생" : "McCheyne 읽기 계획"}
            icon={<Calendar size={24} />}
            className="md:col-span-2 lg:col-span-1"
          >
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : error ? (
              <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300">
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
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex items-center space-x-3">
                        <CheckCircle size={18} className="text-primary-500 dark:text-primary-400" />
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {reading.book} {reading.chapter}:{reading.verseStart}-{reading.verseEnd}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <Link 
                  to="/reading-plan" 
                  className="mt-6 inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium group"
                >
                  전체 계획 보기
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
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
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                  {stats.totalDays}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">총 읽은 날</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                  {stats.streak}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">연속 읽기</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                  {stats.completionRate}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">완주율</div>
              </div>
            </div>
            {isLoggedIn && (
              <Link 
                to="/statistics" 
                className="mt-6 inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium group"
              >
                상세 통계 보기
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
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
