import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Card from '../components/Card'
import { Settings as SettingsIcon, User, Bell, Shield, Mail, Save, Check } from 'lucide-react'
import './Settings.css'

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
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (isLoggedIn && user) {
      // 사용자 설정 로드
      loadUserSettings()
    }
  }, [isLoggedIn, user])

  const loadUserSettings = async () => {
    try {
      // 실제로는 API에서 사용자 설정을 가져옴
      const userSettings = localStorage.getItem('userSettings')
      if (userSettings) {
        setSettings(JSON.parse(userSettings))
      }
    } catch (error) {
      console.error('설정 로드 실패:', error)
    }
  }

  const handleSettingChange = (key: keyof UserSettings, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // 실제로는 API에 설정 저장
      localStorage.setItem('userSettings', JSON.stringify(settings))
      
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('설정 저장 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="settings-page">
        <div className="container">
          <div className="login-required">
            <h2>로그인이 필요합니다</h2>
            <p>설정을 변경하려면 먼저 로그인해주세요.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="settings-page">
      <div className="container">
        <header className="settings-header">
          <h1>
            <SettingsIcon size={28} />
            설정
          </h1>
          <p>계정 및 개인정보 설정을 관리하세요</p>
        </header>

        <div className="settings-grid">
          {/* 개인정보 설정 */}
          <Card title="개인정보 설정" icon={<User size={20} />} className="settings-card">
            <div className="setting-group">
              <div className="setting-item">
                <div className="setting-info">
                  <h3>개인정보 처리방침 동의</h3>
                  <p>개인정보 수집 및 이용에 대한 동의입니다.</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.privacyConsent}
                    onChange={(e) => handleSettingChange('privacyConsent', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </Card>

          {/* 알림 설정 */}
          <Card title="알림 설정" icon={<Bell size={20} />} className="settings-card">
            <div className="setting-group">
              <div className="setting-item">
                <div className="setting-info">
                  <h3>읽기 알림</h3>
                  <p>매일 성경 읽기 시간을 알려드립니다.</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.notificationConsent}
                    onChange={(e) => handleSettingChange('notificationConsent', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </Card>

          {/* 마케팅 설정 */}
          <Card title="마케팅 설정" icon={<Mail size={20} />} className="settings-card">
            <div className="setting-group">
              <div className="setting-item">
                <div className="setting-info">
                  <h3>마케팅 정보 수신</h3>
                  <p>새로운 기능, 이벤트, 추천 콘텐츠에 대한 정보를 받아보세요.</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.marketingConsent}
                    onChange={(e) => handleSettingChange('marketingConsent', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </Card>

          {/* 보안 설정 */}
          <Card title="보안 설정" icon={<Shield size={20} />} className="settings-card">
            <div className="setting-group">
              <div className="setting-item">
                <div className="setting-info">
                  <h3>계정 보안</h3>
                  <p>비밀번호 변경 및 보안 설정을 관리하세요.</p>
                </div>
                <button className="security-btn">
                  보안 설정
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* 저장 버튼 */}
        <div className="settings-actions">
          <button 
            onClick={handleSave}
            disabled={loading}
            className={`save-btn ${saved ? 'saved' : ''}`}
          >
            {loading ? (
              <>
                <SettingsIcon size={20} className="spinning" />
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
