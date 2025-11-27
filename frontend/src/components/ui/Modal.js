import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import Button from './Button';
export default function Modal({ title, open, onClose, children }) {
    const dialogRef = React.useRef(null);
    const previouslyFocused = React.useRef(null);
    React.useEffect(() => {
        if (!open)
            return;
        previouslyFocused.current = document.activeElement;
        const firstFocusable = dialogRef.current?.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        firstFocusable?.focus();
        const onKey = (e) => {
            if (e.key === 'Escape')
                onClose();
        };
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('keydown', onKey);
            previouslyFocused.current?.focus();
        };
    }, [open, onClose]);
    if (!open)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black/40 flex items-center justify-center z-50", role: "presentation", children: _jsxs("div", { ref: dialogRef, role: "dialog", "aria-modal": "true", "aria-labelledby": title ? 'modal-title' : undefined, className: "w-[92%] max-w-2xl bg-white dark:bg-gray-800 rounded-lg p-4", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h3", { id: "modal-title", className: "text-lg font-semibold m-0", children: title }), _jsx(Button, { onClick: onClose, "aria-label": "Close modal", children: "\u2715" })] }), _jsx("div", { className: "mt-3", children: children })] }) }));
}
