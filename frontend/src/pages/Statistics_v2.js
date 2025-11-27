import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PageHeader } from '../components/ui/PageHeader';
import { StatsCard } from '../components/ui/StatsCard';
import Card from '../components/Card';
import { BarChart2, TrendingUp } from 'lucide-react';
import Chart from '../components/ui/Chart';
const Statistics = () => {
    const labels = ['1월', '2월', '3월', '4월', '5월', '6월'];
    const datasets = [
        { label: '읽은 장 수', data: [30, 45, 60, 50, 70, 80], borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,0.12)' }
    ];
    return (_jsxs("div", { children: [_jsx(PageHeader, { title: "\uD1B5\uACC4", description: "\uC77D\uAE30 \uD1B5\uACC4\uC640 \uC131\uACFC\uB97C \uD655\uC778\uD558\uC138\uC694", icon: _jsx(TrendingUp, { size: 28 }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-6", children: [_jsx(StatsCard, { title: "\uCD1D \uC77D\uC740 \uB0A0", value: 123, description: "\uB204\uC801 \uC77D\uAE30", icon: _jsx(BarChart2, { size: 20 }), trend: { direction: 'up', percent: 8 } }), _jsx(StatsCard, { title: "\uC5F0\uC18D \uC77D\uAE30", value: 12, description: "\uC2A4\uD2B8\uB9AD", icon: _jsx(TrendingUp, { size: 20 }) }), _jsx(StatsCard, { title: "\uC644\uC8FC\uC728", value: '78%', description: "\uACC4\uD68D \uC644\uC131\uB3C4", icon: _jsx(TrendingUp, { size: 20 }) })] }), _jsx(Card, { children: _jsxs("div", { className: "p-4", children: [_jsx("h4", { className: "text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "\uC8FC\uAC04 \uC77D\uAE30 \uCD94\uC774" }), _jsx(Chart, { labels: labels, datasets: datasets, height: 300 })] }) })] }));
};
export default Statistics;
