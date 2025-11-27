import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Table({ columns, data, className = '' }) {
    return (_jsx("div", { className: `overflow-x-auto ${className}`, children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700", children: [_jsx("thead", { className: "bg-gray-50 dark:bg-gray-800", children: _jsx("tr", { children: columns.map((col) => (_jsx("th", { scope: "col", className: "px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider", children: col.header }, col.key))) }) }), _jsx("tbody", { className: "bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800", children: data.map((row, i) => (_jsx("tr", { className: "hover:bg-gray-50 dark:hover:bg-gray-800", children: columns.map((col) => (_jsx("td", { className: "px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200", children: col.render ? col.render(row) : // @ts-ignore
                                row[col.key] }, col.key))) }, i))) })] }) }));
}
export default Table;
