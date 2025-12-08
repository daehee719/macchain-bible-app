import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { callEdgeFunction } from '../lib/supabase';
import Card from '../components/Card';
import { LogIn, UserPlus, Mail, Lock, User, Loader, BookOpen, Brain, Users, BarChart3, XCircle } from 'lucide-react';
const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        nickname: ''
    });
    const [agreements, setAgreements] = useState({
        privacy: false,
        marketing: false,
        age: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const { login, register } = useAuth();
    const navigate = useNavigate();
    // 이메일 중복 검증 (Edge Function을 통해 auth.users와 public.users 모두 확인)
    const checkEmailExists = async (email) => {
        try {
            const result = await callEdgeFunction('check-email', { email });
            console.log('Email check result:', result);
            return result.exists || false;
        }
        catch (err) {
            console.error('Email check error:', err);
            // 에러 발생 시 false 반환 (확인 불가)
            return false;
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setFieldErrors({});
        try {
            if (isLogin) {
                // 로그인 모드
                if (!formData.email) {
                    setFieldErrors({ email: '이메일을 입력해주세요.' });
                    setLoading(false);
                    return;
                }
                if (!formData.password) {
                    setFieldErrors({ password: '비밀번호를 입력해주세요.' });
                    setLoading(false);
                    return;
                }
                const success = await login(formData.email, formData.password);
                if (success) {
                    navigate('/');
                }
                else {
                    setError('로그인에 실패했습니다.');
                }
            }
            else {
                // 회원가입 모드 - 필수 입력 검증
                const errors = {};
                if (!formData.name || formData.name.trim() === '') {
                    errors.name = '이름을 입력해주세요.';
                }
                if (!formData.email || formData.email.trim() === '') {
                    errors.email = '이메일을 입력해주세요.';
                }
                else {
                    // 이메일 형식 검증
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(formData.email)) {
                        errors.email = '올바른 이메일 형식을 입력해주세요.';
                    }
                }
                if (!formData.password || formData.password.trim() === '') {
                    errors.password = '비밀번호를 입력해주세요.';
                }
                else if (formData.password.length < 6) {
                    errors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
                }
                if (!agreements.privacy) {
                    errors.privacy = '개인정보 처리방침에 동의해주세요.';
                }
                if (!agreements.age) {
                    errors.age = '만 14세 이상임을 확인해주세요.';
                }
                // 필수 입력 검증 실패 시
                if (Object.keys(errors).length > 0) {
                    setFieldErrors(errors);
                    setLoading(false);
                    return;
                }
                // 이메일 중복 검증 (public.users 확인)
                const emailExistsInPublic = await checkEmailExists(formData.email);
                if (emailExistsInPublic) {
                    setFieldErrors({ email: '중복된 이메일입니다.' });
                    setError('중복된 이메일입니다. 다른 이메일을 사용해주세요.');
                    setLoading(false);
                    return;
                }
                // 회원가입 시도 (auth.users 확인은 회원가입 시도 시 Supabase 에러로 확인)
                try {
                    const result = await register(formData.email, formData.password, formData.name, formData.nickname);
                    console.log('Register result:', result);
                    if (result.success) {
                        navigate('/');
                    }
                    else {
                        // success가 false인 경우 기본적으로 에러 처리
                        if (result.isExistingUser === true) {
                            // 중복된 이메일
                            setFieldErrors({ email: '중복된 이메일입니다.' });
                            setError('중복된 이메일입니다. 다른 이메일을 사용해주세요.');
                        }
                        else if (result.isExistingUser === false) {
                            // 정상적인 새 회원가입 (이메일 확인 필요) - 성공 메시지
                            setError('회원가입이 완료되었습니다. 이메일을 확인해주세요.');
                        }
                        else {
                            // isExistingUser가 undefined인 경우 에러
                            setFieldErrors({ email: '회원가입 중 오류가 발생했습니다.' });
                            setError('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
                        }
                    }
                }
                catch (registerError) {
                    // register 함수에서 throw한 에러를 다시 throw하여 외부 catch 블록에서 처리
                    console.log('Register threw error:', registerError);
                    throw registerError;
                }
            }
        }
        catch (err) {
            console.error('Submit error:', err);
            // AuthContext에서 던진 에러 메시지 사용
            if (err instanceof Error) {
                const errorMessage = err.message;
                // 이메일 중복 에러인 경우
                if (errorMessage.includes('이미 사용 중인 이메일') || errorMessage.includes('중복된 이메일')) {
                    setFieldErrors({ email: '중복된 이메일입니다.' });
                    setError('중복된 이메일입니다. 다른 이메일을 사용해주세요.');
                }
                else {
                    setError(errorMessage);
                }
            }
            else {
                // Supabase 에러 객체인 경우
                const errorMsg = err?.message?.toLowerCase() || '';
                const errorCode = err?.code || err?.status || '';
                if (errorMsg.includes('already registered') ||
                    errorMsg.includes('already exists') ||
                    errorMsg.includes('user already registered') ||
                    errorMsg.includes('email address is already registered') ||
                    errorMsg.includes('email already registered') ||
                    errorCode === 'signup_disabled' ||
                    errorCode === 'user_already_exists') {
                    setFieldErrors({ email: '중복된 이메일입니다.' });
                    setError('중복된 이메일입니다. 다른 이메일을 사용해주세요.');
                }
                else {
                    setError(err?.message || '오류가 발생했습니다. 다시 시도해주세요.');
                }
            }
        }
        finally {
            setLoading(false);
        }
    };
    const handleInputChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        // 입력 시 해당 필드의 에러 메시지 제거
        if (fieldErrors[e.target.name]) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[e.target.name];
                return newErrors;
            });
        }
        setError('');
    };
    const handleAgreementChange = (e) => {
        setAgreements(prev => ({
            ...prev,
            [e.target.name]: e.target.checked
        }));
        // 체크박스 변경 시 해당 필드의 에러 메시지 제거
        if (fieldErrors[e.target.name]) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[e.target.name];
                return newErrors;
            });
        }
    };
    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setFieldErrors({});
        setFormData({
            email: '',
            password: '',
            name: '',
            nickname: ''
        });
        setAgreements({
            privacy: false,
            marketing: false,
            age: false
        });
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 transition-colors", children: _jsx("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8 items-center", children: [_jsxs("div", { className: "hidden lg:block space-y-8", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("div", { className: "p-3 bg-gradient-primary rounded-lg", children: _jsx(BookOpen, { size: 32, className: "text-white" }) }), _jsx("h1", { className: "text-4xl font-bold text-gray-900 dark:text-white", children: "MacChain" })] }), _jsx("p", { className: "text-xl text-gray-600 dark:text-gray-300 mb-8", children: "\uC131\uACBD \uC77D\uAE30\uC640 \uD568\uAED8\uD558\uB294 \uC601\uC801 \uC5EC\uC815" })] }), _jsxs("div", { className: "grid grid-cols-1 gap-6", children: [_jsxs("div", { className: "p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50", children: [_jsxs("div", { className: "flex items-center gap-4 mb-3", children: [_jsx("div", { className: "p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg", children: _jsx(Brain, { size: 24, className: "text-primary-600 dark:text-primary-400" }) }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: "AI \uC131\uACBD \uBD84\uC11D" })] }), _jsx("p", { className: "text-gray-600 dark:text-gray-300", children: "\uC77D\uC740 \uAD6C\uC808\uC5D0 \uB300\uD55C AI\uC758 \uAE4A\uC774 \uC788\uB294 \uBD84\uC11D\uC744 \uBC1B\uC544\uBCF4\uC138\uC694" })] }), _jsxs("div", { className: "p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50", children: [_jsxs("div", { className: "flex items-center gap-4 mb-3", children: [_jsx("div", { className: "p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg", children: _jsx(Users, { size: 24, className: "text-primary-600 dark:text-primary-400" }) }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: "\uCEE4\uBBA4\uB2C8\uD2F0" })] }), _jsx("p", { className: "text-gray-600 dark:text-gray-300", children: "\uB2E4\uB978 \uC131\uB3C4\uB4E4\uACFC \uC131\uACBD \uC77D\uAE30 \uACBD\uD5D8\uC744 \uACF5\uC720\uD558\uC138\uC694" })] }), _jsxs("div", { className: "p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50", children: [_jsxs("div", { className: "flex items-center gap-4 mb-3", children: [_jsx("div", { className: "p-3 bg-green-100 dark:bg-green-900/30 rounded-lg", children: _jsx(BarChart3, { size: 24, className: "text-green-600 dark:text-green-400" }) }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: "\uC0C1\uC138 \uD1B5\uACC4" })] }), _jsx("p", { className: "text-gray-600 dark:text-gray-300", children: "\uB098\uC758 \uC131\uACBD \uC77D\uAE30 \uC5EC\uC815\uC744 \uD1B5\uACC4\uB85C \uD655\uC778\uD558\uC138\uC694" })] })] })] }), _jsx("div", { children: _jsxs(Card, { className: "max-w-md mx-auto", children: [_jsxs("div", { className: "text-center mb-6", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-4", children: isLogin ? (_jsx(LogIn, { size: 32, className: "text-white" })) : (_jsx(UserPlus, { size: 32, className: "text-white" })) }), _jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: isLogin ? '로그인' : '회원가입' }), _jsx("p", { className: "text-gray-600 dark:text-gray-300 mt-2", children: isLogin ? 'MacChain에 오신 것을 환영합니다' : '새로운 계정을 만들어보세요' })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [!isLogin && (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsxs("div", { className: "relative", children: [_jsx(User, { size: 20, className: "absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" }), _jsx("input", { type: "text", name: "name", placeholder: "\uC774\uB984", value: formData.name, onChange: handleInputChange, className: `w-full pl-12 pr-4 py-3 border-2 ${fieldErrors.name
                                                                        ? 'border-red-300 dark:border-red-700'
                                                                        : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 outline-none transition-all` })] }), fieldErrors.name && (_jsxs("p", { className: "mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1", children: [_jsx(XCircle, { size: 14 }), fieldErrors.name] }))] }), _jsx("div", { children: _jsxs("div", { className: "relative", children: [_jsx(User, { size: 20, className: "absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" }), _jsx("input", { type: "text", name: "nickname", placeholder: "\uB2C9\uB124\uC784 (\uC120\uD0DD\uC0AC\uD56D)", value: formData.nickname, onChange: handleInputChange, className: "w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 outline-none transition-all" })] }) })] })), _jsxs("div", { children: [_jsxs("div", { className: "relative", children: [_jsx(Mail, { size: 20, className: "absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" }), _jsx("input", { type: "email", name: "email", placeholder: "\uC774\uBA54\uC77C", value: formData.email, onChange: handleInputChange, className: `w-full pl-12 pr-4 py-3 border-2 ${fieldErrors.email
                                                                ? 'border-red-300 dark:border-red-700'
                                                                : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 outline-none transition-all` })] }), fieldErrors.email && (_jsxs("p", { className: "mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1", children: [_jsx(XCircle, { size: 14 }), fieldErrors.email] }))] }), _jsxs("div", { children: [_jsxs("div", { className: "relative", children: [_jsx(Lock, { size: 20, className: "absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" }), _jsx("input", { type: "password", name: "password", placeholder: "\uBE44\uBC00\uBC88\uD638", value: formData.password, onChange: handleInputChange, className: `w-full pl-12 pr-4 py-3 border-2 ${fieldErrors.password
                                                                ? 'border-red-300 dark:border-red-700'
                                                                : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 outline-none transition-all` })] }), fieldErrors.password && (_jsxs("p", { className: "mt-1 text-sm text-red-600 dark:text-red-400 flex items-center gap-1", children: [_jsx(XCircle, { size: 14 }), fieldErrors.password] }))] }), !isLogin && (_jsxs("div", { className: "space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg", children: [_jsxs("div", { children: [_jsxs("label", { className: "flex items-start gap-3 cursor-pointer", children: [_jsx("input", { type: "checkbox", name: "privacy", checked: agreements.privacy, onChange: handleAgreementChange, className: `mt-1 w-4 h-4 text-primary-600 dark:text-primary-400 ${fieldErrors.privacy
                                                                        ? 'border-red-500 dark:border-red-500'
                                                                        : 'border-gray-300 dark:border-gray-600'} rounded focus:ring-primary-500 dark:focus:ring-primary-400` }), _jsxs("span", { className: "text-sm text-gray-700 dark:text-gray-300", children: [_jsx("a", { href: "/privacy", target: "_blank", className: "text-primary-600 hover:underline", children: "\uAC1C\uC778\uC815\uBCF4 \uCC98\uB9AC\uBC29\uCE68" }), "\uC5D0 \uB3D9\uC758\uD569\uB2C8\uB2E4 ", _jsx("span", { className: "text-red-500", children: "(\uD544\uC218)" })] })] }), fieldErrors.privacy && (_jsxs("p", { className: "mt-1 ml-7 text-sm text-red-600 dark:text-red-400 flex items-center gap-1", children: [_jsx(XCircle, { size: 14 }), fieldErrors.privacy] }))] }), _jsxs("label", { className: "flex items-start gap-3 cursor-pointer", children: [_jsx("input", { type: "checkbox", name: "marketing", checked: agreements.marketing, onChange: handleAgreementChange, className: "mt-1 w-4 h-4 text-primary-600 dark:text-primary-400 border-gray-300 dark:border-gray-600 rounded focus:ring-primary-500 dark:focus:ring-primary-400" }), _jsx("span", { className: "text-sm text-gray-700 dark:text-gray-300", children: "\uB9C8\uCF00\uD305 \uC815\uBCF4 \uC218\uC2E0\uC5D0 \uB3D9\uC758\uD569\uB2C8\uB2E4 (\uC120\uD0DD)" })] }), _jsxs("div", { children: [_jsxs("label", { className: "flex items-start gap-3 cursor-pointer", children: [_jsx("input", { type: "checkbox", name: "age", checked: agreements.age, onChange: handleAgreementChange, className: `mt-1 w-4 h-4 text-primary-600 dark:text-primary-400 ${fieldErrors.age
                                                                        ? 'border-red-500 dark:border-red-500'
                                                                        : 'border-gray-300 dark:border-gray-600'} rounded focus:ring-primary-500 dark:focus:ring-primary-400` }), _jsxs("span", { className: "text-sm text-gray-700 dark:text-gray-300", children: ["\uB9CC 14\uC138 \uC774\uC0C1\uC785\uB2C8\uB2E4 ", _jsx("span", { className: "text-red-500", children: "(\uD544\uC218)" })] })] }), fieldErrors.age && (_jsxs("p", { className: "mt-1 ml-7 text-sm text-red-600 dark:text-red-400 flex items-center gap-1", children: [_jsx(XCircle, { size: 14 }), fieldErrors.age] }))] })] })), error && (_jsx("div", { className: `p-4 rounded-lg ${error.includes('완료') && !error.includes('중복된 이메일')
                                                ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300'
                                                : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300'}`, children: error })), _jsx("button", { type: "submit", disabled: loading, className: "w-full px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2", children: loading ? (_jsxs(_Fragment, { children: [_jsx(Loader, { size: 20, className: "animate-spin" }), "\uCC98\uB9AC \uC911..."] })) : (isLogin ? '로그인' : '회원가입') })] }), _jsx("div", { className: "mt-6 text-center space-y-4", children: _jsxs("p", { className: "text-gray-600 dark:text-gray-300", children: [isLogin ? '아직 계정이 없으신가요?' : '이미 계정이 있으신가요?', _jsx("button", { type: "button", onClick: toggleMode, className: "ml-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold", children: isLogin ? '회원가입' : '로그인' })] }) })] }) })] }) }) }));
};
export default Login;
