import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Card from '../components/Card'
import { Calendar, CheckCircle, Circle, ArrowLeft, ArrowRight, Flame } from 'lucide-react'
import { apiService, ReadingPlan } from '../services/api'

interface ReadingDay {
  date: string
  plan: ReadingPlan | null
  passages: {
    book: string | null
    chapter: number | null
    verse: string
    readingId: number
    completed: boolean
  }[]
}

const ReadingPlanPage: React.FC = () => {
  const { user } = useAuth()
  const [currentWeek, setCurrentWeek] = useState(0)
  const [readingData, setReadingData] = useState<ReadingDay[]>([])
  const [loading, setLoading] = useState(true)
  const [statistics, setStatistics] = useState<any>(null)

  useEffect(() => {
    const loadStatistics = async () => {
      if (user?.id) {
        const stats = await apiService.getUserStatistics(user.id)
        setStatistics(stats)
      }
    }
    loadStatistics()
  }, [user])

  useEffect(() => {
    const fetchReadingPlans = async () => {
      try {
        setLoading(true)
        const today = new Date()
        const weekData: ReadingDay[] = []

        // 현재 주의 7일 데이터 가져오기
        for (let i = 0; i < 7; i++) {
          const date = new Date(today)
          date.setDate(today.getDate() + (currentWeek * 7) + i)
          const dateString = date.toISOString().split('T')[0]

          const plan = await apiService.getPlanByDate(dateString)
          
          // 진행률 조회 (로그인한 경우)
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
              completed: progress.find(p => p.reading_id === 1)?.is_completed || false
            },
            { 
              book: plan?.reading2_book || null, 
              chapter: plan?.reading2_chapter || null, 
              verse: plan ? `${plan.reading2_verse_start}-${plan.reading2_verse_end}` : '',
              readingId: 2,
              completed: progress.find(p => p.reading_id === 2)?.is_completed || false
            },
            { 
              book: plan?.reading3_book || null, 
              chapter: plan?.reading3_chapter || null, 
              verse: plan ? `${plan.reading3_verse_start}-${plan.reading3_verse_end}` : '',
              readingId: 3,
              completed: progress.find(p => p.reading_id === 3)?.is_completed || false
            },
            { 
              book: plan?.reading4_book || null, 
              chapter: plan?.reading4_chapter || null, 
              verse: plan ? `${plan.reading4_verse_start}-${plan.reading4_verse_end}` : '',
              readingId: 4,
              completed: progress.find(p => p.reading_id === 4)?.is_completed || false
            }
          ].filter(p => p.book && p.chapter)

          weekData.push({
            date: dateString,
            plan,
            passages
          })
        }

        setReadingData(weekData)
      } catch (error) {
        console.error('Error fetching reading plans:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReadingPlans()
  }, [currentWeek, user])

  const togglePassageCompletion = async (dayIndex: number, passageIndex: number) => {
    if (!user?.id) {
      console.warn('로그인이 필요합니다.')
      return
    }

    const day = readingData[dayIndex]
    const passage = day.passages[passageIndex]
    const newCompleted = !passage.completed

    // 로컬 상태 먼저 업데이트 (낙관적 업데이트)
    setReadingData(prev => prev.map((d, dIdx) => 
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
    ))

    // Supabase에 진행률 업데이트
    try {
      await apiService.updateReadingProgress(
        user.id,
        day.date,
        passage.readingId,
        newCompleted
      )
    } catch (error) {
      console.error('Failed to update reading progress:', error)
      // 실패 시 롤백
      setReadingData(prev => prev.map((d, dIdx) => 
        dIdx === dayIndex 
          ? {
              ...d,
              passages: d.passages.map((p, pIdx) => 
                pIdx === passageIndex 
                  ? { ...p, completed: !newCompleted }
                  : p
              )
            }
          : d
      ))
    }
  }

  const getWeekData = () => {
    return readingData
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            McCheyne 읽기 계획
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            1년에 성경을 두 번 읽는 체계적인 계획
          </p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card title="진행률" className="text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-32 h-32">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${getCompletionRate() * 3.51} 351`}
                    className="text-primary-600 dark:text-primary-400 transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    {getCompletionRate()}%
                  </span>
                </div>
              </div>
            </div>
          </Card>
          
          <Card title="연속 읽기" className="text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <Flame size={32} className="text-orange-500" />
                <span className="text-4xl font-bold text-green-600">
                  {user ? (statistics?.current_streak || 0) : 0}일
                </span>
              </div>
              <span className="text-gray-600 dark:text-gray-300">연속으로 읽고 있어요!</span>
            </div>
          </Card>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button 
            onClick={() => setCurrentWeek(Math.max(0, currentWeek - 1))}
            disabled={currentWeek === 0}
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-primary-300 dark:hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ArrowLeft size={20} />
            이전 주
          </button>
          
          <div className="px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold text-lg">
            {currentWeek + 1}주차
          </div>
          
          <button 
            onClick={() => setCurrentWeek(currentWeek + 1)}
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-primary-300 dark:hover:border-primary-500 transition-all"
          >
            다음 주
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Reading Days */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {loading ? (
            <div className="col-span-full flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : getWeekData().length > 0 ? (
            getWeekData().map((day, dayIndex) => (
              <Card
                key={day.date}
                title={formatDate(day.date)}
                icon={<Calendar size={20} />}
              >
                <div className="space-y-2">
                  {day.passages.length > 0 ? (
                    day.passages.map((passage, passageIndex) => (
                      <div 
                        key={passageIndex}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer ${
                          passage.completed 
                            ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700' 
                            : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                        }`}
                        onClick={() => togglePassageCompletion(dayIndex, passageIndex)}
                      >
                        <div className="flex-shrink-0">
                          {passage.completed ? (
                            <CheckCircle size={20} className="text-green-600" />
                          ) : (
                            <Circle size={20} className="text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <span className={`font-medium ${
                            passage.completed 
                              ? 'text-green-700 dark:text-green-400 line-through' 
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {passage.book} {passage.chapter}:{passage.verse}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      이 날짜의 읽기 계획이 없습니다.
                    </div>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
              읽기 계획 데이터가 없습니다.
            </div>
          )}
        </div>

        {/* Info Card */}
        <Card title="McCheyne 읽기 계획이란?" className="max-w-3xl mx-auto">
          <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
            로버트 머레이 매케인의 읽기 계획으로, 1년에 성경을 두 번 읽을 수 있도록 
            설계된 체계적인 읽기 계획입니다. 매일 구약 1장, 신약 1장, 시편/잠언 1장씩 읽습니다.
          </p>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li className="flex items-start">
              <span className="text-primary-600 dark:text-primary-400 mr-2">•</span>
              <span>구약: 창세기부터 말라기까지 순서대로</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 dark:text-primary-400 mr-2">•</span>
              <span>신약: 마태복음부터 요한계시록까지 순서대로</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 dark:text-primary-400 mr-2">•</span>
              <span>시편/잠언: 시편 119장과 잠언을 매일 조금씩</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  )
}

export default ReadingPlanPage
