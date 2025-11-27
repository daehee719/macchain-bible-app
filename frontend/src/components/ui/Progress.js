import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const variantStyles = {
    primary: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
};
export const Progress = ({ value, max = 100, label, showPercent = true, variant = 'primary', }) => {
    const percent = (value / max) * 100;
    return (_jsxs("div", { className: "mb-4", children: [(label || showPercent) && (_jsxs("div", { className: "flex items-center justify-between mb-2", children: [label && (_jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: label })), showPercent && (_jsxs("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: [Math.round(percent), "%"] }))] })), _jsx("div", { className: "w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden", children: _jsx("div", { className: `h-full rounded-full transition-all duration-500 ${variantStyles[variant]}`, style: { width: `${percent}%` } }) })] }));
};
