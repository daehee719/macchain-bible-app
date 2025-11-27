import React, { useState, useEffect, useRef } from 'react';
import { Heart, Reply, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import Button from './Button';
import { TextArea } from './TextArea';

interface Comment {
  id: string;
  content: string;
  author_nickname: string;
  author_name: string;
  like_count: number;
  created_at: string;
  is_liked?: boolean;
  is_author?: boolean;
  replies?: Comment[];
}

interface CommentItemProps {
  comment: Comment;
  onLike?: () => void;
  onReply?: (parentId: string, content: string) => void;
  onEdit?: (commentId: string, content: string) => void;
  onDelete?: (commentId: string) => void;
  depth?: number;
}

export default function CommentItem({
  comment,
  onLike,
  onReply,
  onEdit,
  onDelete,
  depth = 0,
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [editContent, setEditContent] = useState(comment.content);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  const handleReply = () => {
    if (!replyContent.trim() || !onReply) return;
    onReply(comment.id, replyContent);
    setReplyContent('');
    setIsReplying(false);
  };

  const handleEdit = () => {
    if (!editContent.trim() || !onEdit) return;
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

  return (
    <div className={`${depth > 0 ? 'ml-8 mt-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        {/* 댓글 헤더 */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-900 dark:text-white">
              {comment.author_nickname}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(comment.created_at)}
            </span>
          </div>
          {comment.is_author && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <MoreVertical size={16} />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    <Edit2 size={14} className="mr-2" />
                    수정
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    <Trash2 size={14} className="mr-2" />
                    삭제
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 댓글 내용 */}
        {isEditing ? (
          <div className="space-y-2">
            <TextArea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={3}
            />
            <div className="flex items-center justify-end space-x-2">
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                취소
              </Button>
              <Button variant="primary" size="sm" onClick={handleEdit}>
                저장
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {comment.content}
          </p>
        )}

        {/* 댓글 액션 */}
        {!isEditing && (
          <div className="flex items-center space-x-4 mt-3">
            <button
              onClick={onLike}
              className={`flex items-center space-x-1 text-sm transition-colors ${
                comment.is_liked
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
              }`}
            >
              <Heart size={14} className={comment.is_liked ? 'fill-current' : ''} />
              <span>{comment.like_count}</span>
            </button>
            {canReply && onReply && (
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <Reply size={14} />
                <span>답글</span>
              </button>
            )}
          </div>
        )}

        {/* 답글 작성 폼 */}
        {isReplying && canReply && (
          <div className="mt-4 space-y-2">
            <TextArea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="답글을 입력하세요..."
              rows={2}
            />
            <div className="flex items-center justify-end space-x-2">
              <Button variant="ghost" size="sm" onClick={() => setIsReplying(false)}>
                취소
              </Button>
              <Button variant="primary" size="sm" onClick={handleReply}>
                작성
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 대댓글 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onLike={onLike}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

