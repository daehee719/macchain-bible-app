import React, { useState } from 'react'
import Card from '../components/Card'
import { BarChart3, Calendar, Target, TrendingUp, BookOpen, Clock, Award, Star } from 'lucide-react'
import './Statistics.css'

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
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month')
  
  const stats: ReadingStats = {
    totalDays: 156,
    currentStreak: 12,
    longestStreak: 45,
    completionRate: 78,
    totalChapters: 1247,
    totalTime: 2340, // minutes
    favoriteBook: '시편',
    monthlyProgress: [
      { month: '1월', days: 28 },
      { month: '2월', days: 31 },
      { month: '3월', days: 30 },
      { month: '4월', days: 25 },
      { month: '5월', days: 31 },
      { month: '6월', days: 11 }
    ]
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

  return (
    <div className="statistics">
      <div className="container">
        <header className="page-header">
          <h1>읽기 통계</h1>
          <p>나의 성경 읽기 여정을 한눈에 보세요</p>
        </header>

        {/* 핵심 통계 */}
        <div className="main-stats">
          <Card title="총 읽은 날" className="stat-card">
            <div className="stat-content">
              <Calendar size={32} className="stat-icon" />
              <span className="stat-number">{stats.totalDays}</span>
              <span className="stat-label">일</span>
            </div>
          </Card>

          <Card title="현재 연속 읽기" className="stat-card">
            <div className="stat-content">
              <TrendingUp size={32} className="stat-icon streak" />
              <span className="stat-number">{stats.currentStreak}</span>
              <span className="stat-label">일</span>
              <div className="streak-status">
                {getStreakStatus(stats.currentStreak).level}
                <span>{getStreakStatus(stats.currentStreak).message}</span>
              </div>
            </div>
          </Card>

          <Card title="최장 연속 기록" className="stat-card">
            <div className="stat-content">
              <Award size={32} className="stat-icon award" />
              <span className="stat-number">{stats.longestStreak}</span>
              <span className="stat-label">일</span>
            </div>
          </Card>

          <Card title="완주율" className="stat-card">
            <div className="stat-content">
              <Target size={32} className="stat-icon" style={{ color: getCompletionColor(stats.completionRate) }} />
              <span className="stat-number">{stats.completionRate}%</span>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
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
        <div className="detailed-stats">
          <Card title="읽기 활동" className="activity-card">
            <div className="activity-grid">
              <div className="activity-item">
                <BookOpen size={24} />
                <div className="activity-info">
                  <span className="activity-number">{stats.totalChapters}</span>
                  <span className="activity-label">총 읽은 장</span>
                </div>
              </div>
              <div className="activity-item">
                <Clock size={24} />
                <div className="activity-info">
                  <span className="activity-number">{formatTime(stats.totalTime)}</span>
                  <span className="activity-label">총 읽기 시간</span>
                </div>
              </div>
              <div className="activity-item">
                <Star size={24} />
                <div className="activity-info">
                  <span className="activity-number">{stats.favoriteBook}</span>
                  <span className="activity-label">가장 많이 읽은 책</span>
                </div>
              </div>
            </div>
          </Card>

          <Card title="월별 진행률" className="progress-card">
            <div className="time-range-selector">
              <button 
                className={`time-btn ${timeRange === 'week' ? 'active' : ''}`}
                onClick={() => setTimeRange('week')}
              >
                주간
              </button>
              <button 
                className={`time-btn ${timeRange === 'month' ? 'active' : ''}`}
                onClick={() => setTimeRange('month')}
              >
                월간
              </button>
              <button 
                className={`time-btn ${timeRange === 'year' ? 'active' : ''}`}
                onClick={() => setTimeRange('year')}
              >
                연간
              </button>
            </div>
            
            <div className="progress-chart">
              {stats.monthlyProgress.map((month, index) => {
                const maxDays = Math.max(...stats.monthlyProgress.map(m => m.days))
                const percentage = (month.days / maxDays) * 100
                
                return (
                  <div key={month.month} className="progress-bar-item">
                    <div className="bar-container">
                      <div 
                        className="progress-bar-fill"
                        style={{ height: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="bar-label">{month.month}</span>
                    <span className="bar-value">{month.days}일</span>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* 성취 및 목표 */}
        <div className="achievements">
          <Card title="성취 배지" className="achievements-card">
            <div className="badges-grid">
              <div className="badge earned">
                <div className="badge-icon">🏆</div>
                <span className="badge-name">첫 읽기</span>
                <span className="badge-desc">첫 성경 읽기 완료</span>
              </div>
              <div className="badge earned">
                <div className="badge-icon">🔥</div>
                <span className="badge-name">연속 읽기</span>
                <span className="badge-desc">7일 연속 읽기</span>
              </div>
              <div className="badge earned">
                <div className="badge-icon">📖</div>
                <span className="badge-name">책 완주</span>
                <span className="badge-desc">첫 책 완주</span>
              </div>
              <div className="badge">
                <div className="badge-icon">🎯</div>
                <span className="badge-name">마라톤</span>
                <span className="badge-desc">100일 연속 읽기</span>
              </div>
              <div className="badge">
                <div className="badge-icon">⭐</div>
                <span className="badge-name">완벽주의</span>
                <span className="badge-desc">1년 완주율 100%</span>
              </div>
              <div className="badge">
                <div className="badge-icon">🌟</div>
                <span className="badge-name">전문가</span>
                <span className="badge-desc">성경 전체 읽기</span>
              </div>
            </div>
          </Card>
        </div>

        {/* 목표 설정 */}
        <div className="goals">
          <Card title="목표 설정" className="goals-card">
            <div className="goal-item">
              <div className="goal-header">
                <h4>일일 읽기 목표</h4>
                <span className="goal-status">진행 중</span>
              </div>
              <div className="goal-progress">
                <div className="goal-bar">
                  <div className="goal-fill" style={{ width: '80%' }}></div>
                </div>
                <span className="goal-text">8/10 일</span>
              </div>
            </div>
            
            <div className="goal-item">
              <div className="goal-header">
                <h4>월간 완주율 목표</h4>
                <span className="goal-status">달성!</span>
              </div>
              <div className="goal-progress">
                <div className="goal-bar">
                  <div className="goal-fill" style={{ width: '100%' }}></div>
                </div>
                <span className="goal-text">78/75%</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Statistics
