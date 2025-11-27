import React, { useState } from 'react'
import Button from '../components/ui/Button'
import { TextArea } from '../components/ui/TextArea'
import { PageHeader } from '../components/ui/PageHeader'
import Card from '../components/Card'
import { Brain, Send, Loader, Lightbulb, BookOpen, MessageCircle } from 'lucide-react'

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
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([])

  const handleAnalyze = async () => {
    if (!inputPassage.trim()) return

    setIsAnalyzing(true)

    // 실제 API 호출로 대체 가능
    setTimeout(() => {
      const newAnalysis: AnalysisResult = {
        id: Date.now().toString(),
        passage: inputPassage,
        analysis: `${inputPassage}에 대한 AI 분석 결과입니다.`,
        insights: ['핵심 메시지', '적용점', '기도 포인트'],
        timestamp: new Date()
      }

      setAnalysisResults(prev => [newAnalysis, ...prev])
      setInputPassage('')
      setIsAnalyzing(false)
    }, 1500)
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader title="AI 성경 분석" description="AI가 도와주는 깊이 있는 성경 구절 분석" icon={<Brain size={28} />} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Card title="구절 분석 요청" icon={<Brain size={20} />}>
              <div className="space-y-4">
                <TextArea
                  value={inputPassage}
                  onChange={(e) => setInputPassage(e.target.value)}
                  placeholder="분석하고 싶은 성경 구절 또는 텍스트를 입력하세요"
                  rows={4}
                />
                <div className="flex items-center">
                  <Button onClick={handleAnalyze} disabled={!inputPassage.trim() || isAnalyzing} variant="primary">
                    {isAnalyzing ? '분석 중...' : '분석 시작'}
                  </Button>
                  <Button variant="ghost" className="ml-3" onClick={() => setInputPassage('')}>초기화</Button>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              {analysisResults.map(result => (
                <Card key={result.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm text-gray-500">{formatTimestamp(result.timestamp)}</div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-1">{result.passage}</h3>
                      <p className="text-gray-700 dark:text-gray-300 mt-2">{result.analysis}</p>
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {result.insights.map((ins, i) => (
                          <div key={i} className="bg-gray-100 dark:bg-gray-700 rounded p-2 text-sm text-gray-800 dark:text-gray-200">{ins}</div>
                        ))}
                      </div>
                    </div>
                    <div className="ml-4 text-sm text-gray-500">{formatTimestamp(result.timestamp)}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">AI 도움말</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">효율적으로 분석을 요청하는 팁을 제공합니다.</p>
              <ul className="text-sm list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-2">
                <li>구절의 맥락을 함께 입력하면 더 정확한 분석을 얻을 수 있어요.</li>
                <li>기도 제목, 영적 적용점을 구체적으로 요청하세요.</li>
                <li>짧은 문장보다 문맥을 포함한 문단이 더 유용합니다.</li>
              </ul>
            </div>

            <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">최근 분석</h4>
              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-center justify-between">
                  <span>요한복음 3:16</span>
                  <span className="text-xs text-gray-500">1시간 전</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>시편 23편</span>
                  <span className="text-xs text-gray-500">2시간 전</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIAnalysis
