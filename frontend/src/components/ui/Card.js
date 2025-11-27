import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function Card({ title, children }) {
    return (_jsxs("div", { className: "bg-white rounded-lg shadow-sm p-3 mb-3", role: "region", children: [title && _jsx("h3", { className: "text-base font-semibold mb-2", children: title }), _jsx("div", { children: children })] }));
}
