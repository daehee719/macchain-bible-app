import React from 'react'
import { PageHeader } from '../components/ui/PageHeader'
import { StatsCard } from '../components/ui/StatsCard'
import Card from '../components/Card'
import { BarChart2, TrendingUp } from 'lucide-react'
import Chart from '../components/ui/Chart'

const Statistics: React.FC = () => {
  const labels = ['1월', '2월', '3월', '4월', '5월', '6월']
  const datasets = [
    { label: '읽은 장 수', data: [30, 45, 60, 50, 70, 80], borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,0.12)' }
  ]

  return (
    <div>
      <PageHeader title="통계" description="읽기 통계와 성과를 확인하세요" icon={<TrendingUp size={28} />} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatsCard title="총 읽은 날" value={123} description="누적 읽기" icon={<BarChart2 size={20} />} trend={{ direction: 'up', percent: 8 }} />
        <StatsCard title="연속 읽기" value={12} description="스트릭" icon={<TrendingUp size={20} />} />
        <StatsCard title="완주율" value={'78%'} description="계획 완성도" icon={<TrendingUp size={20} />} />
      </div>

      <Card>
        <div className="p-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">주간 읽기 추이</h4>
          <Chart labels={labels} datasets={datasets} height={300} />
        </div>
      </Card>
    </div>
  )
}

export default Statistics
