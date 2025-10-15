import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import Card from '../components/Card';
import { Calendar, Target, TrendingUp, BookOpen, Clock, Award, Star } from 'lucide-react';
import './Statistics.css';
const Statistics = () => {
    const [timeRange, setTimeRange] = useState('month');
    const stats = {
        totalDays: 156,
        currentStreak: 12,
        longestStreak: 45,
        completionRate: 78,
        totalChapters: 1247,
        totalTime: 2340,
        favoriteBook: '시편',
        monthlyProgress: [
            { month: '1월', days: 28 },
            { month: '2월', days: 31 },
            { month: '3월', days: 30 },
            { month: '4월', days: 25 },
            { month: '5월', days: 31 },
            { month: '6월', days: 11 }
        ]
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
    return (_jsx("div", { className: "statistics", children: _jsxs("div", { className: "container", children: [_jsxs("header", { className: "page-header", children: [_jsx("h1", { children: "\uC77D\uAE30 \uD1B5\uACC4" }), _jsx("p", { children: "\uB098\uC758 \uC131\uACBD \uC77D\uAE30 \uC5EC\uC815\uC744 \uD55C\uB208\uC5D0 \uBCF4\uC138\uC694" })] }), _jsxs("div", { className: "main-stats", children: [_jsx(Card, { title: "\uCD1D \uC77D\uC740 \uB0A0", className: "stat-card", children: _jsxs("div", { className: "stat-content", children: [_jsx(Calendar, { size: 32, className: "stat-icon" }), _jsx("span", { className: "stat-number", children: stats.totalDays }), _jsx("span", { className: "stat-label", children: "\uC77C" })] }) }), _jsx(Card, { title: "\uD604\uC7AC \uC5F0\uC18D \uC77D\uAE30", className: "stat-card", children: _jsxs("div", { className: "stat-content", children: [_jsx(TrendingUp, { size: 32, className: "stat-icon streak" }), _jsx("span", { className: "stat-number", children: stats.currentStreak }), _jsx("span", { className: "stat-label", children: "\uC77C" }), _jsxs("div", { className: "streak-status", children: [getStreakStatus(stats.currentStreak).level, _jsx("span", { children: getStreakStatus(stats.currentStreak).message })] })] }) }), _jsx(Card, { title: "\uCD5C\uC7A5 \uC5F0\uC18D \uAE30\uB85D", className: "stat-card", children: _jsxs("div", { className: "stat-content", children: [_jsx(Award, { size: 32, className: "stat-icon award" }), _jsx("span", { className: "stat-number", children: stats.longestStreak }), _jsx("span", { className: "stat-label", children: "\uC77C" })] }) }), _jsx(Card, { title: "\uC644\uC8FC\uC728", className: "stat-card", children: _jsxs("div", { className: "stat-content", children: [_jsx(Target, { size: 32, className: "stat-icon", style: { color: getCompletionColor(stats.completionRate) } }), _jsxs("span", { className: "stat-number", children: [stats.completionRate, "%"] }), _jsx("div", { className: "progress-bar", children: _jsx("div", { className: "progress-fill", style: {
                                                width: `${stats.completionRate}%`,
                                                backgroundColor: getCompletionColor(stats.completionRate)
                                            } }) })] }) })] }), _jsxs("div", { className: "detailed-stats", children: [_jsx(Card, { title: "\uC77D\uAE30 \uD65C\uB3D9", className: "activity-card", children: _jsxs("div", { className: "activity-grid", children: [_jsxs("div", { className: "activity-item", children: [_jsx(BookOpen, { size: 24 }), _jsxs("div", { className: "activity-info", children: [_jsx("span", { className: "activity-number", children: stats.totalChapters }), _jsx("span", { className: "activity-label", children: "\uCD1D \uC77D\uC740 \uC7A5" })] })] }), _jsxs("div", { className: "activity-item", children: [_jsx(Clock, { size: 24 }), _jsxs("div", { className: "activity-info", children: [_jsx("span", { className: "activity-number", children: formatTime(stats.totalTime) }), _jsx("span", { className: "activity-label", children: "\uCD1D \uC77D\uAE30 \uC2DC\uAC04" })] })] }), _jsxs("div", { className: "activity-item", children: [_jsx(Star, { size: 24 }), _jsxs("div", { className: "activity-info", children: [_jsx("span", { className: "activity-number", children: stats.favoriteBook }), _jsx("span", { className: "activity-label", children: "\uAC00\uC7A5 \uB9CE\uC774 \uC77D\uC740 \uCC45" })] })] })] }) }), _jsxs(Card, { title: "\uC6D4\uBCC4 \uC9C4\uD589\uB960", className: "progress-card", children: [_jsxs("div", { className: "time-range-selector", children: [_jsx("button", { className: `time-btn ${timeRange === 'week' ? 'active' : ''}`, onClick: () => setTimeRange('week'), children: "\uC8FC\uAC04" }), _jsx("button", { className: `time-btn ${timeRange === 'month' ? 'active' : ''}`, onClick: () => setTimeRange('month'), children: "\uC6D4\uAC04" }), _jsx("button", { className: `time-btn ${timeRange === 'year' ? 'active' : ''}`, onClick: () => setTimeRange('year'), children: "\uC5F0\uAC04" })] }), _jsx("div", { className: "progress-chart", children: stats.monthlyProgress.map((month, index) => {
                                        const maxDays = Math.max(...stats.monthlyProgress.map(m => m.days));
                                        const percentage = (month.days / maxDays) * 100;
                                        return (_jsxs("div", { className: "progress-bar-item", children: [_jsx("div", { className: "bar-container", children: _jsx("div", { className: "progress-bar-fill", style: { height: `${percentage}%` } }) }), _jsx("span", { className: "bar-label", children: month.month }), _jsxs("span", { className: "bar-value", children: [month.days, "\uC77C"] })] }, month.month));
                                    }) })] })] }), _jsx("div", { className: "achievements", children: _jsx(Card, { title: "\uC131\uCDE8 \uBC30\uC9C0", className: "achievements-card", children: _jsxs("div", { className: "badges-grid", children: [_jsxs("div", { className: "badge earned", children: [_jsx("div", { className: "badge-icon", children: "\uD83C\uDFC6" }), _jsx("span", { className: "badge-name", children: "\uCCAB \uC77D\uAE30" }), _jsx("span", { className: "badge-desc", children: "\uCCAB \uC131\uACBD \uC77D\uAE30 \uC644\uB8CC" })] }), _jsxs("div", { className: "badge earned", children: [_jsx("div", { className: "badge-icon", children: "\uD83D\uDD25" }), _jsx("span", { className: "badge-name", children: "\uC5F0\uC18D \uC77D\uAE30" }), _jsx("span", { className: "badge-desc", children: "7\uC77C \uC5F0\uC18D \uC77D\uAE30" })] }), _jsxs("div", { className: "badge earned", children: [_jsx("div", { className: "badge-icon", children: "\uD83D\uDCD6" }), _jsx("span", { className: "badge-name", children: "\uCC45 \uC644\uC8FC" }), _jsx("span", { className: "badge-desc", children: "\uCCAB \uCC45 \uC644\uC8FC" })] }), _jsxs("div", { className: "badge", children: [_jsx("div", { className: "badge-icon", children: "\uD83C\uDFAF" }), _jsx("span", { className: "badge-name", children: "\uB9C8\uB77C\uD1A4" }), _jsx("span", { className: "badge-desc", children: "100\uC77C \uC5F0\uC18D \uC77D\uAE30" })] }), _jsxs("div", { className: "badge", children: [_jsx("div", { className: "badge-icon", children: "\u2B50" }), _jsx("span", { className: "badge-name", children: "\uC644\uBCBD\uC8FC\uC758" }), _jsx("span", { className: "badge-desc", children: "1\uB144 \uC644\uC8FC\uC728 100%" })] }), _jsxs("div", { className: "badge", children: [_jsx("div", { className: "badge-icon", children: "\uD83C\uDF1F" }), _jsx("span", { className: "badge-name", children: "\uC804\uBB38\uAC00" }), _jsx("span", { className: "badge-desc", children: "\uC131\uACBD \uC804\uCCB4 \uC77D\uAE30" })] })] }) }) }), _jsx("div", { className: "goals", children: _jsxs(Card, { title: "\uBAA9\uD45C \uC124\uC815", className: "goals-card", children: [_jsxs("div", { className: "goal-item", children: [_jsxs("div", { className: "goal-header", children: [_jsx("h4", { children: "\uC77C\uC77C \uC77D\uAE30 \uBAA9\uD45C" }), _jsx("span", { className: "goal-status", children: "\uC9C4\uD589 \uC911" })] }), _jsxs("div", { className: "goal-progress", children: [_jsx("div", { className: "goal-bar", children: _jsx("div", { className: "goal-fill", style: { width: '80%' } }) }), _jsx("span", { className: "goal-text", children: "8/10 \uC77C" })] })] }), _jsxs("div", { className: "goal-item", children: [_jsxs("div", { className: "goal-header", children: [_jsx("h4", { children: "\uC6D4\uAC04 \uC644\uC8FC\uC728 \uBAA9\uD45C" }), _jsx("span", { className: "goal-status", children: "\uB2EC\uC131!" })] }), _jsxs("div", { className: "goal-progress", children: [_jsx("div", { className: "goal-bar", children: _jsx("div", { className: "goal-fill", style: { width: '100%' } }) }), _jsx("span", { className: "goal-text", children: "78/75%" })] })] })] }) })] }) }));
};
export default Statistics;
