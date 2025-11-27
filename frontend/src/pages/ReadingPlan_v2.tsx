import Button from '../components/ui/Button';
import { Progress } from '../components/ui/Progress'
import { PageHeader } from '../components/ui/PageHeader'
import React, { useState, useEffect } from 'react'
import { Calendar, CheckCircle, Circle, ArrowLeft, ArrowRight, BookOpen } from 'lucide-react'

interface ReadingDay {
  date: string
  passages: {
    book: string
    chapter: number
    verse: string
    completed: boolean
  }[]
}

const ReadingPlan: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState(0)
  const [readingData, setReadingData] = useState<ReadingDay[]>([])

  useEffect(() => {
    const mockData: ReadingDay[] = Array.from({ length: 365 }, (_, i) => {
      const date = new Date(2025, 0, 1)
      date.setDate(date.getDate() + i)
      return {
        date: date.toISOString().split('T')[0],
        passages: [
          { book: '창세기', chapter: (i % 50) + 1, verse: '1-31', completed: Math.random() > 0.4 },
          { book: '마태복음', chapter: (i % 28) + 1, verse: '1-28', completed: Math.random() > 0.4 },
          { book: '에스라', chapter: (i % 10) + 1, verse: '1-20', completed: Math.random() > 0.4 },
          { book: '사도행전', chapter: (i % 28) + 1, verse: '1-20', completed: Math.random() > 0.4 }
        ]
      }
    })
    setReadingData(mockData)
  }, [])

  const togglePassageCompletion = (dayIndex: number, passageIndex: number) => {
    setReadingData(prev => prev.map((day, dIndex) => 
      dIndex === dayIndex 
        ? {
            ...day,
            passages: day.passages.map((passage, pIndex) => 
              pIndex === passageIndex 
                ? { ...passage, completed: !passage.completed }
                : passage
            )
          }
        : day
    ))
  }

  const getWeekData = () => {
    const startIndex = currentWeek * 7
    return readingData.slice(startIndex, startIndex + 7)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00')
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

  const weekData = getWeekData()
  const totalPassagesThisWeek = weekData.reduce((acc, day) => acc + day.passages.length, 0)
  const completedThisWeek = weekData.reduce((acc, day) => 
    acc + day.passages.filter(p => p.completed).length, 0
  )

  const canGoPrevious = currentWeek > 0
  const canGoNext = (currentWeek + 1) * 7 < readingData.length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="McCheyne 읽기 계획"
          description="1년에 성경을 두 번 읽는 체계적인 계획"
          icon={<BookOpen size={32} />}
        />

        {/* 전체 진행률 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
              연간 완주율
            </h3>
            <Progress value={getCompletionRate()} max={100} showPercent={true} variant="primary" />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {readingData.filter(d => d.passages.every(p => p.completed)).length} / {readingData.length}일 완료
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
              이번 주 진행률
            </h3>
            <Progress 
              value={completedThisWeek} 
              max={totalPassagesThisWeek} 
              showPercent={true} 
              variant="success"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {completedThisWeek} / {totalPassagesThisWeek}개 완료
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
              현재 주
            </h3>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {currentWeek + 1}주
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {weekData[0]?.date && formatDate(weekData[0].date)} ~ {weekData[weekData.length - 1]?.date && formatDate(weekData[weekData.length - 1].date)}
            </p>
          </div>
        </div>

        {/* 주간 읽기 계획 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">이번 주 읽기 계획</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentWeek(prev => Math.max(0, prev - 1))}
                disabled={!canGoPrevious}
                className={`p-2 rounded-lg transition-colors ${
                  canGoPrevious
                    ? 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                    : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                }`}
              >
                <ArrowLeft size={20} />
              </button>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-12 text-center">
                {currentWeek + 1}주
              </span>
              <button
                onClick={() => setCurrentWeek(prev => prev + 1)}
                disabled={!canGoNext}
                className={`p-2 rounded-lg transition-colors ${
                  canGoNext
                    ? 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                    : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                }`}
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {weekData.map((day, dayIndex) => (
              <div key={day.date} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center mb-4">
                  <Calendar size={20} className="text-blue-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatDate(day.date)}
                  </h3>
                  <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                    {day.passages.filter(p => p.completed).length} / {day.passages.length}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {day.passages.map((passage, passageIndex) => (
                    <button
                      key={passageIndex}
                      onClick={() => togglePassageCompletion(currentWeek * 7 + dayIndex, passageIndex)}
                      className={`flex items-start p-3 rounded-lg transition-all text-left ${
                        passage.completed
                          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700'
                          : 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600'
                      }`}
                    >
                      <div className="flex-shrink-0 mr-3 mt-1">
                        {passage.completed ? (
                          <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
                        ) : (
                          <Circle size={20} className="text-gray-400 dark:text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium ${
                          passage.completed
                            ? 'text-green-800 dark:text-green-200 line-through'
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {passage.book}
                        </div>
                        <div className={`text-sm ${
                          passage.completed
                            ? 'text-green-700 dark:text-green-300'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {passage.chapter}장 {passage.verse}절
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 안내 */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            💡 이 계획에 대해
          </h3>
          <p className="text-blue-800 dark:text-blue-200 text-sm mb-3">
            McCheyne 읽기 계획은 1년 동안 성경을 두 번 읽을 수 있도록 설계된 계획입니다. 
            매일 구약 1권, 구약 2권, 신약, 시편을 읽음으로써 균형잡힌 성경 읽기를 경험할 수 있습니다.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-white/50 dark:bg-gray-800/50 rounded p-3">
              <div className="font-semibold text-blue-900 dark:text-blue-100">구약 (책 1)</div>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded p-3">
              <div className="font-semibold text-blue-900 dark:text-blue-100">구약 (책 2)</div>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded p-3">
              <div className="font-semibold text-blue-900 dark:text-blue-100">신약</div>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded p-3">
              <div className="font-semibold text-blue-900 dark:text-blue-100">시편</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReadingPlan
