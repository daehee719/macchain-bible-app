import Button from 'src/components/ui/Button';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Card = ({ title, description, icon, onClick, className = '', children }) => {
    const base = "bg-white rounded-xl p-6 border border-gray-100 shadow-sm transition-transform duration-150";
    const hover = onClick ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:bg-slate-50" : "hover:shadow-md";
    return (_jsxs("div", { className: `${base} ${hover} ${className}`.trim(), onClick: onClick, children: [icon && _jsx("div", { className: "flex items-center justify-center w-12 h-12 rounded-lg text-white mb-4 bg-gradient-to-br from-indigo-500 to-purple-600", children: icon }), _jsxs("div", { className: "flex-1", children: [title && _jsx("h3", { className: "text-lg font-semibold text-gray-800 mb-2", children: title }), description && _jsx("p", { className: "text-sm text-gray-600 mb-4", children: description }), children] })] }));
};
export default Card;
