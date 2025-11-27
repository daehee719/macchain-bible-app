import React, { useState } from 'react'
import { PageHeader } from '../components/ui/PageHeader'
import Card from '../components/Card'
import Button from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { ToggleLeft } from 'lucide-react'

const Settings: React.FC = () => {
  const [displayName, setDisplayName] = useState('')
  const [emailNotif, setEmailNotif] = useState(true)

  return (
    <div>
      <PageHeader title="설정" description="계정과 알림 설정을 관리하세요" icon={<ToggleLeft size={28} />} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">프로필</h3>
          <Input label="표시 이름" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="커뮤니티에 표시될 이름" />
          <div className="flex items-center justify-end">
            <Button variant="primary">저장</Button>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">알림</h3>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">이메일 알림</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">새 게시물 및 분석 알림 수신</div>
            </div>
            <label className="inline-flex items-center">
              <input type="checkbox" checked={emailNotif} onChange={() => setEmailNotif(v => !v)} className="form-checkbox h-5 w-5 text-blue-600" />
            </label>
          </div>
          <div className="flex items-center justify-end">
            <Button variant="primary">설정 저장</Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Settings
