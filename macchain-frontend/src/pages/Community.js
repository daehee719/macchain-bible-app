import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import Card from '../components/Card';
import { MessageCircle, Heart, Share2, Send, TrendingUp, BookOpen } from 'lucide-react';
const Community = () => {
    const [newPost, setNewPost] = useState('');
    const [selectedPassage, setSelectedPassage] = useState('');
    const [posts, setPosts] = useState([
        {
            id: '1',
            author: {
                name: '김성도',
                avatar: '👨‍💼'
            },
            content: '오늘 창세기 1장을 읽으며 하나님의 창조 섭리에 감탄했습니다. "하나님이 보시기에 좋았더라"는 표현이 매번 나올 때마다 마음이 따뜻해집니다.',
            passage: '창세기 1:1-31',
            likes: 12,
            comments: 3,
            timestamp: new Date('2025-01-06T14:30:00'),
            isLiked: false
        },
        {
            id: '2',
            author: {
                name: '이은혜',
                avatar: '👩‍🎓'
            },
            content: '마태복음 5장의 산상수훈을 읽으며 참된 행복이 무엇인지 다시 생각해봤습니다. 세상이 추구하는 것과는 정반대의 가치관이네요.',
            passage: '마태복음 5:1-12',
            likes: 8,
            comments: 5,
            timestamp: new Date('2025-01-06T11:15:00'),
            isLiked: true
        }
    ]);
    const [comments, setComments] = useState({
        '1': [
            {
                id: '1-1',
                author: { name: '박믿음', avatar: '👨‍🎨' },
                content: '정말 공감됩니다! 창조의 아름다움이 매번 새롭게 느껴져요.',
                timestamp: new Date('2025-01-06T15:00:00')
            }
        ]
    });
    const [newComments, setNewComments] = useState({});
    const handleCreatePost = () => {
        if (!newPost.trim())
            return;
        const post = {
            id: Date.now().toString(),
            author: {
                name: '나',
                avatar: '👤'
            },
            content: newPost,
            passage: selectedPassage || undefined,
            likes: 0,
            comments: 0,
            timestamp: new Date(),
            isLiked: false
        };
        setPosts(prev => [post, ...prev]);
        setNewPost('');
        setSelectedPassage('');
    };
    const handleLike = (postId) => {
        setPosts(prev => prev.map(post => post.id === postId
            ? {
                ...post,
                isLiked: !post.isLiked,
                likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
            : post));
    };
    const handleAddComment = (postId) => {
        const commentText = newComments[postId];
        if (!commentText?.trim())
            return;
        const comment = {
            id: Date.now().toString(),
            author: {
                name: '나',
                avatar: '👤'
            },
            content: commentText,
            timestamp: new Date()
        };
        setComments(prev => ({
            ...prev,
            [postId]: [...(prev[postId] || []), comment]
        }));
        setNewComments(prev => ({ ...prev, [postId]: '' }));
        setPosts(prev => prev.map(post => post.id === postId
            ? { ...post, comments: post.comments + 1 }
            : post));
    };
    const formatTimestamp = (date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours < 1)
            return '방금 전';
        if (hours < 24)
            return `${hours}시간 전`;
        return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 transition-colors", children: _jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("header", { className: "text-center mb-12", children: [_jsx("h1", { className: "text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4", children: "\uC131\uACBD \uC77D\uAE30 \uCEE4\uBBA4\uB2C8\uD2F0" }), _jsx("p", { className: "text-xl text-gray-600 dark:text-gray-300", children: "\uB2E4\uB978 \uC131\uB3C4\uB4E4\uACFC \uD568\uAED8 \uB098\uB204\uB294 \uC131\uACBD \uC77D\uAE30 \uACBD\uD5D8" })] }), _jsx("div", { className: "mb-8", children: _jsx(Card, { title: "\uC0C8 \uAE00 \uC791\uC131", icon: _jsx(MessageCircle, { size: 24 }), children: _jsxs("div", { className: "space-y-4", children: [_jsx("textarea", { value: newPost, onChange: (e) => setNewPost(e.target.value), placeholder: "\uC624\uB298 \uC77D\uC740 \uC131\uACBD \uAD6C\uC808\uC5D0 \uB300\uD55C \uC0DD\uAC01\uC744 \uACF5\uC720\uD574\uBCF4\uC138\uC694...", className: "w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 outline-none transition-all resize-none", rows: 4 }), _jsx("input", { type: "text", value: selectedPassage, onChange: (e) => setSelectedPassage(e.target.value), placeholder: "\uAD00\uB828 \uC131\uACBD \uAD6C\uC808 (\uC120\uD0DD\uC0AC\uD56D)", className: "w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 outline-none transition-all" }), _jsxs("button", { onClick: handleCreatePost, disabled: !newPost.trim(), className: "w-full px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2", children: [_jsx(Send, { size: 20 }), "\uAE00 \uC62C\uB9AC\uAE30"] })] }) }) }), _jsx("div", { className: "mb-8", children: _jsx(Card, { title: "\uCEE4\uBBA4\uB2C8\uD2F0 \uD604\uD669", children: _jsxs("div", { className: "grid grid-cols-3 gap-6", children: [_jsxs("div", { className: "text-center", children: [_jsx(TrendingUp, { size: 32, className: "text-primary-600 mx-auto mb-2" }), _jsx("div", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: posts.length }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "\uCD1D \uAC8C\uC2DC\uAE00" })] }), _jsxs("div", { className: "text-center", children: [_jsx(Heart, { size: 32, className: "text-red-500 mx-auto mb-2" }), _jsx("div", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: posts.reduce((acc, post) => acc + post.likes, 0) }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "\uCD1D \uC88B\uC544\uC694" })] }), _jsxs("div", { className: "text-center", children: [_jsx(MessageCircle, { size: 32, className: "text-primary-600 dark:text-primary-400 mx-auto mb-2" }), _jsx("div", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: posts.reduce((acc, post) => acc + post.comments, 0) }), _jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: "\uCD1D \uB313\uAE00" })] })] }) }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-6", children: "\uCD5C\uC2E0 \uAE00" }), posts.length === 0 ? (_jsx(Card, { children: _jsxs("div", { className: "flex flex-col items-center justify-center py-12 text-center", children: [_jsx(MessageCircle, { size: 64, className: "text-gray-400 dark:text-gray-500 mb-4" }), _jsx("h3", { className: "text-xl font-semibold text-gray-900 dark:text-white mb-2", children: "\uC544\uC9C1 \uAC8C\uC2DC\uAE00\uC774 \uC5C6\uC2B5\uB2C8\uB2E4" }), _jsx("p", { className: "text-gray-600 dark:text-gray-300", children: "\uCCAB \uBC88\uC9F8 \uAE00\uC744 \uC791\uC131\uD574\uBCF4\uC138\uC694!" })] }) })) : (_jsx("div", { className: "space-y-6", children: posts.map((post) => (_jsxs(Card, { children: [_jsxs("div", { className: "flex items-center gap-3 mb-4 pb-4 border-b border-gray-200", children: [_jsx("div", { className: "text-3xl", children: post.author.avatar }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "font-semibold text-gray-900 dark:text-white", children: post.author.name }), _jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: formatTimestamp(post.timestamp) })] })] }), _jsxs("div", { className: "mb-4", children: [_jsx("p", { className: "text-gray-700 dark:text-gray-300 leading-relaxed mb-3", children: post.content }), post.passage && (_jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-2 bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-700 rounded-lg text-primary-700 dark:text-primary-300 text-sm font-medium", children: [_jsx(BookOpen, { size: 16 }), post.passage] }))] }), _jsxs("div", { className: "flex items-center gap-4 mb-4 pb-4 border-b border-gray-200", children: [_jsxs("button", { onClick: () => handleLike(post.id), className: `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${post.isLiked
                                                    ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50'
                                                    : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`, children: [_jsx(Heart, { size: 18, className: post.isLiked ? 'fill-current' : '' }), post.likes] }), _jsxs("button", { className: "flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-all", children: [_jsx(MessageCircle, { size: 18 }), post.comments] }), _jsxs("button", { className: "flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-all", children: [_jsx(Share2, { size: 18 }), "\uACF5\uC720"] })] }), _jsxs("div", { className: "space-y-4", children: [comments[post.id]?.map((comment) => (_jsxs("div", { className: "flex gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg", children: [_jsx("div", { className: "text-xl", children: comment.author.avatar }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("span", { className: "font-semibold text-gray-900 dark:text-white text-sm", children: comment.author.name }), _jsx("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: formatTimestamp(comment.timestamp) })] }), _jsx("p", { className: "text-gray-700 dark:text-gray-300 text-sm", children: comment.content })] })] }, comment.id))), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: newComments[post.id] || '', onChange: (e) => setNewComments(prev => ({
                                                            ...prev,
                                                            [post.id]: e.target.value
                                                        })), placeholder: "\uB313\uAE00\uC744 \uC785\uB825\uD558\uC138\uC694...", className: "flex-1 px-4 py-2 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 outline-none transition-all" }), _jsx("button", { onClick: () => handleAddComment(post.id), disabled: !newComments[post.id]?.trim(), className: "px-4 py-2 bg-gradient-primary text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed", children: _jsx(Send, { size: 18 }) })] })] })] }, post.id))) }))] })] }) }));
};
export default Community;
