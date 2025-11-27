import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import SmallChart from '../components/ui/SmallChart';
import Modal from '../components/ui/Modal';
import { apiService } from '../services/api';
export default function PrototypeHome() {
    const [todayPlan, setTodayPlan] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [chartData, setChartData] = useState([2, 3, 4, 2, 5, 6, 4]);
    useEffect(() => {
        let mounted = true;
        apiService.getTodayPlan().then(res => {
            if (mounted)
                setTodayPlan(res);
        }).catch(() => {
            // fallback UI
        });
        return () => { mounted = false; };
    }, []);
    return (_jsxs("div", { className: "max-w-3xl mx-auto p-4", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Prototype Home (MVP)" }), _jsx(Card, { title: "\uC624\uB298\uC758 \uC77D\uAE30 \uACC4\uD68D", children: todayPlan?.readings?.length ? (todayPlan.readings.map((r) => (_jsxs("div", { className: "flex justify-between items-center py-2", children: [_jsxs("div", { children: [_jsxs("div", { className: "font-semibold", children: [r.book, " ", r.chapter] }), _jsxs("div", { className: "text-sm text-gray-500", children: [r.verseStart, " - ", r.verseEnd] })] }), _jsx("div", { children: _jsx(Button, { variant: "ghost", onClick: () => setOpenModal(true), children: "\uBD84\uC11D" }) })] }, r.id)))) : (_jsx("div", { children: "\uBD88\uB7EC\uC624\uB294 \uC911 \uB610\uB294 \uACC4\uD68D\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." })) }), _jsx(Card, { title: "\uC9C4\uD589 \uD1B5\uACC4", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold", children: "12" }), _jsx("div", { className: "text-sm text-gray-500", children: "\uC5F0\uC18D \uC77C\uC218" })] }), _jsx(SmallChart, { data: chartData })] }) }), _jsx(Card, { title: "\uBE60\uB978 \uC561\uC158", children: _jsxs("div", { className: "flex gap-3", children: [_jsx(Button, { onClick: () => alert('동기화 실행'), children: "\uB3D9\uAE30\uD654" }), _jsx(Button, { variant: "secondary", onClick: () => alert('통계 보기'), children: "\uC0C1\uC138 \uD1B5\uACC4" })] }) }), _jsxs(Modal, { title: "AI \uC6D0\uC5B4 \uBD84\uC11D", open: openModal, onClose: () => setOpenModal(false), children: [_jsx("p", { children: "\uAC04\uB2E8\uD55C AI \uBD84\uC11D \uBAA8\uB2EC \uC608\uC2DC\uC785\uB2C8\uB2E4. \uC2E4\uC81C\uB85C\uB294 \uAD6C\uC808\uC744 \uC785\uB825\uD558\uACE0 \uBD84\uC11D\uC744 \uC218\uD589\uD569\uB2C8\uB2E4." }), _jsx(Button, { onClick: () => alert('분석 요청'), children: "\uBD84\uC11D \uC694\uCCAD" })] })] }));
}
