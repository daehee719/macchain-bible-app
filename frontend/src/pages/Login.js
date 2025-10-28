import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import { LogIn, UserPlus, Mail, Lock, User, Loader, BookOpen } from 'lucide-react';
import './Login.css';
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
    return (_jsx("div", { className: "login-page", children: _jsxs("div", { className: "login-container", children: [_jsxs("div", { className: "login-header", children: [_jsxs("div", { className: "login-header-left", children: [_jsx(BookOpen, { size: 24 }), _jsxs("div", { children: [_jsx("h1", { children: "MacChain" }), _jsx("p", { children: "\uC131\uACBD \uC77D\uAE30\uC640 \uD568\uAED8\uD558\uB294 \uC601\uC801 \uC5EC\uC815" })] })] }), _jsxs("div", { className: "login-nav", children: [_jsx(Link, { to: "/", children: "\uB300\uC2DC\uBCF4\uB4DC" }), _jsx(Link, { to: "/reading-plan", children: "\uC77D\uAE30 \uACC4\uD68D" }), _jsx(Link, { to: "/login", className: "active", children: "\u2192 \uB85C\uADF8\uC778" })] })] }), _jsx("div", { style: { maxWidth: '500px', margin: '0 auto' }, children: _jsxs(Card, { className: "login-card", children: [_jsx("div", { className: "login-card-header", children: _jsx("h2", { children: isLogin ? (_jsxs(_Fragment, { children: [_jsx(LogIn, { size: 24 }), "\uB85C\uADF8\uC778"] })) : (_jsxs(_Fragment, { children: [_jsx(UserPlus, { size: 24 }), "\uD68C\uC6D0\uAC00\uC785"] })) }) }), _jsxs("form", { onSubmit: handleSubmit, className: "login-form", children: [!isLogin && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "input-group", children: [_jsx(User, { size: 20, className: "input-icon" }), _jsx("input", { type: "text", name: "name", placeholder: "\uC774\uB984", value: formData.name, onChange: handleInputChange, required: !isLogin, className: "form-input" })] }), _jsxs("div", { className: "input-group", children: [_jsx(User, { size: 20, className: "input-icon" }), _jsx("input", { type: "text", name: "nickname", placeholder: "\uB2C9\uB124\uC784 (\uC120\uD0DD\uC0AC\uD56D)", value: formData.nickname, onChange: handleInputChange, className: "form-input" })] })] })), _jsxs("div", { className: "input-group", children: [_jsx(Mail, { size: 20, className: "input-icon" }), _jsx("input", { type: "email", name: "email", placeholder: "\uC774\uBA54\uC77C", value: formData.email, onChange: handleInputChange, required: true, className: "form-input" })] }), _jsxs("div", { className: "input-group", children: [_jsx(Lock, { size: 20, className: "input-icon" }), _jsx("input", { type: "password", name: "password", placeholder: "\uBE44\uBC00\uBC88\uD638", value: formData.password, onChange: handleInputChange, required: true, className: "form-input" })] }), !isLogin && (_jsxs("div", { className: "agreements-section", children: [_jsx("div", { className: "agreement-item required", children: _jsxs("label", { className: "agreement-label", children: [_jsx("input", { type: "checkbox", name: "privacy", checked: agreements.privacy, onChange: handleAgreementChange, required: true, className: "agreement-checkbox" }), _jsx("span", { className: "checkmark" }), _jsxs("span", { className: "agreement-text", children: [_jsx("a", { href: "/privacy", target: "_blank", className: "agreement-link", children: "\uAC1C\uC778\uC815\uBCF4 \uCC98\uB9AC\uBC29\uCE68" }), "\uC5D0 \uB3D9\uC758\uD569\uB2C8\uB2E4 (\uD544\uC218)"] })] }) }), _jsx("div", { className: "agreement-item", children: _jsxs("label", { className: "agreement-label", children: [_jsx("input", { type: "checkbox", name: "marketing", checked: agreements.marketing, onChange: handleAgreementChange, className: "agreement-checkbox" }), _jsx("span", { className: "checkmark" }), _jsx("span", { className: "agreement-text", children: "\uB9C8\uCF00\uD305 \uC815\uBCF4 \uC218\uC2E0\uC5D0 \uB3D9\uC758\uD569\uB2C8\uB2E4 (\uC120\uD0DD)" })] }) }), _jsx("div", { className: "agreement-item required", children: _jsxs("label", { className: "agreement-label", children: [_jsx("input", { type: "checkbox", name: "age", checked: agreements.age, onChange: handleAgreementChange, required: true, className: "agreement-checkbox" }), _jsx("span", { className: "checkmark" }), _jsx("span", { className: "agreement-text", children: "\uB9CC 14\uC138 \uC774\uC0C1\uC785\uB2C8\uB2E4 (\uD544\uC218)" })] }) })] })), error && (_jsx("div", { className: "error-message", children: error })), _jsx("button", { type: "submit", disabled: loading, className: "submit-btn", children: loading ? (_jsxs(_Fragment, { children: [_jsx(Loader, { size: 20, className: "spinning" }), "\uCC98\uB9AC \uC911..."] })) : (isLogin ? '로그인' : '회원가입') })] }), _jsxs("div", { className: "login-footer", children: [_jsxs("p", { children: [isLogin ? '아직 계정이 없으신가요?' : '이미 계정이 있으신가요?', _jsx("button", { type: "button", onClick: toggleMode, className: "toggle-btn", children: isLogin ? '회원가입' : '로그인' })] }), _jsxs("div", { className: "demo-info", children: [_jsx("p", { children: "\uB370\uBAA8 \uACC4\uC815\uC73C\uB85C \uD14C\uC2A4\uD2B8\uD574\uBCF4\uC138\uC694:" }), _jsx("p", { children: "\uC774\uBA54\uC77C: test@example.com" }), _jsx("p", { children: "\uBE44\uBC00\uBC88\uD638: password" })] })] })] }) }), _jsxs("div", { className: "login-features", children: [_jsxs("button", { type: "button", className: "feature", children: [_jsx("h3", { children: "AI \uC131\uACBD \uBD84\uC11D" }), _jsx("p", { children: "\uC77D\uC740 \uAD6C\uC808\uC5D0 \uB300\uD55C AI\uC758 \uAE4A\uC774 \uC788\uB294 \uBD84\uC11D\uC744 \uBC1B\uC544\uBCF4\uC138\uC694" })] }), _jsxs("button", { type: "button", className: "feature", children: [_jsx("h3", { children: "\uCEE4\uBBA4\uB2C8\uD2F0" }), _jsx("p", { children: "\uB2E4\uB978 \uC131\uB3C4\uB4E4\uACFC \uC131\uACBD \uC77D\uAE30 \uACBD\uD5D8\uC744 \uACF5\uC720\uD558\uC138\uC694" })] }), _jsxs("button", { type: "button", className: "feature", children: [_jsx("h3", { children: "\uC0C1\uC138 \uD1B5\uACC4" }), _jsx("p", { children: "\uB098\uC758 \uC131\uACBD \uC77D\uAE30 \uC5EC\uC815\uC744 \uD1B5\uACC4\uB85C \uD655\uC778\uD558\uC138\uC694" })] })] })] }) }));
};
export default Login;
