import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Card from '../components/Card'
import { Settings as SettingsIcon, User, Bell, Shield, Mail, Save, Check, Loader } from 'lucide-react'
import { apiService } from '../services/api'

interface UserSettings {
  marketingConsent: boolean
  notificationConsent: boolean
  privacyConsent: boolean
}

const Settings: React.FC = () => {
  const { user, isLoggedIn } = useAuth()
  const [settings, setSettings] = useState<UserSettings>({
    marketingConsent: false,
    notificationConsent: false,
    privacyConsent: true
  })
  const [userSettings, setUserSettings] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (isLoggedIn && user) {
      loadUserSettings()
      loadUserConsents()
    }
  }, [isLoggedIn, user])

  const loadUserSettings = async () => {
    try {
      if (!user) return
      const settingsData = await apiService.getUserSettings(user.id)
      if (settingsData) {
        setUserSettings(settingsData)
      }
    } catch (error) {
      console.error('설정 로드 실패:', error)
    }
  }

  const loadUserConsents = async () => {
    try {
      if (!user) return
      setLoading(true)
      const consents = await apiService.getUserConsents(user.id)
      if (consents) {
        setSettings({
          marketingConsent: consents.marketing_consent || false,
          notificationConsent: consents.notification_consent || false,
          privacyConsent: consents.privacy_consent || true
        })
      }
    } catch (error) {
      console.error('동의 설정 로드 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSettingChange = (key: keyof UserSettings, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = async () => {
    if (!user) return
    
    setSaving(true)
    try {
      // 동의 설정 저장
      await apiService.updateUserConsents(user.id, {
        privacy_consent: settings.privacyConsent,
        marketing_consent: settings.marketingConsent,
        notification_consent: settings.notificationConsent
      })

      // 사용자 설정 저장 (알림 시간 등)
      if (userSettings) {
        await apiService.updateUserSettings(user.id, {
          notification_enabled: settings.notificationConsent,
          reminder_time: userSettings.reminder_time || '09:00',
          language: userSettings.language || 'ko',
          theme: userSettings.theme || 'light'
        })
      }
      
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('설정 저장 실패:', error)
      alert('설정 저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center py-12">
        <div className="max-w-md mx-auto px-4">
          <Card className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">로그인이 필요합니다</h2>
            <p className="text-gray-600 dark:text-gray-300">설정을 변경하려면 먼저 로그인해주세요.</p>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-4">
            <SettingsIcon size={32} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            설정
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            계정 및 개인정보 설정을 관리하세요
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* 개인정보 설정 */}
          <Card title="개인정보 설정" icon={<User size={20} />}>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">개인정보 처리방침 동의</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">개인정보 수집 및 이용에 대한 동의입니다.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  checked={settings.privacyConsent}
                  onChange={(e) => handleSettingChange('privacyConsent', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 dark:peer-checked:bg-primary-500"></div>
              </label>
            </div>
          </Card>

          {/* 알림 설정 */}
          <Card title="알림 설정" icon={<Bell size={20} />}>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">읽기 알림</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">매일 성경 읽기 시간을 알려드립니다.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  checked={settings.notificationConsent}
                  onChange={(e) => handleSettingChange('notificationConsent', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 dark:peer-checked:bg-primary-500"></div>
              </label>
            </div>
          </Card>

          {/* 마케팅 설정 */}
          <Card title="마케팅 설정" icon={<Mail size={20} />}>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">마케팅 정보 수신</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">새로운 기능, 이벤트, 추천 콘텐츠에 대한 정보를 받아보세요.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  checked={settings.marketingConsent}
                  onChange={(e) => handleSettingChange('marketingConsent', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 dark:peer-checked:bg-primary-500"></div>
              </label>
            </div>
          </Card>

          {/* 보안 설정 */}
          <Card title="보안 설정" icon={<Shield size={20} />}>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">계정 보안</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">비밀번호 변경 및 보안 설정을 관리하세요.</p>
              </div>
              <button className="px-4 py-2 bg-white dark:bg-gray-800 border-2 border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-300 rounded-lg font-medium hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:border-primary-400 dark:hover:border-primary-500 transition-all">
                보안 설정
              </button>
            </div>
          </Card>
        </div>

        {/* 저장 버튼 */}
        <div className="flex justify-center mt-8">
          <button 
            onClick={handleSave}
            disabled={saving || loading}
            className={`px-8 py-4 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              saved 
                ? 'bg-green-500 text-white' 
                : 'bg-gradient-primary text-white hover:shadow-lg hover:scale-105'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {saving ? (
              <>
                <Loader size={20} className="animate-spin" />
                저장 중...
              </>
            ) : saved ? (
              <>
                <Check size={20} />
                저장 완료!
              </>
            ) : (
              <>
                <Save size={20} />
                설정 저장
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings
