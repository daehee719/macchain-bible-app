import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { MessageCircle, Heart, BookOpen, Clock, User } from 'lucide-react';
export default function DiscussionCard({ id, title, content, passage_reference, passage_text, category_name, category_icon, category_color, author_nickname, view_count, like_count, comment_count, created_at, is_liked = false, is_bookmarked = false, onLike, onBookmark, }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        if (minutes < 1)
            return '방금 전';
        if (minutes < 60)
            return `${minutes}분 전`;
        if (hours < 24)
            return `${hours}시간 전`;
        if (days < 7)
            return `${days}일 전`;
        return date.toLocaleDateString('ko-KR');
    };
    const truncatedContent = content.length > 150 ? content.substring(0, 150) + '...' : content;
    return (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow", children: [category_name && (_jsxs("div", { className: "flex items-center mb-3", children: [_jsx("span", { className: "text-lg mr-2", children: category_icon }), _jsx("span", { className: "text-xs font-medium px-2 py-1 rounded", style: {
                            backgroundColor: category_color ? `${category_color}20` : undefined,
                            color: category_color || undefined
                        }, children: category_name })] })), _jsx(Link, { to: `/discussions/${id}`, children: _jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors", children: title }) }), passage_reference && (_jsx("div", { className: "mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500", children: _jsxs("div", { className: "flex items-start", children: [_jsx(BookOpen, { size: 16, className: "text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "text-sm font-medium text-blue-900 dark:text-blue-200 mb-1", children: passage_reference }), passage_text && (_jsxs("div", { className: "text-sm text-blue-700 dark:text-blue-300 italic", children: ["\"", passage_text, "\""] }))] })] }) })), _jsx("p", { className: "text-gray-700 dark:text-gray-300 mb-4 line-clamp-3", children: truncatedContent }), _jsx("div", { className: "flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4", children: _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(User, { size: 14, className: "mr-1" }), _jsx("span", { children: author_nickname })] }), _jsxs("div", { className: "flex items-center", children: [_jsx(Clock, { size: 14, className: "mr-1" }), _jsx("span", { children: formatDate(created_at) })] }), _jsxs("span", { children: ["\uC870\uD68C ", view_count] })] }) }), _jsxs("div", { className: "flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("button", { onClick: onLike, className: `flex items-center space-x-1 px-3 py-1.5 rounded-md transition-colors ${is_liked
                                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`, children: [_jsx(Heart, { size: 16, className: is_liked ? 'fill-current' : '' }), _jsx("span", { children: like_count })] }), _jsxs(Link, { to: `/discussions/${id}`, className: "flex items-center space-x-1 px-3 py-1.5 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors", children: [_jsx(MessageCircle, { size: 16 }), _jsx("span", { children: comment_count })] })] }), onBookmark && (_jsx("button", { onClick: onBookmark, className: `p-1.5 rounded-md transition-colors ${is_bookmarked
                            ? 'text-yellow-600 dark:text-yellow-400'
                            : 'text-gray-400 dark:text-gray-500 hover:text-yellow-500 dark:hover:text-yellow-400'}`, title: is_bookmarked ? '북마크 제거' : '북마크 추가', children: _jsx("svg", { className: "w-5 h-5", fill: is_bookmarked ? 'currentColor' : 'none', stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" }) }) }))] })] }));
}
