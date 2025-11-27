import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './Card.css';
const Card = ({ title, description, icon, onClick, className = '', children }) => {
    const handleKeyDown = (e) => {
        if (!onClick)
            return;
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
        }
    };
    return (_jsxs("div", { className: `card ${onClick ? 'clickable' : ''} ${className}`, onClick: onClick, role: onClick ? 'button' : undefined, tabIndex: onClick ? 0 : undefined, onKeyDown: handleKeyDown, children: [icon && _jsx("div", { className: "card-icon", children: icon }), _jsxs("div", { className: "card-content", children: [title && _jsx("h3", { className: "card-title", children: title }), description && _jsx("p", { className: "card-description", children: description }), children] })] }));
};
export default Card;
