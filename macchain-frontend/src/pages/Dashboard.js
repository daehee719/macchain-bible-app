import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import { Brain, Users, Calendar, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';
import { apiService } from '../services/api';
const Dashboard = () => {
    const { isLoggedIn, user } = useAuth();
    const [todayReading, setTodayReading] = useState(null);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // 오늘의 읽기 계획 조회
                const plan = await apiService.getTodayPlan();
                setTodayReading(plan);
                // 사용자 통계 조회 (로그인한 경우)
                if (user?.id) {
                    const stats = await apiService.getUserStatistics(user.id);
                    if (stats) {
                        setStatistics(stats);
                    }
                }
            }
            catch (err) {
                setError('데이터를 불러오는데 실패했습니다.');
                console.error('Error fetching data:', err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);
    const stats = {
        totalDays: statistics?.total_days_read || 0,
        streak: statistics?.current_streak || 0,
        longestStreak: statistics?.longest_streak || 0,
        completionRate: statistics?.total_days_read ? Math.round((statistics.total_days_read / 365) * 100) : 0
    };
    const today = new Date();
    const formattedDate = today.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors", children: [_jsxs("section", { className: "relative py-20 md:py-32 overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-primary opacity-5 dark:opacity-10" }), _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10", children: _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "inline-flex items-center px-4 py-2 bg-primary-100 dark:bg-primary-900/50 rounded-full text-primary-700 dark:text-primary-300 text-sm font-medium mb-6", children: [_jsx(Calendar, { size: 16, className: "mr-2" }), formattedDate] }), _jsx("h1", { className: "text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6", children: "MacChain \uC131\uACBD \uC77D\uAE30" }), _jsxs("p", { className: "text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto", children: ["\uB9E4\uC77C \uD568\uAED8\uD558\uB294 \uC131\uACBD \uC77D\uAE30 \uC5EC\uD589", _jsx("br", {}), _jsx("span", { className: "text-primary-600 dark:text-primary-400 font-semibold", children: "McCheyne \uC77D\uAE30 \uACC4\uD68D" }), "\uC73C\uB85C 1\uB144\uC5D0 \uC131\uACBD\uC744 \uB450 \uBC88 \uC77D\uC5B4\uBCF4\uC138\uC694"] }), !isLoggedIn && (_jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [_jsxs(Link, { to: "/login", className: "px-8 py-4 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center space-x-2", children: [_jsx("span", { children: "\uC2DC\uC791\uD558\uAE30" }), _jsx(ArrowRight, { size: 20 })] }), _jsx(Link, { to: "/reading-plan", className: "px-8 py-4 bg-white dark:bg-gray-800 text-primary-700 dark:text-primary-300 rounded-lg font-semibold border-2 border-primary-200 dark:border-primary-700 hover:border-primary-400 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all", children: "\uC77D\uAE30 \uACC4\uD68D \uBCF4\uAE30" })] }))] }) })] }), _jsxs("section", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [_jsx(Card, { title: "\uC624\uB298\uC758 \uC77D\uAE30 \uACC4\uD68D", description: loading ? "로딩 중..." : error ? "오류 발생" : "McCheyne 읽기 계획", icon: _jsx(Calendar, { size: 24 }), className: "md:col-span-2 lg:col-span-1", children: loading ? (_jsx("div", { className: "flex items-center justify-center h-48", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" }) })) : error ? (_jsx("div", { className: "p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300", children: error })) : todayReading?.plan ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "space-y-3", children: [
                                                { book: todayReading.plan.reading1_book, chapter: todayReading.plan.reading1_chapter, verseStart: todayReading.plan.reading1_verse_start, verseEnd: todayReading.plan.reading1_verse_end },
                                                { book: todayReading.plan.reading2_book, chapter: todayReading.plan.reading2_chapter, verseStart: todayReading.plan.reading2_verse_start, verseEnd: todayReading.plan.reading2_verse_end },
                                                { book: todayReading.plan.reading3_book, chapter: todayReading.plan.reading3_chapter, verseStart: todayReading.plan.reading3_verse_start, verseEnd: todayReading.plan.reading3_verse_end },
                                                { book: todayReading.plan.reading4_book, chapter: todayReading.plan.reading4_chapter, verseStart: todayReading.plan.reading4_verse_start, verseEnd: todayReading.plan.reading4_verse_end }
                                            ].filter(r => r && r.book && r.chapter && r.verseStart && r.verseEnd).map((reading, index) => (_jsx("div", { className: "flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(CheckCircle, { size: 18, className: "text-primary-500 dark:text-primary-400" }), _jsxs("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: [reading.book, " ", reading.chapter, ":", reading.verseStart, "-", reading.verseEnd] })] }) }, index))) }), _jsxs(Link, { to: "/reading-plan", className: "mt-6 inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium group", children: ["\uC804\uCCB4 \uACC4\uD68D \uBCF4\uAE30", _jsx(ArrowRight, { size: 18, className: "ml-2 group-hover:translate-x-1 transition-transform" })] })] })) : (_jsx("div", { className: "text-center py-8 text-gray-500 dark:text-gray-400", children: "\uC77D\uAE30 \uACC4\uD68D\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4." })) }), _jsxs(Card, { title: "\uC77D\uAE30 \uD1B5\uACC4", description: "\uB098\uC758 \uC131\uACBD \uC77D\uAE30 \uD604\uD669", icon: _jsx(TrendingUp, { size: 24 }), children: [_jsxs("div", { className: "grid grid-cols-3 gap-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1", children: stats.totalDays }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "\uCD1D \uC77D\uC740 \uB0A0" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1", children: stats.streak }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "\uC5F0\uC18D \uC77D\uAE30" })] }), _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-3xl font-bold text-green-600 dark:text-green-400 mb-1", children: [stats.completionRate, "%"] }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "\uC644\uC8FC\uC728" })] })] }), isLoggedIn && (_jsxs(Link, { to: "/statistics", className: "mt-6 inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium group", children: ["\uC0C1\uC138 \uD1B5\uACC4 \uBCF4\uAE30", _jsx(ArrowRight, { size: 18, className: "ml-2 group-hover:translate-x-1 transition-transform" })] }))] }), _jsxs(Card, { title: "AI \uC131\uACBD \uBD84\uC11D", description: "AI\uAC00 \uB3C4\uC640\uC8FC\uB294 \uC131\uACBD \uAD6C\uC808 \uBD84\uC11D", icon: _jsx(Brain, { size: 24 }), children: [_jsx("p", { className: "text-gray-600 dark:text-gray-300 mb-4", children: "\uC77D\uC740 \uAD6C\uC808\uC5D0 \uB300\uD574 AI\uC758 \uB3C4\uC6C0\uC744 \uBC1B\uC544 \uB354 \uAE4A\uC774 \uC774\uD574\uD574\uBCF4\uC138\uC694." }), isLoggedIn ? (_jsxs(Link, { to: "/ai-analysis", className: "inline-flex items-center px-6 py-3 bg-gradient-primary text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all", children: ["\uBD84\uC11D \uC2DC\uC791\uD558\uAE30", _jsx(ArrowRight, { size: 18, className: "ml-2" })] })) : (_jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 italic", children: "\uB85C\uADF8\uC778\uC774 \uD544\uC694\uD569\uB2C8\uB2E4" }))] }), _jsxs(Card, { title: "\uCEE4\uBBA4\uB2C8\uD2F0", description: "\uB2E4\uB978 \uC131\uB3C4\uB4E4\uACFC \uC18C\uD1B5\uD558\uBA70 \uC131\uC7A5\uD558\uAE30", icon: _jsx(Users, { size: 24 }), children: [_jsx("p", { className: "text-gray-600 dark:text-gray-300 mb-4", children: "\uC131\uACBD \uC77D\uAE30 \uACBD\uD5D8\uC744 \uACF5\uC720\uD558\uACE0 \uB2E4\uB978 \uC131\uB3C4\uB4E4\uACFC \uAD50\uC81C\uD558\uC138\uC694." }), isLoggedIn ? (_jsxs(Link, { to: "/community", className: "inline-flex items-center px-6 py-3 bg-gradient-primary text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all", children: ["\uCEE4\uBBA4\uB2C8\uD2F0 \uCC38\uC5EC\uD558\uAE30", _jsx(ArrowRight, { size: 18, className: "ml-2" })] })) : (_jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 italic", children: "\uB85C\uADF8\uC778\uC774 \uD544\uC694\uD569\uB2C8\uB2E4" }))] })] }), !isLoggedIn && (_jsxs("div", { className: "mt-16 text-center bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-8 max-w-2xl mx-auto", children: [_jsx("h3", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-3", children: "\uB354 \uB9CE\uC740 \uAE30\uB2A5\uC744 \uC0AC\uC6A9\uD558\uB824\uBA74 \uB85C\uADF8\uC778\uD558\uC138\uC694" }), _jsx("p", { className: "text-gray-600 dark:text-gray-300 mb-6", children: "AI \uBD84\uC11D, \uCEE4\uBBA4\uB2C8\uD2F0, \uC0C1\uC138 \uD1B5\uACC4 \uB4F1\uC758 \uAE30\uB2A5\uC744 \uC774\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4." }), _jsxs(Link, { to: "/login", className: "inline-flex items-center px-8 py-4 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-xl hover:scale-105 transition-all", children: ["\uB85C\uADF8\uC778\uD558\uAE30", _jsx(ArrowRight, { size: 20, className: "ml-2" })] })] }))] })] }));
};
export default Dashboard;
