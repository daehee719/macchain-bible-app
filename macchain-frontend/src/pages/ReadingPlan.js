import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import { Calendar, CheckCircle, Circle, ArrowLeft, ArrowRight, Flame } from 'lucide-react';
import { apiService } from '../services/api';
const ReadingPlanPage = () => {
    const { user } = useAuth();
    const [currentWeek, setCurrentWeek] = useState(0);
    const [readingData, setReadingData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statistics, setStatistics] = useState(null);
    useEffect(() => {
        const loadStatistics = async () => {
            if (user?.id) {
                const stats = await apiService.getUserStatistics(user.id);
                setStatistics(stats);
            }
        };
        loadStatistics();
    }, [user]);
    useEffect(() => {
        const fetchReadingPlans = async () => {
            try {
                setLoading(true);
                const today = new Date();
                const weekData = [];
                // 현재 주의 7일 데이터 가져오기
                for (let i = 0; i < 7; i++) {
                    const date = new Date(today);
                    date.setDate(today.getDate() + (currentWeek * 7) + i);
                    const dateString = date.toISOString().split('T')[0];
                    const plan = await apiService.getPlanByDate(dateString);
                    // 진행률 조회 (로그인한 경우)
                    let progress = [];
                    if (user?.id) {
                        progress = await apiService.getReadingProgress(user.id, dateString);
                    }
                    const passages = [
                        {
                            book: plan?.reading1_book || null,
                            chapter: plan?.reading1_chapter || null,
                            verse: plan ? `${plan.reading1_verse_start}-${plan.reading1_verse_end}` : '',
                            readingId: 1,
                            completed: progress.find(p => p.reading_id === 1)?.is_completed || false
                        },
                        {
                            book: plan?.reading2_book || null,
                            chapter: plan?.reading2_chapter || null,
                            verse: plan ? `${plan.reading2_verse_start}-${plan.reading2_verse_end}` : '',
                            readingId: 2,
                            completed: progress.find(p => p.reading_id === 2)?.is_completed || false
                        },
                        {
                            book: plan?.reading3_book || null,
                            chapter: plan?.reading3_chapter || null,
                            verse: plan ? `${plan.reading3_verse_start}-${plan.reading3_verse_end}` : '',
                            readingId: 3,
                            completed: progress.find(p => p.reading_id === 3)?.is_completed || false
                        },
                        {
                            book: plan?.reading4_book || null,
                            chapter: plan?.reading4_chapter || null,
                            verse: plan ? `${plan.reading4_verse_start}-${plan.reading4_verse_end}` : '',
                            readingId: 4,
                            completed: progress.find(p => p.reading_id === 4)?.is_completed || false
                        }
                    ].filter(p => p.book && p.chapter);
                    weekData.push({
                        date: dateString,
                        plan,
                        passages
                    });
                }
                setReadingData(weekData);
            }
            catch (error) {
                console.error('Error fetching reading plans:', error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchReadingPlans();
    }, [currentWeek, user]);
    const togglePassageCompletion = async (dayIndex, passageIndex) => {
        if (!user?.id) {
            console.warn('로그인이 필요합니다.');
            return;
        }
        const day = readingData[dayIndex];
        const passage = day.passages[passageIndex];
        const newCompleted = !passage.completed;
        // 로컬 상태 먼저 업데이트 (낙관적 업데이트)
        setReadingData(prev => prev.map((d, dIdx) => dIdx === dayIndex
            ? {
                ...d,
                passages: d.passages.map((p, pIdx) => pIdx === passageIndex
                    ? { ...p, completed: newCompleted }
                    : p)
            }
            : d));
        // Supabase에 진행률 업데이트
        try {
            await apiService.updateReadingProgress(user.id, day.date, passage.readingId, newCompleted);
        }
        catch (error) {
            console.error('Failed to update reading progress:', error);
            // 실패 시 롤백
            setReadingData(prev => prev.map((d, dIdx) => dIdx === dayIndex
                ? {
                    ...d,
                    passages: d.passages.map((p, pIdx) => pIdx === passageIndex
                        ? { ...p, completed: !newCompleted }
                        : p)
                }
                : d));
        }
    };
    const getWeekData = () => {
        return readingData;
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
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 transition-colors", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("header", { className: "text-center mb-12", children: [_jsx("h1", { className: "text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4", children: "McCheyne \uC77D\uAE30 \uACC4\uD68D" }), _jsx("p", { className: "text-xl text-gray-600 dark:text-gray-300", children: "1\uB144\uC5D0 \uC131\uACBD\uC744 \uB450 \uBC88 \uC77D\uB294 \uCCB4\uACC4\uC801\uC778 \uACC4\uD68D" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-8", children: [_jsx(Card, { title: "\uC9C4\uD589\uB960", className: "text-center", children: _jsx("div", { className: "flex flex-col items-center gap-4", children: _jsxs("div", { className: "relative w-32 h-32", children: [_jsxs("svg", { className: "transform -rotate-90 w-32 h-32", children: [_jsx("circle", { cx: "64", cy: "64", r: "56", stroke: "currentColor", strokeWidth: "8", fill: "none", className: "text-gray-200 dark:text-gray-700" }), _jsx("circle", { cx: "64", cy: "64", r: "56", stroke: "currentColor", strokeWidth: "8", fill: "none", strokeDasharray: `${getCompletionRate() * 3.51} 351`, className: "text-primary-600 dark:text-primary-400 transition-all duration-500" })] }), _jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: _jsxs("span", { className: "text-3xl font-bold text-primary-600 dark:text-primary-400", children: [getCompletionRate(), "%"] }) })] }) }) }), _jsx(Card, { title: "\uC5F0\uC18D \uC77D\uAE30", className: "text-center", children: _jsxs("div", { className: "flex flex-col items-center gap-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Flame, { size: 32, className: "text-orange-500" }), _jsxs("span", { className: "text-4xl font-bold text-green-600", children: [user ? (statistics?.current_streak || 0) : 0, "\uC77C"] })] }), _jsx("span", { className: "text-gray-600 dark:text-gray-300", children: "\uC5F0\uC18D\uC73C\uB85C \uC77D\uACE0 \uC788\uC5B4\uC694!" })] }) })] }), _jsxs("div", { className: "flex items-center justify-center gap-4 mb-8", children: [_jsxs("button", { onClick: () => setCurrentWeek(Math.max(0, currentWeek - 1)), disabled: currentWeek === 0, className: "flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-primary-300 dark:hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all", children: [_jsx(ArrowLeft, { size: 20 }), "\uC774\uC804 \uC8FC"] }), _jsxs("div", { className: "px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold text-lg", children: [currentWeek + 1, "\uC8FC\uCC28"] }), _jsxs("button", { onClick: () => setCurrentWeek(currentWeek + 1), className: "flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-primary-300 dark:hover:border-primary-500 transition-all", children: ["\uB2E4\uC74C \uC8FC", _jsx(ArrowRight, { size: 20 })] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12", children: loading ? (_jsx("div", { className: "col-span-full flex items-center justify-center h-64", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" }) })) : getWeekData().length > 0 ? (getWeekData().map((day, dayIndex) => (_jsx(Card, { title: formatDate(day.date), icon: _jsx(Calendar, { size: 20 }), children: _jsx("div", { className: "space-y-2", children: day.passages.length > 0 ? (day.passages.map((passage, passageIndex) => (_jsxs("div", { className: `flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer ${passage.completed
                                    ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700'
                                    : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'}`, onClick: () => togglePassageCompletion(dayIndex, passageIndex), children: [_jsx("div", { className: "flex-shrink-0", children: passage.completed ? (_jsx(CheckCircle, { size: 20, className: "text-green-600" })) : (_jsx(Circle, { size: 20, className: "text-gray-400" })) }), _jsx("div", { className: "flex-1", children: _jsxs("span", { className: `font-medium ${passage.completed
                                                ? 'text-green-700 dark:text-green-400 line-through'
                                                : 'text-gray-900 dark:text-white'}`, children: [passage.book, " ", passage.chapter, ":", passage.verse] }) })] }, passageIndex)))) : (_jsx("div", { className: "text-center py-8 text-gray-500 dark:text-gray-400", children: "\uC774 \uB0A0\uC9DC\uC758 \uC77D\uAE30 \uACC4\uD68D\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." })) }) }, day.date)))) : (_jsx("div", { className: "col-span-full text-center py-12 text-gray-500 dark:text-gray-400", children: "\uC77D\uAE30 \uACC4\uD68D \uB370\uC774\uD130\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4." })) }), _jsxs(Card, { title: "McCheyne \uC77D\uAE30 \uACC4\uD68D\uC774\uB780?", className: "max-w-3xl mx-auto", children: [_jsx("p", { className: "text-gray-600 dark:text-gray-300 mb-4 leading-relaxed", children: "\uB85C\uBC84\uD2B8 \uBA38\uB808\uC774 \uB9E4\uCF00\uC778\uC758 \uC77D\uAE30 \uACC4\uD68D\uC73C\uB85C, 1\uB144\uC5D0 \uC131\uACBD\uC744 \uB450 \uBC88 \uC77D\uC744 \uC218 \uC788\uB3C4\uB85D \uC124\uACC4\uB41C \uCCB4\uACC4\uC801\uC778 \uC77D\uAE30 \uACC4\uD68D\uC785\uB2C8\uB2E4. \uB9E4\uC77C \uAD6C\uC57D 1\uC7A5, \uC2E0\uC57D 1\uC7A5, \uC2DC\uD3B8/\uC7A0\uC5B8 1\uC7A5\uC529 \uC77D\uC2B5\uB2C8\uB2E4." }), _jsxs("ul", { className: "space-y-2 text-gray-600 dark:text-gray-300", children: [_jsxs("li", { className: "flex items-start", children: [_jsx("span", { className: "text-primary-600 dark:text-primary-400 mr-2", children: "\u2022" }), _jsx("span", { children: "\uAD6C\uC57D: \uCC3D\uC138\uAE30\uBD80\uD130 \uB9D0\uB77C\uAE30\uAE4C\uC9C0 \uC21C\uC11C\uB300\uB85C" })] }), _jsxs("li", { className: "flex items-start", children: [_jsx("span", { className: "text-primary-600 dark:text-primary-400 mr-2", children: "\u2022" }), _jsx("span", { children: "\uC2E0\uC57D: \uB9C8\uD0DC\uBCF5\uC74C\uBD80\uD130 \uC694\uD55C\uACC4\uC2DC\uB85D\uAE4C\uC9C0 \uC21C\uC11C\uB300\uB85C" })] }), _jsxs("li", { className: "flex items-start", children: [_jsx("span", { className: "text-primary-600 dark:text-primary-400 mr-2", children: "\u2022" }), _jsx("span", { children: "\uC2DC\uD3B8/\uC7A0\uC5B8: \uC2DC\uD3B8 119\uC7A5\uACFC \uC7A0\uC5B8\uC744 \uB9E4\uC77C \uC870\uAE08\uC529" })] })] })] })] }) }));
};
export default ReadingPlanPage;
