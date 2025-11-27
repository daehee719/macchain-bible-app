import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const variantStyles = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-800 dark:text-green-200',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200',
    danger: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-800 dark:text-red-200',
};
const titleStyles = {
    success: 'text-green-900 dark:text-green-100',
    info: 'text-blue-900 dark:text-blue-100',
    warning: 'text-yellow-900 dark:text-yellow-100',
    danger: 'text-red-900 dark:text-red-100',
};
export const Alert = ({ variant = 'info', title, children, onClose, className = '', }) => {
    return (_jsxs("div", { className: `border rounded-lg p-4 mb-4 flex justify-between items-start ${variantStyles[variant]} ${className || ''}`, role: "alert", children: [_jsxs("div", { className: "flex-1", children: [title && (_jsx("h3", { className: `font-medium mb-1 ${titleStyles[variant]}`, children: title })), _jsx("div", { className: "text-sm", children: children })] }), onClose && (_jsx("button", { onClick: onClose, className: "ml-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors", "aria-label": "Close alert", children: _jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z", clipRule: "evenodd" }) }) }))] }));
};
