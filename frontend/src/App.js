import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import ReadingPlan from './pages/ReadingPlan_v2';
import AIAnalysis from './pages/AIAnalysis_v2';
import Community from './pages/Community_v2';
import Discussion from './pages/Discussion_v2';
import Statistics from './pages/Statistics_v2';
import Settings from './pages/Settings_v2';
import Login from './pages/Login_v2';
import PrototypeHome from './pages/PrototypeHome';
import './App.css';
import './styles/tailwind.css';
function App() {
    return (_jsx(AuthProvider, { children: _jsx(Router, { children: _jsx(Layout, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/reading-plan", element: _jsx(ReadingPlan, {}) }), _jsx(Route, { path: "/prototype", element: _jsx(PrototypeHome, {}) }), _jsx(Route, { path: "/ai-analysis", element: _jsx(ProtectedRoute, { children: _jsx(AIAnalysis, {}) }) }), _jsx(Route, { path: "/community", element: _jsx(ProtectedRoute, { children: _jsx(Community, {}) }) }), _jsx(Route, { path: "/discussions", element: _jsx(Discussion, {}) }), _jsx(Route, { path: "/discussions/:id", element: _jsx(Discussion, {}) }), _jsx(Route, { path: "/statistics", element: _jsx(ProtectedRoute, { children: _jsx(Statistics, {}) }) }), _jsx(Route, { path: "/settings", element: _jsx(ProtectedRoute, { children: _jsx(Settings, {}) }) })] }) }) }) }));
}
export default App;
