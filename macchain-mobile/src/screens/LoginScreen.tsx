import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Switch, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Ionicons } from '@expo/vector-icons'
import Toast from 'react-native-toast-message'
import { useAuth } from '../contexts/AuthContext'
import { supabase, callEdgeFunction } from '../lib/supabase'

type RootStackParamList = {
  Login: undefined
  Dashboard: undefined
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    nickname: ''
  })
  const [agreements, setAgreements] = useState({
    privacy: false,
    marketing: false,
    age: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string
    email?: string
    password?: string
    privacy?: string
    age?: string
  }>({})
  
  const { login, register } = useAuth()

  const handleResetPassword = async () => {
    if (!formData.email) {
      setFieldErrors({ email: '이메일을 입력해주세요.' })
      return
    }
    try {
      setLoading(true)
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email)
      if (error) {
        throw error
      }
      Toast.show({
        type: 'success',
        text1: '비밀번호 재설정 메일을 전송했습니다.',
      })
    } catch (err: any) {
      console.error('Reset password error:', err)
      Toast.show({
        type: 'error',
        text1: '재설정 메일 전송에 실패했습니다.',
      })
    } finally {
      setLoading(false)
    }
  }

  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const result = await callEdgeFunction('check-email', { email })
      return result.exists || false
    } catch (err) {
      console.error('Email check error:', err)
      return false
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    setFieldErrors({})

    try {
      if (isLogin) {
        if (!formData.email) {
          setFieldErrors({ email: '이메일을 입력해주세요.' })
          setLoading(false)
          return
        }
        if (!formData.password) {
          setFieldErrors({ password: '비밀번호를 입력해주세요.' })
          setLoading(false)
          return
        }

        const success = await login(formData.email, formData.password)
        if (success) {
          navigation.replace('Dashboard')
        } else {
          setError('로그인에 실패했습니다.')
        }
      } else {
        const errors: typeof fieldErrors = {}
        
        if (!formData.name || formData.name.trim() === '') {
          errors.name = '이름을 입력해주세요.'
        }
        
        if (!formData.email || formData.email.trim() === '') {
          errors.email = '이메일을 입력해주세요.'
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(formData.email)) {
            errors.email = '올바른 이메일 형식을 입력해주세요.'
          }
        }
        
        if (!formData.password || formData.password.trim() === '') {
          errors.password = '비밀번호를 입력해주세요.'
        } else if (formData.password.length < 6) {
          errors.password = '비밀번호는 최소 6자 이상이어야 합니다.'
        }
        
        if (!agreements.privacy) {
          errors.privacy = '개인정보 처리방침에 동의해주세요.'
        }
        
        if (!agreements.age) {
          errors.age = '만 14세 이상임을 확인해주세요.'
        }

        if (Object.keys(errors).length > 0) {
          setFieldErrors(errors)
          setLoading(false)
          return
        }

        const emailExistsInPublic = await checkEmailExists(formData.email)
        if (emailExistsInPublic) {
          setFieldErrors({ email: '중복된 이메일입니다.' })
          setError('중복된 이메일입니다. 다른 이메일을 사용해주세요.')
          setLoading(false)
          return
        }

        try {
          const result = await register(
            formData.email, 
            formData.password, 
            formData.name, 
            formData.nickname
          )

          if (result.success) {
            navigation.replace('Dashboard')
          } else {
            if (result.isExistingUser === true) {
              setFieldErrors({ email: '중복된 이메일입니다.' })
              setError('중복된 이메일입니다. 다른 이메일을 사용해주세요.')
            } else if (result.isExistingUser === false) {
              setError('회원가입이 완료되었습니다. 이메일을 확인해주세요.')
            } else {
              setFieldErrors({ email: '회원가입 중 오류가 발생했습니다.' })
              setError('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.')
            }
          }
        } catch (registerError) {
          throw registerError
        }
      }
    } catch (err: any) {
      console.error('Submit error:', err)
      if (err instanceof Error) {
        const errorMessage = err.message
        if (errorMessage.includes('이미 사용 중인 이메일') || errorMessage.includes('중복된 이메일')) {
          setFieldErrors({ email: '중복된 이메일입니다.' })
          setError('중복된 이메일입니다. 다른 이메일을 사용해주세요.')
        } else {
          setError(errorMessage)
        }
      } else {
        const errorMsg = err?.message?.toLowerCase() || ''
        if (errorMsg.includes('already registered') || errorMsg.includes('already exists')) {
          setFieldErrors({ email: '중복된 이메일입니다.' })
          setError('중복된 이메일입니다. 다른 이메일을 사용해주세요.')
        } else {
          setError(err?.message || '오류가 발생했습니다. 다시 시도해주세요.')
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    if (fieldErrors[field as keyof typeof fieldErrors]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field as keyof typeof fieldErrors]
        return newErrors
      })
    }
    setError('')
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError('')
    setFieldErrors({})
    setFormData({
      email: '',
      password: '',
      name: '',
      nickname: ''
    })
    setAgreements({
      privacy: false,
      marketing: false,
      age: false
    })
  }

  const isSuccessMessage = error.includes('완료') && !error.includes('중복된 이메일')

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons 
              name={isLogin ? 'log-in' : 'person-add'} 
              size={32} 
              color="#FFFFFF" 
            />
          </View>
          <Text style={styles.title}>
            {isLogin ? '로그인' : '회원가입'}
          </Text>
          <Text style={styles.subtitle}>
            {isLogin ? 'MacChain에 오신 것을 환영합니다' : '새로운 계정을 만들어보세요'}
          </Text>
        </View>

        <View style={styles.form}>
          {!isLogin && (
            <>
              <View style={styles.field}>
                <View style={[styles.inputContainer, fieldErrors.name && styles.inputError]}>
                  <Ionicons name="person" size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    placeholder="이름"
                    value={formData.name}
                    onChangeText={(value) => handleInputChange('name', value)}
                    style={styles.input}
                  />
                </View>
                {fieldErrors.name && (
                  <Text style={styles.errorText}>{fieldErrors.name}</Text>
                )}
              </View>
              
              <View style={styles.field}>
                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    placeholder="닉네임 (선택사항)"
                    value={formData.nickname}
                    onChangeText={(value) => handleInputChange('nickname', value)}
                    style={styles.input}
                  />
                </View>
              </View>
            </>
          )}

          <View style={styles.field}>
            <View style={[styles.inputContainer, fieldErrors.email && styles.inputError]}>
              <Ionicons name="mail" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                placeholder="이메일"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>
            {fieldErrors.email && (
              <Text style={styles.errorText}>{fieldErrors.email}</Text>
            )}
          </View>

          <View style={styles.field}>
            <View style={[styles.inputContainer, fieldErrors.password && styles.inputError]}>
              <Ionicons name="lock-closed" size={20} color="#9CA3AF" style={styles.inputIcon} />
              <TextInput
                placeholder="비밀번호"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry
                style={styles.input}
              />
            </View>
            {fieldErrors.password && (
              <Text style={styles.errorText}>{fieldErrors.password}</Text>
            )}
            {isLogin && (
              <TouchableOpacity 
                onPress={handleResetPassword}
                disabled={loading}
                style={styles.resetButton}
              >
                <Text style={styles.resetButtonText}>비밀번호 재설정 메일 보내기</Text>
              </TouchableOpacity>
            )}
          </View>

          {!isLogin && (
            <View style={styles.agreements}>
              <View style={styles.agreementItem}>
                <View style={styles.agreementRow}>
                  <Switch
                    value={agreements.privacy}
                    onValueChange={(value) => setAgreements(prev => ({ ...prev, privacy: value }))}
                    trackColor={{ false: '#D1D5DB', true: '#8B5CF6' }}
                  />
                  <Text style={styles.agreementText}>
                    개인정보 처리방침에 동의합니다 <Text style={styles.requiredText}>(필수)</Text>
                  </Text>
                </View>
                {fieldErrors.privacy && (
                  <Text style={[styles.errorText, styles.agreementError]}>{fieldErrors.privacy}</Text>
                )}
              </View>

              <View style={styles.agreementRow}>
                <Switch
                  value={agreements.marketing}
                  onValueChange={(value) => setAgreements(prev => ({ ...prev, marketing: value }))}
                  trackColor={{ false: '#D1D5DB', true: '#8B5CF6' }}
                />
                <Text style={styles.agreementText}>
                  마케팅 정보 수신에 동의합니다 (선택)
                </Text>
              </View>

              <View style={styles.agreementItem}>
                <View style={styles.agreementRow}>
                  <Switch
                    value={agreements.age}
                    onValueChange={(value) => setAgreements(prev => ({ ...prev, age: value }))}
                    trackColor={{ false: '#D1D5DB', true: '#8B5CF6' }}
                  />
                  <Text style={styles.agreementText}>
                    만 14세 이상입니다 <Text style={styles.requiredText}>(필수)</Text>
                  </Text>
                </View>
                {fieldErrors.age && (
                  <Text style={[styles.errorText, styles.agreementError]}>{fieldErrors.age}</Text>
                )}
              </View>
            </View>
          )}

          {error && (
            <View style={[styles.errorContainer, isSuccessMessage ? styles.successContainer : styles.errorContainerBg]}>
              <Text style={[styles.errorMessage, isSuccessMessage && styles.successMessage]}>
                {error}
              </Text>
            </View>
          )}

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>
                {isLogin ? '로그인' : '회원가입'}
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {isLogin ? '아직 계정이 없으신가요? ' : '이미 계정이 있으신가요? '}
              <Text 
                onPress={toggleMode}
                style={styles.footerLink}
              >
                {isLogin ? '회원가입' : '로그인'}
              </Text>
            </Text>
          </View>
        </View>
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
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    backgroundColor: '#8B5CF6',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    color: '#4B5563',
  },
  form: {
    gap: 16,
  },
  field: {
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#FCA5A5',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#111827',
    fontSize: 16,
  },
  errorText: {
    marginTop: 4,
    fontSize: 14,
    color: '#DC2626',
  },
  resetButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  resetButtonText: {
    fontSize: 14,
    color: '#8B5CF6',
  },
  agreements: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    gap: 12,
  },
  agreementItem: {
    marginBottom: 4,
  },
  agreementRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  agreementText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  requiredText: {
    color: '#DC2626',
  },
  agreementError: {
    marginLeft: 48,
    marginTop: 4,
  },
  errorContainer: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  errorContainerBg: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
  },
  successContainer: {
    backgroundColor: '#D1FAE5',
    borderColor: '#86EFAC',
  },
  errorMessage: {
    fontSize: 14,
    color: '#DC2626',
  },
  successMessage: {
    color: '#059669',
  },
  submitButton: {
    width: '100%',
    paddingVertical: 12,
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 18,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    color: '#4B5563',
  },
  footerLink: {
    color: '#8B5CF6',
    fontWeight: '600',
  },
})
