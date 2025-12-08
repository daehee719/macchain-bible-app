import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import { Brain, Users, Calendar, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';
import { apiService } from '../services/api';
import { cn } from '../utils/cn';
import { layout, button, card, text, state, link } from '../utils/styles';
import { Loading } from '../components/Loading';
const Dashboard = () => {
    const { isLoggedIn, user } = useAuth();
    // 오늘의 읽기 계획 조회 (1시간 캐시)
    const { data: todayReading, isLoading: planLoading } = useQuery({
        queryKey: ['today-plan'],
        queryFn: async () => {
            return await apiService.getTodayPlan();
        },
        staleTime: 60 * 60 * 1000,
        gcTime: 2 * 60 * 60 * 1000, // 2시간
    });
    // 사용자 통계 조회 (30분 캐시)
    const { data: statistics, isLoading: statsLoading } = useQuery({
        queryKey: ['user-statistics', user?.id],
        queryFn: async () => {
            if (!user?.id)
                return null;
            return await apiService.getUserStatistics(user.id);
        },
        staleTime: 30 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        enabled: !!user?.id,
    });
    const loading = planLoading || statsLoading;
    const error = null; // React Query가 에러를 자동으로 처리
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
    return (_jsxs("div", { className: layout.pageContainer, children: [_jsxs("section", { className: "relative py-20 md:py-32 overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-primary opacity-5 dark:opacity-10" }), _jsx("div", { className: cn(layout.container, 'relative z-10'), children: _jsxs("div", { className: text.center, children: [_jsxs("div", { className: cn('inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6', 'bg-primary-100 dark:bg-primary-900/50', 'text-primary-700 dark:text-primary-300'), children: [_jsx(Calendar, { size: 16, className: "mr-2" }), formattedDate] }), _jsx("h1", { className: cn('text-4xl md:text-6xl font-bold mb-6', text.bold), children: "MacChain \uC131\uACBD \uC77D\uAE30" }), _jsxs("p", { className: cn('text-xl md:text-2xl mb-8 max-w-2xl mx-auto', text.secondary), children: ["\uB9E4\uC77C \uD568\uAED8\uD558\uB294 \uC131\uACBD \uC77D\uAE30 \uC5EC\uD589", _jsx("br", {}), _jsx("span", { className: cn(text.primary, 'font-semibold'), children: "McCheyne \uC77D\uAE30 \uACC4\uD68D" }), "\uC73C\uB85C 1\uB144\uC5D0 \uC131\uACBD\uC744 \uB450 \uBC88 \uC77D\uC5B4\uBCF4\uC138\uC694"] }), !isLoggedIn && (_jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [_jsxs(Link, { to: "/login", className: cn(button.primary, 'px-8 py-4 hover:shadow-xl hover:scale-105'), children: [_jsx("span", { children: "\uC2DC\uC791\uD558\uAE30" }), _jsx(ArrowRight, { size: 20 })] }), _jsx(Link, { to: "/reading-plan", className: cn(button.secondary, 'px-8 py-4 text-primary-700 dark:text-primary-300', 'hover:border-primary-400 dark:hover:border-primary-500', 'hover:bg-primary-50 dark:hover:bg-primary-900/30'), children: "\uC77D\uAE30 \uACC4\uD68D \uBCF4\uAE30" })] }))] }) })] }), _jsxs("section", { className: cn(layout.container, 'pb-20'), children: [_jsxs("div", { className: card.grid, children: [_jsx(Card, { title: "\uC624\uB298\uC758 \uC77D\uAE30 \uACC4\uD68D", description: loading ? "로딩 중..." : error ? "오류 발생" : "McCheyne 읽기 계획", icon: _jsx(Calendar, { size: 24 }), className: "md:col-span-2 lg:col-span-1", children: loading ? (_jsx(Loading, { size: "md", text: "\uC77D\uAE30 \uACC4\uD68D\uC744 \uBD88\uB7EC\uC624\uB294 \uC911..." })) : error ? (_jsx("div", { className: state.error, children: error })) : todayReading?.plan ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "space-y-3", children: [
                                                { book: todayReading.plan.reading1_book, chapter: todayReading.plan.reading1_chapter, verseStart: todayReading.plan.reading1_verse_start, verseEnd: todayReading.plan.reading1_verse_end },
                                                { book: todayReading.plan.reading2_book, chapter: todayReading.plan.reading2_chapter, verseStart: todayReading.plan.reading2_verse_start, verseEnd: todayReading.plan.reading2_verse_end },
                                                { book: todayReading.plan.reading3_book, chapter: todayReading.plan.reading3_chapter, verseStart: todayReading.plan.reading3_verse_start, verseEnd: todayReading.plan.reading3_verse_end },
                                                { book: todayReading.plan.reading4_book, chapter: todayReading.plan.reading4_chapter, verseStart: todayReading.plan.reading4_verse_start, verseEnd: todayReading.plan.reading4_verse_end }
                                            ].filter(r => r && r.book && r.chapter && r.verseStart && r.verseEnd).map((reading, index) => (_jsx("div", { className: cn('flex items-center justify-between p-3 rounded-lg transition-colors', 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'), children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(CheckCircle, { size: 18, className: "text-primary-500 dark:text-primary-400" }), _jsxs("span", { className: cn('font-medium', text.bold), children: [reading.book, " ", reading.chapter, ":", reading.verseStart, "-", reading.verseEnd] })] }) }, index))) }), _jsxs(Link, { to: "/reading-plan", className: cn(link.primary, 'mt-6'), children: ["\uC804\uCCB4 \uACC4\uD68D \uBCF4\uAE30", _jsx(ArrowRight, { size: 18, className: link.icon })] })] })) : (_jsx("div", { className: "text-center py-8 text-gray-500 dark:text-gray-400", children: "\uC77D\uAE30 \uACC4\uD68D\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4." })) }), _jsxs(Card, { title: "\uC77D\uAE30 \uD1B5\uACC4", description: "\uB098\uC758 \uC131\uACBD \uC77D\uAE30 \uD604\uD669", icon: _jsx(TrendingUp, { size: 24 }), children: [_jsxs("div", { className: card.grid3, children: [_jsxs("div", { className: text.center, children: [_jsx("div", { className: cn('text-3xl font-bold mb-1', text.primary), children: stats.totalDays }), _jsx("div", { className: text.small, children: "\uCD1D \uC77D\uC740 \uB0A0" })] }), _jsxs("div", { className: text.center, children: [_jsx("div", { className: cn('text-3xl font-bold mb-1', text.primary), children: stats.streak }), _jsx("div", { className: text.small, children: "\uC5F0\uC18D \uC77D\uAE30" })] }), _jsxs("div", { className: text.center, children: [_jsxs("div", { className: "text-3xl font-bold text-green-600 dark:text-green-400 mb-1", children: [stats.completionRate, "%"] }), _jsx("div", { className: text.small, children: "\uC644\uC8FC\uC728" })] })] }), isLoggedIn && (_jsxs(Link, { to: "/statistics", className: cn(link.primary, 'mt-6'), children: ["\uC0C1\uC138 \uD1B5\uACC4 \uBCF4\uAE30", _jsx(ArrowRight, { size: 18, className: link.icon })] }))] }), _jsxs(Card, { title: "AI \uC131\uACBD \uBD84\uC11D", description: "AI\uAC00 \uB3C4\uC640\uC8FC\uB294 \uC131\uACBD \uAD6C\uC808 \uBD84\uC11D", icon: _jsx(Brain, { size: 24 }), children: [_jsx("p", { className: "text-gray-600 dark:text-gray-300 mb-4", children: "\uC77D\uC740 \uAD6C\uC808\uC5D0 \uB300\uD574 AI\uC758 \uB3C4\uC6C0\uC744 \uBC1B\uC544 \uB354 \uAE4A\uC774 \uC774\uD574\uD574\uBCF4\uC138\uC694." }), isLoggedIn ? (_jsxs(Link, { to: "/ai-analysis", className: "inline-flex items-center px-6 py-3 bg-gradient-primary text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all", children: ["\uBD84\uC11D \uC2DC\uC791\uD558\uAE30", _jsx(ArrowRight, { size: 18, className: "ml-2" })] })) : (_jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 italic", children: "\uB85C\uADF8\uC778\uC774 \uD544\uC694\uD569\uB2C8\uB2E4" }))] }), _jsxs(Card, { title: "\uCEE4\uBBA4\uB2C8\uD2F0", description: "\uB2E4\uB978 \uC131\uB3C4\uB4E4\uACFC \uC18C\uD1B5\uD558\uBA70 \uC131\uC7A5\uD558\uAE30", icon: _jsx(Users, { size: 24 }), children: [_jsx("p", { className: "text-gray-600 dark:text-gray-300 mb-4", children: "\uC131\uACBD \uC77D\uAE30 \uACBD\uD5D8\uC744 \uACF5\uC720\uD558\uACE0 \uB2E4\uB978 \uC131\uB3C4\uB4E4\uACFC \uAD50\uC81C\uD558\uC138\uC694." }), isLoggedIn ? (_jsxs(Link, { to: "/community", className: "inline-flex items-center px-6 py-3 bg-gradient-primary text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all", children: ["\uCEE4\uBBA4\uB2C8\uD2F0 \uCC38\uC5EC\uD558\uAE30", _jsx(ArrowRight, { size: 18, className: "ml-2" })] })) : (_jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 italic", children: "\uB85C\uADF8\uC778\uC774 \uD544\uC694\uD569\uB2C8\uB2E4" }))] })] }), !isLoggedIn && (_jsxs("div", { className: "mt-16 text-center bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-8 max-w-2xl mx-auto", children: [_jsx("h3", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-3", children: "\uB354 \uB9CE\uC740 \uAE30\uB2A5\uC744 \uC0AC\uC6A9\uD558\uB824\uBA74 \uB85C\uADF8\uC778\uD558\uC138\uC694" }), _jsx("p", { className: "text-gray-600 dark:text-gray-300 mb-6", children: "AI \uBD84\uC11D, \uCEE4\uBBA4\uB2C8\uD2F0, \uC0C1\uC138 \uD1B5\uACC4 \uB4F1\uC758 \uAE30\uB2A5\uC744 \uC774\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4." }), _jsxs(Link, { to: "/login", className: "inline-flex items-center px-8 py-4 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-xl hover:scale-105 transition-all", children: ["\uB85C\uADF8\uC778\uD558\uAE30", _jsx(ArrowRight, { size: 20, className: "ml-2" })] })] }))] })] }));
};
export default Dashboard;
