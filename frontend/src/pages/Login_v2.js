import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import Button from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, UserPlus, Mail, Lock, User, BookOpen, Eye, EyeOff } from 'lucide-react';
const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
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
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            let success = false;
            if (isLogin) {
                success = await login(formData.email, formData.password);
            }
            else {
                if (!agreements.age) {
                    setError('14세 이상임을 동의해주세요.');
                    setLoading(false);
                    return;
                }
                success = await register(formData.email, formData.password, formData.name, formData.nickname);
            }
            if (success) {
                navigate('/');
            }
            else {
                setError(isLogin ? '로그인에 실패했습니다.' : '회원가입에 실패했습니다.');
            }
        }
        catch (err) {
            setError('오류가 발생했습니다. 다시 시도해주세요.');
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
    };
    const handleAgreementChange = (e) => {
        setAgreements(prev => ({
            ...prev,
            [e.target.name]: e.target.checked
        }));
    };
    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
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
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "w-full max-w-md", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "inline-flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mb-4", children: _jsx(BookOpen, { size: 24 }) }), _jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-white", children: "MacChain" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mt-2", children: "\uC131\uACBD \uC77D\uAE30\uC640 \uD568\uAED8\uD558\uB294 \uC601\uC801 \uC5EC\uC815" })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center", children: isLogin ? (_jsxs(_Fragment, { children: [_jsx(LogIn, { size: 24, className: "mr-2 text-blue-600" }), "\uB85C\uADF8\uC778"] })) : (_jsxs(_Fragment, { children: [_jsx(UserPlus, { size: 24, className: "mr-2 text-blue-600" }), "\uD68C\uC6D0\uAC00\uC785"] })) }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: isLogin
                                        ? '계정으로 로그인하여 성경 읽기를 시작하세요'
                                        : '새 계정을 만들고 성경 읽기 여정을 시작하세요' })] }), error && (_jsx(Alert, { variant: "danger", onClose: () => setError(''), className: "mb-6", children: error })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [!isLogin && (_jsxs(_Fragment, { children: [_jsx(Input, { label: "\uC774\uB984", type: "text", name: "name", placeholder: "\uC131\uBA85\uC744 \uC785\uB825\uD558\uC138\uC694", value: formData.name, onChange: handleInputChange, required: true, icon: _jsx(User, { size: 18 }) }), _jsx(Input, { label: "\uB2C9\uB124\uC784 (\uC120\uD0DD)", type: "text", name: "nickname", placeholder: "\uCEE4\uBBA4\uB2C8\uD2F0\uC5D0\uC11C \uD45C\uC2DC\uB420 \uC774\uB984", value: formData.nickname, onChange: handleInputChange, icon: _jsx(User, { size: 18 }) })] })), _jsx(Input, { label: "\uC774\uBA54\uC77C", type: "email", name: "email", placeholder: "example@email.com", value: formData.email, onChange: handleInputChange, required: true, icon: _jsx(Mail, { size: 18 }) }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "\uBE44\uBC00\uBC88\uD638" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: showPassword ? 'text' : 'password', name: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", value: formData.password, onChange: handleInputChange, required: true, className: "w-full px-4 py-2 pl-10 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors" }), _jsx(Lock, { size: 18, className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300", children: showPassword ? _jsx(EyeOff, { size: 18 }) : _jsx(Eye, { size: 18 }) })] })] }), !isLogin && (_jsxs("div", { className: "space-y-3 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 my-6", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", id: "age", name: "age", checked: agreements.age, onChange: handleAgreementChange, className: "w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer", required: true }), _jsx("label", { htmlFor: "age", className: "ml-3 text-sm cursor-pointer", children: _jsxs("span", { className: "font-medium text-gray-900 dark:text-white", children: ["14\uC138 \uC774\uC0C1\uC785\uB2C8\uB2E4 ", _jsx("span", { className: "text-red-500", children: "*" })] }) })] }), _jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", id: "privacy", name: "privacy", checked: agreements.privacy, onChange: handleAgreementChange, className: "w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer", required: true }), _jsx("label", { htmlFor: "privacy", className: "ml-3 text-sm cursor-pointer", children: _jsxs("span", { className: "text-gray-700 dark:text-gray-300", children: [_jsx(Link, { to: "/privacy", className: "text-blue-600 hover:text-blue-700", children: "\uAC1C\uC778\uC815\uBCF4\uCC98\uB9AC\uBC29\uCE68" }), "\uC5D0 \uB3D9\uC758\uD569\uB2C8\uB2E4 ", _jsx("span", { className: "text-red-500", children: "*" })] }) })] }), _jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", id: "marketing", name: "marketing", checked: agreements.marketing, onChange: handleAgreementChange, className: "w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer" }), _jsx("label", { htmlFor: "marketing", className: "ml-3 text-sm cursor-pointer", children: _jsx("span", { className: "text-gray-700 dark:text-gray-300", children: "\uB9C8\uCF00\uD305 \uC815\uBCF4 \uC218\uC2E0\uC5D0 \uB3D9\uC758\uD569\uB2C8\uB2E4" }) })] })] })), _jsx(Button, { type: "submit", variant: "primary", disabled: loading, className: "w-full mt-6", children: loading ? (_jsxs("span", { className: "flex items-center justify-center", children: [_jsxs("svg", { className: "animate-spin h-5 w-5 mr-2", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4", fill: "none" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), "\uCC98\uB9AC \uC911..."] })) : (isLogin ? '로그인' : '회원가입') })] }), _jsx("div", { className: "mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center", children: _jsxs("p", { className: "text-gray-600 dark:text-gray-400", children: [isLogin ? '계정이 없으신가요?' : '이미 계정이 있으신가요?', ' ', _jsx("button", { type: "button", onClick: toggleMode, className: "text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-colors", children: isLogin ? '회원가입' : '로그인' })] }) })] }), _jsx("div", { className: "text-center text-sm text-gray-600 dark:text-gray-400", children: _jsxs("p", { children: ["\uB85C\uADF8\uC778\uD558\uC9C0 \uC54A\uACE0\uB3C4", ' ', _jsx(Link, { to: "/", className: "text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold", children: "\uB300\uC2DC\uBCF4\uB4DC" }), "\uB97C \uBCFC \uC218 \uC788\uC2B5\uB2C8\uB2E4."] }) })] }) }));
};
export default Login;
