import { jsx as _jsx } from "react/jsx-runtime";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, } from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);
export const Chart = ({ labels, datasets, height = 220 }) => {
    const data = {
        labels,
        datasets: datasets.map(ds => ({
            ...ds,
            tension: 0.3,
            fill: true,
            backgroundColor: ds.backgroundColor || 'rgba(37,99,235,0.08)'
        }))
    };
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            title: { display: false }
        },
        scales: {
            x: { grid: { display: false } },
            y: { grid: { color: 'rgba(0,0,0,0.05)' } }
        }
    };
    return (_jsx("div", { style: { height }, className: "w-full", children: _jsx(Line, { options: options, data: data }) }));
};
export default Chart;
