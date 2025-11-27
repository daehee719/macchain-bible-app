import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Button from '../components/ui/Button';
import { useState, useEffect } from 'react';
import Card from '../components/Card';
import { Calendar, CheckCircle, Circle, ArrowLeft, ArrowRight } from 'lucide-react';
import './ReadingPlan.css';
const ReadingPlan = () => {
    const [currentWeek, setCurrentWeek] = useState(0);
    const [readingData, setReadingData] = useState([]);
    useEffect(() => {
        // Mock data - 실제로는 API에서 가져올 데이터
        const mockData = [
            {
                date: '2025-01-06',
                passages: [
                    { book: '창세기', chapter: 1, verse: '1-31', completed: true },
                    { book: '마태복음', chapter: 1, verse: '1-17', completed: true },
                    { book: '에스라', chapter: 1, verse: '1-11', completed: false },
                    { book: '사도행전', chapter: 1, verse: '1-26', completed: false }
                ]
            },
            {
                date: '2025-01-07',
                passages: [
                    { book: '창세기', chapter: 2, verse: '1-25', completed: true },
                    { book: '마태복음', chapter: 2, verse: '1-12', completed: true },
                    { book: '에스라', chapter: 2, verse: '1-35', completed: true },
                    { book: '사도행전', chapter: 2, verse: '1-13', completed: false }
                ]
            },
            {
                date: '2025-01-08',
                passages: [
                    { book: '창세기', chapter: 3, verse: '1-24', completed: false },
                    { book: '마태복음', chapter: 2, verse: '13-23', completed: false },
                    { book: '에스라', chapter: 2, verse: '36-70', completed: false },
                    { book: '사도행전', chapter: 2, verse: '14-36', completed: false }
                ]
            }
        ];
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
        const date = new Date(dateString);
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
    return (_jsx("div", { className: "reading-plan", children: _jsxs("div", { className: "container", children: [_jsxs("header", { className: "page-header", children: [_jsx("h1", { children: "McCheyne \uC77D\uAE30 \uACC4\uD68D" }), _jsx("p", { children: "1\uB144\uC5D0 \uC131\uACBD\uC744 \uB450 \uBC88 \uC77D\uB294 \uCCB4\uACC4\uC801\uC778 \uACC4\uD68D" })] }), _jsxs("div", { className: "plan-stats", children: [_jsx(Card, { title: "\uC9C4\uD589\uB960", className: "stat-card", children: _jsxs("div", { className: "completion-rate", children: [_jsxs("span", { className: "rate-number", children: [getCompletionRate(), "%"] }), _jsx("div", { className: "progress-circle", children: _jsx("div", { className: "progress-fill", style: {
                                                background: `conic-gradient(#667eea ${getCompletionRate() * 3.6}deg, #e5e7eb 0deg)`
                                            } }) })] }) }), _jsx(Card, { title: "\uC5F0\uC18D \uC77D\uAE30", className: "stat-card", children: _jsxs("div", { className: "streak", children: [_jsx("span", { className: "streak-number", children: "12\uC77C" }), _jsx("span", { className: "streak-label", children: "\uC5F0\uC18D\uC73C\uB85C \uC77D\uACE0 \uC788\uC5B4\uC694!" })] }) })] }), _jsxs("div", { className: "week-navigation", children: [_jsxs(Button, { onClick: () => setCurrentWeek(Math.max(0, currentWeek - 1)), disabled: currentWeek === 0, children: [_jsx(ArrowLeft, { size: 20 }), "\uC774\uC804 \uC8FC"] }), _jsxs("span", { className: "week-label", children: [currentWeek + 1, "\uC8FC\uCC28"] }), _jsxs(Button, { onClick: () => setCurrentWeek(currentWeek + 1), children: ["\uB2E4\uC74C \uC8FC", _jsx(ArrowRight, { size: 20 })] })] }), _jsx("div", { className: "reading-days", children: getWeekData().map((day, dayIndex) => (_jsx(Card, { title: formatDate(day.date), icon: _jsx(Calendar, { size: 20 }), className: "reading-day", children: _jsx("div", { className: "passages-list", children: day.passages.map((passage, passageIndex) => (_jsxs("div", { className: `passage-item ${passage.completed ? 'completed' : ''}`, onClick: () => togglePassageCompletion(dayIndex + currentWeek * 7, passageIndex), children: [_jsx("div", { className: "passage-check", children: passage.completed ? (_jsx(CheckCircle, { size: 20, className: "check-icon completed" })) : (_jsx(Circle, { size: 20, className: "check-icon" })) }), _jsx("div", { className: "passage-text", children: _jsxs("span", { className: "passage-reference", children: [passage.book, " ", passage.chapter, ":", passage.verse] }) })] }, passageIndex))) }) }, day.date))) }), _jsx("div", { className: "plan-info", children: _jsxs(Card, { title: "McCheyne \uC77D\uAE30 \uACC4\uD68D\uC774\uB780?", className: "info-card", children: [_jsx("p", { children: "\uB85C\uBC84\uD2B8 \uBA38\uB808\uC774 \uB9E4\uCF00\uC778\uC758 \uC77D\uAE30 \uACC4\uD68D\uC73C\uB85C, 1\uB144\uC5D0 \uC131\uACBD\uC744 \uB450 \uBC88 \uC77D\uC744 \uC218 \uC788\uB3C4\uB85D \uC124\uACC4\uB41C \uCCB4\uACC4\uC801\uC778 \uC77D\uAE30 \uACC4\uD68D\uC785\uB2C8\uB2E4. \uB9E4\uC77C \uAD6C\uC57D 1\uC7A5, \uC2E0\uC57D 1\uC7A5, \uC2DC\uD3B8/\uC7A0\uC5B8 1\uC7A5\uC529 \uC77D\uC2B5\uB2C8\uB2E4." }), _jsxs("ul", { children: [_jsx("li", { children: "\uAD6C\uC57D: \uCC3D\uC138\uAE30\uBD80\uD130 \uB9D0\uB77C\uAE30\uAE4C\uC9C0 \uC21C\uC11C\uB300\uB85C" }), _jsx("li", { children: "\uC2E0\uC57D: \uB9C8\uD0DC\uBCF5\uC74C\uBD80\uD130 \uC694\uD55C\uACC4\uC2DC\uB85D\uAE4C\uC9C0 \uC21C\uC11C\uB300\uB85C" }), _jsx("li", { children: "\uC2DC\uD3B8/\uC7A0\uC5B8: \uC2DC\uD3B8 119\uC7A5\uACFC \uC7A0\uC5B8\uC744 \uB9E4\uC77C \uC870\uAE08\uC529" })] })] }) })] }) }));
};
export default ReadingPlan;
