import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import ThemeToggle from './ThemeToggle';
import { User } from 'lucide-react';
const Topbar = () => {
    return (_jsx("header", { className: "bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex items-center justify-between h-16", children: [_jsx("div", {}), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx(ThemeToggle, {}), _jsxs("button", { className: "flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300", children: [_jsx(User, { size: 18 }), _jsx("span", { children: "Guest" })] })] })] }) }) }));
};
export default Topbar;
