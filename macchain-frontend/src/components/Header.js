import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { BookOpen, Brain, Users, BarChart3, Settings, LogIn, LogOut, Menu, X, Sun, Moon } from 'lucide-react';
const Header = () => {
    const { user, isLoggedIn, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navLinks = [
        { to: '/', label: '대시보드' },
        { to: '/reading-plan', label: '읽기 계획' },
    ];
    const authNavLinks = isLoggedIn ? [
        { to: '/ai-analysis', label: 'AI 분석', icon: Brain },
        { to: '/community', label: '커뮤니티', icon: Users },
        { to: '/statistics', label: '통계', icon: BarChart3 },
    ] : [];
    const isActive = (path) => location.pathname === path;
    return (_jsx("header", { className: "fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "flex items-center justify-between h-16 md:h-20", children: [_jsxs(Link, { to: "/", className: "flex items-center space-x-2 group", children: [_jsx("div", { className: "p-2 bg-gradient-primary rounded-lg group-hover:scale-110 transition-transform", children: _jsx(BookOpen, { size: 24, className: "text-white" }) }), _jsx("span", { className: "text-xl md:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent", children: "MacChain" })] }), _jsxs("nav", { className: "hidden md:flex items-center space-x-1", children: [navLinks.map((link) => (_jsx(Link, { to: link.to, className: `px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive(link.to)
                                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400'}`, children: link.label }, link.to))), authNavLinks.map((link) => (_jsxs(Link, { to: link.to, className: `px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1 ${isActive(link.to)
                                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400'}`, children: [_jsx(link.icon, { size: 16 }), _jsx("span", { children: link.label })] }, link.to)))] }), _jsxs("div", { className: "hidden md:flex items-center space-x-4", children: [_jsx("button", { onClick: toggleTheme, className: "p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all", "aria-label": "\uB2E4\uD06C\uBAA8\uB4DC \uD1A0\uAE00", children: theme === 'dark' ? (_jsx(Sun, { size: 20, className: "text-yellow-500" })) : (_jsx(Moon, { size: 20 })) }), isLoggedIn ? (_jsxs(_Fragment, { children: [_jsx(Link, { to: "/settings", className: `p-2 rounded-lg transition-all ${isActive('/settings')
                                                ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`, children: _jsx(Settings, { size: 20 }) }), _jsx("span", { className: "text-sm text-gray-700 dark:text-gray-300 font-medium", children: user?.name || user?.email }), _jsxs("button", { onClick: logout, className: "px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all", children: [_jsx(LogOut, { size: 18, className: "inline mr-1" }), "\uB85C\uADF8\uC544\uC6C3"] })] })) : (_jsxs(Link, { to: "/login", className: "px-6 py-2 bg-gradient-primary text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all flex items-center space-x-2", children: [_jsx(LogIn, { size: 18 }), _jsx("span", { children: "\uB85C\uADF8\uC778" })] }))] }), _jsxs("div", { className: "md:hidden flex items-center space-x-2", children: [_jsx("button", { onClick: toggleTheme, className: "p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all", "aria-label": "\uB2E4\uD06C\uBAA8\uB4DC \uD1A0\uAE00", children: theme === 'dark' ? (_jsx(Sun, { size: 20, className: "text-yellow-500" })) : (_jsx(Moon, { size: 20 })) }), _jsx("button", { onClick: () => setMobileMenuOpen(!mobileMenuOpen), className: "p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800", children: mobileMenuOpen ? _jsx(X, { size: 24 }) : _jsx(Menu, { size: 24 }) })] })] }), mobileMenuOpen && (_jsx("div", { className: "md:hidden py-4 border-t border-gray-200 dark:border-gray-700", children: _jsxs("nav", { className: "flex flex-col space-y-2", children: [navLinks.map((link) => (_jsx(Link, { to: link.to, onClick: () => setMobileMenuOpen(false), className: `px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${isActive(link.to)
                                    ? 'bg-primary-100 text-primary-700'
                                    : 'text-gray-700 hover:bg-gray-100'}`, children: _jsx("span", { children: link.label }) }, link.to))), authNavLinks.map((link) => {
                                const IconComponent = link.icon;
                                return (_jsxs(Link, { to: link.to, onClick: () => setMobileMenuOpen(false), className: `px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${isActive(link.to)
                                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`, children: [_jsx(IconComponent, { size: 18 }), _jsx("span", { children: link.label })] }, link.to));
                            }), isLoggedIn ? (_jsxs(_Fragment, { children: [_jsxs(Link, { to: "/settings", onClick: () => setMobileMenuOpen(false), className: `px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${isActive('/settings')
                                            ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`, children: [_jsx(Settings, { size: 18 }), _jsx("span", { children: "\uC124\uC815" })] }), _jsx("div", { className: "px-4 py-2 text-sm text-gray-700 dark:text-gray-300", children: user?.name || user?.email }), _jsxs("button", { onClick: () => {
                                            logout();
                                            setMobileMenuOpen(false);
                                        }, className: "px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all flex items-center space-x-2 text-left", children: [_jsx(LogOut, { size: 18 }), _jsx("span", { children: "\uB85C\uADF8\uC544\uC6C3" })] })] })) : (_jsx(Link, { to: "/login", onClick: () => setMobileMenuOpen(false), className: "px-4 py-2 bg-gradient-primary text-white rounded-lg font-medium text-center", children: "\uB85C\uADF8\uC778" }))] }) }))] }) }));
};
export default Header;
