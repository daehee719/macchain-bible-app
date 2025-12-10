import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useAuth } from '../contexts/AuthContext'
import { Ionicons } from '@expo/vector-icons'
import Toast from 'react-native-toast-message'
import { apiService } from '../services/api'
import { Loading } from '../components/Loading'
import Card from '../components/Card'

interface AnalysisResult {
  id: string
  passage: string
  analysis: string
  insights: string[]
  timestamp: Date
}

export default function AIAnalysisScreen() {
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
    if (!inputPassage.trim() || !isLoggedIn || !user) {
      Toast.show({
        type: 'error',
        text1: '성경 구절을 입력하고 로그인해야 분석할 수 있습니다.',
      })
      return
    }

    setIsAnalyzing(true)
    
    try {
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

      await apiService.saveAIAnalysis(
        user.id,
        today,
        1,
        inputPassage,
        'general',
        mockAnalysis
      )

      const newAnalysis: AnalysisResult = {
        id: Date.now().toString(),
        passage: inputPassage,
        analysis: mockAnalysis.analysis,
        insights: mockAnalysis.insights,
        timestamp: new Date()
      }
      
      setAnalysisResults(prev => [newAnalysis, ...prev])
      setInputPassage('')
      
      Toast.show({
        type: 'success',
        text1: 'AI 분석이 완료되었습니다.',
      })
    } catch (error) {
      console.error('Failed to analyze passage:', error)
      Toast.show({
        type: 'error',
        text1: '분석 중 오류가 발생했습니다.',
      })
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

  if (loading) {
    return <Loading fullScreen text="분석 기록을 불러오는 중..." />
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.badge}>
            <Ionicons name="sparkles" size={16} color="#8B5CF6" />
            <Text style={styles.badgeText}>AI 기반 분석</Text>
          </View>
          <Text style={styles.title}>AI 성경 분석</Text>
          <Text style={styles.subtitle}>AI가 도와주는 깊이 있는 성경 구절 분석</Text>
        </View>

        {/* Input Section */}
        <Card title="구절 분석 요청" icon={<Ionicons name="bulb" size={24} color="#8B5CF6" />} style={styles.inputCard}>
          {!isLoggedIn ? (
            <View style={styles.loginPrompt}>
              <Text style={styles.loginPromptText}>AI 분석 기능을 사용하려면 로그인이 필요합니다.</Text>
            </View>
          ) : (
            <View style={styles.inputSection}>
              <TextInput
                value={inputPassage}
                onChangeText={setInputPassage}
                placeholder="분석하고 싶은 성경 구절을 입력하세요 (예: 요한복음 3:16)"
                style={styles.textArea}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <TouchableOpacity
                onPress={handleAnalyze}
                disabled={!inputPassage.trim() || isAnalyzing}
                style={[styles.analyzeButton, (!inputPassage.trim() || isAnalyzing) && styles.analyzeButtonDisabled]}
              >
                {isAnalyzing ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="send" size={18} color="#FFFFFF" />
                    <Text style={styles.analyzeButtonText}>분석하기</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Card>

        {/* Analysis Results */}
        {analysisResults.length > 0 && (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsTitle}>분석 기록</Text>
            {analysisResults.map((result) => (
              <Card key={result.id} style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultPassage}>{result.passage}</Text>
                  <Text style={styles.resultTimestamp}>{formatTimestamp(result.timestamp)}</Text>
                </View>
                <Text style={styles.resultAnalysis}>{result.analysis}</Text>
                {result.insights.length > 0 && (
                  <View style={styles.insightsContainer}>
                    {result.insights.map((insight, index) => (
                      <View key={index} style={styles.insightItem}>
                        <Ionicons name="bulb" size={16} color="#F59E0B" />
                        <Text style={styles.insightText}>{insight}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </Card>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF',
  },
  content: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#EDE9FE',
    borderRadius: 999,
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7C3AED',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  inputCard: {
    marginBottom: 24,
  },
  loginPrompt: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  loginPromptText: {
    fontSize: 14,
    color: '#6B7280',
  },
  inputSection: {
    gap: 16,
  },
  textArea: {
    width: '100%',
    minHeight: 100,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#111827',
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
  },
  analyzeButtonDisabled: {
    opacity: 0.5,
  },
  analyzeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  resultsSection: {
    gap: 16,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  resultCard: {
    marginBottom: 0,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  resultPassage: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  resultTimestamp: {
    fontSize: 12,
    color: '#6B7280',
  },
  resultAnalysis: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  insightsContainer: {
    gap: 8,
    marginTop: 8,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    backgroundColor: '#FEF3C7',
    borderRadius: 6,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: '#92400E',
  },
})

