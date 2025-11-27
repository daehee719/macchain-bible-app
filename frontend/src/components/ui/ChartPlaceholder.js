import { jsx as _jsx } from "react/jsx-runtime";
export const ChartPlaceholder = ({ height = 220, children }) => {
    return (_jsx("div", { role: "img", "aria-label": "\uCC28\uD2B8 \uC790\uB9AC \uD45C\uC2DC\uC790", className: "w-full bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-lg flex items-center justify-center text-gray-400", style: { height }, children: children ?? _jsx("span", { children: "\uCC28\uD2B8 \uC790\uB9AC (\uCC28\uD2B8 \uB77C\uC774\uBE0C\uB7EC\uB9AC\uB85C \uAD50\uCCB4 \uC608\uC815)" }) }));
};
export default ChartPlaceholder;
