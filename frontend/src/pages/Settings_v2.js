import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import Card from '../components/Card';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ToggleLeft } from 'lucide-react';
const Settings = () => {
    const [displayName, setDisplayName] = useState('');
    const [emailNotif, setEmailNotif] = useState(true);
    return (_jsxs("div", { children: [_jsx(PageHeader, { title: "\uC124\uC815", description: "\uACC4\uC815\uACFC \uC54C\uB9BC \uC124\uC815\uC744 \uAD00\uB9AC\uD558\uC138\uC694", icon: _jsx(ToggleLeft, { size: 28 }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsx("h3", { className: "text-sm font-medium text-gray-700 dark:text-gray-300 mb-3", children: "\uD504\uB85C\uD544" }), _jsx(Input, { label: "\uD45C\uC2DC \uC774\uB984", value: displayName, onChange: (e) => setDisplayName(e.target.value), placeholder: "\uCEE4\uBBA4\uB2C8\uD2F0\uC5D0 \uD45C\uC2DC\uB420 \uC774\uB984" }), _jsx("div", { className: "flex items-center justify-end", children: _jsx(Button, { variant: "primary", children: "\uC800\uC7A5" }) })] }), _jsxs(Card, { children: [_jsx("h3", { className: "text-sm font-medium text-gray-700 dark:text-gray-300 mb-3", children: "\uC54C\uB9BC" }), _jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { children: [_jsx("div", { className: "font-medium text-gray-900 dark:text-white", children: "\uC774\uBA54\uC77C \uC54C\uB9BC" }), _jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: "\uC0C8 \uAC8C\uC2DC\uBB3C \uBC0F \uBD84\uC11D \uC54C\uB9BC \uC218\uC2E0" })] }), _jsx("label", { className: "inline-flex items-center", children: _jsx("input", { type: "checkbox", checked: emailNotif, onChange: () => setEmailNotif(v => !v), className: "form-checkbox h-5 w-5 text-blue-600" }) })] }), _jsx("div", { className: "flex items-center justify-end", children: _jsx(Button, { variant: "primary", children: "\uC124\uC815 \uC800\uC7A5" }) })] })] })] }));
};
export default Settings;
