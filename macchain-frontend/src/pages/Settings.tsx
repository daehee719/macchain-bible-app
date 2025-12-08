import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Card from '../components/Card'
import { Settings as SettingsIcon, User, Bell, Shield, Mail, Save, Check, Loader, Image as ImageIcon, KeyRound } from 'lucide-react'
import { toast } from 'sonner'
import { apiService } from '../services/api'
import { supabase } from '../lib/supabase'
import { useQueryClient } from '@tanstack/react-query'

interface UserSettings {
  marketingConsent: boolean
  notificationConsent: boolean
  privacyConsent: boolean
}

const Settings: React.FC = () => {
  const { user, isLoggedIn } = useAuth()
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [settings, setSettings] = useState<UserSettings>({
    marketingConsent: false,
    notificationConsent: false,
    privacyConsent: true
  })
  const [userSettings, setUserSettings] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)

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

  const handleAvatarUpload = async (file: File) => {
    if (!user) {
      toast.error('로그인이 필요합니다.')
      return
    }
    try {
      setAvatarUploading(true)
      const ext = file.name.split('.').pop()
      const filePath = `${user.id}/${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      })
      if (uploadError) {
        if ((uploadError as any)?.message?.includes('bucket')) {
          toast.error('Storage 버킷(avatars)이 없습니다. Supabase에서 생성 후 다시 시도하세요.')
        } else {
          toast.error('프로필 이미지 업로드에 실패했습니다.')
        }
        return
      }

      const { data: publicData } = supabase.storage.from('avatars').getPublicUrl(filePath)
      const publicUrl = publicData?.publicUrl
      if (!publicUrl) {
        toast.error('이미지 URL을 가져오지 못했습니다.')
        return
      }

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      })
      if (updateError) {
        toast.error('프로필 이미지 정보를 저장하지 못했습니다.')
        return
      }

      // UI 반영
      setAvatarPreview(publicUrl)
      queryClient.setQueryData(['auth', 'user'], (prev: any) => {
        if (!prev) return prev
        return { ...prev, avatarUrl: publicUrl }
      })

      toast.success('프로필 이미지가 업데이트되었습니다.')
    } catch (error) {
      console.error('Avatar upload error:', error)
      toast.error('프로필 이미지 업로드 중 오류가 발생했습니다.')
    } finally {
      setAvatarUploading(false)
    }
  }

  const handleAvatarInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleAvatarUpload(file)
    }
  }

  const handleChangePassword = async () => {
    if (!user) {
      toast.error('로그인이 필요합니다.')
      return
    }
    if (!newPassword || newPassword.length < 6) {
      toast.error('비밀번호는 6자 이상이어야 합니다.')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다.')
      return
    }
    try {
      setPasswordSaving(true)
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) {
        throw error
      }
      toast.success('비밀번호가 변경되었습니다.')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      console.error('Password change error:', error)
      toast.error('비밀번호 변경에 실패했습니다.')
    } finally {
      setPasswordSaving(false)
    }
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
      toast.error('설정 저장 중 오류가 발생했습니다.')
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
          {/* 프로필 이미지 업로드 */}
          <Card title="프로필" icon={<ImageIcon size={20} />}>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-primary text-white flex items-center justify-center text-2xl font-bold overflow-hidden">
                {avatarPreview || user?.avatarUrl ? (
                  <img
                    src={avatarPreview || user?.avatarUrl}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  (user?.nickname?.[0] || user?.name?.[0] || 'P')
                )}
              </div>
              <div className="flex-1">
                <p className="text-gray-700 dark:text-gray-300 mb-2">프로필 이미지를 업로드하세요.</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={avatarUploading}
                    className="px-4 py-2 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {avatarUploading ? '업로드 중...' : '이미지 선택'}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarInputChange}
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">권장: 정사각형 이미지, 1MB 이하</p>
              </div>
            </div>
          </Card>

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

          {/* 비밀번호 변경 */}
          <Card title="비밀번호 변경" icon={<KeyRound size={20} />}>
            <div className="space-y-3">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="새 비밀번호 (6자 이상)"
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 outline-none transition-all"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="새 비밀번호 확인"
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 outline-none transition-all"
              />
              <button
                type="button"
                onClick={handleChangePassword}
                disabled={passwordSaving}
                className="w-full px-4 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {passwordSaving ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    변경 중...
                  </>
                ) : (
                  '비밀번호 변경'
                )}
              </button>
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
