import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import Card from '../components/Card';
import DiscussionCard from '../components/ui/DiscussionCard';
import CommentItem from '../components/ui/CommentItem';
import { Input } from '../components/ui/Input';
import { TextArea } from '../components/ui/TextArea';
import Button from '../components/ui/Button';
import { MessageCircle, Plus, Filter, BookOpen, ArrowLeft, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiService, Discussion, Comment, Category } from '../services/api';

// 타입은 services/api.ts에서 import

const DiscussionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token, isLoggedIn } = useAuth();

  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 필터 상태
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sort, setSort] = useState<'latest' | 'popular'>('latest');
  const [page, setPage] = useState(1);

  // 작성 폼 상태
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    content: '',
    passageReference: '',
    passageText: '',
    categoryId: undefined as number | undefined,
  });

  // 댓글 작성 상태
  const [commentContent, setCommentContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
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
      } catch (err) {
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
    } catch (err: any) {
      setError('토론 목록을 불러오는데 실패했습니다.');
      console.error('Failed to load discussions:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadDiscussion = async (discussionId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getDiscussion(token, discussionId);
      if (response.success && response.data) {
        setDiscussion(response.data.discussion);
      }
    } catch (err: any) {
      setError('토론을 불러오는데 실패했습니다.');
      console.error('Failed to load discussion:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async (discussionId: string) => {
    if (!token) return;
    try {
      const response = await apiService.getComments(token, discussionId);
      if (response.success && response.data) {
        setComments(response.data.comments || []);
      }
    } catch (err) {
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
    } catch (err: any) {
      setError('토론 작성에 실패했습니다.');
      console.error('Failed to create discussion:', err);
    }
  };

  const handleLike = async (discussionId: string) => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await apiService.toggleDiscussionLike(token, discussionId);
      if (isDetailPage && discussion) {
        loadDiscussion(discussionId);
      } else {
        loadDiscussions();
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  const handleBookmark = async (discussionId: string) => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await apiService.toggleBookmark(token, discussionId);
      if (isDetailPage && discussion) {
        loadDiscussion(discussionId);
      } else {
        loadDiscussions();
      }
    } catch (err) {
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
    } catch (err: any) {
      setError('댓글 작성에 실패했습니다.');
      console.error('Failed to create comment:', err);
    }
  };

  const handleReplyComment = async (parentId: string, content: string) => {
    if (!token || !id) return;

    try {
      await apiService.createComment(token, id, content, parentId);
      setReplyContent('');
      setReplyingTo(null);
      loadComments(id);
    } catch (err) {
      console.error('Failed to reply comment:', err);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!token) return;

    try {
      await apiService.toggleCommentLike(token, commentId);
      if (id) {
        loadComments(id);
      }
    } catch (err) {
      console.error('Failed to toggle comment like:', err);
    }
  };

  // 상세 페이지
  if (isDetailPage) {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-500">로딩 중...</div>
        </div>
      );
    }

    if (error || !discussion) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="text-red-500 mb-4">{error || '토론을 찾을 수 없습니다.'}</div>
          <Button onClick={() => navigate('/discussions')}>목록으로</Button>
        </div>
      );
    }

    return (
      <div>
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/discussions')}
            className="mb-4"
          >
            <ArrowLeft size={16} className="mr-2" />
            목록으로
          </Button>
          <PageHeader
            title={discussion.title}
            description={`${discussion.author_nickname} • ${new Date(discussion.created_at).toLocaleDateString('ko-KR')}`}
            icon={<MessageCircle size={28} />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* 토론 내용 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
              {discussion.passage_reference && (
                <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-start">
                    <BookOpen size={20} className="text-blue-600 dark:text-blue-400 mr-3 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-blue-900 dark:text-blue-200 mb-2">
                        {discussion.passage_reference}
                      </div>
                      {discussion.passage_text && (
                        <div className="text-blue-700 dark:text-blue-300 italic">
                          "{discussion.passage_text}"
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="prose dark:prose-invert max-w-none">
                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {discussion.content}
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleLike(discussion.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                      discussion.is_liked
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Heart size={18} className={discussion.is_liked ? 'fill-current' : ''} />
                    <span>{discussion.like_count}</span>
                  </button>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <MessageCircle size={18} />
                    <span>{discussion.comment_count}</span>
                  </div>
                </div>
                {isLoggedIn && (
                  <button
                    onClick={() => handleBookmark(discussion.id)}
                    className={`p-2 rounded-md transition-colors ${
                      discussion.is_bookmarked
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : 'text-gray-400 dark:text-gray-500 hover:text-yellow-500 dark:hover:text-yellow-400'
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill={discussion.is_bookmarked ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* 댓글 작성 */}
            {isLoggedIn && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">댓글 작성</h3>
                <TextArea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="댓글을 입력하세요..."
                  rows={4}
                />
                <div className="flex justify-end mt-4">
                  <Button variant="primary" onClick={handleCreateComment}>
                    작성
                  </Button>
                </div>
              </div>
            )}

            {/* 댓글 목록 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-4">
                댓글 {discussion.comment_count}
              </h3>
              {comments.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  아직 댓글이 없습니다.
                </div>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      onLike={() => handleLikeComment(comment.id)}
                      onReply={handleReplyComment}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 사이드바 */}
          <aside>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h4 className="font-semibold mb-3">토론 가이드</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>• 서로를 존중하며 대화하세요</li>
                <li>• 성경 말씀을 중심으로 토론하세요</li>
                <li>• 건설적인 의견을 나눠주세요</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  // 목록 페이지
  return (
    <div>
      <PageHeader
        title="토론"
        description="성경 말씀에 대해 함께 나눠요"
        icon={<MessageCircle size={28} />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* 필터 및 정렬 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Filter size={18} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">카테고리:</span>
                <select
                  value={selectedCategory || ''}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value ? parseInt(e.target.value) : null);
                    setPage(1);
                  }}
                  className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                >
                  <option value="">전체</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">정렬:</span>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value as 'latest' | 'popular');
                    setPage(1);
                  }}
                  className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                >
                  <option value="latest">최신순</option>
                  <option value="popular">인기순</option>
                </select>
              </div>
              {isLoggedIn && (
                <Button
                  variant="primary"
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="ml-auto"
                >
                  <Plus size={16} className="mr-2" />
                  토론 작성
                </Button>
              )}
            </div>
          </div>

          {/* 토론 작성 폼 */}
          {showCreateForm && isLoggedIn && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">새 토론 작성</h3>
              <div className="space-y-4">
                <Input
                  label="제목"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  placeholder="토론 제목을 입력하세요"
                />
                <TextArea
                  label="내용"
                  value={createForm.content}
                  onChange={(e) => setCreateForm({ ...createForm, content: e.target.value })}
                  placeholder="토론 내용을 입력하세요"
                  rows={6}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="성경 구절 참조 (선택)"
                    value={createForm.passageReference}
                    onChange={(e) => setCreateForm({ ...createForm, passageReference: e.target.value })}
                    placeholder="예: 요한복음 3:16"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      카테고리 (선택)
                    </label>
                    <select
                      value={createForm.categoryId || ''}
                      onChange={(e) => setCreateForm({ ...createForm, categoryId: e.target.value ? parseInt(e.target.value) : undefined })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="">선택 안 함</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <TextArea
                  label="성경 구절 본문 (선택)"
                  value={createForm.passageText}
                  onChange={(e) => setCreateForm({ ...createForm, passageText: e.target.value })}
                  placeholder="성경 구절 본문을 입력하세요"
                  rows={3}
                />
                {error && (
                  <div className="text-sm text-red-600 dark:text-red-400">{error}</div>
                )}
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" onClick={() => setShowCreateForm(false)}>
                    취소
                  </Button>
                  <Button variant="primary" onClick={handleCreateDiscussion}>
                    작성
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 토론 목록 */}
          {loading ? (
            <div className="text-center py-8 text-gray-500">로딩 중...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : discussions.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                아직 토론이 없습니다.
                {isLoggedIn && (
                  <div className="mt-4">
                    <Button variant="primary" onClick={() => setShowCreateForm(true)}>
                      첫 토론 작성하기
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {discussions.map((disc) => (
                <DiscussionCard
                  key={disc.id}
                  {...disc}
                  onLike={() => handleLike(disc.id)}
                  onBookmark={() => handleBookmark(disc.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* 사이드바 */}
        <aside>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h4 className="font-semibold mb-3">카테고리</h4>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setPage(1);
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedCategory === null
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                전체
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setPage(1);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-2">{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mt-4">
            <h4 className="font-semibold mb-3">토론 가이드</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <li>• 서로를 존중하며 대화하세요</li>
              <li>• 성경 말씀을 중심으로 토론하세요</li>
              <li>• 건설적인 의견을 나눠주세요</li>
              <li>• 부적절한 내용은 신고해주세요</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DiscussionPage;

