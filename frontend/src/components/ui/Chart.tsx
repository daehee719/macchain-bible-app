import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

interface ChartProps {
  labels: string[]
  datasets: Array<{ label: string; data: number[]; borderColor?: string; backgroundColor?: string }>
  height?: number
}

export const Chart: React.FC<ChartProps> = ({ labels, datasets, height = 220 }) => {
  const data = {
    labels,
    datasets: datasets.map(ds => ({
      ...ds,
      tension: 0.3,
      fill: true,
      backgroundColor: ds.backgroundColor || 'rgba(37,99,235,0.08)'
    }))
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false as const,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: false }
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: 'rgba(0,0,0,0.05)' } }
    }
  }

  return (
    <div style={{ height }} className="w-full">
      <Line options={options} data={data} />
    </div>
  )
}

export default Chart
