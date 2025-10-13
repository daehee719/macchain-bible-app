import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import ReadingPlan from './pages/ReadingPlan';
import AIAnalysis from './pages/AIAnalysis';
import Community from './pages/Community';
import Statistics from './pages/Statistics';
import Login from './pages/Login';
import './App.css';
function App() {
    return (_jsx(AuthProvider, { children: _jsx(Router, { children: _jsxs("div", { className: "App", children: [_jsx(Header, {}), _jsx("main", { className: "main-content", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/reading-plan", element: _jsx(ReadingPlan, {}) }), _jsx(Route, { path: "/ai-analysis", element: _jsx(ProtectedRoute, { children: _jsx(AIAnalysis, {}) }) }), _jsx(Route, { path: "/community", element: _jsx(ProtectedRoute, { children: _jsx(Community, {}) }) }), _jsx(Route, { path: "/statistics", element: _jsx(ProtectedRoute, { children: _jsx(Statistics, {}) }) })] }) })] }) }) }));
}
export default App;
