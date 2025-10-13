import React, { useState, useEffect } from 'react'
import Card from '../components/Card'
import { Calendar, CheckCircle, Circle, ArrowLeft, ArrowRight } from 'lucide-react'
import './ReadingPlan.css'

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
    // Mock data - 실제로는 API에서 가져올 데이터
    const mockData: ReadingDay[] = [
      {
        date: '2025-01-06',
        passages: [
          { book: '창세기', chapter: 1, verse: '1-31', completed: true },
          { book: '마태복음', chapter: 1, verse: '1-17', completed: true },
          { book: '에스라', chapter: 1, verse: '1-11', completed: false },
          { book: '사도행전', chapter: 1, verse: '1-26', completed: false }
        ]
      },
      {
        date: '2025-01-07',
        passages: [
          { book: '창세기', chapter: 2, verse: '1-25', completed: true },
          { book: '마태복음', chapter: 2, verse: '1-12', completed: true },
          { book: '에스라', chapter: 2, verse: '1-35', completed: true },
          { book: '사도행전', chapter: 2, verse: '1-13', completed: false }
        ]
      },
      {
        date: '2025-01-08',
        passages: [
          { book: '창세기', chapter: 3, verse: '1-24', completed: false },
          { book: '마태복음', chapter: 2, verse: '13-23', completed: false },
          { book: '에스라', chapter: 2, verse: '36-70', completed: false },
          { book: '사도행전', chapter: 2, verse: '14-36', completed: false }
        ]
      }
    ]
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
          {getWeekData().map((day, dayIndex) => (
            <Card
              key={day.date}
              title={formatDate(day.date)}
              icon={<Calendar size={20} />}
              className="reading-day"
            >
              <div className="passages-list">
                {day.passages.map((passage, passageIndex) => (
                  <div 
                    key={passageIndex}
                    className={`passage-item ${passage.completed ? 'completed' : ''}`}
                    onClick={() => togglePassageCompletion(dayIndex + currentWeek * 7, passageIndex)}
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
                ))}
              </div>
            </Card>
          ))}
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

export default ReadingPlan
