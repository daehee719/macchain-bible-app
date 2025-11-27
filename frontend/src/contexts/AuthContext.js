import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // 페이지 로드 시 저장된 토큰 확인
        const savedToken = localStorage.getItem('authToken');
        const savedUser = localStorage.getItem('user');
        if (savedToken && savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                setToken(savedToken);
                setUser(userData);
            }
            catch (error) {
                console.error('Failed to parse saved user data:', error);
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);
    const login = async (email, password) => {
        try {
            setLoading(true);
            // 실제 API 호출 (외부 Workers API로 일관되게 요청합니다)
            const data = await apiService.login(email, password);
            if (data && data.success && data.token && data.user) {
                setToken(data.token);
                setUser(data.user);
                // 로컬 스토리지에 저장
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                return true;
            }
            return false;
        }
        catch (error) {
            console.error('Login error:', error);
            // Mock 로그인 (개발용)
            if (email === 'test@example.com' && password === 'password') {
                const mockUser = {
                    id: '1',
                    email: 'test@example.com',
                    name: '테스트 사용자',
                    nickname: '테스터',
                    isActive: true
                };
                const mockToken = 'mock-jwt-token';
                setToken(mockToken);
                setUser(mockUser);
                localStorage.setItem('authToken', mockToken);
                localStorage.setItem('user', JSON.stringify(mockUser));
                return true;
            }
            return false;
        }
        finally {
            setLoading(false);
        }
    };
    const register = async (email, password, name, nickname) => {
        try {
            setLoading(true);
            // 실제 API 호출 (외부 Workers API로 일관되게 요청)
            const data = await apiService.register(email, password, name, nickname);
            if (data && data.success && data.token && data.user) {
                setToken(data.token);
                setUser(data.user);
                // 로컬 스토리지에 저장
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                return true;
            }
            return false;
        }
        catch (error) {
            console.error('Register error:', error);
            // Mock 회원가입 (개발용)
            const mockUser = {
                id: Date.now().toString(),
                email,
                name,
                nickname: nickname || name,
                isActive: true
            };
            const mockToken = 'mock-jwt-token';
            setToken(mockToken);
            setUser(mockUser);
            localStorage.setItem('authToken', mockToken);
            localStorage.setItem('user', JSON.stringify(mockUser));
            return true;
        }
        finally {
            setLoading(false);
        }
    };
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    };
    const value = {
        user,
        token,
        isLoggedIn: !!user && !!token,
        login,
        register,
        logout,
        loading
    };
    return (_jsx(AuthContext.Provider, { value: value, children: children }));
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
