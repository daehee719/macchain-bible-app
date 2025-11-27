import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Progress } from '../components/ui/Progress';
import { PageHeader } from '../components/ui/PageHeader';
import { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Circle, ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
const ReadingPlan = () => {
    const [currentWeek, setCurrentWeek] = useState(0);
    const [readingData, setReadingData] = useState([]);
    useEffect(() => {
        const mockData = Array.from({ length: 365 }, (_, i) => {
            const date = new Date(2025, 0, 1);
            date.setDate(date.getDate() + i);
            return {
                date: date.toISOString().split('T')[0],
                passages: [
                    { book: '창세기', chapter: (i % 50) + 1, verse: '1-31', completed: Math.random() > 0.4 },
                    { book: '마태복음', chapter: (i % 28) + 1, verse: '1-28', completed: Math.random() > 0.4 },
                    { book: '에스라', chapter: (i % 10) + 1, verse: '1-20', completed: Math.random() > 0.4 },
                    { book: '사도행전', chapter: (i % 28) + 1, verse: '1-20', completed: Math.random() > 0.4 }
                ]
            };
        });
        setReadingData(mockData);
    }, []);
    const togglePassageCompletion = (dayIndex, passageIndex) => {
        setReadingData(prev => prev.map((day, dIndex) => dIndex === dayIndex
            ? {
                ...day,
                passages: day.passages.map((passage, pIndex) => pIndex === passageIndex
                    ? { ...passage, completed: !passage.completed }
                    : passage)
            }
            : day));
    };
    const getWeekData = () => {
        const startIndex = currentWeek * 7;
        return readingData.slice(startIndex, startIndex + 7);
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('ko-KR', {
            month: 'short',
            day: 'numeric',
            weekday: 'short'
        });
    };
    const getCompletionRate = () => {
        const totalPassages = readingData.reduce((acc, day) => acc + day.passages.length, 0);
        const completedPassages = readingData.reduce((acc, day) => acc + day.passages.filter(p => p.completed).length, 0);
        return totalPassages > 0 ? Math.round((completedPassages / totalPassages) * 100) : 0;
    };
    const weekData = getWeekData();
    const totalPassagesThisWeek = weekData.reduce((acc, day) => acc + day.passages.length, 0);
    const completedThisWeek = weekData.reduce((acc, day) => acc + day.passages.filter(p => p.completed).length, 0);
    const canGoPrevious = currentWeek > 0;
    const canGoNext = (currentWeek + 1) * 7 < readingData.length;
    return (_jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900 py-8", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsx(PageHeader, { title: "McCheyne \uC77D\uAE30 \uACC4\uD68D", description: "1\uB144\uC5D0 \uC131\uACBD\uC744 \uB450 \uBC88 \uC77D\uB294 \uCCB4\uACC4\uC801\uC778 \uACC4\uD68D", icon: _jsx(BookOpen, { size: 32 }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8", children: [_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-md p-6", children: [_jsx("h3", { className: "text-sm font-medium text-gray-600 dark:text-gray-400 mb-3", children: "\uC5F0\uAC04 \uC644\uC8FC\uC728" }), _jsx(Progress, { value: getCompletionRate(), max: 100, showPercent: true, variant: "primary" }), _jsxs("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-2", children: [readingData.filter(d => d.passages.every(p => p.completed)).length, " / ", readingData.length, "\uC77C \uC644\uB8CC"] })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-md p-6", children: [_jsx("h3", { className: "text-sm font-medium text-gray-600 dark:text-gray-400 mb-3", children: "\uC774\uBC88 \uC8FC \uC9C4\uD589\uB960" }), _jsx(Progress, { value: completedThisWeek, max: totalPassagesThisWeek, showPercent: true, variant: "success" }), _jsxs("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-2", children: [completedThisWeek, " / ", totalPassagesThisWeek, "\uAC1C \uC644\uB8CC"] })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-md p-6", children: [_jsx("h3", { className: "text-sm font-medium text-gray-600 dark:text-gray-400 mb-3", children: "\uD604\uC7AC \uC8FC" }), _jsxs("div", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: [currentWeek + 1, "\uC8FC"] }), _jsxs("p", { className: "text-xs text-gray-500 dark:text-gray-400 mt-2", children: [weekData[0]?.date && formatDate(weekData[0].date), " ~ ", weekData[weekData.length - 1]?.date && formatDate(weekData[weekData.length - 1].date)] })] })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden", children: [_jsxs("div", { className: "px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: "\uC774\uBC88 \uC8FC \uC77D\uAE30 \uACC4\uD68D" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("button", { onClick: () => setCurrentWeek(prev => Math.max(0, prev - 1)), disabled: !canGoPrevious, className: `p-2 rounded-lg transition-colors ${canGoPrevious
                                                ? 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                                                : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'}`, children: _jsx(ArrowLeft, { size: 20 }) }), _jsxs("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300 min-w-12 text-center", children: [currentWeek + 1, "\uC8FC"] }), _jsx("button", { onClick: () => setCurrentWeek(prev => prev + 1), disabled: !canGoNext, className: `p-2 rounded-lg transition-colors ${canGoNext
                                                ? 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                                                : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'}`, children: _jsx(ArrowRight, { size: 20 }) })] })] }), _jsx("div", { className: "divide-y divide-gray-200 dark:divide-gray-700", children: weekData.map((day, dayIndex) => (_jsxs("div", { className: "p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors", children: [_jsxs("div", { className: "flex items-center mb-4", children: [_jsx(Calendar, { size: 20, className: "text-blue-500 mr-2" }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: formatDate(day.date) }), _jsxs("div", { className: "ml-auto text-sm text-gray-500 dark:text-gray-400", children: [day.passages.filter(p => p.completed).length, " / ", day.passages.length] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: day.passages.map((passage, passageIndex) => (_jsxs("button", { onClick: () => togglePassageCompletion(currentWeek * 7 + dayIndex, passageIndex), className: `flex items-start p-3 rounded-lg transition-all text-left ${passage.completed
                                                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700'
                                                : 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600'}`, children: [_jsx("div", { className: "flex-shrink-0 mr-3 mt-1", children: passage.completed ? (_jsx(CheckCircle, { size: 20, className: "text-green-600 dark:text-green-400" })) : (_jsx(Circle, { size: 20, className: "text-gray-400 dark:text-gray-500" })) }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: `font-medium ${passage.completed
                                                                ? 'text-green-800 dark:text-green-200 line-through'
                                                                : 'text-gray-900 dark:text-white'}`, children: passage.book }), _jsxs("div", { className: `text-sm ${passage.completed
                                                                ? 'text-green-700 dark:text-green-300'
                                                                : 'text-gray-600 dark:text-gray-400'}`, children: [passage.chapter, "\uC7A5 ", passage.verse, "\uC808"] })] })] }, passageIndex))) })] }, day.date))) })] }), _jsxs("div", { className: "mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2", children: "\uD83D\uDCA1 \uC774 \uACC4\uD68D\uC5D0 \uB300\uD574" }), _jsx("p", { className: "text-blue-800 dark:text-blue-200 text-sm mb-3", children: "McCheyne \uC77D\uAE30 \uACC4\uD68D\uC740 1\uB144 \uB3D9\uC548 \uC131\uACBD\uC744 \uB450 \uBC88 \uC77D\uC744 \uC218 \uC788\uB3C4\uB85D \uC124\uACC4\uB41C \uACC4\uD68D\uC785\uB2C8\uB2E4. \uB9E4\uC77C \uAD6C\uC57D 1\uAD8C, \uAD6C\uC57D 2\uAD8C, \uC2E0\uC57D, \uC2DC\uD3B8\uC744 \uC77D\uC74C\uC73C\uB85C\uC368 \uADE0\uD615\uC7A1\uD78C \uC131\uACBD \uC77D\uAE30\uB97C \uACBD\uD5D8\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4." }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 text-sm", children: [_jsx("div", { className: "bg-white/50 dark:bg-gray-800/50 rounded p-3", children: _jsx("div", { className: "font-semibold text-blue-900 dark:text-blue-100", children: "\uAD6C\uC57D (\uCC45 1)" }) }), _jsx("div", { className: "bg-white/50 dark:bg-gray-800/50 rounded p-3", children: _jsx("div", { className: "font-semibold text-blue-900 dark:text-blue-100", children: "\uAD6C\uC57D (\uCC45 2)" }) }), _jsx("div", { className: "bg-white/50 dark:bg-gray-800/50 rounded p-3", children: _jsx("div", { className: "font-semibold text-blue-900 dark:text-blue-100", children: "\uC2E0\uC57D" }) }), _jsx("div", { className: "bg-white/50 dark:bg-gray-800/50 rounded p-3", children: _jsx("div", { className: "font-semibold text-blue-900 dark:text-blue-100", children: "\uC2DC\uD3B8" }) })] })] })] }) }));
};
export default ReadingPlan;
