import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { supabase, callEdgeFunction } from '../lib/supabase';
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    // Supabase 세션 확인 및 사용자 프로필 로드
    const loadUserProfile = async (supabaseUser) => {
        const startTime = Date.now();
        try {
            const queryStartTime = Date.now();
            // 타임아웃 처리 (10초)
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => {
                    reject(new Error('Query timeout after 10 seconds'));
                }, 10000);
            });
            const queryPromise = supabase
                .from('users')
                .select('*')
                .eq('id', supabaseUser.id)
                .single();
            const { data: profile, error } = await Promise.race([
                queryPromise,
                timeoutPromise
            ]);
            const queryDuration = Date.now() - queryStartTime;
            if (queryDuration > 500) {
                console.warn(`⚠️ Slow profile query: ${queryDuration}ms`);
            }
            if (error) {
                // 아직 프로필이 없는 경우(PGRST116)에는 이 시점에서 생성 시도
                if (error.code === 'PGRST116') {
                    console.log('User profile not found (PGRST116), creating on demand...');
                    try {
                        const { data: created, error: insertError } = await supabase
                            .from('users')
                            .insert({
                            id: supabaseUser.id,
                            email: supabaseUser.email,
                            name: supabaseUser.user_metadata?.name ||
                                supabaseUser.email,
                            nickname: supabaseUser.user_metadata?.nickname ||
                                supabaseUser.user_metadata?.name ||
                                supabaseUser.email,
                            is_active: true
                        })
                            .select('*')
                            .single();
                        if (insertError || !created) {
                            console.error('Failed to create user profile on demand:', insertError);
                            console.error('Insert error details:', JSON.stringify(insertError, null, 2));
                            return null;
                        }
                        console.log('User profile created successfully:', created.email);
                        return {
                            id: created.id,
                            email: created.email,
                            name: created.name,
                            nickname: created.nickname,
                            isActive: created.is_active
                        };
                    }
                    catch (insertErr) {
                        console.error('Error creating user profile on demand:', insertErr);
                        return null;
                    }
                }
                console.error('Failed to load user profile:', error);
                console.error('Error details:', JSON.stringify(error, null, 2));
                return null;
            }
            // 프로필이 정상적으로 로드됨
            if (!profile) {
                console.warn('Profile query returned no data');
                return null;
            }
            const totalDuration = Date.now() - startTime;
            if (totalDuration > 1000) {
                console.warn(`⚠️ Slow profile load: ${totalDuration}ms`);
            }
            return {
                id: profile.id,
                email: profile.email,
                name: profile.name,
                nickname: profile.nickname,
                isActive: profile.is_active
            };
        }
        catch (error) {
            const totalDuration = Date.now() - startTime;
            console.error(`❌ Error loading user profile (took ${totalDuration}ms):`, error);
            if (error?.message?.includes('timeout')) {
                console.error('Profile load timed out');
            }
            // 네트워크 에러인 경우 상세 정보 출력
            if (error?.message) {
                console.error('Error message:', error.message);
            }
            if (error?.code) {
                console.error('Error code:', error.code);
            }
            if (error?.stack) {
                console.error('Error stack:', error.stack);
            }
            return null;
        }
    };
    useEffect(() => {
        let isMounted = true;
        let isLoadingProfile = false;
        // 프로필 로드 헬퍼 함수 (중복 방지)
        const loadProfileIfNeeded = async (session) => {
            if (!session?.user || isLoadingProfile || !isMounted)
                return;
            isLoadingProfile = true;
            try {
                setToken(session.access_token);
                const profile = await loadUserProfile(session.user);
                if (profile && isMounted) {
                    setUser(profile);
                }
            }
            catch (error) {
                console.error('Failed to load profile:', error);
            }
            finally {
                isLoadingProfile = false;
            }
        };
        // Supabase 인증 상태 변경 리스너 (초기 세션과 변경 모두 처리)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!isMounted)
                return;
            if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
                if (session?.user) {
                    await loadProfileIfNeeded(session);
                }
            }
            else if (event === 'SIGNED_OUT') {
                setUser(null);
                setToken(null);
            }
            if (isMounted) {
                setLoading(false);
            }
        });
        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);
    const login = async (email, password) => {
        try {
            setLoading(true);
            // Supabase Auth를 통한 로그인
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            if (error) {
                console.error('Login error:', error);
                return false;
            }
            if (data.session?.user) {
                setToken(data.session.access_token);
                // 사용자 프로필 로드
                const profile = await loadUserProfile(data.session.user);
                if (profile) {
                    setUser(profile);
                    return true;
                }
            }
            return false;
        }
        catch (error) {
            console.error('Login error:', error);
            return false;
        }
        finally {
            setLoading(false);
        }
    };
    const register = async (email, password, name, nickname) => {
        try {
            setLoading(true);
            // Supabase Auth를 통한 회원가입
            // 이메일 인증 후 리다이렉트 URL 설정
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/verify-email`,
                    data: {
                        name,
                        nickname: nickname || name
                    }
                }
            });
            if (authError) {
                console.error('Register error:', authError);
                console.error('Register error details:', {
                    message: authError.message,
                    status: authError.status,
                    code: authError.code,
                    name: authError.name
                });
                // 이메일 중복 에러 처리 - Supabase의 다양한 에러 메시지 패턴 확인
                const errorMsg = authError.message?.toLowerCase() || '';
                const errorCode = authError.status || authError.code || '';
                if (errorMsg.includes('already registered') ||
                    errorMsg.includes('user already registered') ||
                    errorMsg.includes('already exists') ||
                    errorMsg.includes('email address is already registered') ||
                    errorMsg.includes('email already registered') ||
                    errorCode === 'signup_disabled' ||
                    errorCode === 'user_already_exists') {
                    console.error('이메일 중복 에러 감지:', errorMsg, errorCode);
                    throw new Error('이미 사용 중인 이메일입니다.');
                }
                throw new Error(authError.message || '회원가입에 실패했습니다.');
            }
            if (authData.user) {
                // 이메일이 이미 인증된 사용자인지 확인
                // email_confirmed_at이 있고 created_at이 오래 전이면 이미 존재하는 사용자일 가능성이 높음
                if (authData.user.email_confirmed_at) {
                    const createdAt = new Date(authData.user.created_at);
                    const now = new Date();
                    const timeDiff = now.getTime() - createdAt.getTime();
                    const minutesDiff = timeDiff / (1000 * 60);
                    // 1분 이내에 생성된 사용자는 새 사용자로 간주
                    // 그 외는 이미 존재하는 사용자로 간주
                    if (minutesDiff > 1) {
                        console.error('이미 존재하는 사용자 감지:', {
                            email: authData.user.email,
                            created_at: authData.user.created_at,
                            email_confirmed_at: authData.user.email_confirmed_at,
                            minutesDiff
                        });
                        throw new Error('중복된 이메일입니다.');
                    }
                }
                // 세션이 있으면 (이메일 확인 불필요) 바로 로그인 처리
                if (authData.session) {
                    setToken(authData.session.access_token);
                    // 프로필 로드 (없으면 자동 생성됨)
                    const profile = await loadUserProfile(authData.user);
                    if (profile) {
                        setUser(profile);
                        return { success: true, user: authData.user };
                    }
                    // 프로필이 없어도 세션은 있으므로 로그인 성공으로 처리
                    // (프로필은 loadUserProfile에서 자동 생성 시도했지만 실패한 경우)
                    // 세션만으로도 로그인 상태 유지
                    return { success: true, user: authData.user };
                }
                // 세션이 없으면 (이메일 확인 필요) false 반환하여
                // Login 페이지에서 안내 메시지 표시 가능하도록
                // Edge Function을 통해 auth.users와 public.users 둘 다 확인
                let isExistingUser = false;
                try {
                    const checkResult = await callEdgeFunction('check-email', { email });
                    isExistingUser = checkResult.exists || false;
                    console.log('Register result - no session (Edge Function check):', {
                        email: authData.user.email,
                        email_confirmed_at: authData.user.email_confirmed_at,
                        created_at: authData.user.created_at,
                        checkResult,
                        isExistingUser
                    });
                }
                catch (checkError) {
                    console.error('Edge Function check error:', checkError);
                    // Edge Function 호출 실패 시 기존 로직 사용
                    // 1. auth.users 확인: email_confirmed_at이 있으면 이미 존재하는 사용자
                    const isExistingInAuth = !!authData.user.email_confirmed_at;
                    // 2. public.users 확인: 직접 조회
                    const { data: existingUserInPublic } = await supabase
                        .from('users')
                        .select('id, email')
                        .eq('email', email.toLowerCase().trim())
                        .maybeSingle();
                    const isExistingInPublic = !!existingUserInPublic;
                    isExistingUser = isExistingInAuth || isExistingInPublic;
                    console.log('Register result - no session (fallback check):', {
                        email: authData.user.email,
                        isExistingInAuth,
                        isExistingInPublic,
                        isExistingUser
                    });
                }
                return { success: false, user: authData.user, isExistingUser };
            }
            // authData.user가 없는 경우 (이상한 상황)
            console.error('Register returned user data but no user object:', authData);
            return { success: false, isExistingUser: false };
        }
        catch (error) {
            console.error('Register error:', error);
            // 에러를 다시 throw하여 Login.tsx에서 처리할 수 있도록 함
            throw error;
        }
        finally {
            setLoading(false);
        }
    };
    const logout = async () => {
        try {
            await supabase.auth.signOut();
            setUser(null);
            setToken(null);
        }
        catch (error) {
            console.error('Logout error:', error);
            // 에러가 발생해도 로컬 상태는 초기화
            setUser(null);
            setToken(null);
        }
    };
    const value = useMemo(() => ({
        user,
        token,
        isLoggedIn: !!user && !!token,
        login,
        register,
        logout,
        loading
    }), [user, token, loading, login, register, logout]);
    return (_jsx(AuthContext.Provider, { value: value, children: children }));
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
