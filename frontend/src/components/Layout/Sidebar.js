import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Brain, Users, MessageSquare, BarChart3, Settings } from 'lucide-react';
const routes = [
    { to: '/', label: '대시보드', icon: _jsx(Home, { size: 18 }) },
    { to: '/reading-plan', label: '읽기 계획', icon: _jsx(BookOpen, { size: 18 }) },
    { to: '/ai-analysis', label: 'AI 분석', icon: _jsx(Brain, { size: 18 }) },
    { to: '/community', label: '커뮤니티', icon: _jsx(Users, { size: 18 }) },
    { to: '/discussions', label: '토론', icon: _jsx(MessageSquare, { size: 18 }) },
    { to: '/statistics', label: '통계', icon: _jsx(BarChart3, { size: 18 }) },
    { to: '/settings', label: '설정', icon: _jsx(Settings, { size: 18 }) },
];
const Sidebar = () => {
    return (_jsx("aside", { className: "w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-xl font-bold text-gray-900 dark:text-white", children: "MacChain" }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "\uC131\uACBD \uC77D\uAE30 \uB300\uC2DC\uBCF4\uB4DC" })] }), _jsx("nav", { className: "space-y-1", children: routes.map((r) => (_jsxs(NavLink, { to: r.to, end: true, className: ({ isActive }) => `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`, children: [_jsx("span", { className: "mr-3 text-gray-500 dark:text-gray-400", children: r.icon }), _jsx("span", { children: r.label })] }, r.to))) })] }) }));
};
export default Sidebar;
