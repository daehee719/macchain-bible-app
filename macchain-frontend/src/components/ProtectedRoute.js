import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loading } from './Loading';
const ProtectedRoute = ({ children }) => {
    const { isLoggedIn, loading } = useAuth();
    if (loading) {
        return _jsx(Loading, { size: "lg", text: "\uC778\uC99D \uD655\uC778 \uC911...", fullScreen: true });
    }
    if (!isLoggedIn) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    return _jsx(_Fragment, { children: children });
};
export default ProtectedRoute;
