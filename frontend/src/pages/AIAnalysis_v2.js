import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import Button from '../components/ui/Button';
import { TextArea } from '../components/ui/TextArea';
import { PageHeader } from '../components/ui/PageHeader';
import Card from '../components/Card';
import { Brain } from 'lucide-react';
const AIAnalysis = () => {
    const [inputPassage, setInputPassage] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResults, setAnalysisResults] = useState([]);
    const handleAnalyze = async () => {
        if (!inputPassage.trim())
            return;
        setIsAnalyzing(true);
        // 실제 API 호출로 대체 가능
        setTimeout(() => {
            const newAnalysis = {
                id: Date.now().toString(),
                passage: inputPassage,
                analysis: `${inputPassage}에 대한 AI 분석 결과입니다.`,
                insights: ['핵심 메시지', '적용점', '기도 포인트'],
                timestamp: new Date()
            };
            setAnalysisResults(prev => [newAnalysis, ...prev]);
            setInputPassage('');
            setIsAnalyzing(false);
        }, 1500);
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
    return (_jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900 py-8", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsx(PageHeader, { title: "AI \uC131\uACBD \uBD84\uC11D", description: "AI\uAC00 \uB3C4\uC640\uC8FC\uB294 \uAE4A\uC774 \uC788\uB294 \uC131\uACBD \uAD6C\uC808 \uBD84\uC11D", icon: _jsx(Brain, { size: 28 }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8", children: [_jsxs("div", { className: "lg:col-span-2", children: [_jsx(Card, { title: "\uAD6C\uC808 \uBD84\uC11D \uC694\uCCAD", icon: _jsx(Brain, { size: 20 }), children: _jsxs("div", { className: "space-y-4", children: [_jsx(TextArea, { value: inputPassage, onChange: (e) => setInputPassage(e.target.value), placeholder: "\uBD84\uC11D\uD558\uACE0 \uC2F6\uC740 \uC131\uACBD \uAD6C\uC808 \uB610\uB294 \uD14D\uC2A4\uD2B8\uB97C \uC785\uB825\uD558\uC138\uC694", rows: 4 }), _jsxs("div", { className: "flex items-center", children: [_jsx(Button, { onClick: handleAnalyze, disabled: !inputPassage.trim() || isAnalyzing, variant: "primary", children: isAnalyzing ? '분석 중...' : '분석 시작' }), _jsx(Button, { variant: "ghost", className: "ml-3", onClick: () => setInputPassage(''), children: "\uCD08\uAE30\uD654" })] })] }) }), _jsx("div", { className: "space-y-4", children: analysisResults.map(result => (_jsx(Card, { className: "p-4", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-500", children: formatTimestamp(result.timestamp) }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mt-1", children: result.passage }), _jsx("p", { className: "text-gray-700 dark:text-gray-300 mt-2", children: result.analysis }), _jsx("div", { className: "mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2", children: result.insights.map((ins, i) => (_jsx("div", { className: "bg-gray-100 dark:bg-gray-700 rounded p-2 text-sm text-gray-800 dark:text-gray-200", children: ins }, i))) })] }), _jsx("div", { className: "ml-4 text-sm text-gray-500", children: formatTimestamp(result.timestamp) })] }) }, result.id))) })] }), _jsxs("div", { children: [_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-md p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-2", children: "AI \uB3C4\uC6C0\uB9D0" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mb-4", children: "\uD6A8\uC728\uC801\uC73C\uB85C \uBD84\uC11D\uC744 \uC694\uCCAD\uD558\uB294 \uD301\uC744 \uC81C\uACF5\uD569\uB2C8\uB2E4." }), _jsxs("ul", { className: "text-sm list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-2", children: [_jsx("li", { children: "\uAD6C\uC808\uC758 \uB9E5\uB77D\uC744 \uD568\uAED8 \uC785\uB825\uD558\uBA74 \uB354 \uC815\uD655\uD55C \uBD84\uC11D\uC744 \uC5BB\uC744 \uC218 \uC788\uC5B4\uC694." }), _jsx("li", { children: "\uAE30\uB3C4 \uC81C\uBAA9, \uC601\uC801 \uC801\uC6A9\uC810\uC744 \uAD6C\uCCB4\uC801\uC73C\uB85C \uC694\uCCAD\uD558\uC138\uC694." }), _jsx("li", { children: "\uC9E7\uC740 \uBB38\uC7A5\uBCF4\uB2E4 \uBB38\uB9E5\uC744 \uD3EC\uD568\uD55C \uBB38\uB2E8\uC774 \uB354 \uC720\uC6A9\uD569\uB2C8\uB2E4." })] })] }), _jsxs("div", { className: "mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6", children: [_jsx("h4", { className: "text-sm font-medium text-gray-600 dark:text-gray-300 mb-2", children: "\uCD5C\uADFC \uBD84\uC11D" }), _jsxs("div", { className: "space-y-3 text-sm text-gray-700 dark:text-gray-300", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { children: "\uC694\uD55C\uBCF5\uC74C 3:16" }), _jsx("span", { className: "text-xs text-gray-500", children: "1\uC2DC\uAC04 \uC804" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { children: "\uC2DC\uD3B8 23\uD3B8" }), _jsx("span", { className: "text-xs text-gray-500", children: "2\uC2DC\uAC04 \uC804" })] })] })] })] })] })] }) }));
};
export default AIAnalysis;
