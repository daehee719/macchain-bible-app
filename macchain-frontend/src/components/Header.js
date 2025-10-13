import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Brain, Users, BarChart3, LogIn, LogOut } from 'lucide-react';
import './Header.css';
const Header = () => {
    const { user, isLoggedIn, logout } = useAuth();
    const location = useLocation();
    return (_jsx("header", { className: "header", children: _jsxs("div", { className: "header-container", children: [_jsxs(Link, { to: "/", className: "logo", children: [_jsx(BookOpen, { size: 24 }), _jsx("span", { children: "MacChain" })] }), _jsxs("nav", { className: "nav", children: [_jsx(Link, { to: "/", className: `nav-link ${location.pathname === '/' ? 'active' : ''}`, children: "\uB300\uC2DC\uBCF4\uB4DC" }), _jsx(Link, { to: "/reading-plan", className: `nav-link ${location.pathname === '/reading-plan' ? 'active' : ''}`, children: "\uC77D\uAE30 \uACC4\uD68D" }), isLoggedIn && (_jsxs(_Fragment, { children: [_jsxs(Link, { to: "/ai-analysis", className: `nav-link ${location.pathname === '/ai-analysis' ? 'active' : ''}`, children: [_jsx(Brain, { size: 16 }), "AI \uBD84\uC11D"] }), _jsxs(Link, { to: "/community", className: `nav-link ${location.pathname === '/community' ? 'active' : ''}`, children: [_jsx(Users, { size: 16 }), "\uCEE4\uBBA4\uB2C8\uD2F0"] }), _jsxs(Link, { to: "/statistics", className: `nav-link ${location.pathname === '/statistics' ? 'active' : ''}`, children: [_jsx(BarChart3, { size: 16 }), "\uD1B5\uACC4"] })] }))] }), _jsx("div", { className: "auth-section", children: isLoggedIn ? (_jsxs("div", { className: "user-info", children: [_jsx("span", { className: "user-name", children: user?.name || user?.email }), _jsxs("button", { onClick: logout, className: "logout-btn", children: [_jsx(LogOut, { size: 16 }), "\uB85C\uADF8\uC544\uC6C3"] })] })) : (_jsxs(Link, { to: "/login", className: "login-btn", children: [_jsx(LogIn, { size: 16 }), "\uB85C\uADF8\uC778"] })) })] }) }));
};
export default Header;
