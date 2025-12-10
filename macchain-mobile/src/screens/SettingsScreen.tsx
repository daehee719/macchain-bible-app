import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Switch, Image } from 'react-native'
import { useAuth } from '../contexts/AuthContext'
import { Ionicons } from '@expo/vector-icons'
import Toast from 'react-native-toast-message'
import { apiService } from '../services/api'
import { supabase } from '../lib/supabase'
import { useQueryClient } from '@tanstack/react-query'
import * as ImagePicker from 'expo-image-picker'
import { Loading } from '../components/Loading'
import Card from '../components/Card'

interface UserSettings {
  marketingConsent: boolean
  notificationConsent: boolean
  privacyConsent: boolean
}

export default function SettingsScreen() {
  const { user, isLoggedIn } = useAuth()
  const queryClient = useQueryClient()
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
      if (user.avatarUrl) {
        setAvatarPreview(user.avatarUrl)
      }
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

  const handleAvatarUpload = async () => {
    if (!user) {
      Toast.show({
        type: 'error',
        text1: '로그인이 필요합니다.',
      })
      return
    }

    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        Toast.show({
          type: 'error',
          text1: '이미지 접근 권한이 필요합니다.',
        })
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      })

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0]
        setAvatarUploading(true)

        // 이미지를 Base64로 변환하거나 직접 업로드
        const response = await fetch(asset.uri)
        const blob = await response.blob()
        const fileExt = asset.uri.split('.').pop()
        const fileName = `${user.id}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, blob, {
            cacheControl: '3600',
            upsert: true,
          })

        if (uploadError) {
          throw uploadError
        }

        const { data: publicUrlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath)
        
        const publicUrl = publicUrlData.publicUrl

        const { error: updateError } = await supabase.auth.updateUser({
          data: { avatar_url: publicUrl }
        })
        
        if (updateError) {
          Toast.show({
            type: 'error',
            text1: '프로필 이미지 정보를 저장하지 못했습니다.',
          })
          return
        }

        setAvatarPreview(publicUrl)
        queryClient.setQueryData(['auth', 'user'], (prev: any) => {
          if (!prev) return prev
          return { ...prev, avatarUrl: publicUrl }
        })

        Toast.show({
          type: 'success',
          text1: '프로필 이미지가 업데이트되었습니다.',
        })
      }
    } catch (error) {
      console.error('Avatar upload error:', error)
      Toast.show({
        type: 'error',
        text1: '프로필 이미지 업로드 중 오류가 발생했습니다.',
      })
    } finally {
      setAvatarUploading(false)
    }
  }

  const handleChangePassword = async () => {
    if (!user) {
      Toast.show({
        type: 'error',
        text1: '로그인이 필요합니다.',
      })
      return
    }
    if (!newPassword || newPassword.length < 6) {
      Toast.show({
        type: 'error',
        text1: '비밀번호는 6자 이상이어야 합니다.',
      })
      return
    }
    if (newPassword !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: '비밀번호가 일치하지 않습니다.',
      })
      return
    }
    try {
      setPasswordSaving(true)
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) {
        throw error
      }
      Toast.show({
        type: 'success',
        text1: '비밀번호가 변경되었습니다.',
      })
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      console.error('Password change error:', error)
      Toast.show({
        type: 'error',
        text1: '비밀번호 변경에 실패했습니다.',
      })
    } finally {
      setPasswordSaving(false)
    }
  }

  const handleSave = async () => {
    if (!user) return
    
    setSaving(true)
    try {
      await apiService.updateUserConsents(user.id, {
        privacy_consent: settings.privacyConsent,
        marketing_consent: settings.marketingConsent,
        notification_consent: settings.notificationConsent
      })

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
      
      Toast.show({
        type: 'success',
        text1: '설정이 저장되었습니다.',
      })
    } catch (error) {
      console.error('설정 저장 실패:', error)
      Toast.show({
        type: 'error',
        text1: '설정 저장 중 오류가 발생했습니다.',
      })
    } finally {
      setSaving(false)
    }
  }

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <View style={styles.loginPrompt}>
          <Text style={styles.loginPromptText}>설정을 변경하려면 먼저 로그인해주세요.</Text>
        </View>
      </View>
    )
  }

  if (loading) {
    return <Loading fullScreen text="설정을 불러오는 중..." />
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="settings" size={32} color="#8B5CF6" />
          <Text style={styles.title}>설정</Text>
          <Text style={styles.subtitle}>계정 및 개인정보 설정을 관리하세요</Text>
        </View>

        {/* Profile Image */}
        <Card title="프로필 이미지" icon={<Ionicons name="image" size={20} color="#8B5CF6" />} style={styles.card}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              {avatarPreview ? (
                <Image source={{ uri: avatarPreview }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={40} color="#9CA3AF" />
                </View>
              )}
              <TouchableOpacity
                onPress={handleAvatarUpload}
                disabled={avatarUploading}
                style={styles.avatarUploadButton}
              >
                {avatarUploading ? (
                  <Ionicons name="hourglass" size={16} color="#FFFFFF" />
                ) : (
                  <Ionicons name="camera" size={16} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.avatarHint}>최대 5MB, JPG, PNG</Text>
          </View>
        </Card>

        {/* Password Change */}
        <Card title="비밀번호 변경" icon={<Ionicons name="lock-closed" size={20} color="#8B5CF6" />} style={styles.card}>
          <View style={styles.passwordSection}>
            <View style={styles.inputField}>
              <Text style={styles.inputLabel}>새 비밀번호</Text>
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="새 비밀번호 (6자 이상)"
                secureTextEntry
                style={styles.input}
              />
            </View>
            <View style={styles.inputField}>
              <Text style={styles.inputLabel}>비밀번호 확인</Text>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="새 비밀번호 확인"
                secureTextEntry
                style={styles.input}
              />
            </View>
            <TouchableOpacity
              onPress={handleChangePassword}
              disabled={passwordSaving || !newPassword || newPassword !== confirmPassword}
              style={[styles.passwordButton, (passwordSaving || !newPassword || newPassword !== confirmPassword) && styles.passwordButtonDisabled]}
            >
              {passwordSaving ? (
                <Ionicons name="hourglass" size={18} color="#FFFFFF" />
              ) : (
                <Ionicons name="lock-closed" size={18} color="#FFFFFF" />
              )}
              <Text style={styles.passwordButtonText}>비밀번호 변경</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Privacy Settings */}
        <Card title="개인정보 설정" icon={<Ionicons name="person" size={20} color="#8B5CF6" />} style={styles.card}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>개인정보 처리방침 동의</Text>
              <Text style={styles.settingDescription}>개인정보 수집 및 이용에 대한 동의입니다.</Text>
            </View>
            <Switch
              value={settings.privacyConsent}
              onValueChange={(value) => handleSettingChange('privacyConsent', value)}
              trackColor={{ false: '#D1D5DB', true: '#8B5CF6' }}
            />
          </View>
        </Card>

        {/* Notification Settings */}
        <Card title="알림 설정" icon={<Ionicons name="notifications" size={20} color="#8B5CF6" />} style={styles.card}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>읽기 알림</Text>
              <Text style={styles.settingDescription}>매일 성경 읽기 시간을 알려드립니다.</Text>
            </View>
            <Switch
              value={settings.notificationConsent}
              onValueChange={(value) => handleSettingChange('notificationConsent', value)}
              trackColor={{ false: '#D1D5DB', true: '#8B5CF6' }}
            />
          </View>
        </Card>

        {/* Marketing Settings */}
        <Card title="마케팅 설정" icon={<Ionicons name="mail" size={20} color="#8B5CF6" />} style={styles.card}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>마케팅 정보 수신</Text>
              <Text style={styles.settingDescription}>새로운 기능, 이벤트, 추천 콘텐츠에 대한 정보를 받아보세요.</Text>
            </View>
            <Switch
              value={settings.marketingConsent}
              onValueChange={(value) => handleSettingChange('marketingConsent', value)}
              trackColor={{ false: '#D1D5DB', true: '#8B5CF6' }}
            />
          </View>
        </Card>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving || loading}
          style={[styles.saveButton, saved && styles.saveButtonSuccess, (saving || loading) && styles.saveButtonDisabled]}
        >
          {saving ? (
            <Ionicons name="hourglass" size={20} color="#FFFFFF" />
          ) : saved ? (
            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
          ) : (
            <Ionicons name="save" size={20} color="#FFFFFF" />
          )}
          <Text style={styles.saveButtonText}>
            {saving ? '저장 중...' : saved ? '저장 완료!' : '설정 저장'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF',
  },
  content: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  loginPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loginPromptText: {
    fontSize: 16,
    color: '#6B7280',
  },
  card: {
    marginBottom: 16,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  avatarUploadButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 999,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarHint: {
    fontSize: 12,
    color: '#6B7280',
  },
  passwordSection: {
    gap: 16,
  },
  inputField: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    padding: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#111827',
  },
  passwordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
  },
  passwordButtonDisabled: {
    opacity: 0.5,
  },
  passwordButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    marginTop: 8,
  },
  saveButtonSuccess: {
    backgroundColor: '#10B981',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
})

