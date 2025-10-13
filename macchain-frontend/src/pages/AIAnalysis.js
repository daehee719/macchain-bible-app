import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import Card from '../components/Card';
import { Brain, Send, Loader, Lightbulb, BookOpen, MessageCircle } from 'lucide-react';
import './AIAnalysis.css';
const AIAnalysis = () => {
    const [inputPassage, setInputPassage] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResults, setAnalysisResults] = useState([
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
    ]);
    const handleAnalyze = async () => {
        if (!inputPassage.trim())
            return;
        setIsAnalyzing(true);
        // Mock API call - 실제로는 백엔드 API 호출
        setTimeout(() => {
            const newAnalysis = {
                id: Date.now().toString(),
                passage: inputPassage,
                analysis: `${inputPassage}에 대한 AI 분석 결과입니다. 이 구절은 성경의 핵심 메시지를 담고 있으며, 오늘날 우리의 삶에 중요한 교훈을 제공합니다.`,
                insights: [
                    '구절의 핵심 메시지',
                    '현대적 적용점',
                    '영적 교훈'
                ],
                timestamp: new Date()
            };
            setAnalysisResults(prev => [newAnalysis, ...prev]);
            setInputPassage('');
            setIsAnalyzing(false);
        }, 2000);
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
    return (_jsx("div", { className: "ai-analysis", children: _jsxs("div", { className: "container", children: [_jsxs("header", { className: "page-header", children: [_jsx("h1", { children: "AI \uC131\uACBD \uBD84\uC11D" }), _jsx("p", { children: "AI\uAC00 \uB3C4\uC640\uC8FC\uB294 \uAE4A\uC774 \uC788\uB294 \uC131\uACBD \uAD6C\uC808 \uBD84\uC11D" })] }), _jsx("div", { className: "analysis-input", children: _jsx(Card, { title: "\uAD6C\uC808 \uBD84\uC11D \uC694\uCCAD", icon: _jsx(Brain, { size: 24 }), children: _jsxs("div", { className: "input-section", children: [_jsx("textarea", { value: inputPassage, onChange: (e) => setInputPassage(e.target.value), placeholder: "\uBD84\uC11D\uD558\uACE0 \uC2F6\uC740 \uC131\uACBD \uAD6C\uC808\uC744 \uC785\uB825\uD558\uC138\uC694 (\uC608: \uC694\uD55C\uBCF5\uC74C 3:16)", className: "passage-input", rows: 3 }), _jsx("button", { onClick: handleAnalyze, disabled: !inputPassage.trim() || isAnalyzing, className: "analyze-btn", children: isAnalyzing ? (_jsxs(_Fragment, { children: [_jsx(Loader, { size: 16, className: "spinning" }), "\uBD84\uC11D \uC911..."] })) : (_jsxs(_Fragment, { children: [_jsx(Send, { size: 16 }), "\uBD84\uC11D \uC2DC\uC791"] })) })] }) }) }), _jsxs("div", { className: "analysis-results", children: [_jsx("h2", { children: "\uBD84\uC11D \uACB0\uACFC" }), analysisResults.length === 0 ? (_jsx(Card, { className: "empty-state", children: _jsxs("div", { className: "empty-content", children: [_jsx(BookOpen, { size: 48, className: "empty-icon" }), _jsx("h3", { children: "\uC544\uC9C1 \uBD84\uC11D\uB41C \uAD6C\uC808\uC774 \uC5C6\uC2B5\uB2C8\uB2E4" }), _jsx("p", { children: "\uC704\uC758 \uC785\uB825\uB780\uC5D0 \uC131\uACBD \uAD6C\uC808\uC744 \uC785\uB825\uD558\uACE0 \uBD84\uC11D\uC744 \uC2DC\uC791\uD574\uBCF4\uC138\uC694." })] }) })) : (_jsx("div", { className: "results-grid", children: analysisResults.map((result) => (_jsxs(Card, { className: "analysis-result", children: [_jsxs("div", { className: "result-header", children: [_jsx("h3", { className: "passage-title", children: result.passage }), _jsx("span", { className: "timestamp", children: formatTimestamp(result.timestamp) })] }), _jsxs("div", { className: "analysis-content", children: [_jsxs("div", { className: "analysis-text", children: [_jsxs("h4", { children: [_jsx(Lightbulb, { size: 16 }), "\uBD84\uC11D \uB0B4\uC6A9"] }), _jsx("p", { children: result.analysis })] }), _jsxs("div", { className: "insights", children: [_jsxs("h4", { children: [_jsx(MessageCircle, { size: 16 }), "\uD575\uC2EC \uC778\uC0AC\uC774\uD2B8"] }), _jsx("ul", { children: result.insights.map((insight, index) => (_jsx("li", { children: insight }, index))) })] })] })] }, result.id))) }))] }), _jsx("div", { className: "analysis-tips", children: _jsx(Card, { title: "\uBD84\uC11D \uD301", className: "tips-card", children: _jsxs("div", { className: "tips-content", children: [_jsxs("div", { className: "tip", children: [_jsx("h4", { children: "\uAD6C\uCCB4\uC801\uC778 \uAD6C\uC808 \uC785\uB825" }), _jsx("p", { children: "\uC7A5\uACFC \uC808\uC744 \uBA85\uD655\uD788 \uC9C0\uC815\uD558\uBA74 \uB354 \uC815\uD655\uD55C \uBD84\uC11D\uC744 \uBC1B\uC744 \uC218 \uC788\uC2B5\uB2C8\uB2E4." })] }), _jsxs("div", { className: "tip", children: [_jsx("h4", { children: "\uB9E5\uB77D \uACE0\uB824" }), _jsx("p", { children: "\uC55E\uB4A4 \uAD6C\uC808\uC758 \uB9E5\uB77D\uC744 \uD568\uAED8 \uACE0\uB824\uD558\uC5EC \uBD84\uC11D\uD558\uBA74 \uB354 \uAE4A\uC774 \uC788\uB294 \uC774\uD574\uB97C \uC5BB\uC744 \uC218 \uC788\uC2B5\uB2C8\uB2E4." })] }), _jsxs("div", { className: "tip", children: [_jsx("h4", { children: "\uC815\uAE30\uC801 \uD65C\uC6A9" }), _jsx("p", { children: "\uB9E4\uC77C \uC77D\uB294 \uC131\uACBD \uAD6C\uC808\uC5D0 \uB300\uD574 AI \uBD84\uC11D\uC744 \uBC1B\uC544\uBCF4\uC138\uC694." })] })] }) }) })] }) }));
};
export default AIAnalysis;
