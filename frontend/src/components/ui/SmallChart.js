import { jsx as _jsx } from "react/jsx-runtime";
export default function SmallChart({ data, width = 120, height = 32 }) {
    if (!data || data.length === 0)
        return _jsx("svg", { width: width, height: height });
    const max = Math.max(...data);
    const min = Math.min(...data);
    const points = data.map((v, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((v - min) / (max - min || 1)) * height;
        return `${x},${y}`;
    }).join(' ');
    return (_jsx("svg", { width: width, height: height, viewBox: `0 0 ${width} ${height}`, preserveAspectRatio: "none", children: _jsx("polyline", { fill: "none", stroke: "#2563eb", strokeWidth: 2, points: points }) }));
}
