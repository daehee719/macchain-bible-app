import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import Button from '../components/ui/Button';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import { Settings as SettingsIcon, User, Bell, Shield, Mail, Save, Check } from 'lucide-react';
import './Settings.css';
const Settings = () => {
    const { user, isLoggedIn } = useAuth();
    const [settings, setSettings] = useState({
        marketingConsent: false,
        notificationConsent: false,
        privacyConsent: true
    });
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    useEffect(() => {
        if (isLoggedIn && user) {
            // 사용자 설정 로드
            loadUserSettings();
        }
    }, [isLoggedIn, user]);
    const loadUserSettings = async () => {
        try {
            // 실제로는 API에서 사용자 설정을 가져옴
            const userSettings = localStorage.getItem('userSettings');
            if (userSettings) {
                setSettings(JSON.parse(userSettings));
            }
        }
        catch (error) {
            console.error('설정 로드 실패:', error);
        }
    };
    const handleSettingChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };
    const handleSave = async () => {
        setLoading(true);
        try {
            // 실제로는 API에 설정 저장
            localStorage.setItem('userSettings', JSON.stringify(settings));
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }
        catch (error) {
            console.error('설정 저장 실패:', error);
        }
        finally {
            setLoading(false);
        }
    };
    if (!isLoggedIn) {
        return (_jsx("div", { className: "settings-page", children: _jsx("div", { className: "container", children: _jsxs("div", { className: "login-required", children: [_jsx("h2", { children: "\uB85C\uADF8\uC778\uC774 \uD544\uC694\uD569\uB2C8\uB2E4" }), _jsx("p", { children: "\uC124\uC815\uC744 \uBCC0\uACBD\uD558\uB824\uBA74 \uBA3C\uC800 \uB85C\uADF8\uC778\uD574\uC8FC\uC138\uC694." })] }) }) }));
    }
    return (_jsx("div", { className: "settings-page", children: _jsxs("div", { className: "container", children: [_jsxs("header", { className: "settings-header", children: [_jsxs("h1", { children: [_jsx(SettingsIcon, { size: 28 }), "\uC124\uC815"] }), _jsx("p", { children: "\uACC4\uC815 \uBC0F \uAC1C\uC778\uC815\uBCF4 \uC124\uC815\uC744 \uAD00\uB9AC\uD558\uC138\uC694" })] }), _jsxs("div", { className: "settings-grid", children: [_jsx(Card, { title: "\uAC1C\uC778\uC815\uBCF4 \uC124\uC815", icon: _jsx(User, { size: 20 }), className: "settings-card", children: _jsx("div", { className: "setting-group", children: _jsxs("div", { className: "setting-item", children: [_jsxs("div", { className: "setting-info", children: [_jsx("h3", { children: "\uAC1C\uC778\uC815\uBCF4 \uCC98\uB9AC\uBC29\uCE68 \uB3D9\uC758" }), _jsx("p", { children: "\uAC1C\uC778\uC815\uBCF4 \uC218\uC9D1 \uBC0F \uC774\uC6A9\uC5D0 \uB300\uD55C \uB3D9\uC758\uC785\uB2C8\uB2E4." })] }), _jsxs("label", { className: "toggle-switch", children: [_jsx("input", { type: "checkbox", checked: settings.privacyConsent, onChange: (e) => handleSettingChange('privacyConsent', e.target.checked) }), _jsx("span", { className: "slider" })] })] }) }) }), _jsx(Card, { title: "\uC54C\uB9BC \uC124\uC815", icon: _jsx(Bell, { size: 20 }), className: "settings-card", children: _jsx("div", { className: "setting-group", children: _jsxs("div", { className: "setting-item", children: [_jsxs("div", { className: "setting-info", children: [_jsx("h3", { children: "\uC77D\uAE30 \uC54C\uB9BC" }), _jsx("p", { children: "\uB9E4\uC77C \uC131\uACBD \uC77D\uAE30 \uC2DC\uAC04\uC744 \uC54C\uB824\uB4DC\uB9BD\uB2C8\uB2E4." })] }), _jsxs("label", { className: "toggle-switch", children: [_jsx("input", { type: "checkbox", checked: settings.notificationConsent, onChange: (e) => handleSettingChange('notificationConsent', e.target.checked) }), _jsx("span", { className: "slider" })] })] }) }) }), _jsx(Card, { title: "\uB9C8\uCF00\uD305 \uC124\uC815", icon: _jsx(Mail, { size: 20 }), className: "settings-card", children: _jsx("div", { className: "setting-group", children: _jsxs("div", { className: "setting-item", children: [_jsxs("div", { className: "setting-info", children: [_jsx("h3", { children: "\uB9C8\uCF00\uD305 \uC815\uBCF4 \uC218\uC2E0" }), _jsx("p", { children: "\uC0C8\uB85C\uC6B4 \uAE30\uB2A5, \uC774\uBCA4\uD2B8, \uCD94\uCC9C \uCF58\uD150\uCE20\uC5D0 \uB300\uD55C \uC815\uBCF4\uB97C \uBC1B\uC544\uBCF4\uC138\uC694." })] }), _jsxs("label", { className: "toggle-switch", children: [_jsx("input", { type: "checkbox", checked: settings.marketingConsent, onChange: (e) => handleSettingChange('marketingConsent', e.target.checked) }), _jsx("span", { className: "slider" })] })] }) }) }), _jsx(Card, { title: "\uBCF4\uC548 \uC124\uC815", icon: _jsx(Shield, { size: 20 }), className: "settings-card", children: _jsx("div", { className: "setting-group", children: _jsxs("div", { className: "setting-item", children: [_jsxs("div", { className: "setting-info", children: [_jsx("h3", { children: "\uACC4\uC815 \uBCF4\uC548" }), _jsx("p", { children: "\uBE44\uBC00\uBC88\uD638 \uBCC0\uACBD \uBC0F \uBCF4\uC548 \uC124\uC815\uC744 \uAD00\uB9AC\uD558\uC138\uC694." })] }), _jsx(Button, { children: "\uBCF4\uC548 \uC124\uC815" })] }) }) })] }), _jsx("div", { className: "settings-actions", children: _jsx(Button, { onClick: handleSave, disabled: loading, className: 'save-btn ', children: loading ? (_jsxs(_Fragment, { children: [_jsx(SettingsIcon, { size: 20, className: "spinning" }), "\uC800\uC7A5 \uC911..."] })) : saved ? (_jsxs(_Fragment, { children: [_jsx(Check, { size: 20 }), "\uC800\uC7A5 \uC644\uB8CC!"] })) : (_jsxs(_Fragment, { children: [_jsx(Save, { size: 20 }), "\uC124\uC815 \uC800\uC7A5"] })) }) })] }) }));
};
export default Settings;
