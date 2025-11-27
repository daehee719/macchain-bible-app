import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Sidebar from './Sidebar';
import Topbar from './Topbar';
const Layout = ({ children }) => {
    return (_jsx("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: _jsxs("div", { className: "flex", children: [_jsx(Sidebar, {}), _jsxs("div", { className: "flex-1", children: [_jsx(Topbar, {}), _jsx("main", { className: "p-6 max-w-7xl mx-auto", children: children })] })] }) }));
};
export default Layout;
