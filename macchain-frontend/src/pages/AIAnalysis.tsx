import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Card from '../components/Card'
import { Brain, Send, Lightbulb, BookOpen, MessageCircle, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { apiService } from '../services/api'
import { Loading } from '../components/Loading'

interface AnalysisResult {
  id: string
  passage: string
  analysis: string
  insights: string[]
  timestamp: Date
}

const AIAnalysis: React.FC = () => {
  const { user, isLoggedIn } = useAuth()
  const [inputPassage, setInputPassage] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoggedIn && user) {
      loadAnalysisHistory()
    } else {
      setLoading(false)
    }
  }, [isLoggedIn, user])

  const loadAnalysisHistory = async () => {
    try {
      setLoading(true)
      const history = await apiService.getAIAnalysis(user!.id, 20)
      
      const formattedResults: AnalysisResult[] = history.map((item: any) => ({
        id: item.id,
        passage: item.analysis_data?.passage || '알 수 없음',
        analysis: typeof item.analysis_data === 'string' 
          ? item.analysis_data 
          : item.analysis_data?.analysis || '분석 내용 없음',
        insights: item.analysis_data?.insights || [],
        timestamp: new Date(item.created_at)
      }))
      
      setAnalysisResults(formattedResults)
    } catch (error) {
      console.error('Failed to load analysis history:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyze = async () => {
    if (!inputPassage.trim() || !isLoggedIn || !user) return

    setIsAnalyzing(true)
    
    try {
      // TODO: 실제 AI 분석 API 호출 (Supabase Edge Function 또는 외부 AI 서비스)
      // 현재는 Mock 데이터로 저장
      const today = new Date().toISOString().split('T')[0]
      const mockAnalysis = {
        passage: inputPassage,
        analysis: `${inputPassage}에 대한 AI 분석 결과입니다. 이 구절은 성경의 핵심 메시지를 담고 있으며, 오늘날 우리의 삶에 중요한 교훈을 제공합니다.`,
        insights: [
          '구절의 핵심 메시지',
          '현대적 적용점',
          '영적 교훈'
        ]
      }

      // Supabase에 저장
      await apiService.saveAIAnalysis(
        user.id,
        today,
        1,
        inputPassage,
        'general',
        mockAnalysis
      )

      // 로컬 상태 업데이트
      const newAnalysis: AnalysisResult = {
        id: Date.now().toString(),
        passage: inputPassage,
        analysis: mockAnalysis.analysis,
        insights: mockAnalysis.insights,
        timestamp: new Date()
      }
      
      setAnalysisResults(prev => [newAnalysis, ...prev])
      setInputPassage('')
    } catch (error) {
      console.error('Failed to analyze passage:', error)
      toast.error('분석 중 오류가 발생했습니다.')
    } finally {
      setIsAnalyzing(false)
    }
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full text-primary-700 dark:text-primary-300 text-sm font-medium mb-6">
            <Sparkles size={16} />
            <span>AI 기반 분석</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            AI 성경 분석
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            AI가 도와주는 깊이 있는 성경 구절 분석
          </p>
        </header>

        {/* Input Section */}
        <div className="mb-12">
          <Card title="구절 분석 요청" icon={<Brain size={24} />}>
            {!isLoggedIn ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-300 mb-4">AI 분석 기능을 사용하려면 로그인이 필요합니다.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <textarea
                  value={inputPassage}
                  onChange={(e) => setInputPassage(e.target.value)}
                  placeholder="분석하고 싶은 성경 구절을 입력하세요 (예: 요한복음 3:16)"
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 outline-none transition-all resize-none"
                  rows={4}
                />
                <button 
                  onClick={handleAnalyze}
                  disabled={!inputPassage.trim() || isAnalyzing}
                  className="w-full px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="relative">
                        <div className="h-5 w-5 rounded-full border-2 border-white/30"></div>
                        <div className="absolute top-0 left-0 h-5 w-5 rounded-full border-2 border-transparent border-t-white animate-spin"></div>
                      </div>
                      <span className="animate-pulse">분석 중...</span>
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      분석 시작
                    </>
                  )}
                </button>
              </div>
            )}
          </Card>
        </div>

        {/* Results Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">분석 결과</h2>
          {loading ? (
            <Card>
              <Loading size="lg" text="분석 이력을 불러오는 중..." />
            </Card>
          ) : analysisResults.length === 0 ? (
            <Card>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <BookOpen size={64} className="text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">아직 분석된 구절이 없습니다</h3>
                <p className="text-gray-600 dark:text-gray-300">위의 입력란에 성경 구절을 입력하고 분석을 시작해보세요.</p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {analysisResults.map((result) => (
                <Card key={result.id}>
                  <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{result.passage}</h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap ml-4">
                      {formatTimestamp(result.timestamp)}
                    </span>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        <Lightbulb size={18} className="text-yellow-500" />
                        분석 내용
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{result.analysis}</p>
                    </div>
                    
                    {result.insights.length > 0 && (
                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          <MessageCircle size={18} className="text-primary-600 dark:text-primary-400" />
                          핵심 인사이트
                        </h4>
                        <ul className="space-y-2">
                          {result.insights.map((insight, index) => (
                            <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                              <span className="text-primary-600 dark:text-primary-400 mt-1">•</span>
                              <span>{insight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Tips Section */}
        <Card title="분석 팁">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">구체적인 구절 입력</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">장과 절을 명확히 지정하면 더 정확한 분석을 받을 수 있습니다.</p>
            </div>
            <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">맥락 고려</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">앞뒤 구절의 맥락을 함께 고려하여 분석하면 더 깊이 있는 이해를 얻을 수 있습니다.</p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">정기적 활용</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">매일 읽는 성경 구절에 대해 AI 분석을 받아보세요.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default AIAnalysis
