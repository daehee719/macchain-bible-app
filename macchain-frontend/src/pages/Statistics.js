import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import { Calendar, Target, BookOpen, Clock, Award, Star, Flame } from 'lucide-react';
import { apiService } from '../services/api';
import { cn } from '../utils/cn';
import { layout, text } from '../utils/styles';
import { Loading } from '../components/Loading';
const Statistics = () => {
    const { user, isLoggedIn } = useAuth();
    const [timeRange, setTimeRange] = useState('month');
    // 사용자 통계 조회 (30분 캐시)
    const { data: userStats, isLoading: statsLoading } = useQuery({
        queryKey: ['user-statistics', user?.id],
        queryFn: async () => {
            if (!user?.id)
                return null;
            return await apiService.getUserStatistics(user.id);
        },
        staleTime: 30 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        enabled: isLoggedIn && !!user?.id,
    });
    // 월별 통계 조회 (30분 캐시)
    const { data: monthlyProgress = [], isLoading: monthlyLoading } = useQuery({
        queryKey: ['monthly-statistics', user?.id, new Date().getFullYear()],
        queryFn: async () => {
            if (!user?.id)
                return [];
            const currentYear = new Date().getFullYear();
            const progress = [];
            for (let month = 1; month <= 12; month++) {
                const monthData = await apiService.getMonthlyStatistics(user.id, currentYear, month);
                const uniqueDays = new Set(monthData.map((d) => d.plan_date)).size;
                progress.push({
                    month: `${month}월`,
                    days: uniqueDays
                });
            }
            return progress;
        },
        staleTime: 30 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        enabled: isLoggedIn && !!user?.id,
    });
    const loading = statsLoading || monthlyLoading;
    const stats = {
        totalDays: userStats?.total_days_read || 0,
        currentStreak: userStats?.current_streak || 0,
        longestStreak: userStats?.longest_streak || 0,
        completionRate: userStats?.total_days_read ? Math.round((userStats.total_days_read / 365) * 100) : 0,
        totalChapters: (userStats?.total_days_read || 0) * 4,
        totalTime: (userStats?.total_days_read || 0) * 30,
        favoriteBook: '시편',
        monthlyProgress
    };
    const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return `${hours}시간 ${mins}분`;
        }
        return `${mins}분`;
    };
    const getStreakStatus = (streak) => {
        if (streak >= 30)
            return { level: '🔥', message: '놀라운 열정!' };
        if (streak >= 14)
            return { level: '⭐', message: '훌륭한 습관!' };
        if (streak >= 7)
            return { level: '💪', message: '잘하고 있어요!' };
        return { level: '🌱', message: '시작이 좋아요!' };
    };
    const getCompletionColor = (rate) => {
        if (rate >= 90)
            return '#10b981';
        if (rate >= 70)
            return '#3b82f6';
        if (rate >= 50)
            return '#f59e0b';
        return '#ef4444';
    };
    if (!isLoggedIn) {
        return (_jsx("div", { className: cn(layout.pageContainer, 'flex items-center justify-center'), children: _jsx("div", { className: "max-w-md mx-auto px-4", children: _jsxs(Card, { className: text.center, children: [_jsx("h2", { className: cn('text-2xl font-bold', text.bold, 'mb-2'), children: "\uB85C\uADF8\uC778\uC774 \uD544\uC694\uD569\uB2C8\uB2E4" }), _jsx("p", { className: text.secondary, children: "\uD1B5\uACC4\uB97C \uBCF4\uB824\uBA74 \uBA3C\uC800 \uB85C\uADF8\uC778\uD574\uC8FC\uC138\uC694." })] }) }) }));
    }
    if (loading) {
        return (_jsx("div", { className: layout.pageContainer, children: _jsx(Loading, { size: "lg", text: "\uD1B5\uACC4\uB97C \uBD88\uB7EC\uC624\uB294 \uC911...", fullScreen: true }) }));
    }
    return (_jsx("div", { className: layout.pageContainer, children: _jsxs("div", { className: layout.container, children: [_jsxs("header", { className: layout.header, children: [_jsx("h1", { className: layout.title, children: "\uC77D\uAE30 \uD1B5\uACC4" }), _jsx("p", { className: layout.subtitle, children: "\uB098\uC758 \uC131\uACBD \uC77D\uAE30 \uC5EC\uC815\uC744 \uD55C\uB208\uC5D0 \uBCF4\uC138\uC694" })] }), _jsxs("div", { className: cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'), children: [_jsx(Card, { title: "\uCD1D \uC77D\uC740 \uB0A0", className: text.center, children: _jsxs("div", { className: "flex flex-col items-center gap-3", children: [_jsx(Calendar, { size: 40, className: "text-primary-600" }), _jsxs("div", { children: [_jsx("div", { className: cn('text-4xl font-bold', text.bold), children: stats.totalDays }), _jsx("div", { className: cn(text.small, 'mt-1'), children: "\uC77C" })] })] }) }), _jsx(Card, { title: "\uD604\uC7AC \uC5F0\uC18D \uC77D\uAE30", className: text.center, children: _jsxs("div", { className: "flex flex-col items-center gap-3", children: [_jsx("div", { className: "flex items-center gap-2", children: _jsx(Flame, { size: 40, className: "text-orange-500" }) }), _jsxs("div", { children: [_jsx("div", { className: "text-4xl font-bold text-green-600", children: stats.currentStreak }), _jsx("div", { className: cn(text.small, 'mt-1'), children: "\uC77C" })] }), _jsxs("div", { className: cn(text.small, text.primary, 'font-medium'), children: [getStreakStatus(stats.currentStreak).level, " ", getStreakStatus(stats.currentStreak).message] })] }) }), _jsx(Card, { title: "\uCD5C\uC7A5 \uC5F0\uC18D \uAE30\uB85D", className: text.center, children: _jsxs("div", { className: "flex flex-col items-center gap-3", children: [_jsx(Award, { size: 40, className: "text-yellow-500" }), _jsxs("div", { children: [_jsx("div", { className: cn('text-4xl font-bold', text.bold), children: stats.longestStreak }), _jsx("div", { className: cn(text.small, 'mt-1'), children: "\uC77C" })] })] }) }), _jsx(Card, { title: "\uC644\uC8FC\uC728", className: "text-center", children: _jsxs("div", { className: "flex flex-col items-center gap-3", children: [_jsx(Target, { size: 40, style: { color: getCompletionColor(stats.completionRate) } }), _jsx("div", { children: _jsxs("div", { className: "text-4xl font-bold", style: { color: getCompletionColor(stats.completionRate) }, children: [stats.completionRate, "%"] }) }), _jsx("div", { className: "w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2", children: _jsx("div", { className: "h-2 rounded-full transition-all duration-500", style: {
                                                width: `${stats.completionRate}%`,
                                                backgroundColor: getCompletionColor(stats.completionRate)
                                            } }) })] }) })] }), _jsxs("div", { className: cn('grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12'), children: [_jsx(Card, { title: "\uC77D\uAE30 \uD65C\uB3D9", children: _jsxs("div", { className: cn('grid grid-cols-1 md:grid-cols-3 gap-6'), children: [_jsxs("div", { className: "text-center", children: [_jsx(BookOpen, { size: 32, className: "text-primary-600 mx-auto mb-3" }), _jsx("div", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: stats.totalChapters }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400 mt-1", children: "\uCD1D \uC77D\uC740 \uC7A5" })] }), _jsxs("div", { className: "text-center", children: [_jsx(Clock, { size: 32, className: "text-primary-600 dark:text-primary-400 mx-auto mb-3" }), _jsx("div", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: formatTime(stats.totalTime) }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400 mt-1", children: "\uCD1D \uC77D\uAE30 \uC2DC\uAC04" })] }), _jsxs("div", { className: "text-center", children: [_jsx(Star, { size: 32, className: "text-yellow-500 mx-auto mb-3" }), _jsx("div", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: stats.favoriteBook }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400 mt-1", children: "\uAC00\uC7A5 \uB9CE\uC774 \uC77D\uC740 \uCC45" })] })] }) }), _jsxs(Card, { title: "\uC6D4\uBCC4 \uC9C4\uD589\uB960", children: [_jsxs("div", { className: "flex gap-2 mb-6", children: [_jsx("button", { className: `px-4 py-2 rounded-lg font-medium transition-all ${timeRange === 'week'
                                                ? 'bg-gradient-primary text-white'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`, onClick: () => setTimeRange('week'), children: "\uC8FC\uAC04" }), _jsx("button", { className: `px-4 py-2 rounded-lg font-medium transition-all ${timeRange === 'month'
                                                ? 'bg-gradient-primary text-white'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`, onClick: () => setTimeRange('month'), children: "\uC6D4\uAC04" }), _jsx("button", { className: `px-4 py-2 rounded-lg font-medium transition-all ${timeRange === 'year'
                                                ? 'bg-gradient-primary text-white'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`, onClick: () => setTimeRange('year'), children: "\uC5F0\uAC04" })] }), _jsx("div", { className: "flex items-end justify-between gap-2 h-48", children: stats.monthlyProgress.map((month) => {
                                        const maxDays = Math.max(...stats.monthlyProgress.map(m => m.days), 1);
                                        const percentage = (month.days / maxDays) * 100;
                                        return (_jsxs("div", { className: "flex-1 flex flex-col items-center gap-2", children: [_jsx("div", { className: "w-full bg-gray-200 dark:bg-gray-700 rounded-t-lg h-40 flex items-end", children: _jsx("div", { className: "w-full bg-gradient-primary rounded-t-lg transition-all duration-500", style: { height: `${percentage}%` } }) }), _jsx("span", { className: "text-xs font-medium text-gray-700 dark:text-gray-300", children: month.month }), _jsxs("span", { className: "text-sm font-bold text-gray-900 dark:text-white", children: [month.days, "\uC77C"] })] }, month.month));
                                    }) })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsx(Card, { title: "\uC131\uCDE8 \uBC30\uC9C0", children: _jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4", children: [
                                    { icon: '🏆', name: '첫 읽기', desc: '첫 성경 읽기 완료', earned: true },
                                    { icon: '🔥', name: '연속 읽기', desc: '7일 연속 읽기', earned: true },
                                    { icon: '📖', name: '책 완주', desc: '첫 책 완주', earned: true },
                                    { icon: '🎯', name: '마라톤', desc: '100일 연속 읽기', earned: false },
                                    { icon: '⭐', name: '완벽주의', desc: '1년 완주율 100%', earned: false },
                                    { icon: '🌟', name: '전문가', desc: '성경 전체 읽기', earned: false },
                                ].map((badge, index) => (_jsxs("div", { className: `p-4 rounded-lg border-2 text-center transition-all ${badge.earned
                                        ? 'border-primary-300 dark:border-primary-600 bg-primary-50 dark:bg-primary-900/30'
                                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-60'}`, children: [_jsx("div", { className: "text-3xl mb-2", children: badge.icon }), _jsx("div", { className: "font-semibold text-gray-900 dark:text-white mb-1", children: badge.name }), _jsx("div", { className: "text-xs text-gray-600 dark:text-gray-400", children: badge.desc })] }, index))) }) }), _jsx(Card, { title: "\uBAA9\uD45C \uC124\uC815", children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h4", { className: "font-semibold text-gray-900 dark:text-white", children: "\uC77C\uC77C \uC77D\uAE30 \uBAA9\uD45C" }), _jsx("span", { className: "px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium", children: "\uC9C4\uD589 \uC911" })] }), _jsx("div", { className: "w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2", children: _jsx("div", { className: "bg-gradient-primary h-3 rounded-full", style: { width: '80%' } }) }), _jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "8/10 \uC77C" })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h4", { className: "font-semibold text-gray-900 dark:text-white", children: "\uC6D4\uAC04 \uC644\uC8FC\uC728 \uBAA9\uD45C" }), _jsx("span", { className: "px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium", children: "\uB2EC\uC131!" })] }), _jsx("div", { className: "w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2", children: _jsx("div", { className: "bg-green-500 dark:bg-green-600 h-3 rounded-full", style: { width: '100%' } }) }), _jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "78/75%" })] })] }) })] })] }) }));
};
export default Statistics;
