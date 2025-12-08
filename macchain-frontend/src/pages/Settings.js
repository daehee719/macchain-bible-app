import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import { Settings as SettingsIcon, User, Bell, Shield, Mail, Save, Check, Loader } from 'lucide-react';
import { apiService } from '../services/api';
const Settings = () => {
    const { user, isLoggedIn } = useAuth();
    const [settings, setSettings] = useState({
        marketingConsent: false,
        notificationConsent: false,
        privacyConsent: true
    });
    const [userSettings, setUserSettings] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    useEffect(() => {
        if (isLoggedIn && user) {
            loadUserSettings();
            loadUserConsents();
        }
    }, [isLoggedIn, user]);
    const loadUserSettings = async () => {
        try {
            if (!user)
                return;
            const settingsData = await apiService.getUserSettings(user.id);
            if (settingsData) {
                setUserSettings(settingsData);
            }
        }
        catch (error) {
            console.error('설정 로드 실패:', error);
        }
    };
    const loadUserConsents = async () => {
        try {
            if (!user)
                return;
            setLoading(true);
            const consents = await apiService.getUserConsents(user.id);
            if (consents) {
                setSettings({
                    marketingConsent: consents.marketing_consent || false,
                    notificationConsent: consents.notification_consent || false,
                    privacyConsent: consents.privacy_consent || true
                });
            }
        }
        catch (error) {
            console.error('동의 설정 로드 실패:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleSettingChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };
    const handleSave = async () => {
        if (!user)
            return;
        setSaving(true);
        try {
            // 동의 설정 저장
            await apiService.updateUserConsents(user.id, {
                privacy_consent: settings.privacyConsent,
                marketing_consent: settings.marketingConsent,
                notification_consent: settings.notificationConsent
            });
            // 사용자 설정 저장 (알림 시간 등)
            if (userSettings) {
                await apiService.updateUserSettings(user.id, {
                    notification_enabled: settings.notificationConsent,
                    reminder_time: userSettings.reminder_time || '09:00',
                    language: userSettings.language || 'ko',
                    theme: userSettings.theme || 'light'
                });
            }
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }
        catch (error) {
            console.error('설정 저장 실패:', error);
            alert('설정 저장 중 오류가 발생했습니다.');
        }
        finally {
            setSaving(false);
        }
    };
    if (!isLoggedIn) {
        return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center py-12", children: _jsx("div", { className: "max-w-md mx-auto px-4", children: _jsxs(Card, { className: "text-center", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-2", children: "\uB85C\uADF8\uC778\uC774 \uD544\uC694\uD569\uB2C8\uB2E4" }), _jsx("p", { className: "text-gray-600 dark:text-gray-300", children: "\uC124\uC815\uC744 \uBCC0\uACBD\uD558\uB824\uBA74 \uBA3C\uC800 \uB85C\uADF8\uC778\uD574\uC8FC\uC138\uC694." })] }) }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 transition-colors", children: _jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("header", { className: "text-center mb-12", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-4", children: _jsx(SettingsIcon, { size: 32, className: "text-white" }) }), _jsx("h1", { className: "text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4", children: "\uC124\uC815" }), _jsx("p", { className: "text-xl text-gray-600 dark:text-gray-300", children: "\uACC4\uC815 \uBC0F \uAC1C\uC778\uC815\uBCF4 \uC124\uC815\uC744 \uAD00\uB9AC\uD558\uC138\uC694" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-8", children: [_jsx(Card, { title: "\uAC1C\uC778\uC815\uBCF4 \uC124\uC815", icon: _jsx(User, { size: 20 }), children: _jsxs("div", { className: "flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-semibold text-gray-900 dark:text-white mb-1", children: "\uAC1C\uC778\uC815\uBCF4 \uCC98\uB9AC\uBC29\uCE68 \uB3D9\uC758" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-300", children: "\uAC1C\uC778\uC815\uBCF4 \uC218\uC9D1 \uBC0F \uC774\uC6A9\uC5D0 \uB300\uD55C \uB3D9\uC758\uC785\uB2C8\uB2E4." })] }), _jsxs("label", { className: "relative inline-flex items-center cursor-pointer ml-4", children: [_jsx("input", { type: "checkbox", checked: settings.privacyConsent, onChange: (e) => handleSettingChange('privacyConsent', e.target.checked), className: "sr-only peer" }), _jsx("div", { className: "w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 dark:peer-checked:bg-primary-500" })] })] }) }), _jsx(Card, { title: "\uC54C\uB9BC \uC124\uC815", icon: _jsx(Bell, { size: 20 }), children: _jsxs("div", { className: "flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-semibold text-gray-900 dark:text-white mb-1", children: "\uC77D\uAE30 \uC54C\uB9BC" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-300", children: "\uB9E4\uC77C \uC131\uACBD \uC77D\uAE30 \uC2DC\uAC04\uC744 \uC54C\uB824\uB4DC\uB9BD\uB2C8\uB2E4." })] }), _jsxs("label", { className: "relative inline-flex items-center cursor-pointer ml-4", children: [_jsx("input", { type: "checkbox", checked: settings.notificationConsent, onChange: (e) => handleSettingChange('notificationConsent', e.target.checked), className: "sr-only peer" }), _jsx("div", { className: "w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 dark:peer-checked:bg-primary-500" })] })] }) }), _jsx(Card, { title: "\uB9C8\uCF00\uD305 \uC124\uC815", icon: _jsx(Mail, { size: 20 }), children: _jsxs("div", { className: "flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-semibold text-gray-900 dark:text-white mb-1", children: "\uB9C8\uCF00\uD305 \uC815\uBCF4 \uC218\uC2E0" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-300", children: "\uC0C8\uB85C\uC6B4 \uAE30\uB2A5, \uC774\uBCA4\uD2B8, \uCD94\uCC9C \uCF58\uD150\uCE20\uC5D0 \uB300\uD55C \uC815\uBCF4\uB97C \uBC1B\uC544\uBCF4\uC138\uC694." })] }), _jsxs("label", { className: "relative inline-flex items-center cursor-pointer ml-4", children: [_jsx("input", { type: "checkbox", checked: settings.marketingConsent, onChange: (e) => handleSettingChange('marketingConsent', e.target.checked), className: "sr-only peer" }), _jsx("div", { className: "w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 dark:peer-checked:bg-primary-500" })] })] }) }), _jsx(Card, { title: "\uBCF4\uC548 \uC124\uC815", icon: _jsx(Shield, { size: 20 }), children: _jsxs("div", { className: "flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-semibold text-gray-900 dark:text-white mb-1", children: "\uACC4\uC815 \uBCF4\uC548" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-300", children: "\uBE44\uBC00\uBC88\uD638 \uBCC0\uACBD \uBC0F \uBCF4\uC548 \uC124\uC815\uC744 \uAD00\uB9AC\uD558\uC138\uC694." })] }), _jsx("button", { className: "px-4 py-2 bg-white dark:bg-gray-800 border-2 border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-300 rounded-lg font-medium hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:border-primary-400 dark:hover:border-primary-500 transition-all", children: "\uBCF4\uC548 \uC124\uC815" })] }) })] }), _jsx("div", { className: "flex justify-center mt-8", children: _jsx("button", { onClick: handleSave, disabled: saving || loading, className: `px-8 py-4 rounded-lg font-semibold transition-all flex items-center gap-2 ${saved
                            ? 'bg-green-500 text-white'
                            : 'bg-gradient-primary text-white hover:shadow-lg hover:scale-105'} disabled:opacity-50 disabled:cursor-not-allowed`, children: saving ? (_jsxs(_Fragment, { children: [_jsx(Loader, { size: 20, className: "animate-spin" }), "\uC800\uC7A5 \uC911..."] })) : saved ? (_jsxs(_Fragment, { children: [_jsx(Check, { size: 20 }), "\uC800\uC7A5 \uC644\uB8CC!"] })) : (_jsxs(_Fragment, { children: [_jsx(Save, { size: 20 }), "\uC124\uC815 \uC800\uC7A5"] })) }) })] }) }));
};
export default Settings;
