import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { apiService } from '../services/api';
import Card from '../components/Card';
import { MessageCircle, Heart, Share2, Send, TrendingUp, BookOpen } from 'lucide-react';
import { cn } from '../utils/cn';
import { layout, button, input, card, text, state } from '../utils/styles';
import { Loading } from '../components/Loading';
const Community = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [newPost, setNewPost] = useState('');
    const [selectedPassage, setSelectedPassage] = useState('');
    const [newComments, setNewComments] = useState({});
    // 나눔 목록 조회 (React Query 캐싱: 5분)
    const { data: posts = [], isLoading: loading, refetch: refetchPosts } = useQuery({
        queryKey: ['community-posts'],
        queryFn: async () => {
            const data = await apiService.getCommunityPosts();
            return data.map((post) => ({
                ...post,
                timestamp: new Date(post.created_at)
            }));
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        enabled: !!user, // 로그인한 경우에만 조회
    });
    // 각 나눔의 댓글 조회 (React Query 캐싱: 10분)
    const commentsQueries = useQuery({
        queryKey: ['community-comments', posts.map(p => p.id)],
        queryFn: async () => {
            const commentsMap = {};
            await Promise.all(posts.map(async (post) => {
                const data = await apiService.getCommunityComments(post.id);
                commentsMap[post.id] = data.map((comment) => ({
                    ...comment,
                    timestamp: new Date(comment.created_at)
                }));
            }));
            return commentsMap;
        },
        staleTime: 10 * 60 * 1000,
        gcTime: 20 * 60 * 1000,
        enabled: posts.length > 0,
    });
    const comments = commentsQueries.data || {};
    // 프리페칭: 다음 페이지 데이터 미리 로드
    useEffect(() => {
        if (!user || loading || posts.length === 0)
            return;
        // 스크롤이 하단 80% 지점에 도달하면 다음 데이터 프리페치
        const handleScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = document.documentElement.clientHeight;
            const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
            // 80% 지점에 도달하면 프리페치
            if (scrollPercentage > 0.8) {
                // 다음 페이지 데이터 프리페치 (현재는 같은 쿼리지만 향후 페이지네이션 추가 시 활용)
                queryClient.prefetchQuery({
                    queryKey: ['community-posts'],
                    queryFn: async () => {
                        const data = await apiService.getCommunityPosts();
                        return data.map((post) => ({
                            ...post,
                            timestamp: new Date(post.created_at)
                        }));
                    },
                    staleTime: 5 * 60 * 1000,
                });
            }
        };
        // 스크롤 이벤트 리스너 추가 (throttle 적용)
        let ticking = false;
        const throttledHandleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', throttledHandleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', throttledHandleScroll);
        };
    }, [user, loading, posts.length, queryClient]);
    // 실시간 구독 설정
    useEffect(() => {
        if (!user)
            return;
        // 나눔 실시간 구독
        const postsChannel = supabase
            .channel('community-posts')
            .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'community_posts'
        }, (payload) => {
            console.log('📢 나눔 변경 감지:', payload.eventType, payload.new);
            if (payload.eventType === 'INSERT') {
                // 새 나눔 추가
                queryClient.invalidateQueries({ queryKey: ['community-posts'] });
            }
            else if (payload.eventType === 'UPDATE') {
                // 나눔 수정
                queryClient.invalidateQueries({ queryKey: ['community-posts'] });
            }
            else if (payload.eventType === 'DELETE') {
                // 나눔 삭제
                queryClient.setQueryData(['community-posts'], (old = []) => old.filter(post => post.id !== payload.old.id));
            }
        })
            .subscribe();
        // 댓글 실시간 구독
        const commentsChannel = supabase
            .channel('community-comments')
            .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'community_comments'
        }, (payload) => {
            console.log('💬 댓글 변경 감지:', payload.eventType, payload.new);
            if (payload.eventType === 'INSERT') {
                // 새 댓글 추가
                const newComment = payload.new;
                const postId = newComment.post_id;
                // 사용자 정보 조회 및 캐시 업데이트
                const updateCommentCache = (userData) => {
                    queryClient.setQueryData(['community-comments', posts.map(p => p.id)], (old = {}) => {
                        const existingComments = old[postId] || [];
                        // 중복 방지
                        if (existingComments.some(c => c.id === newComment.id)) {
                            return old;
                        }
                        return {
                            ...old,
                            [postId]: [
                                ...existingComments,
                                {
                                    id: newComment.id,
                                    author: {
                                        name: userData?.name || '알 수 없음',
                                        nickname: userData?.nickname || '',
                                        avatar: '👤'
                                    },
                                    content: newComment.content,
                                    timestamp: new Date(newComment.created_at)
                                }
                            ]
                        };
                    });
                };
                (async () => {
                    try {
                        const { data: userData } = await supabase
                            .from('users')
                            .select('name, nickname')
                            .eq('id', newComment.user_id)
                            .single();
                        updateCommentCache(userData);
                    }
                    catch {
                        // 사용자 정보 조회 실패 시 기본값 사용
                        updateCommentCache(null);
                    }
                })();
                // 나눔의 댓글 수 업데이트
                queryClient.setQueryData(['community-posts'], (old = []) => old.map(post => post.id === payload.new.post_id
                    ? { ...post, comments: post.comments + 1 }
                    : post));
            }
            else if (payload.eventType === 'DELETE') {
                // 댓글 삭제
                const deletedComment = payload.old;
                queryClient.setQueryData(['community-comments', posts.map(p => p.id)], (old = {}) => {
                    const postId = deletedComment.post_id;
                    return {
                        ...old,
                        [postId]: (old[postId] || []).filter(c => c.id !== deletedComment.id)
                    };
                });
                // 나눔의 댓글 수 업데이트
                queryClient.setQueryData(['community-posts'], (old = []) => old.map(post => post.id === deletedComment.post_id
                    ? { ...post, comments: Math.max(0, post.comments - 1) }
                    : post));
            }
        })
            .subscribe();
        // 아멘 실시간 구독
        const likesChannel = supabase
            .channel('community-likes')
            .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'community_likes'
        }, (payload) => {
            console.log('❤️ 아멘 변경 감지:', payload.eventType, payload.new);
            if (payload.eventType === 'INSERT') {
                // 새 아멘 추가
                const newLike = payload.new;
                queryClient.setQueryData(['community-posts'], (old = []) => old.map(post => post.id === newLike.post_id
                    ? {
                        ...post,
                        likes: post.likes + 1,
                        isLiked: newLike.user_id === user.id ? true : post.isLiked
                    }
                    : post));
            }
            else if (payload.eventType === 'DELETE') {
                // 아멘 제거
                const deletedLike = payload.old;
                queryClient.setQueryData(['community-posts'], (old = []) => old.map(post => post.id === deletedLike.post_id
                    ? {
                        ...post,
                        likes: Math.max(0, post.likes - 1),
                        isLiked: deletedLike.user_id === user.id ? false : post.isLiked
                    }
                    : post));
            }
        })
            .subscribe();
        // 정리 함수
        return () => {
            postsChannel.unsubscribe();
            commentsChannel.unsubscribe();
            likesChannel.unsubscribe();
        };
    }, [user, posts, queryClient]);
    // 나눔 생성 Mutation
    const createPostMutation = useMutation({
        mutationFn: async ({ content, passage }) => {
            return await apiService.createCommunityPost(content, passage);
        },
        onSuccess: () => {
            // 나눔 목록 캐시 무효화 및 리프레시
            queryClient.invalidateQueries({ queryKey: ['community-posts'] });
            setNewPost('');
            setSelectedPassage('');
        },
        onError: (error) => {
            console.error('Failed to create post:', error);
            alert('나눔 작성에 실패했습니다.');
        },
    });
    // 아멘 토글 Mutation
    const toggleLikeMutation = useMutation({
        mutationFn: async (postId) => {
            return await apiService.toggleCommunityLike(postId);
        },
        onSuccess: (isLiked, postId) => {
            // 나눔 목록 캐시 업데이트
            queryClient.setQueryData(['community-posts'], (old = []) => old.map(post => post.id === postId
                ? {
                    ...post,
                    isLiked,
                    likes: isLiked ? post.likes + 1 : post.likes - 1,
                }
                : post));
        },
        onError: (error) => {
            console.error('Failed to toggle like:', error);
        },
    });
    // 댓글 생성 Mutation
    const createCommentMutation = useMutation({
        mutationFn: async ({ postId, content }) => {
            return await apiService.createCommunityComment(postId, content);
        },
        onSuccess: (comment, variables) => {
            const { postId } = variables;
            // 댓글 캐시 업데이트
            queryClient.setQueryData(['community-comments', posts.map(p => p.id)], (old = {}) => ({
                ...old,
                [postId]: [...(old[postId] || []), {
                        ...comment,
                        timestamp: new Date(comment.created_at),
                    }],
            }));
            // 나눔 목록의 댓글 수 업데이트
            queryClient.setQueryData(['community-posts'], (old = []) => old.map(post => post.id === postId
                ? { ...post, comments: post.comments + 1 }
                : post));
            setNewComments(prev => ({ ...prev, [postId]: '' }));
        },
        onError: (error) => {
            console.error('Failed to create comment:', error);
            alert('댓글 작성에 실패했습니다.');
        },
    });
    const handleCreatePost = () => {
        if (!newPost.trim() || !user)
            return;
        createPostMutation.mutate({ content: newPost, passage: selectedPassage || null });
    };
    const handleLike = (postId) => {
        if (!user) {
            alert('로그인이 필요합니다.');
            return;
        }
        toggleLikeMutation.mutate(postId);
    };
    const handleAddComment = (postId) => {
        const commentText = newComments[postId];
        if (!commentText?.trim() || !user)
            return;
        createCommentMutation.mutate({ postId, content: commentText });
    };
    const formatTimestamp = (date) => {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (minutes < 1)
            return '방금 전';
        if (minutes < 60)
            return `${minutes}분 전`;
        if (hours < 24)
            return `${hours}시간 전`;
        if (days < 7)
            return `${days}일 전`;
        return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
    };
    return (_jsx("div", { className: layout.pageContainer, children: _jsxs("div", { className: layout.containerMd, children: [_jsxs("header", { className: layout.header, children: [_jsx("h1", { className: layout.title, children: "\uC131\uACBD \uC77D\uAE30 \uCEE4\uBBA4\uB2C8\uD2F0" }), _jsx("p", { className: layout.subtitle, children: "\uB2E4\uB978 \uC131\uB3C4\uB4E4\uACFC \uD568\uAED8 \uB098\uB204\uB294 \uC131\uACBD \uC77D\uAE30 \uACBD\uD5D8" })] }), _jsx("div", { className: "mb-8", children: _jsx(Card, { title: "\uC0C8 \uB098\uB214 \uC791\uC131", icon: _jsx(MessageCircle, { size: 24 }), children: _jsxs("div", { className: "space-y-4", children: [_jsx("textarea", { value: newPost, onChange: (e) => setNewPost(e.target.value), placeholder: "\uC624\uB298 \uC77D\uC740 \uC131\uACBD \uAD6C\uC808\uC5D0 \uB300\uD55C \uC0DD\uAC01\uC744 \uACF5\uC720\uD574\uBCF4\uC138\uC694...", className: input.textarea, rows: 4 }), _jsx("input", { type: "text", value: selectedPassage, onChange: (e) => setSelectedPassage(e.target.value), placeholder: "\uAD00\uB828 \uC131\uACBD \uAD6C\uC808 (\uC120\uD0DD\uC0AC\uD56D)", className: cn(input.base, 'py-2') }), _jsx("button", { onClick: handleCreatePost, disabled: !newPost.trim() || !user || createPostMutation.isPending, className: cn(button.primary, 'w-full'), children: createPostMutation.isPending ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "h-5 w-5 rounded-full border-2 border-white/30" }), _jsx("div", { className: "absolute top-0 left-0 h-5 w-5 rounded-full border-2 border-transparent border-t-white animate-spin" })] }), _jsx("span", { className: "animate-pulse", children: "\uC62C\uB9AC\uB294 \uC911..." })] })) : (_jsxs(_Fragment, { children: [_jsx(Send, { size: 20 }), "\uB098\uB214 \uC62C\uB9AC\uAE30"] })) }), !user && (_jsx("p", { className: cn(text.small, text.center), children: "\uB098\uB214\uC744 \uC791\uC131\uD558\uB824\uBA74 \uB85C\uADF8\uC778\uC774 \uD544\uC694\uD569\uB2C8\uB2E4." }))] }) }) }), _jsx("div", { className: "mb-8", children: _jsx(Card, { title: "\uCEE4\uBBA4\uB2C8\uD2F0 \uD604\uD669", children: _jsxs("div", { className: card.grid3, children: [_jsxs("div", { className: text.center, children: [_jsx(TrendingUp, { size: 32, className: "text-primary-600 mx-auto mb-2" }), _jsx("div", { className: text.large, children: posts.length }), _jsx("div", { className: text.small, children: "\uCD1D \uB098\uB214" })] }), _jsxs("div", { className: text.center, children: [_jsx(Heart, { size: 32, className: "text-red-500 mx-auto mb-2" }), _jsx("div", { className: text.large, children: posts.reduce((acc, post) => acc + post.likes, 0) }), _jsx("div", { className: text.small, children: "\uCD1D \uC544\uBA58" })] }), _jsxs("div", { className: text.center, children: [_jsx(MessageCircle, { size: 32, className: "text-primary-600 dark:text-primary-400 mx-auto mb-2" }), _jsx("div", { className: text.large, children: posts.reduce((acc, post) => acc + post.comments, 0) }), _jsx("div", { className: text.small, children: "\uCD1D \uB313\uAE00" })] })] }) }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white mb-6", children: "\uCD5C\uC2E0 \uB098\uB214" }), loading ? (_jsx(Card, { children: _jsx(Loading, { size: "lg", text: "\uB098\uB214\uC744 \uBD88\uB7EC\uC624\uB294 \uC911..." }) })) : posts.length === 0 ? (_jsx(Card, { children: _jsxs("div", { className: cn(state.loading, 'flex-col py-12'), children: [_jsx(MessageCircle, { size: 64, className: "text-gray-400 dark:text-gray-500 mb-4" }), _jsx("h3", { className: cn('text-xl font-semibold', text.bold, 'mb-2'), children: "\uC544\uC9C1 \uB098\uB214\uC774 \uC5C6\uC2B5\uB2C8\uB2E4" }), _jsx("p", { className: text.secondary, children: "\uCCAB \uBC88\uC9F8 \uB098\uB214\uC744 \uC791\uC131\uD574\uBCF4\uC138\uC694!" })] }) })) : (_jsx("div", { className: "space-y-6", children: posts.map((post) => (_jsxs(Card, { children: [_jsxs("div", { className: cn('flex items-center gap-3 mb-4 pb-4', 'border-b border-gray-200 dark:border-gray-700'), children: [_jsx("div", { className: "text-3xl", children: post.author.avatar }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: cn('font-semibold', text.bold), children: post.author.nickname || post.author.name }), _jsx("div", { className: cn('text-sm', text.muted), children: formatTimestamp(post.timestamp) })] })] }), _jsxs("div", { className: "mb-4", children: [_jsx("p", { className: cn('leading-relaxed mb-3', text.secondary), children: post.content }), post.passage && (_jsxs("div", { className: cn('inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium', 'bg-primary-50 dark:bg-primary-900/30', 'border border-primary-200 dark:border-primary-700', 'text-primary-700 dark:text-primary-300'), children: [_jsx(BookOpen, { size: 16 }), post.passage] }))] }), _jsxs("div", { className: cn('flex items-center gap-4 mb-4 pb-4', 'border-b border-gray-200 dark:border-gray-700'), children: [_jsxs("button", { onClick: () => handleLike(post.id), disabled: !user, className: cn(button.icon, 'px-4 py-2 rounded-lg font-medium transition-all', post.isLiked
                                                    ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50'
                                                    : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700', button.disabled), children: [_jsx(Heart, { size: 18, className: post.isLiked ? 'fill-current' : '' }), "\uC544\uBA58 ", post.likes] }), _jsxs("button", { className: cn(button.icon, 'px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-all'), children: [_jsx(MessageCircle, { size: 18 }), "\uB313\uAE00 ", post.comments] }), _jsxs("button", { className: cn(button.icon, 'px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-all'), children: [_jsx(Share2, { size: 18 }), "\uACF5\uC720"] })] }), _jsxs("div", { className: "space-y-4", children: [comments[post.id]?.map((comment) => (_jsxs("div", { className: cn('flex gap-3 p-3 rounded-lg', 'bg-gray-50 dark:bg-gray-800'), children: [_jsx("div", { className: "text-xl", children: comment.author.avatar }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("span", { className: cn('font-semibold text-sm', text.bold), children: comment.author.nickname || comment.author.name }), _jsx("span", { className: cn('text-xs', text.muted), children: formatTimestamp(comment.timestamp) })] }), _jsx("p", { className: cn('text-sm', text.secondary), children: comment.content })] })] }, comment.id))), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: newComments[post.id] || '', onChange: (e) => setNewComments(prev => ({
                                                            ...prev,
                                                            [post.id]: e.target.value
                                                        })), placeholder: "\uB313\uAE00\uC744 \uC785\uB825\uD558\uC138\uC694...", disabled: !user, className: cn(input.base, 'flex-1 py-2', 'disabled:opacity-50') }), _jsx("button", { onClick: () => handleAddComment(post.id), disabled: !newComments[post.id]?.trim() || !user, className: cn('px-4 py-2 bg-gradient-primary text-white rounded-lg', 'hover:shadow-lg transition-all', button.disabled), children: _jsx(Send, { size: 18 }) })] })] })] }, post.id))) }))] })] }) }));
};
export default Community;
