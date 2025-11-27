import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
const ThemeToggle = () => {
    const [dark, setDark] = useState(() => {
        try {
            return document.documentElement.classList.contains('dark');
        }
        catch {
            return false;
        }
    });
    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add('dark');
        }
        else {
            document.documentElement.classList.remove('dark');
        }
    }, [dark]);
    return (_jsx("button", { onClick: () => setDark((d) => !d), className: "px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-200", "aria-pressed": dark, children: dark ? '다크' : '라이트' }));
};
export default ThemeToggle;
