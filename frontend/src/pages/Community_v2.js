import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import Card from '../components/Card';
import { TextArea } from '../components/ui/TextArea';
import Button from '../components/ui/Button';
import { MessageCircle, Heart, Image } from 'lucide-react';
const mockPosts = [
    { id: '1', author: '은혜', content: '오늘 아침 말씀 나눕니다. 주님 감사합니다.', likes: 3, time: '1시간 전' },
    { id: '2', author: '요셉', content: '요한복음 묵상 중입니다. 질문 있어요.', likes: 1, time: '2시간 전' }
];
const Community = () => {
    const [posts, setPosts] = useState(mockPosts);
    const [text, setText] = useState('');
    const submitPost = () => {
        if (!text.trim())
            return;
        setPosts(prev => [{ id: Date.now().toString(), author: '나', content: text.trim(), likes: 0, time: '방금' }, ...prev]);
        setText('');
    };
    return (_jsxs("div", { children: [_jsx(PageHeader, { title: "\uCEE4\uBBA4\uB2C8\uD2F0", description: "\uC131\uACBD \uC77D\uAE30 \uACBD\uD5D8\uC744 \uB098\uB204\uC138\uC694", icon: _jsx(MessageCircle, { size: 28 }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2", children: [_jsx(Card, { children: _jsxs("div", { className: "space-y-4", children: [_jsx(TextArea, { value: text, onChange: (e) => setText(e.target.value), placeholder: "\uB098\uB20C \uB9D0\uC500\uC774\uB098 \uBB35\uC0C1\uC744 \uC791\uC131\uD558\uC138\uC694", rows: 3 }), _jsxs("div", { className: "flex items-center justify-end", children: [_jsx(Button, { variant: "ghost", className: "mr-2", children: _jsx(Image, { size: 16 }) }), _jsx(Button, { variant: "primary", onClick: submitPost, children: "\uB098\uB204\uAE30" })] })] }) }), _jsx("div", { className: "space-y-4 mt-4", children: posts.map(p => (_jsx(Card, { className: "p-4", children: _jsx("div", { className: "flex items-start", children: _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: [p.author, " \u2022 ", p.time] }), _jsx("p", { className: "mt-2 text-gray-900 dark:text-white", children: p.content }), _jsxs("div", { className: "mt-3 flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-300", children: [_jsxs("button", { className: "flex items-center space-x-1", children: [_jsx(Heart, { size: 14 }), " ", _jsx("span", { children: p.likes })] }), _jsxs("button", { className: "flex items-center space-x-1", children: [_jsx(MessageCircle, { size: 14 }), " ", _jsx("span", { children: "\uB313\uAE00" })] })] })] }) }) }, p.id))) })] }), _jsx("aside", { children: _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-md p-6", children: [_jsx("h4", { className: "text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "\uCEE4\uBBA4\uB2C8\uD2F0 \uAC00\uC774\uB4DC" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "\uC11C\uB85C\uB97C \uC874\uC911\uD558\uBA70 \uBB35\uC0C1\uACFC \uAE30\uB3C4 \uC81C\uBAA9\uC744 \uB098\uB220\uC8FC\uC138\uC694." })] }) })] })] }));
};
export default Community;
