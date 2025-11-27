import Button from '../components/ui/Button';
import { StatsCard } from '../components/ui/StatsCard'
import { PageHeader } from '../components/ui/PageHeader'
import { Progress } from '../components/ui/Progress'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Card from '../components/Card'
import { BookOpen, Brain, Users, BarChart3, Calendar, TrendingUp, ArrowRight, Flame } from 'lucide-react'
import { apiService, TodayPlanResponse } from '../services/api'

const Dashboard: React.FC = () => {
  const { isLoggedIn } = useAuth()
  const [todayReading, setTodayReading] = useState<TodayPlanResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTodayPlan = async () => {
      try {
        setLoading(true)
        const plan = await apiService.getTodayPlan()
        setTodayReading(plan)
      } catch (err) {
        setError('오늘의 읽기 계획을 불러오는데 실패했습니다.')
        console.error('Error fetching today plan:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTodayPlan()
  }, [])

  const stats = {
    totalDays: 45,
    streak: 12,
    completionRate: 78
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="성경 읽기 대시보드"
          description="매일 함께하는 성경 읽기 여행"
          icon={<BookOpen size={32} />}
        />

        {/* 읽기 통계 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="총 읽은 날"
            value={stats.totalDays}
            icon={<Calendar size={24} className="text-blue-500" />}
            description="누적 읽기 일수"
            trend={{ direction: 'up', percent: 12 }}
          />
          <StatsCard
            title="연속 읽기"
            value={stats.streak}
            icon={<Flame size={24} className="text-orange-500" />}
            description="현재 스트릭"
            trend={{ direction: 'up', percent: 5 }}
          />
          <StatsCard
            title="완주율"
            value={`${stats.completionRate}%`}
            icon={<TrendingUp size={24} className="text-green-500" />}
            description="계획 완성도"
          />
          <StatsCard
            title="다음 읽기"
            value={todayReading ? `${todayReading.readings.length}개` : '---'}
            icon={<BookOpen size={24} className="text-purple-500" />}
            description="오늘의 구절"
          />
        </div>

        {/* 메인 컨텐츠 영역 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* 오늘의 읽기 계획 */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar size={20} className="text-blue-500 mr-3" />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      오늘의 읽기 계획
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {loading ? "로딩 중..." : error ? "오류 발생" : `${todayReading?.date}`}
                    </p>
                  </div>
                </div>
                <Link
                  to="/reading-plan"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  <ArrowRight size={20} />
                </Link>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="text-gray-600 dark:text-gray-400 mt-4">읽기 계획을 불러오는 중...</p>
                  </div>
                ) : error ? (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 text-red-700 dark:text-red-200">
                    {error}
                  </div>
                ) : todayReading ? (
                  <>
                    <div className="space-y-4">
                      {todayReading.readings.map((reading, index) => (
                        <div key={reading.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-xs font-bold mr-3">
                                {index + 1}
                              </span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {reading.book} {reading.chapter}:{reading.verseStart}-{reading.verseEnd}
                              </span>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            className="w-5 h-5 rounded cursor-pointer text-green-500 focus:ring-2 focus:ring-green-500"
                            aria-label={`${reading.book} 읽음 표시`}
                          />
                        </div>
                      ))}
                    </div>
                    <Link
                      to="/reading-plan"
                      className="mt-6 block text-center"
                    >
                      <Button variant="primary" className="w-full">
                        전체 계획 보기
                      </Button>
                    </Link>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    읽기 계획을 찾을 수 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 사이드바: 기능 바로가기 */}
          <div className="space-y-6">
            {/* AI 분석 */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-lg shadow-md p-6 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full"></div>
              <div className="relative">
                <div className="flex items-center mb-3">
                  <Brain size={28} className="mr-3" />
                  <h3 className="text-lg font-semibold">AI 분석</h3>
                </div>
                <p className="text-blue-100 text-sm mb-4">
                  읽은 구절에 대해 AI의 도움을 받아 더 깊이 이해해보세요.
                </p>
                {isLoggedIn ? (
                  <Link to="/ai-analysis">
                    <Button
                      variant="primary"
                      className="w-full bg-white text-blue-600 hover:bg-blue-50"
                    >
                      분석 시작
                    </Button>
                  </Link>
                ) : (
                  <Link to="/login">
                    <Button
                      variant="primary"
                      className="w-full bg-white text-blue-600 hover:bg-blue-50"
                    >
                      로그인
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* 커뮤니티 */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-lg shadow-md p-6 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full"></div>
              <div className="relative">
                <div className="flex items-center mb-3">
                  <Users size={28} className="mr-3" />
                  <h3 className="text-lg font-semibold">커뮤니티</h3>
                </div>
                <p className="text-purple-100 text-sm mb-4">
                  다른 성도들과 소통하며 성장하세요.
                </p>
                {isLoggedIn ? (
                  <Link to="/community">
                    <Button
                      variant="primary"
                      className="w-full bg-white text-purple-600 hover:bg-purple-50"
                    >
                      참여하기
                    </Button>
                  </Link>
                ) : (
                  <Link to="/login">
                    <Button
                      variant="primary"
                      className="w-full bg-white text-purple-600 hover:bg-purple-50"
                    >
                      로그인
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* 통계 */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 rounded-lg shadow-md p-6 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full"></div>
              <div className="relative">
                <div className="flex items-center mb-3">
                  <BarChart3 size={28} className="mr-3" />
                  <h3 className="text-lg font-semibold">상세 통계</h3>
                </div>
                <p className="text-green-100 text-sm mb-4">
                  자세한 읽기 통계를 확인하세요.
                </p>
                {isLoggedIn ? (
                  <Link to="/statistics">
                    <Button
                      variant="primary"
                      className="w-full bg-white text-green-600 hover:bg-green-50"
                    >
                      보기
                    </Button>
                  </Link>
                ) : (
                  <Link to="/login">
                    <Button
                      variant="primary"
                      className="w-full bg-white text-green-600 hover:bg-green-50"
                    >
                      로그인
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {!isLoggedIn && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              더 많은 기능을 사용하려면 로그인하세요
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              AI 분석, 커뮤니티, 상세 통계 등의 기능을 이용할 수 있습니다.
            </p>
            <Link to="/login">
              <Button variant="primary">
                로그인하기
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
