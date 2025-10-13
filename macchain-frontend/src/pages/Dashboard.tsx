import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Card from '../components/Card'
import { BookOpen, Brain, Users, BarChart3, Calendar, TrendingUp } from 'lucide-react'
import './Dashboard.css'

const Dashboard: React.FC = () => {
  const { isLoggedIn } = useAuth()

  const todayReading = {
    date: new Date().toLocaleDateString('ko-KR'),
    passages: [
      { book: '창세기', chapter: 1, verse: '1-31' },
      { book: '마태복음', chapter: 1, verse: '1-17' },
      { book: '에스라', chapter: 1, verse: '1-11' },
      { book: '사도행전', chapter: 1, verse: '1-26' }
    ]
  }

  const stats = {
    totalDays: 45,
    streak: 12,
    completionRate: 78
  }

  return (
    <div className="dashboard">
      <div className="container">
        <header className="dashboard-header">
          <h1>MacChain 성경 읽기</h1>
          <p>매일 함께하는 성경 읽기 여행</p>
        </header>

        <div className="dashboard-grid">
          {/* 오늘의 읽기 계획 */}
          <Card
            title="오늘의 읽기 계획"
            description={`${todayReading.date} - McCheyne 읽기 계획`}
            icon={<Calendar size={24} />}
            className="today-reading"
          >
            <div className="reading-list">
              {todayReading.passages.map((passage, index) => (
                <div key={index} className="reading-item">
                  <span className="passage">{passage.book} {passage.chapter}:{passage.verse}</span>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '0%' }}></div>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/reading-plan" className="view-all-btn">
              전체 계획 보기 →
            </Link>
          </Card>

          {/* 읽기 통계 */}
          <Card
            title="읽기 통계"
            description="나의 성경 읽기 현황"
            icon={<TrendingUp size={24} />}
            className="stats-card"
          >
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">{stats.totalDays}</span>
                <span className="stat-label">총 읽은 날</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.streak}</span>
                <span className="stat-label">연속 읽기</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.completionRate}%</span>
                <span className="stat-label">완주율</span>
              </div>
            </div>
            {isLoggedIn && (
              <Link to="/statistics" className="view-all-btn">
                상세 통계 보기 →
              </Link>
            )}
          </Card>

          {/* 기능 카드들 */}
          <Card
            title="AI 성경 분석"
            description="AI가 도와주는 성경 구절 분석"
            icon={<Brain size={24} />}
            className="feature-card"
          >
            <p>읽은 구절에 대해 AI의 도움을 받아 더 깊이 이해해보세요.</p>
            {isLoggedIn ? (
              <Link to="/ai-analysis" className="feature-btn">
                분석 시작하기
              </Link>
            ) : (
              <p className="login-required">로그인이 필요합니다</p>
            )}
          </Card>

          <Card
            title="커뮤니티"
            description="다른 성도들과 소통하며 성장하기"
            icon={<Users size={24} />}
            className="feature-card"
          >
            <p>성경 읽기 경험을 공유하고 다른 성도들과 교제하세요.</p>
            {isLoggedIn ? (
              <Link to="/community" className="feature-btn">
                커뮤니티 참여하기
              </Link>
            ) : (
              <p className="login-required">로그인이 필요합니다</p>
            )}
          </Card>
        </div>

        {!isLoggedIn && (
          <div className="login-prompt">
            <h3>더 많은 기능을 사용하려면 로그인하세요</h3>
            <p>AI 분석, 커뮤니티, 상세 통계 등의 기능을 이용할 수 있습니다.</p>
            <Link to="/login" className="login-btn">
              로그인하기
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
