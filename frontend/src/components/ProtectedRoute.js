import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
const ProtectedRoute = ({ children }) => {
    const { isLoggedIn, loading } = useAuth();
    if (loading) {
        return (_jsx("div", { className: "loading-container", children: _jsxs("div", { className: "loading-spinner", children: [_jsx("div", { className: "spinner" }), _jsx("p", { children: "\uB85C\uB529 \uC911..." })] }) }));
    }
    if (!isLoggedIn) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    return _jsx(_Fragment, { children: children });
};
export default ProtectedRoute;
