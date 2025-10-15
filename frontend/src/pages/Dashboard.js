import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import { Brain, Users, Calendar, TrendingUp } from 'lucide-react';
import { apiService } from '../services/api';
import './Dashboard.css';
const Dashboard = () => {
    const { isLoggedIn } = useAuth();
    const [todayReading, setTodayReading] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchTodayPlan = async () => {
            try {
                setLoading(true);
                const plan = await apiService.getTodayPlan();
                setTodayReading(plan);
            }
            catch (err) {
                setError('오늘의 읽기 계획을 불러오는데 실패했습니다.');
                console.error('Error fetching today plan:', err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchTodayPlan();
    }, []);
    const stats = {
        totalDays: 45,
        streak: 12,
        completionRate: 78
    };
    return (_jsx("div", { className: "dashboard", children: _jsxs("div", { className: "container", children: [_jsxs("header", { className: "dashboard-header", children: [_jsx("h1", { children: "MacChain \uC131\uACBD \uC77D\uAE30" }), _jsx("p", { children: "\uB9E4\uC77C \uD568\uAED8\uD558\uB294 \uC131\uACBD \uC77D\uAE30 \uC5EC\uD589" })] }), _jsxs("div", { className: "dashboard-grid", children: [_jsx(Card, { title: "\uC624\uB298\uC758 \uC77D\uAE30 \uACC4\uD68D", description: loading ? "로딩 중..." : error ? "오류 발생" : `${todayReading?.date} - McCheyne 읽기 계획`, icon: _jsx(Calendar, { size: 24 }), className: "today-reading", children: loading ? (_jsx("div", { className: "loading", children: "\uC77D\uAE30 \uACC4\uD68D\uC744 \uBD88\uB7EC\uC624\uB294 \uC911..." })) : error ? (_jsx("div", { className: "error", children: error })) : todayReading ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "reading-list", children: todayReading.readings.map((reading) => (_jsxs("div", { className: "reading-item", children: [_jsxs("span", { className: "passage", children: [reading.book, " ", reading.chapter, ":", reading.verseStart, "-", reading.verseEnd] }), _jsx("div", { className: "progress-bar", children: _jsx("div", { className: "progress-fill", style: { width: '0%' } }) })] }, reading.id))) }), _jsx(Link, { to: "/reading-plan", className: "view-all-btn", children: "\uC804\uCCB4 \uACC4\uD68D \uBCF4\uAE30 \u2192" })] })) : (_jsx("div", { className: "no-data", children: "\uC77D\uAE30 \uACC4\uD68D\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4." })) }), _jsxs(Card, { title: "\uC77D\uAE30 \uD1B5\uACC4", description: "\uB098\uC758 \uC131\uACBD \uC77D\uAE30 \uD604\uD669", icon: _jsx(TrendingUp, { size: 24 }), className: "stats-card", children: [_jsxs("div", { className: "stats-grid", children: [_jsxs("div", { className: "stat-item", children: [_jsx("span", { className: "stat-number", children: stats.totalDays }), _jsx("span", { className: "stat-label", children: "\uCD1D \uC77D\uC740 \uB0A0" })] }), _jsxs("div", { className: "stat-item", children: [_jsx("span", { className: "stat-number", children: stats.streak }), _jsx("span", { className: "stat-label", children: "\uC5F0\uC18D \uC77D\uAE30" })] }), _jsxs("div", { className: "stat-item", children: [_jsxs("span", { className: "stat-number", children: [stats.completionRate, "%"] }), _jsx("span", { className: "stat-label", children: "\uC644\uC8FC\uC728" })] })] }), isLoggedIn && (_jsx(Link, { to: "/statistics", className: "view-all-btn", children: "\uC0C1\uC138 \uD1B5\uACC4 \uBCF4\uAE30 \u2192" }))] }), _jsxs(Card, { title: "AI \uC131\uACBD \uBD84\uC11D", description: "AI\uAC00 \uB3C4\uC640\uC8FC\uB294 \uC131\uACBD \uAD6C\uC808 \uBD84\uC11D", icon: _jsx(Brain, { size: 24 }), className: "feature-card", children: [_jsx("p", { children: "\uC77D\uC740 \uAD6C\uC808\uC5D0 \uB300\uD574 AI\uC758 \uB3C4\uC6C0\uC744 \uBC1B\uC544 \uB354 \uAE4A\uC774 \uC774\uD574\uD574\uBCF4\uC138\uC694." }), isLoggedIn ? (_jsx(Link, { to: "/ai-analysis", className: "feature-btn", children: "\uBD84\uC11D \uC2DC\uC791\uD558\uAE30" })) : (_jsx("p", { className: "login-required", children: "\uB85C\uADF8\uC778\uC774 \uD544\uC694\uD569\uB2C8\uB2E4" }))] }), _jsxs(Card, { title: "\uCEE4\uBBA4\uB2C8\uD2F0", description: "\uB2E4\uB978 \uC131\uB3C4\uB4E4\uACFC \uC18C\uD1B5\uD558\uBA70 \uC131\uC7A5\uD558\uAE30", icon: _jsx(Users, { size: 24 }), className: "feature-card", children: [_jsx("p", { children: "\uC131\uACBD \uC77D\uAE30 \uACBD\uD5D8\uC744 \uACF5\uC720\uD558\uACE0 \uB2E4\uB978 \uC131\uB3C4\uB4E4\uACFC \uAD50\uC81C\uD558\uC138\uC694." }), isLoggedIn ? (_jsx(Link, { to: "/community", className: "feature-btn", children: "\uCEE4\uBBA4\uB2C8\uD2F0 \uCC38\uC5EC\uD558\uAE30" })) : (_jsx("p", { className: "login-required", children: "\uB85C\uADF8\uC778\uC774 \uD544\uC694\uD569\uB2C8\uB2E4" }))] })] }), !isLoggedIn && (_jsxs("div", { className: "login-prompt", children: [_jsx("h3", { children: "\uB354 \uB9CE\uC740 \uAE30\uB2A5\uC744 \uC0AC\uC6A9\uD558\uB824\uBA74 \uB85C\uADF8\uC778\uD558\uC138\uC694" }), _jsx("p", { children: "AI \uBD84\uC11D, \uCEE4\uBBA4\uB2C8\uD2F0, \uC0C1\uC138 \uD1B5\uACC4 \uB4F1\uC758 \uAE30\uB2A5\uC744 \uC774\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4." }), _jsx(Link, { to: "/login", className: "login-btn", children: "\uB85C\uADF8\uC778\uD558\uAE30" })] }))] }) }));
};
export default Dashboard;
