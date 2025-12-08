import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import { Brain, Send, Loader, Lightbulb, BookOpen, MessageCircle, Sparkles } from 'lucide-react';
import { apiService } from '../services/api';
const AIAnalysis = () => {
    const { user, isLoggedIn } = useAuth();
    const [inputPassage, setInputPassage] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResults, setAnalysisResults] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (isLoggedIn && user) {
            loadAnalysisHistory();
        }
        else {
            setLoading(false);
        }
    }, [isLoggedIn, user]);
    const loadAnalysisHistory = async () => {
        try {
            setLoading(true);
            const history = await apiService.getAIAnalysis(user.id, 20);
            const formattedResults = history.map((item) => ({
                id: item.id,
                passage: item.analysis_data?.passage || '알 수 없음',
                analysis: typeof item.analysis_data === 'string'
                    ? item.analysis_data
                    : item.analysis_data?.analysis || '분석 내용 없음',
                insights: item.analysis_data?.insights || [],
                timestamp: new Date(item.created_at)
            }));
            setAnalysisResults(formattedResults);
        }
        catch (error) {
            console.error('Failed to load analysis history:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleAnalyze = async () => {
        if (!inputPassage.trim() || !isLoggedIn || !user)
            return;
        setIsAnalyzing(true);
        try {
            // TODO: 실제 AI 분석 API 호출 (Supabase Edge Function 또는 외부 AI 서비스)
            // 현재는 Mock 데이터로 저장
            const today = new Date().toISOString().split('T')[0];
            const mockAnalysis = {
                passage: inputPassage,
                analysis: `${inputPassage}에 대한 AI 분석 결과입니다. 이 구절은 성경의 핵심 메시지를 담고 있으며, 오늘날 우리의 삶에 중요한 교훈을 제공합니다.`,
                insights: [
                    '구절의 핵심 메시지',
                    '현대적 적용점',
                    '영적 교훈'
                ]
            };
            // Supabase에 저장
            await apiService.saveAIAnalysis(user.id, today, 1, inputPassage, 'general', mockAnalysis);
            // 로컬 상태 업데이트
            const newAnalysis = {
                id: Date.now().toString(),
                passage: inputPassage,
                analysis: mockAnalysis.analysis,
                insights: mockAnalysis.insights,
                timestamp: new Date()
            };
            setAnalysisResults(prev => [newAnalysis, ...prev]);
            setInputPassage('');
        }
        catch (error) {
            console.error('Failed to analyze passage:', error);
            alert('분석 중 오류가 발생했습니다.');
        }
        finally {
            setIsAnalyzing(false);
        }
    };
    const formatTimestamp = (date) => {
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 transition-colors", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("header", { className: "text-center mb-12", children: [_jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full text-primary-700 dark:text-primary-300 text-sm font-medium mb-6", children: [_jsx(Sparkles, { size: 16 }), _jsx("span", { children: "AI \uAE30\uBC18 \uBD84\uC11D" })] }), _jsx("h1", { className: "text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4", children: "AI \uC131\uACBD \uBD84\uC11D" }), _jsx("p", { className: "text-xl text-gray-600 dark:text-gray-300", children: "AI\uAC00 \uB3C4\uC640\uC8FC\uB294 \uAE4A\uC774 \uC788\uB294 \uC131\uACBD \uAD6C\uC808 \uBD84\uC11D" })] }), _jsx("div", { className: "mb-12", children: _jsx(Card, { title: "\uAD6C\uC808 \uBD84\uC11D \uC694\uCCAD", icon: _jsx(Brain, { size: 24 }), children: !isLoggedIn ? (_jsx("div", { className: "text-center py-8", children: _jsx("p", { className: "text-gray-600 dark:text-gray-300 mb-4", children: "AI \uBD84\uC11D \uAE30\uB2A5\uC744 \uC0AC\uC6A9\uD558\uB824\uBA74 \uB85C\uADF8\uC778\uC774 \uD544\uC694\uD569\uB2C8\uB2E4." }) })) : (_jsxs("div", { className: "space-y-4", children: [_jsx("textarea", { value: inputPassage, onChange: (e) => setInputPassage(e.target.value), placeholder: "\uBD84\uC11D\uD558\uACE0 \uC2F6\uC740 \uC131\uACBD \uAD6C\uC808\uC744 \uC785\uB825\uD558\uC138\uC694 (\uC608: \uC694\uD55C\uBCF5\uC74C 3:16)", className: "w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 outline-none transition-all resize-none", rows: 4 }), _jsx("button", { onClick: handleAnalyze, disabled: !inputPassage.trim() || isAnalyzing, className: "w-full px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2", children: isAnalyzing ? (_jsxs(_Fragment, { children: [_jsx(Loader, { size: 20, className: "animate-spin" }), "\uBD84\uC11D \uC911..."] })) : (_jsxs(_Fragment, { children: [_jsx(Send, { size: 20 }), "\uBD84\uC11D \uC2DC\uC791"] })) })] })) }) }), _jsxs("div", { className: "mb-12", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-6", children: "\uBD84\uC11D \uACB0\uACFC" }), loading ? (_jsx(Card, { children: _jsxs("div", { className: "flex flex-col items-center justify-center py-12", children: [_jsx(Loader, { size: 48, className: "animate-spin text-primary-600 mb-4" }), _jsx("p", { className: "text-gray-600 dark:text-gray-300", children: "\uBD84\uC11D \uC774\uB825\uC744 \uBD88\uB7EC\uC624\uB294 \uC911..." })] }) })) : analysisResults.length === 0 ? (_jsx(Card, { children: _jsxs("div", { className: "flex flex-col items-center justify-center py-12 text-center", children: [_jsx(BookOpen, { size: 64, className: "text-gray-400 mb-4" }), _jsx("h3", { className: "text-xl font-semibold text-gray-900 dark:text-white mb-2", children: "\uC544\uC9C1 \uBD84\uC11D\uB41C \uAD6C\uC808\uC774 \uC5C6\uC2B5\uB2C8\uB2E4" }), _jsx("p", { className: "text-gray-600 dark:text-gray-300", children: "\uC704\uC758 \uC785\uB825\uB780\uC5D0 \uC131\uACBD \uAD6C\uC808\uC744 \uC785\uB825\uD558\uACE0 \uBD84\uC11D\uC744 \uC2DC\uC791\uD574\uBCF4\uC138\uC694." })] }) })) : (_jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: analysisResults.map((result) => (_jsxs(Card, { children: [_jsxs("div", { className: "flex items-start justify-between mb-4 pb-4 border-b border-gray-200", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: result.passage }), _jsx("span", { className: "text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap ml-4", children: formatTimestamp(result.timestamp) })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsxs("h4", { className: "flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2", children: [_jsx(Lightbulb, { size: 18, className: "text-yellow-500" }), "\uBD84\uC11D \uB0B4\uC6A9"] }), _jsx("p", { className: "text-gray-700 dark:text-gray-300 leading-relaxed", children: result.analysis })] }), result.insights.length > 0 && (_jsxs("div", { children: [_jsxs("h4", { className: "flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3", children: [_jsx(MessageCircle, { size: 18, className: "text-primary-600 dark:text-primary-400" }), "\uD575\uC2EC \uC778\uC0AC\uC774\uD2B8"] }), _jsx("ul", { className: "space-y-2", children: result.insights.map((insight, index) => (_jsxs("li", { className: "flex items-start gap-2 text-gray-700 dark:text-gray-300", children: [_jsx("span", { className: "text-primary-600 dark:text-primary-400 mt-1", children: "\u2022" }), _jsx("span", { children: insight })] }, index))) })] }))] })] }, result.id))) }))] }), _jsx(Card, { title: "\uBD84\uC11D \uD301", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { className: "p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg", children: [_jsx("h4", { className: "font-semibold text-gray-900 dark:text-white mb-2", children: "\uAD6C\uCCB4\uC801\uC778 \uAD6C\uC808 \uC785\uB825" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-300", children: "\uC7A5\uACFC \uC808\uC744 \uBA85\uD655\uD788 \uC9C0\uC815\uD558\uBA74 \uB354 \uC815\uD655\uD55C \uBD84\uC11D\uC744 \uBC1B\uC744 \uC218 \uC788\uC2B5\uB2C8\uB2E4." })] }), _jsxs("div", { className: "p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg", children: [_jsx("h4", { className: "font-semibold text-gray-900 dark:text-white mb-2", children: "\uB9E5\uB77D \uACE0\uB824" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-300", children: "\uC55E\uB4A4 \uAD6C\uC808\uC758 \uB9E5\uB77D\uC744 \uD568\uAED8 \uACE0\uB824\uD558\uC5EC \uBD84\uC11D\uD558\uBA74 \uB354 \uAE4A\uC774 \uC788\uB294 \uC774\uD574\uB97C \uC5BB\uC744 \uC218 \uC788\uC2B5\uB2C8\uB2E4." })] }), _jsxs("div", { className: "p-4 bg-green-50 dark:bg-green-900/20 rounded-lg", children: [_jsx("h4", { className: "font-semibold text-gray-900 dark:text-white mb-2", children: "\uC815\uAE30\uC801 \uD65C\uC6A9" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-300", children: "\uB9E4\uC77C \uC77D\uB294 \uC131\uACBD \uAD6C\uC808\uC5D0 \uB300\uD574 AI \uBD84\uC11D\uC744 \uBC1B\uC544\uBCF4\uC138\uC694." })] })] }) })] }) }));
};
export default AIAnalysis;
