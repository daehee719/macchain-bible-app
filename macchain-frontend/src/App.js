import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import ReadingPlan from './pages/ReadingPlan';
import AIAnalysis from './pages/AIAnalysis';
import Community from './pages/Community';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';
function App() {
    return (_jsx(ThemeProvider, { children: _jsx(AuthProvider, { children: _jsx(Router, { children: _jsxs("div", { className: "min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors", children: [_jsx(Header, {}), _jsx("main", { className: "pt-20 min-h-screen", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/verify-email", element: _jsx(VerifyEmail, {}) }), _jsx(Route, { path: "/reading-plan", element: _jsx(ReadingPlan, {}) }), _jsx(Route, { path: "/ai-analysis", element: _jsx(ProtectedRoute, { children: _jsx(AIAnalysis, {}) }) }), _jsx(Route, { path: "/community", element: _jsx(ProtectedRoute, { children: _jsx(Community, {}) }) }), _jsx(Route, { path: "/statistics", element: _jsx(ProtectedRoute, { children: _jsx(Statistics, {}) }) }), _jsx(Route, { path: "/settings", element: _jsx(ProtectedRoute, { children: _jsx(Settings, {}) }) })] }) })] }) }) }) }));
}
export default App;
