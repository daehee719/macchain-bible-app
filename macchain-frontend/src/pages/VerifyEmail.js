import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import { Mail, CheckCircle, XCircle, Loader, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
const VerifyEmail = () => {
    const navigate = useNavigate();
    const { user, isLoggedIn } = useAuth();
    const [status, setStatus] = useState('verifying');
    const [errorMessage, setErrorMessage] = useState('');
    const [userEmail, setUserEmail] = useState('');
    useEffect(() => {
        let isMounted = true;
        let timeoutId;
        // URL 해시에서 파라미터 확인
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const error = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');
        const accessToken = hashParams.get('access_token');
        const type = hashParams.get('type');
        // 에러가 있는 경우 즉시 처리
        if (error) {
            console.error('Email verification error:', error, errorDescription);
            if (error === 'expired_token' || error === 'token_expired') {
                setStatus('expired');
                setErrorMessage('인증 링크가 만료되었습니다. 새로운 인증 링크를 요청해주세요.');
            }
            else {
                setStatus('error');
                setErrorMessage(errorDescription || '이메일 인증 중 오류가 발생했습니다.');
            }
            return;
        }
        // 이미 로그인된 경우 (이미 인증 완료)
        if (isLoggedIn && user) {
            setUserEmail(user.email || '');
            setStatus('success');
            timeoutId = setTimeout(() => {
                if (isMounted) {
                    navigate('/');
                }
            }, 3000); // 3초 후 리다이렉트
            return;
        }
        // Supabase 인증 상태 변경 리스너 설정
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!isMounted)
                return;
            console.log('Auth state change:', event, session?.user?.email);
            if (event === 'SIGNED_IN' && session) {
                setUserEmail(session.user.email || '');
                setStatus('success');
                // URL 해시 정리 (보안상 이유로)
                window.history.replaceState(null, '', '/verify-email');
                timeoutId = setTimeout(() => {
                    if (isMounted) {
                        navigate('/');
                    }
                }, 3000); // 3초 후 리다이렉트
            }
            else if (event === 'TOKEN_REFRESHED' && session) {
                // 토큰이 갱신된 경우도 성공으로 처리
                setUserEmail(session.user.email || '');
                setStatus('success');
                window.history.replaceState(null, '', '/verify-email');
                timeoutId = setTimeout(() => {
                    if (isMounted) {
                        navigate('/');
                    }
                }, 3000);
            }
        });
        // 현재 세션 확인 (이미 처리되었을 수 있음)
        supabase.auth.getSession().then(({ data: { session }, error: sessionError }) => {
            if (!isMounted)
                return;
            if (sessionError) {
                console.error('Session error:', sessionError);
                // 세션 에러가 있어도 해시에 토큰이 있으면 인증 시도
                if (accessToken && type) {
                    // Supabase가 자동으로 처리하므로 대기
                    return;
                }
                setStatus('error');
                setErrorMessage('세션을 확인하는 중 오류가 발생했습니다.');
                return;
            }
            if (session && session.user) {
                setUserEmail(session.user.email || '');
                setStatus('success');
                window.history.replaceState(null, '', '/verify-email');
                timeoutId = setTimeout(() => {
                    if (isMounted) {
                        navigate('/');
                    }
                }, 3000);
            }
            else if (accessToken && type) {
                // 해시에 토큰이 있으면 Supabase가 자동으로 처리하므로 대기
                // 타임아웃 설정
                timeoutId = setTimeout(() => {
                    if (isMounted && status === 'verifying') {
                        setStatus('error');
                        setErrorMessage('인증 링크를 처리할 수 없습니다. 링크가 유효한지 확인해주세요.');
                    }
                }, 15000); // 15초 후 타임아웃
            }
            else {
                // 해시도 없고 세션도 없는 경우
                setStatus('error');
                setErrorMessage('인증 링크가 올바르지 않습니다. 이메일에서 링크를 다시 확인해주세요.');
            }
        });
        return () => {
            isMounted = false;
            subscription.unsubscribe();
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [navigate, isLoggedIn, user, status]);
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 transition-colors", children: _jsxs("div", { className: "max-w-2xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs(Card, { className: "text-center", children: [status === 'verifying' && (_jsxs("div", { className: "py-12", children: [_jsx("div", { className: "flex justify-center mb-6", children: _jsxs("div", { className: "relative", children: [_jsx(Loader, { size: 80, className: "text-primary-600 dark:text-primary-400 animate-spin" }), _jsx(Mail, { size: 40, className: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary-600 dark:text-primary-400" })] }) }), _jsx("h1", { className: "text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4", children: "\uC774\uBA54\uC77C \uC778\uC99D \uC911..." }), _jsx("p", { className: "text-lg text-gray-600 dark:text-gray-300 mb-4", children: "\uC7A0\uC2DC\uB9CC \uAE30\uB2E4\uB824\uC8FC\uC138\uC694. \uC774\uBA54\uC77C \uC778\uC99D\uC744 \uCC98\uB9AC\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4." }), _jsx("div", { className: "flex justify-center", children: _jsxs("div", { className: "flex gap-2", children: [_jsx("div", { className: "w-2 h-2 bg-primary-500 rounded-full animate-bounce", style: { animationDelay: '0ms' } }), _jsx("div", { className: "w-2 h-2 bg-primary-500 rounded-full animate-bounce", style: { animationDelay: '150ms' } }), _jsx("div", { className: "w-2 h-2 bg-primary-500 rounded-full animate-bounce", style: { animationDelay: '300ms' } })] }) })] })), status === 'success' && (_jsxs("div", { className: "py-12", children: [_jsx("div", { className: "flex justify-center mb-6", children: _jsxs("div", { className: "relative", children: [_jsx("div", { className: "p-6 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 rounded-full animate-pulse", children: _jsx(CheckCircle, { size: 72, className: "text-green-600 dark:text-green-400" }) }), _jsx("div", { className: "absolute -top-2 -right-2", children: _jsx(Sparkles, { size: 32, className: "text-yellow-400 animate-bounce" }) })] }) }), _jsx("h1", { className: "text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4", children: "\uD83C\uDF89 \uC774\uBA54\uC77C \uC778\uC99D \uC644\uB8CC!" }), _jsx("p", { className: "text-xl text-gray-700 dark:text-gray-200 mb-2 font-semibold", children: "\uD658\uC601\uD569\uB2C8\uB2E4!" }), userEmail && (_jsxs("p", { className: "text-lg text-gray-600 dark:text-gray-300 mb-8", children: [_jsx("span", { className: "font-semibold text-primary-600 dark:text-primary-400", children: userEmail }), " \uACC4\uC815\uC774 \uC131\uACF5\uC801\uC73C\uB85C \uC778\uC99D\uB418\uC5C8\uC2B5\uB2C8\uB2E4."] })), _jsx("div", { className: "bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg p-6 mb-8", children: _jsxs("p", { className: "text-base text-gray-700 dark:text-gray-300", children: ["\uC774\uC81C MacChain\uC758 \uBAA8\uB4E0 \uAE30\uB2A5\uC744 \uC0AC\uC6A9\uD558\uC2E4 \uC218 \uC788\uC2B5\uB2C8\uB2E4.", _jsx("br", {}), _jsx("span", { className: "text-sm text-gray-500 dark:text-gray-400 mt-2 block", children: "\uC7A0\uC2DC \uD6C4 \uC790\uB3D9\uC73C\uB85C \uB300\uC2DC\uBCF4\uB4DC\uB85C \uC774\uB3D9\uD569\uB2C8\uB2E4..." })] }) }), _jsx("div", { className: "flex justify-center gap-4", children: _jsxs(Link, { to: "/", className: "inline-flex items-center px-8 py-4 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-xl hover:scale-105 transition-all text-lg", children: ["\uB300\uC2DC\uBCF4\uB4DC\uB85C \uC774\uB3D9", _jsx(ArrowRight, { size: 24, className: "ml-2" })] }) })] })), status === 'error' && (_jsxs("div", { className: "py-12", children: [_jsx("div", { className: "flex justify-center mb-6", children: _jsx("div", { className: "p-4 bg-red-100 dark:bg-red-900/30 rounded-full", children: _jsx(XCircle, { size: 64, className: "text-red-600 dark:text-red-400" }) }) }), _jsx("h1", { className: "text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4", children: "\uC778\uC99D \uC2E4\uD328" }), _jsx("p", { className: "text-lg text-gray-600 dark:text-gray-300 mb-2", children: errorMessage }), _jsxs("div", { className: "mt-8 space-y-4", children: [_jsxs(Link, { to: "/login", className: "inline-flex items-center px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all", children: ["\uB85C\uADF8\uC778 \uD398\uC774\uC9C0\uB85C \uC774\uB3D9", _jsx(ArrowRight, { size: 20, className: "ml-2" })] }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "\uBB38\uC81C\uAC00 \uACC4\uC18D\uB418\uBA74 \uC0C8\uB85C\uC6B4 \uC778\uC99D \uB9C1\uD06C\uB97C \uC694\uCCAD\uD574\uC8FC\uC138\uC694." })] })] })), status === 'expired' && (_jsxs("div", { className: "py-12", children: [_jsx("div", { className: "flex justify-center mb-6", children: _jsx("div", { className: "p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-full", children: _jsx(XCircle, { size: 64, className: "text-yellow-600 dark:text-yellow-400" }) }) }), _jsx("h1", { className: "text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4", children: "\uC778\uC99D \uB9C1\uD06C \uB9CC\uB8CC" }), _jsxs("p", { className: "text-lg text-gray-600 dark:text-gray-300 mb-8", children: ["\uC778\uC99D \uB9C1\uD06C\uAC00 \uB9CC\uB8CC\uB418\uC5C8\uC2B5\uB2C8\uB2E4.", _jsx("br", {}), "\uC0C8\uB85C\uC6B4 \uC778\uC99D \uB9C1\uD06C\uB97C \uC694\uCCAD\uD574\uC8FC\uC138\uC694."] }), _jsxs("div", { className: "space-y-4", children: [_jsxs(Link, { to: "/login", className: "inline-flex items-center px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all", children: ["\uB85C\uADF8\uC778 \uD398\uC774\uC9C0\uB85C \uC774\uB3D9", _jsx(ArrowRight, { size: 20, className: "ml-2" })] }), _jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "\uB85C\uADF8\uC778 \uD398\uC774\uC9C0\uC5D0\uC11C \"\uBE44\uBC00\uBC88\uD638 \uC7AC\uC124\uC815\" \uB610\uB294 \"\uC778\uC99D \uB9C1\uD06C \uC7AC\uC804\uC1A1\"\uC744 \uC694\uCCAD\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4." })] })] }))] }), _jsx("div", { className: "mt-8 text-center", children: _jsxs("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: ["\uB3C4\uC6C0\uC774 \uD544\uC694\uD558\uC2E0\uAC00\uC694?", ' ', _jsx(Link, { to: "/login", className: "text-primary-600 dark:text-primary-400 hover:underline", children: "\uB85C\uADF8\uC778 \uD398\uC774\uC9C0" }), "\uB85C \uB3CC\uC544\uAC00\uC138\uC694."] }) })] }) }));
};
export default VerifyEmail;
