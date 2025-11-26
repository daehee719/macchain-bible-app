import Button from 'src/components/ui/Button';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string
  nickname?: string
  isActive: boolean
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string, nickname?: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 페이지 로드 시 저장된 토큰 확인
    const savedToken = localStorage.getItem('authToken')
    const savedUser = localStorage.getItem('user')
    
    if (savedToken && savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setToken(savedToken)
        setUser(userData)
      } catch (error) {
        console.error('Failed to parse saved user data:', error)
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
      }
    }
    
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      
      // 실제 API 호출
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('로그인 실패')
      }

      const data = await response.json()
      
      if (data.success && data.token && data.user) {
        setToken(data.token)
        setUser(data.user)
        
        // 로컬 스토리지에 저장
        localStorage.setItem('authToken', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        return true
      }
      
      return false
    } catch (error) {
      console.error('Login error:', error)
      
      // Mock 로그인 (개발용)
      if (email === 'test@example.com' && password === 'password') {
        const mockUser: User = {
          id: '1',
          email: 'test@example.com',
          name: '테스트 사용자',
          nickname: '테스터',
          isActive: true
        }
        
        const mockToken = 'mock-jwt-token'
        
        setToken(mockToken)
        setUser(mockUser)
        
        localStorage.setItem('authToken', mockToken)
        localStorage.setItem('user', JSON.stringify(mockUser))
        
        return true
      }
      
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (
    email: string, 
    password: string, 
    name: string, 
    nickname?: string
  ): Promise<boolean> => {
    try {
      setLoading(true)
      
      // 실제 API 호출
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password, 
          name, 
          nickname: nickname || name 
        }),
      })

      if (!response.ok) {
        throw new Error('회원가입 실패')
      }

      const data = await response.json()
      
      if (data.success && data.token && data.user) {
        setToken(data.token)
        setUser(data.user)
        
        // 로컬 스토리지에 저장
        localStorage.setItem('authToken', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        return true
      }
      
      return false
    } catch (error) {
      console.error('Register error:', error)
      
      // Mock 회원가입 (개발용)
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name,
        nickname: nickname || name,
        isActive: true
      }
      
      const mockToken = 'mock-jwt-token'
      
      setToken(mockToken)
      setUser(mockUser)
      
      localStorage.setItem('authToken', mockToken)
      localStorage.setItem('user', JSON.stringify(mockUser))
      
      return true
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  }

  const value: AuthContextType = {
    user,
    token,
    isLoggedIn: !!user && !!token,
    login,
    register,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
