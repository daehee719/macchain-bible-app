import Button from 'src/components/ui/Button';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import Card from '../components/Card';
import { MessageCircle, Heart, Share2, Send, TrendingUp } from 'lucide-react';
import './Community.css';
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
    return (_jsx("div", { className: "community", children: _jsxs("div", { className: "container", children: [_jsxs("header", { className: "page-header", children: [_jsx("h1", { children: "\uC131\uACBD \uC77D\uAE30 \uCEE4\uBBA4\uB2C8\uD2F0" }), _jsx("p", { children: "\uB2E4\uB978 \uC131\uB3C4\uB4E4\uACFC \uD568\uAED8 \uB098\uB204\uB294 \uC131\uACBD \uC77D\uAE30 \uACBD\uD5D8" })] }), _jsx("div", { className: "create-post", children: _jsx(Card, { title: "\uC0C8 \uAE00 \uC791\uC131", icon: _jsx(MessageCircle, { size: 24 }), children: _jsxs("div", { className: "post-form", children: [_jsx("textarea", { value: newPost, onChange: (e) => setNewPost(e.target.value), placeholder: "\uC624\uB298 \uC77D\uC740 \uC131\uACBD \uAD6C\uC808\uC5D0 \uB300\uD55C \uC0DD\uAC01\uC744 \uACF5\uC720\uD574\uBCF4\uC138\uC694...", className: "post-input", rows: 4 }), _jsx("input", { type: "text", value: selectedPassage, onChange: (e) => setSelectedPassage(e.target.value), placeholder: "\uAD00\uB828 \uC131\uACBD \uAD6C\uC808 (\uC120\uD0DD\uC0AC\uD56D)", className: "passage-input" }), _jsxs("button", { onClick: handleCreatePost, disabled: !newPost.trim(), className: "create-btn", children: [_jsx(Send, { size: 16 }), "\uAE00 \uC62C\uB9AC\uAE30"] })] }) }) }), _jsx("div", { className: "community-stats", children: _jsx(Card, { title: "\uCEE4\uBBA4\uB2C8\uD2F0 \uD604\uD669", className: "stats-card", children: _jsxs("div", { className: "stats-grid", children: [_jsxs("div", { className: "stat", children: [_jsx(TrendingUp, { size: 24 }), _jsx("span", { className: "stat-number", children: posts.length }), _jsx("span", { className: "stat-label", children: "\uCD1D \uAC8C\uC2DC\uAE00" })] }), _jsxs("div", { className: "stat", children: [_jsx(Heart, { size: 24 }), _jsx("span", { className: "stat-number", children: posts.reduce((acc, post) => acc + post.likes, 0) }), _jsx("span", { className: "stat-label", children: "\uCD1D \uC88B\uC544\uC694" })] }), _jsxs("div", { className: "stat", children: [_jsx(MessageCircle, { size: 24 }), _jsx("span", { className: "stat-number", children: posts.reduce((acc, post) => acc + post.comments, 0) }), _jsx("span", { className: "stat-label", children: "\uCD1D \uB313\uAE00" })] })] }) }) }), _jsxs("div", { className: "posts-feed", children: [_jsx("h2", { children: "\uCD5C\uC2E0 \uAE00" }), posts.length === 0 ? (_jsx(Card, { className: "empty-state", children: _jsxs("div", { className: "empty-content", children: [_jsx(MessageCircle, { size: 48, className: "empty-icon" }), _jsx("h3", { children: "\uC544\uC9C1 \uAC8C\uC2DC\uAE00\uC774 \uC5C6\uC2B5\uB2C8\uB2E4" }), _jsx("p", { children: "\uCCAB \uBC88\uC9F8 \uAE00\uC744 \uC791\uC131\uD574\uBCF4\uC138\uC694!" })] }) })) : (_jsx("div", { className: "posts-list", children: posts.map((post) => (_jsxs(Card, { className: "post-card", children: [_jsx("div", { className: "post-header", children: _jsxs("div", { className: "author-info", children: [_jsx("span", { className: "author-avatar", children: post.author.avatar }), _jsxs("div", { className: "author-details", children: [_jsx("span", { className: "author-name", children: post.author.name }), _jsx("span", { className: "post-time", children: formatTimestamp(post.timestamp) })] })] }) }), _jsxs("div", { className: "post-content", children: [_jsx("p", { children: post.content }), post.passage && (_jsxs("div", { className: "passage-reference", children: ["\uD83D\uDCD6 ", post.passage] }))] }), _jsxs("div", { className: "post-actions", children: [_jsxs("button", { onClick: () => handleLike(post.id), className: `action-btn like-btn ${post.isLiked ? 'liked' : ''}`, children: [_jsx(Heart, { size: 16 }), post.likes] }), _jsxs("button", { className: "action-btn comment-btn", children: [_jsx(MessageCircle, { size: 16 }), post.comments] }), _jsxs("button", { className: "action-btn share-btn", children: [_jsx(Share2, { size: 16 }), "\uACF5\uC720"] })] }), _jsxs("div", { className: "comments-section", children: [comments[post.id]?.map((comment) => (_jsxs("div", { className: "comment", children: [_jsxs("div", { className: "comment-author", children: [_jsx("span", { className: "comment-avatar", children: comment.author.avatar }), _jsx("span", { className: "comment-name", children: comment.author.name }), _jsx("span", { className: "comment-time", children: formatTimestamp(comment.timestamp) })] }), _jsx("p", { className: "comment-content", children: comment.content })] }, comment.id))), _jsxs("div", { className: "add-comment", children: [_jsx("input", { type: "text", value: newComments[post.id] || '', onChange: (e) => setNewComments(prev => ({
                                                            ...prev,
                                                            [post.id]: e.target.value
                                                        })), placeholder: "\uB313\uAE00\uC744 \uC785\uB825\uD558\uC138\uC694...", className: "comment-input" }), _jsx("button", { onClick: () => handleAddComment(post.id), disabled: !newComments[post.id]?.trim(), className: "comment-submit", children: _jsx(Send, { size: 14 }) })] })] })] }, post.id))) }))] })] }) }));
};
export default Community;
