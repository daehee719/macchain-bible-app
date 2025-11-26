import React, { useState } from 'react'
import Card from '../components/Card'
import Button from '../components/ui/Button'
import { Brain, Send, Loader, Lightbulb, BookOpen, MessageCircle } from 'lucide-react'
import './AIAnalysis.css'

interface AnalysisResult {
  id: string
  passage: string
  analysis: string
  insights: string[]
  timestamp: Date
}

const AIAnalysis: React.FC = () => {
  const [inputPassage, setInputPassage] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([
    {
      id: '1',
      passage: '창세기 1:1-3',
      analysis: '하나님이 천지를 창조하신 과정에서 말씀의 중요성이 강조됩니다. "하나님이 이르시되"라는 표현이 반복되며, 하나님의 말씀이 곧 창조의 동력임을 보여줍니다.',
      insights: [
        '말씀의 창조적 능력',
        '삼위일체 하나님의 협력',
        '빛의 상징적 의미'
      ],
      timestamp: new Date('2025-01-06T10:30:00')
    }
  ])

  const handleAnalyze = async () => {
    if (!inputPassage.trim()) return

    setIsAnalyzing(true)
    
    // Mock API call - 실제로는 백엔드 API 호출
    setTimeout(() => {
      const newAnalysis: AnalysisResult = {
        id: Date.now().toString(),
        passage: inputPassage,
        analysis: `${inputPassage}에 대한 AI 분석 결과입니다. 이 구절은 성경의 핵심 메시지를 담고 있으며, 오늘날 우리의 삶에 중요한 교훈을 제공합니다.`,
        insights: [
          '구절의 핵심 메시지',
          '현대적 적용점',
          '영적 교훈'
        ],
        timestamp: new Date()
      }
      
      setAnalysisResults(prev => [newAnalysis, ...prev])
      setInputPassage('')
      setIsAnalyzing(false)
    }, 2000)
  }

  const formatTimestamp = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="ai-analysis">
      <div className="container">
        <header className="page-header">
          <h1>AI 성경 분석</h1>
          <p>AI가 도와주는 깊이 있는 성경 구절 분석</p>
        </header>

        <div className="analysis-input">
          <Card title="구절 분석 요청" icon={<Brain size={24} />}>
            <div className="input-section">
              <textarea
                value={inputPassage}
                onChange={(e) => setInputPassage(e.target.value)}
                placeholder="분석하고 싶은 성경 구절을 입력하세요 (예: 요한복음 3:16)"
                className="passage-input"
                rows={3}
              />
              <Button onClick={handleAnalyze} disabled={!inputPassage.trim() || isAnalyzing} variant="primary">
                {isAnalyzing ? (
                  <>
                    <Loader size={16} className="spinning" />
                    분석 중...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    분석 시작
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        <div className="analysis-results">
          <h2>분석 결과</h2>
          {analysisResults.length === 0 ? (
            <Card className="empty-state">
              <div className="empty-content">
                <BookOpen size={48} className="empty-icon" />
                <h3>아직 분석된 구절이 없습니다</h3>
                <p>위의 입력란에 성경 구절을 입력하고 분석을 시작해보세요.</p>
              </div>
            </Card>
          ) : (
            <div className="results-grid">
              {analysisResults.map((result) => (
                <Card key={result.id} className="analysis-result">
                  <div className="result-header">
                    <h3 className="passage-title">{result.passage}</h3>
                    <span className="timestamp">{formatTimestamp(result.timestamp)}</span>
                  </div>
                  
                  <div className="analysis-content">
                    <div className="analysis-text">
                      <h4>
                        <Lightbulb size={16} />
                        분석 내용
                      </h4>
                      <p>{result.analysis}</p>
                    </div>
                    
                    <div className="insights">
                      <h4>
                        <MessageCircle size={16} />
                        핵심 인사이트
                      </h4>
                      <ul>
                        {result.insights.map((insight, index) => (
                          <li key={index}>{insight}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="analysis-tips">
          <Card title="분석 팁" className="tips-card">
            <div className="tips-content">
              <div className="tip">
                <h4>구체적인 구절 입력</h4>
                <p>장과 절을 명확히 지정하면 더 정확한 분석을 받을 수 있습니다.</p>
              </div>
              <div className="tip">
                <h4>맥락 고려</h4>
                <p>앞뒤 구절의 맥락을 함께 고려하여 분석하면 더 깊이 있는 이해를 얻을 수 있습니다.</p>
              </div>
              <div className="tip">
                <h4>정기적 활용</h4>
                <p>매일 읽는 성경 구절에 대해 AI 분석을 받아보세요.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AIAnalysis
