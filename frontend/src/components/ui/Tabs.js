import { jsx as _jsx } from "react/jsx-runtime";
export const Tabs = ({ tabs, activeTab, onChange, className = '', }) => {
    const handleKeyDown = (e) => {
        const idx = tabs.findIndex(t => t.value === activeTab);
        if (e.key === 'ArrowRight') {
            const next = tabs[(idx + 1) % tabs.length];
            onChange(next.value);
        }
        else if (e.key === 'ArrowLeft') {
            const prev = tabs[(idx - 1 + tabs.length) % tabs.length];
            onChange(prev.value);
        }
    };
    return (_jsx("div", { className: `border-b border-gray-200 dark:border-gray-700 ${className}`, children: _jsx("div", { role: "tablist", "aria-label": "Tabs", className: "flex space-x-8", onKeyDown: handleKeyDown, children: tabs.map((tab, i) => {
                const selected = activeTab === tab.value;
                return (_jsx("button", { role: "tab", "aria-selected": selected, "aria-controls": `panel-${tab.value}`, id: `tab-${tab.value}`, tabIndex: selected ? 0 : -1, onClick: () => onChange(tab.value), className: `py-4 px-1 border-b-2 font-medium text-sm transition-colors ${selected
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'}`, children: tab.label }, tab.value));
            }) }) }));
};
