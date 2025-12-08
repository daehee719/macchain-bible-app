import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Card = ({ title, description, icon, onClick, className = '', children }) => {
    return (_jsxs("div", { className: `
        bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 hover:shadow-xl dark:hover:shadow-gray-900 transition-all duration-300
        ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''}
        ${className}
      `, onClick: onClick, children: [(icon || title || description) && (_jsxs("div", { className: "p-6 border-b border-gray-100 dark:border-gray-700", children: [icon && (_jsx("div", { className: "mb-3 inline-flex p-3 bg-gradient-primary rounded-lg text-white", children: icon })), title && (_jsx("h3", { className: "text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2", children: title })), description && (_jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: description }))] })), children && (_jsx("div", { className: "p-6", children: children }))] }));
};
export default Card;
