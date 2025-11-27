import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
export const Input = React.forwardRef(({ label, error, icon, className = '', id, ...props }, ref) => {
    const reactId = React.useId();
    const inputId = id || `input-${reactId}`;
    const errorId = `${inputId}-error`;
    return (_jsxs("div", { className: "mb-4", children: [label && (_jsx("label", { htmlFor: inputId, className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: label })), _jsxs("div", { className: "relative", children: [icon && (_jsx("div", { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400", children: icon })), _jsx("input", { id: inputId, ref: ref, "aria-invalid": error ? true : undefined, "aria-describedby": error ? errorId : undefined, className: `w-full px-4 py-2 ${icon ? 'pl-10' : ''} border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 transition-colors ${error ? 'border-red-500 dark:border-red-400' : ''} ${className}`, ...props })] }), error && (_jsx("p", { id: errorId, className: "mt-1 text-sm text-red-600 dark:text-red-400", children: error }))] }));
});
Input.displayName = 'Input';
