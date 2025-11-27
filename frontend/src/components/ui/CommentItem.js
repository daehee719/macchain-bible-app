import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { Heart, Reply, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import Button from './Button';
import { TextArea } from './TextArea';
export default function CommentItem({ comment, onLike, onReply, onEdit, onDelete, depth = 0, }) {
    const [isReplying, setIsReplying] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [editContent, setEditContent] = useState(comment.content);
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);
    // 메뉴 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMenu]);
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
    const handleReply = () => {
        if (!replyContent.trim() || !onReply)
            return;
        onReply(comment.id, replyContent);
        setReplyContent('');
        setIsReplying(false);
    };
    const handleEdit = () => {
        if (!editContent.trim() || !onEdit)
            return;
        onEdit(comment.id, editContent);
        setIsEditing(false);
    };
    const handleDelete = () => {
        if (window.confirm('댓글을 삭제하시겠습니까?') && onDelete) {
            onDelete(comment.id);
        }
        setShowMenu(false);
    };
    const maxDepth = 3;
    const canReply = depth < maxDepth;
    return (_jsxs("div", { className: `${depth > 0 ? 'ml-8 mt-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4' : ''}`, children: [_jsxs("div", { className: "bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4", children: [_jsxs("div", { className: "flex items-start justify-between mb-2", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "font-medium text-gray-900 dark:text-white", children: comment.author_nickname }), _jsx("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: formatDate(comment.created_at) })] }), comment.is_author && (_jsxs("div", { className: "relative", ref: menuRef, children: [_jsx("button", { onClick: () => setShowMenu(!showMenu), className: "p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300", children: _jsx(MoreVertical, { size: 16 }) }), showMenu && (_jsxs("div", { className: "absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10", children: [_jsxs("button", { onClick: () => {
                                                    setIsEditing(true);
                                                    setShowMenu(false);
                                                }, className: "w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center", children: [_jsx(Edit2, { size: 14, className: "mr-2" }), "\uC218\uC815"] }), _jsxs("button", { onClick: handleDelete, className: "w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center", children: [_jsx(Trash2, { size: 14, className: "mr-2" }), "\uC0AD\uC81C"] })] }))] }))] }), isEditing ? (_jsxs("div", { className: "space-y-2", children: [_jsx(TextArea, { value: editContent, onChange: (e) => setEditContent(e.target.value), rows: 3 }), _jsxs("div", { className: "flex items-center justify-end space-x-2", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => setIsEditing(false), children: "\uCDE8\uC18C" }), _jsx(Button, { variant: "primary", size: "sm", onClick: handleEdit, children: "\uC800\uC7A5" })] })] })) : (_jsx("p", { className: "text-gray-700 dark:text-gray-300 whitespace-pre-wrap", children: comment.content })), !isEditing && (_jsxs("div", { className: "flex items-center space-x-4 mt-3", children: [_jsxs("button", { onClick: onLike, className: `flex items-center space-x-1 text-sm transition-colors ${comment.is_liked
                                    ? 'text-red-600 dark:text-red-400'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'}`, children: [_jsx(Heart, { size: 14, className: comment.is_liked ? 'fill-current' : '' }), _jsx("span", { children: comment.like_count })] }), canReply && onReply && (_jsxs("button", { onClick: () => setIsReplying(!isReplying), className: "flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300", children: [_jsx(Reply, { size: 14 }), _jsx("span", { children: "\uB2F5\uAE00" })] }))] })), isReplying && canReply && (_jsxs("div", { className: "mt-4 space-y-2", children: [_jsx(TextArea, { value: replyContent, onChange: (e) => setReplyContent(e.target.value), placeholder: "\uB2F5\uAE00\uC744 \uC785\uB825\uD558\uC138\uC694...", rows: 2 }), _jsxs("div", { className: "flex items-center justify-end space-x-2", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => setIsReplying(false), children: "\uCDE8\uC18C" }), _jsx(Button, { variant: "primary", size: "sm", onClick: handleReply, children: "\uC791\uC131" })] })] }))] }), comment.replies && comment.replies.length > 0 && (_jsx("div", { className: "mt-4 space-y-4", children: comment.replies.map((reply) => (_jsx(CommentItem, { comment: reply, onLike: onLike, onReply: onReply, onEdit: onEdit, onDelete: onDelete, depth: depth + 1 }, reply.id))) }))] }));
}
