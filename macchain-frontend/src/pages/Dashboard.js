import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import { Brain, Users, Calendar, TrendingUp } from 'lucide-react';
import './Dashboard.css';
const Dashboard = () => {
    const { isLoggedIn } = useAuth();
    const todayReading = {
        date: new Date().toLocaleDateString('ko-KR'),
        passages: [
            { book: '창세기', chapter: 1, verse: '1-31' },
            { book: '마태복음', chapter: 1, verse: '1-17' },
            { book: '에스라', chapter: 1, verse: '1-11' },
            { book: '사도행전', chapter: 1, verse: '1-26' }
        ]
    };
    const stats = {
        totalDays: 45,
        streak: 12,
        completionRate: 78
    };
    return (_jsx("div", { className: "dashboard", children: _jsxs("div", { className: "container", children: [_jsxs("header", { className: "dashboard-header", children: [_jsx("h1", { children: "MacChain \uC131\uACBD \uC77D\uAE30" }), _jsx("p", { children: "\uB9E4\uC77C \uD568\uAED8\uD558\uB294 \uC131\uACBD \uC77D\uAE30 \uC5EC\uD589" })] }), _jsxs("div", { className: "dashboard-grid", children: [_jsxs(Card, { title: "\uC624\uB298\uC758 \uC77D\uAE30 \uACC4\uD68D", description: `${todayReading.date} - McCheyne 읽기 계획`, icon: _jsx(Calendar, { size: 24 }), className: "today-reading", children: [_jsx("div", { className: "reading-list", children: todayReading.passages.map((passage, index) => (_jsxs("div", { className: "reading-item", children: [_jsxs("span", { className: "passage", children: [passage.book, " ", passage.chapter, ":", passage.verse] }), _jsx("div", { className: "progress-bar", children: _jsx("div", { className: "progress-fill", style: { width: '0%' } }) })] }, index))) }), _jsx(Link, { to: "/reading-plan", className: "view-all-btn", children: "\uC804\uCCB4 \uACC4\uD68D \uBCF4\uAE30 \u2192" })] }), _jsxs(Card, { title: "\uC77D\uAE30 \uD1B5\uACC4", description: "\uB098\uC758 \uC131\uACBD \uC77D\uAE30 \uD604\uD669", icon: _jsx(TrendingUp, { size: 24 }), className: "stats-card", children: [_jsxs("div", { className: "stats-grid", children: [_jsxs("div", { className: "stat-item", children: [_jsx("span", { className: "stat-number", children: stats.totalDays }), _jsx("span", { className: "stat-label", children: "\uCD1D \uC77D\uC740 \uB0A0" })] }), _jsxs("div", { className: "stat-item", children: [_jsx("span", { className: "stat-number", children: stats.streak }), _jsx("span", { className: "stat-label", children: "\uC5F0\uC18D \uC77D\uAE30" })] }), _jsxs("div", { className: "stat-item", children: [_jsxs("span", { className: "stat-number", children: [stats.completionRate, "%"] }), _jsx("span", { className: "stat-label", children: "\uC644\uC8FC\uC728" })] })] }), isLoggedIn && (_jsx(Link, { to: "/statistics", className: "view-all-btn", children: "\uC0C1\uC138 \uD1B5\uACC4 \uBCF4\uAE30 \u2192" }))] }), _jsxs(Card, { title: "AI \uC131\uACBD \uBD84\uC11D", description: "AI\uAC00 \uB3C4\uC640\uC8FC\uB294 \uC131\uACBD \uAD6C\uC808 \uBD84\uC11D", icon: _jsx(Brain, { size: 24 }), className: "feature-card", children: [_jsx("p", { children: "\uC77D\uC740 \uAD6C\uC808\uC5D0 \uB300\uD574 AI\uC758 \uB3C4\uC6C0\uC744 \uBC1B\uC544 \uB354 \uAE4A\uC774 \uC774\uD574\uD574\uBCF4\uC138\uC694." }), isLoggedIn ? (_jsx(Link, { to: "/ai-analysis", className: "feature-btn", children: "\uBD84\uC11D \uC2DC\uC791\uD558\uAE30" })) : (_jsx("p", { className: "login-required", children: "\uB85C\uADF8\uC778\uC774 \uD544\uC694\uD569\uB2C8\uB2E4" }))] }), _jsxs(Card, { title: "\uCEE4\uBBA4\uB2C8\uD2F0", description: "\uB2E4\uB978 \uC131\uB3C4\uB4E4\uACFC \uC18C\uD1B5\uD558\uBA70 \uC131\uC7A5\uD558\uAE30", icon: _jsx(Users, { size: 24 }), className: "feature-card", children: [_jsx("p", { children: "\uC131\uACBD \uC77D\uAE30 \uACBD\uD5D8\uC744 \uACF5\uC720\uD558\uACE0 \uB2E4\uB978 \uC131\uB3C4\uB4E4\uACFC \uAD50\uC81C\uD558\uC138\uC694." }), isLoggedIn ? (_jsx(Link, { to: "/community", className: "feature-btn", children: "\uCEE4\uBBA4\uB2C8\uD2F0 \uCC38\uC5EC\uD558\uAE30" })) : (_jsx("p", { className: "login-required", children: "\uB85C\uADF8\uC778\uC774 \uD544\uC694\uD569\uB2C8\uB2E4" }))] })] }), !isLoggedIn && (_jsxs("div", { className: "login-prompt", children: [_jsx("h3", { children: "\uB354 \uB9CE\uC740 \uAE30\uB2A5\uC744 \uC0AC\uC6A9\uD558\uB824\uBA74 \uB85C\uADF8\uC778\uD558\uC138\uC694" }), _jsx("p", { children: "AI \uBD84\uC11D, \uCEE4\uBBA4\uB2C8\uD2F0, \uC0C1\uC138 \uD1B5\uACC4 \uB4F1\uC758 \uAE30\uB2A5\uC744 \uC774\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4." }), _jsx(Link, { to: "/login", className: "login-btn", children: "\uB85C\uADF8\uC778\uD558\uAE30" })] }))] }) }));
};
export default Dashboard;
