import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const PageHeader = ({ title, description, icon, action, }) => {
    return (_jsxs("div", { className: "mb-8 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center", children: [icon && (_jsx("div", { className: "text-4xl mr-4 text-blue-500 dark:text-blue-400", children: icon })), _jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-white", children: title }), description && (_jsx("p", { className: "text-gray-600 dark:text-gray-400 mt-1", children: description }))] })] }), action && (_jsx("div", { className: "ml-4", children: action }))] }));
};
