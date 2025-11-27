import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import DiscussionCard from '../components/ui/DiscussionCard';
import CommentItem from '../components/ui/CommentItem';
import { Input } from '../components/ui/Input';
import { TextArea } from '../components/ui/TextArea';
import Button from '../components/ui/Button';
import { MessageCircle, Plus, Filter, BookOpen, ArrowLeft, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
// 타입은 services/api.ts에서 import
const DiscussionPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token, isLoggedIn } = useAuth();
    const [discussions, setDiscussions] = useState([]);
    const [discussion, setDiscussion] = useState(null);
    const [comments, setComments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // 필터 상태
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [sort, setSort] = useState('latest');
    const [page, setPage] = useState(1);
    // 작성 폼 상태
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [createForm, setCreateForm] = useState({
        title: '',
        content: '',
        passageReference: '',
        passageText: '',
        categoryId: undefined,
    });
    // 댓글 작성 상태
    const [commentContent, setCommentContent] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyContent, setReplyContent] = useState('');
    // 상세 페이지인지 목록 페이지인지
    const isDetailPage = !!id;
    // 카테고리 목록 로드
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await apiService.getCategories();
                if (response.success && response.data) {
                    setCategories(response.data.categories || []);
                }
            }
            catch (err) {
                console.error('Failed to load categories:', err);
            }
        };
        loadCategories();
    }, []);
    // 토론 목록 로드
    useEffect(() => {
        if (!isDetailPage) {
            loadDiscussions();
        }
    }, [selectedCategory, sort, page, isDetailPage]);
    // 토론 상세 로드
    useEffect(() => {
        if (isDetailPage && id) {
            loadDiscussion(id);
            loadComments(id);
        }
    }, [id, isDetailPage]);
    const loadDiscussions = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiService.getDiscussions(token, {
                categoryId: selectedCategory || undefined,
                page,
                limit: 20,
                sort,
            });
            if (response.success && response.data) {
                setDiscussions(response.data.discussions || []);
            }
        }
        catch (err) {
            setError('토론 목록을 불러오는데 실패했습니다.');
            console.error('Failed to load discussions:', err);
        }
        finally {
            setLoading(false);
        }
    };
    const loadDiscussion = async (discussionId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiService.getDiscussion(token, discussionId);
            if (response.success && response.data) {
                setDiscussion(response.data.discussion);
            }
        }
        catch (err) {
            setError('토론을 불러오는데 실패했습니다.');
            console.error('Failed to load discussion:', err);
        }
        finally {
            setLoading(false);
        }
    };
    const loadComments = async (discussionId) => {
        if (!token)
            return;
        try {
            const response = await apiService.getComments(token, discussionId);
            if (response.success && response.data) {
                setComments(response.data.comments || []);
            }
        }
        catch (err) {
            console.error('Failed to load comments:', err);
        }
    };
    const handleCreateDiscussion = async () => {
        if (!token || !createForm.title.trim() || !createForm.content.trim()) {
            setError('제목과 내용을 입력해주세요.');
            return;
        }
        try {
            setError(null);
            const response = await apiService.createDiscussion(token, {
                title: createForm.title,
                content: createForm.content,
                passageReference: createForm.passageReference || undefined,
                passageText: createForm.passageText || undefined,
                categoryId: createForm.categoryId,
            });
            if (response.success) {
                setShowCreateForm(false);
                setCreateForm({
                    title: '',
                    content: '',
                    passageReference: '',
                    passageText: '',
                    categoryId: undefined,
                });
                loadDiscussions();
            }
        }
        catch (err) {
            setError('토론 작성에 실패했습니다.');
            console.error('Failed to create discussion:', err);
        }
    };
    const handleLike = async (discussionId) => {
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            await apiService.toggleDiscussionLike(token, discussionId);
            if (isDetailPage && discussion) {
                loadDiscussion(discussionId);
            }
            else {
                loadDiscussions();
            }
        }
        catch (err) {
            console.error('Failed to toggle like:', err);
        }
    };
    const handleBookmark = async (discussionId) => {
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            await apiService.toggleBookmark(token, discussionId);
            if (isDetailPage && discussion) {
                loadDiscussion(discussionId);
            }
            else {
                loadDiscussions();
            }
        }
        catch (err) {
            console.error('Failed to toggle bookmark:', err);
        }
    };
    const handleCreateComment = async () => {
        if (!token || !id) {
            navigate('/login');
            return;
        }
        if (!commentContent.trim()) {
            setError('댓글 내용을 입력해주세요.');
            return;
        }
        try {
            setError(null);
            await apiService.createComment(token, id, commentContent);
            setCommentContent('');
            loadComments(id);
            if (discussion) {
                loadDiscussion(id);
            }
        }
        catch (err) {
            setError('댓글 작성에 실패했습니다.');
            console.error('Failed to create comment:', err);
        }
    };
    const handleReplyComment = async (parentId, content) => {
        if (!token || !id)
            return;
        try {
            await apiService.createComment(token, id, content, parentId);
            setReplyContent('');
            setReplyingTo(null);
            loadComments(id);
        }
        catch (err) {
            console.error('Failed to reply comment:', err);
        }
    };
    const handleLikeComment = async (commentId) => {
        if (!token)
            return;
        try {
            await apiService.toggleCommentLike(token, commentId);
            if (id) {
                loadComments(id);
            }
        }
        catch (err) {
            console.error('Failed to toggle comment like:', err);
        }
    };
    // 상세 페이지
    if (isDetailPage) {
        if (loading) {
            return (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsx("div", { className: "text-gray-500", children: "\uB85C\uB529 \uC911..." }) }));
        }
        if (error || !discussion) {
            return (_jsxs("div", { className: "flex flex-col items-center justify-center min-h-screen", children: [_jsx("div", { className: "text-red-500 mb-4", children: error || '토론을 찾을 수 없습니다.' }), _jsx(Button, { onClick: () => navigate('/discussions'), children: "\uBAA9\uB85D\uC73C\uB85C" })] }));
        }
        return (_jsxs("div", { children: [_jsxs("div", { className: "mb-6", children: [_jsxs(Button, { variant: "ghost", onClick: () => navigate('/discussions'), className: "mb-4", children: [_jsx(ArrowLeft, { size: 16, className: "mr-2" }), "\uBAA9\uB85D\uC73C\uB85C"] }), _jsx(PageHeader, { title: discussion.title, description: `${discussion.author_nickname} • ${new Date(discussion.created_at).toLocaleDateString('ko-KR')}`, icon: _jsx(MessageCircle, { size: 28 }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2", children: [_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6", children: [discussion.passage_reference && (_jsx("div", { className: "mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500", children: _jsxs("div", { className: "flex items-start", children: [_jsx(BookOpen, { size: 20, className: "text-blue-600 dark:text-blue-400 mr-3 mt-0.5" }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "font-medium text-blue-900 dark:text-blue-200 mb-2", children: discussion.passage_reference }), discussion.passage_text && (_jsxs("div", { className: "text-blue-700 dark:text-blue-300 italic", children: ["\"", discussion.passage_text, "\""] }))] })] }) })), _jsx("div", { className: "prose dark:prose-invert max-w-none", children: _jsx("div", { className: "text-gray-700 dark:text-gray-300 whitespace-pre-wrap", children: discussion.content }) }), _jsxs("div", { className: "flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("button", { onClick: () => handleLike(discussion.id), className: `flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${discussion.is_liked
                                                                ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`, children: [_jsx(Heart, { size: 18, className: discussion.is_liked ? 'fill-current' : '' }), _jsx("span", { children: discussion.like_count })] }), _jsxs("div", { className: "flex items-center space-x-2 text-gray-600 dark:text-gray-400", children: [_jsx(MessageCircle, { size: 18 }), _jsx("span", { children: discussion.comment_count })] })] }), isLoggedIn && (_jsx("button", { onClick: () => handleBookmark(discussion.id), className: `p-2 rounded-md transition-colors ${discussion.is_bookmarked
                                                        ? 'text-yellow-600 dark:text-yellow-400'
                                                        : 'text-gray-400 dark:text-gray-500 hover:text-yellow-500 dark:hover:text-yellow-400'}`, children: _jsx("svg", { className: "w-5 h-5", fill: discussion.is_bookmarked ? 'currentColor' : 'none', stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" }) }) }))] })] }), isLoggedIn && (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "\uB313\uAE00 \uC791\uC131" }), _jsx(TextArea, { value: commentContent, onChange: (e) => setCommentContent(e.target.value), placeholder: "\uB313\uAE00\uC744 \uC785\uB825\uD558\uC138\uC694...", rows: 4 }), _jsx("div", { className: "flex justify-end mt-4", children: _jsx(Button, { variant: "primary", onClick: handleCreateComment, children: "\uC791\uC131" }) })] })), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6", children: [_jsxs("h3", { className: "text-lg font-semibold mb-4", children: ["\uB313\uAE00 ", discussion.comment_count] }), comments.length === 0 ? (_jsx("div", { className: "text-center py-8 text-gray-500 dark:text-gray-400", children: "\uC544\uC9C1 \uB313\uAE00\uC774 \uC5C6\uC2B5\uB2C8\uB2E4." })) : (_jsx("div", { className: "space-y-4", children: comments.map((comment) => (_jsx(CommentItem, { comment: comment, onLike: () => handleLikeComment(comment.id), onReply: handleReplyComment }, comment.id))) }))] })] }), _jsx("aside", { children: _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6", children: [_jsx("h4", { className: "font-semibold mb-3", children: "\uD1A0\uB860 \uAC00\uC774\uB4DC" }), _jsxs("ul", { className: "text-sm text-gray-600 dark:text-gray-400 space-y-2", children: [_jsx("li", { children: "\u2022 \uC11C\uB85C\uB97C \uC874\uC911\uD558\uBA70 \uB300\uD654\uD558\uC138\uC694" }), _jsx("li", { children: "\u2022 \uC131\uACBD \uB9D0\uC500\uC744 \uC911\uC2EC\uC73C\uB85C \uD1A0\uB860\uD558\uC138\uC694" }), _jsx("li", { children: "\u2022 \uAC74\uC124\uC801\uC778 \uC758\uACAC\uC744 \uB098\uB220\uC8FC\uC138\uC694" })] })] }) })] })] }));
    }
    // 목록 페이지
    return (_jsxs("div", { children: [_jsx(PageHeader, { title: "\uD1A0\uB860", description: "\uC131\uACBD \uB9D0\uC500\uC5D0 \uB300\uD574 \uD568\uAED8 \uB098\uB220\uC694", icon: _jsx(MessageCircle, { size: 28 }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2", children: [_jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6", children: _jsxs("div", { className: "flex flex-wrap items-center gap-4", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Filter, { size: 18, className: "text-gray-500" }), _jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "\uCE74\uD14C\uACE0\uB9AC:" }), _jsxs("select", { value: selectedCategory || '', onChange: (e) => {
                                                        setSelectedCategory(e.target.value ? parseInt(e.target.value) : null);
                                                        setPage(1);
                                                    }, className: "px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm", children: [_jsx("option", { value: "", children: "\uC804\uCCB4" }), categories.map((cat) => (_jsxs("option", { value: cat.id, children: [cat.icon, " ", cat.name] }, cat.id)))] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "\uC815\uB82C:" }), _jsxs("select", { value: sort, onChange: (e) => {
                                                        setSort(e.target.value);
                                                        setPage(1);
                                                    }, className: "px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm", children: [_jsx("option", { value: "latest", children: "\uCD5C\uC2E0\uC21C" }), _jsx("option", { value: "popular", children: "\uC778\uAE30\uC21C" })] })] }), isLoggedIn && (_jsxs(Button, { variant: "primary", onClick: () => setShowCreateForm(!showCreateForm), className: "ml-auto", children: [_jsx(Plus, { size: 16, className: "mr-2" }), "\uD1A0\uB860 \uC791\uC131"] }))] }) }), showCreateForm && isLoggedIn && (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "\uC0C8 \uD1A0\uB860 \uC791\uC131" }), _jsxs("div", { className: "space-y-4", children: [_jsx(Input, { label: "\uC81C\uBAA9", value: createForm.title, onChange: (e) => setCreateForm({ ...createForm, title: e.target.value }), placeholder: "\uD1A0\uB860 \uC81C\uBAA9\uC744 \uC785\uB825\uD558\uC138\uC694" }), _jsx(TextArea, { label: "\uB0B4\uC6A9", value: createForm.content, onChange: (e) => setCreateForm({ ...createForm, content: e.target.value }), placeholder: "\uD1A0\uB860 \uB0B4\uC6A9\uC744 \uC785\uB825\uD558\uC138\uC694", rows: 6 }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(Input, { label: "\uC131\uACBD \uAD6C\uC808 \uCC38\uC870 (\uC120\uD0DD)", value: createForm.passageReference, onChange: (e) => setCreateForm({ ...createForm, passageReference: e.target.value }), placeholder: "\uC608: \uC694\uD55C\uBCF5\uC74C 3:16" }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "\uCE74\uD14C\uACE0\uB9AC (\uC120\uD0DD)" }), _jsxs("select", { value: createForm.categoryId || '', onChange: (e) => setCreateForm({ ...createForm, categoryId: e.target.value ? parseInt(e.target.value) : undefined }), className: "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white", children: [_jsx("option", { value: "", children: "\uC120\uD0DD \uC548 \uD568" }), categories.map((cat) => (_jsxs("option", { value: cat.id, children: [cat.icon, " ", cat.name] }, cat.id)))] })] })] }), _jsx(TextArea, { label: "\uC131\uACBD \uAD6C\uC808 \uBCF8\uBB38 (\uC120\uD0DD)", value: createForm.passageText, onChange: (e) => setCreateForm({ ...createForm, passageText: e.target.value }), placeholder: "\uC131\uACBD \uAD6C\uC808 \uBCF8\uBB38\uC744 \uC785\uB825\uD558\uC138\uC694", rows: 3 }), error && (_jsx("div", { className: "text-sm text-red-600 dark:text-red-400", children: error })), _jsxs("div", { className: "flex justify-end space-x-2", children: [_jsx(Button, { variant: "ghost", onClick: () => setShowCreateForm(false), children: "\uCDE8\uC18C" }), _jsx(Button, { variant: "primary", onClick: handleCreateDiscussion, children: "\uC791\uC131" })] })] })] })), loading ? (_jsx("div", { className: "text-center py-8 text-gray-500", children: "\uB85C\uB529 \uC911..." })) : error ? (_jsx("div", { className: "text-center py-8 text-red-500", children: error })) : discussions.length === 0 ? (_jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6", children: _jsxs("div", { className: "text-center py-8 text-gray-500 dark:text-gray-400", children: ["\uC544\uC9C1 \uD1A0\uB860\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.", isLoggedIn && (_jsx("div", { className: "mt-4", children: _jsx(Button, { variant: "primary", onClick: () => setShowCreateForm(true), children: "\uCCAB \uD1A0\uB860 \uC791\uC131\uD558\uAE30" }) }))] }) })) : (_jsx("div", { className: "space-y-4", children: discussions.map((disc) => (_jsx(DiscussionCard, { ...disc, onLike: () => handleLike(disc.id), onBookmark: () => handleBookmark(disc.id) }, disc.id))) }))] }), _jsxs("aside", { children: [_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6", children: [_jsx("h4", { className: "font-semibold mb-3", children: "\uCE74\uD14C\uACE0\uB9AC" }), _jsxs("div", { className: "space-y-2", children: [_jsx("button", { onClick: () => {
                                                    setSelectedCategory(null);
                                                    setPage(1);
                                                }, className: `w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${selectedCategory === null
                                                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`, children: "\uC804\uCCB4" }), categories.map((cat) => (_jsxs("button", { onClick: () => {
                                                    setSelectedCategory(cat.id);
                                                    setPage(1);
                                                }, className: `w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center ${selectedCategory === cat.id
                                                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`, children: [_jsx("span", { className: "mr-2", children: cat.icon }), cat.name] }, cat.id)))] })] }), _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mt-4", children: [_jsx("h4", { className: "font-semibold mb-3", children: "\uD1A0\uB860 \uAC00\uC774\uB4DC" }), _jsxs("ul", { className: "text-sm text-gray-600 dark:text-gray-400 space-y-2", children: [_jsx("li", { children: "\u2022 \uC11C\uB85C\uB97C \uC874\uC911\uD558\uBA70 \uB300\uD654\uD558\uC138\uC694" }), _jsx("li", { children: "\u2022 \uC131\uACBD \uB9D0\uC500\uC744 \uC911\uC2EC\uC73C\uB85C \uD1A0\uB860\uD558\uC138\uC694" }), _jsx("li", { children: "\u2022 \uAC74\uC124\uC801\uC778 \uC758\uACAC\uC744 \uB098\uB220\uC8FC\uC138\uC694" }), _jsx("li", { children: "\u2022 \uBD80\uC801\uC808\uD55C \uB0B4\uC6A9\uC740 \uC2E0\uACE0\uD574\uC8FC\uC138\uC694" })] })] })] })] })] }));
};
export default DiscussionPage;
