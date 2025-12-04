import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Card from '../components/Card'
import { Calendar, CheckCircle, Circle, ArrowLeft, ArrowRight } from 'lucide-react'
import { apiService, ReadingPlan } from '../services/api.ts'
import './ReadingPlan.css'

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
    <div className="reading-plan">
      <div className="container">
        <header className="page-header">
          <h1>McCheyne 읽기 계획</h1>
          <p>1년에 성경을 두 번 읽는 체계적인 계획</p>
        </header>

        <div className="plan-stats">
          <Card title="진행률" className="stat-card">
            <div className="completion-rate">
              <span className="rate-number">{getCompletionRate()}%</span>
              <div className="progress-circle">
                <div 
                  className="progress-fill" 
                  style={{ 
                    background: `conic-gradient(#667eea ${getCompletionRate() * 3.6}deg, #e5e7eb 0deg)` 
                  }}
                ></div>
              </div>
            </div>
          </Card>
          
          <Card title="연속 읽기" className="stat-card">
            <div className="streak">
              <span className="streak-number">12일</span>
              <span className="streak-label">연속으로 읽고 있어요!</span>
            </div>
          </Card>
        </div>

        <div className="week-navigation">
          <button 
            onClick={() => setCurrentWeek(Math.max(0, currentWeek - 1))}
            disabled={currentWeek === 0}
            className="nav-btn"
          >
            <ArrowLeft size={20} />
            이전 주
          </button>
          
          <span className="week-label">
            {currentWeek + 1}주차
          </span>
          
          <button 
            onClick={() => setCurrentWeek(currentWeek + 1)}
            className="nav-btn"
          >
            다음 주
            <ArrowRight size={20} />
          </button>
        </div>

        <div className="reading-days">
          {loading ? (
            <div className="loading">읽기 계획을 불러오는 중...</div>
          ) : getWeekData().length > 0 ? (
            getWeekData().map((day, dayIndex) => (
              <Card
                key={day.date}
                title={formatDate(day.date)}
                icon={<Calendar size={20} />}
                className="reading-day"
              >
                <div className="passages-list">
                  {day.passages.length > 0 ? (
                    day.passages.map((passage, passageIndex) => (
                      <div 
                        key={passageIndex}
                        className={`passage-item ${passage.completed ? 'completed' : ''}`}
                        onClick={() => togglePassageCompletion(dayIndex, passageIndex)}
                      >
                        <div className="passage-check">
                          {passage.completed ? (
                            <CheckCircle size={20} className="check-icon completed" />
                          ) : (
                            <Circle size={20} className="check-icon" />
                          )}
                        </div>
                        <div className="passage-text">
                          <span className="passage-reference">
                            {passage.book} {passage.chapter}:{passage.verse}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-passages">이 날짜의 읽기 계획이 없습니다.</div>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <div className="no-data">읽기 계획 데이터가 없습니다.</div>
          )}
        </div>

        <div className="plan-info">
          <Card title="McCheyne 읽기 계획이란?" className="info-card">
            <p>
              로버트 머레이 매케인의 읽기 계획으로, 1년에 성경을 두 번 읽을 수 있도록 
              설계된 체계적인 읽기 계획입니다. 매일 구약 1장, 신약 1장, 시편/잠언 1장씩 읽습니다.
            </p>
            <ul>
              <li>구약: 창세기부터 말라기까지 순서대로</li>
              <li>신약: 마태복음부터 요한계시록까지 순서대로</li>
              <li>시편/잠언: 시편 119장과 잠언을 매일 조금씩</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ReadingPlanPage
