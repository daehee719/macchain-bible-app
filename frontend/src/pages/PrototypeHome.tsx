import React, { useState, useEffect } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import SmallChart from '../components/ui/SmallChart'
import Modal from '../components/ui/Modal'
import { apiService } from '../services/api'

export default function PrototypeHome() {
  const [todayPlan, setTodayPlan] = useState<any>(null)
  const [openModal, setOpenModal] = useState(false)
  const [chartData, setChartData] = useState<number[]>([2,3,4,2,5,6,4])

  useEffect(() => {
    let mounted = true
    apiService.getTodayPlan().then(res => {
      if (mounted) setTodayPlan(res)
    }).catch(() => {
      // fallback UI
    })
    return () => { mounted = false }
  }, [])

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Prototype Home (MVP)</h2>

      <Card title="오늘의 읽기 계획">
        {todayPlan?.readings?.length ? (
          todayPlan.readings.map((r: any) => (
            <div key={r.id} className="flex justify-between items-center py-2">
              <div>
                <div className="font-semibold">{r.book} {r.chapter}</div>
                <div className="text-sm text-gray-500">{r.verseStart} - {r.verseEnd}</div>
              </div>
              <div>
                <Button variant="ghost" onClick={() => setOpenModal(true)}>분석</Button>
              </div>
            </div>
          ))
        ) : (
          <div>불러오는 중 또는 계획이 없습니다.</div>
        )}
      </Card>

      <Card title="진행 통계">
        <div className="flex items-center gap-4">
          <div>
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm text-gray-500">연속 일수</div>
          </div>
          <SmallChart data={chartData} />
        </div>
      </Card>

      <Card title="빠른 액션">
        <div className="flex gap-3">
          <Button onClick={() => alert('동기화 실행')}>동기화</Button>
          <Button variant="secondary" onClick={() => alert('통계 보기')}>상세 통계</Button>
        </div>
      </Card>

      <Modal title="AI 원어 분석" open={openModal} onClose={() => setOpenModal(false)}>
        <p>간단한 AI 분석 모달 예시입니다. 실제로는 구절을 입력하고 분석을 수행합니다.</p>
        <Button onClick={() => alert('분석 요청')}>분석 요청</Button>
      </Modal>
    </div>
  )
}
