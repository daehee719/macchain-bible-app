import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { apiService } from '../services/api'
import Card from '../components/Card'
import { MessageCircle, Heart, Share2, Send, TrendingUp, BookOpen } from 'lucide-react'
import { cn } from '../utils/cn'
import { layout, button, input, card, text, state } from '../utils/styles'

interface Post {
  id: string
  author: {
    name: string
    nickname: string
    avatar: string
  }
  content: string
  passage?: string
  likes: number
  comments: number
  timestamp: Date
  isLiked: boolean
}

interface Comment {
  id: string
  author: {
    name: string
    nickname: string
    avatar: string
  }
  content: string
  timestamp: Date
}

const Community: React.FC = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [newPost, setNewPost] = useState('')
  const [selectedPassage, setSelectedPassage] = useState('')
  const [newComments, setNewComments] = useState<{ [postId: string]: string }>({})

  // 나눔 목록 조회 (React Query 캐싱: 5분)
  const { data: posts = [], isLoading: loading, refetch: refetchPosts } = useQuery<Post[]>({
    queryKey: ['community-posts'],
    queryFn: async () => {
      const data = await (apiService as any).getCommunityPosts()
      return data.map((post: any) => ({
        ...post,
        timestamp: new Date(post.created_at)
      }))
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분 (v5에서 cacheTime → gcTime으로 변경)
    enabled: !!user, // 로그인한 경우에만 조회
  })

  // 각 나눔의 댓글 조회 (React Query 캐싱: 10분)
  const commentsQueries = useQuery<{ [postId: string]: Comment[] }>({
    queryKey: ['community-comments', posts.map(p => p.id)],
    queryFn: async () => {
      const commentsMap: { [postId: string]: Comment[] } = {}
      await Promise.all(
        posts.map(async (post) => {
          const data = await (apiService as any).getCommunityComments(post.id)
          commentsMap[post.id] = data.map((comment: any) => ({
            ...comment,
            timestamp: new Date(comment.created_at)
          }))
        })
      )
      return commentsMap
    },
    staleTime: 10 * 60 * 1000, // 10분
    gcTime: 20 * 60 * 1000, // 20분 (v5에서 cacheTime → gcTime으로 변경)
    enabled: posts.length > 0,
  })

  const comments = commentsQueries.data || {}

  // 프리페칭: 다음 페이지 데이터 미리 로드
  useEffect(() => {
    if (!user || loading || posts.length === 0) return

    // 스크롤이 하단 80% 지점에 도달하면 다음 데이터 프리페치
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight
      const clientHeight = document.documentElement.clientHeight
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight

      // 80% 지점에 도달하면 프리페치
      if (scrollPercentage > 0.8) {
        // 다음 페이지 데이터 프리페치 (현재는 같은 쿼리지만 향후 페이지네이션 추가 시 활용)
        queryClient.prefetchQuery({
          queryKey: ['community-posts'],
          queryFn: async () => {
            const data = await (apiService as any).getCommunityPosts()
            return data.map((post: any) => ({
              ...post,
              timestamp: new Date(post.created_at)
            }))
          },
          staleTime: 5 * 60 * 1000,
        })
      }
    }

    // 스크롤 이벤트 리스너 추가 (throttle 적용)
    let ticking = false
    const throttledHandleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', throttledHandleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll)
    }
  }, [user, loading, posts.length, queryClient])

  // 실시간 구독 설정
  useEffect(() => {
    if (!user) return

    // 나눔 실시간 구독
    const postsChannel = supabase
      .channel('community-posts')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'community_posts'
        },
        (payload) => {
          console.log('📢 나눔 변경 감지:', payload.eventType, payload.new)
          
          if (payload.eventType === 'INSERT') {
            // 새 나눔 추가
            queryClient.invalidateQueries({ queryKey: ['community-posts'] })
          } else if (payload.eventType === 'UPDATE') {
            // 나눔 수정
            queryClient.invalidateQueries({ queryKey: ['community-posts'] })
          } else if (payload.eventType === 'DELETE') {
            // 나눔 삭제
            queryClient.setQueryData<Post[]>(['community-posts'], (old = []) =>
              old.filter(post => post.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    // 댓글 실시간 구독
    const commentsChannel = supabase
      .channel('community-comments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'community_comments'
        },
        (payload) => {
          console.log('💬 댓글 변경 감지:', payload.eventType, payload.new)
          
          if (payload.eventType === 'INSERT') {
            // 새 댓글 추가
            const newComment = payload.new as any
            const postId = newComment.post_id
            
            // 사용자 정보 조회 및 캐시 업데이트
            const updateCommentCache = (userData: any) => {
              queryClient.setQueryData<{ [postId: string]: Comment[] }>(
                ['community-comments', posts.map(p => p.id)],
                (old = {}) => {
                  const existingComments = old[postId] || []
                  
                  // 중복 방지
                  if (existingComments.some(c => c.id === newComment.id)) {
                    return old
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
                  }
                }
              )
            }

            // 사용자 정보 비동기 조회
            ;(async () => {
              try {
                const { data: userData } = await supabase
                  .from('users')
                  .select('name, nickname')
                  .eq('id', newComment.user_id)
                  .single()
                updateCommentCache(userData)
              } catch {
                // 사용자 정보 조회 실패 시 기본값 사용
                updateCommentCache(null)
              }
            })()
            // 나눔의 댓글 수 업데이트
            queryClient.setQueryData<Post[]>(['community-posts'], (old = []) =>
              old.map(post =>
                post.id === payload.new.post_id
                  ? { ...post, comments: post.comments + 1 }
                  : post
              )
            )
          } else if (payload.eventType === 'DELETE') {
            // 댓글 삭제
            const deletedComment = payload.old as any
            queryClient.setQueryData<{ [postId: string]: Comment[] }>(
              ['community-comments', posts.map(p => p.id)],
              (old = {}) => {
                const postId = deletedComment.post_id
                return {
                  ...old,
                  [postId]: (old[postId] || []).filter(c => c.id !== deletedComment.id)
                }
              }
            )
            // 나눔의 댓글 수 업데이트
            queryClient.setQueryData<Post[]>(['community-posts'], (old = []) =>
              old.map(post =>
                post.id === deletedComment.post_id
                  ? { ...post, comments: Math.max(0, post.comments - 1) }
                  : post
              )
            )
          }
        }
      )
      .subscribe()

    // 아멘 실시간 구독
    const likesChannel = supabase
      .channel('community-likes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'community_likes'
        },
        (payload) => {
          console.log('❤️ 아멘 변경 감지:', payload.eventType, payload.new)
          
          if (payload.eventType === 'INSERT') {
            // 새 아멘 추가
            const newLike = payload.new as any
            queryClient.setQueryData<Post[]>(['community-posts'], (old = []) =>
              old.map(post =>
                post.id === newLike.post_id
                  ? {
                      ...post,
                      likes: post.likes + 1,
                      isLiked: newLike.user_id === user.id ? true : post.isLiked
                    }
                  : post
              )
            )
          } else if (payload.eventType === 'DELETE') {
            // 아멘 제거
            const deletedLike = payload.old as any
            queryClient.setQueryData<Post[]>(['community-posts'], (old = []) =>
              old.map(post =>
                post.id === deletedLike.post_id
                  ? {
                      ...post,
                      likes: Math.max(0, post.likes - 1),
                      isLiked: deletedLike.user_id === user.id ? false : post.isLiked
                    }
                  : post
              )
            )
          }
        }
      )
      .subscribe()

    // 정리 함수
    return () => {
      postsChannel.unsubscribe()
      commentsChannel.unsubscribe()
      likesChannel.unsubscribe()
    }
  }, [user, posts, queryClient])

  // 나눔 생성 Mutation
  const createPostMutation = useMutation({
    mutationFn: async ({ content, passage }: { content: string; passage: string | null }) => {
      return await (apiService as any).createCommunityPost(content, passage)
    },
    onSuccess: () => {
      // 나눔 목록 캐시 무효화 및 리프레시
      queryClient.invalidateQueries({ queryKey: ['community-posts'] })
    setNewPost('')
    setSelectedPassage('')
    },
    onError: (error) => {
      console.error('Failed to create post:', error)
      alert('나눔 작성에 실패했습니다.')
    },
  })

  // 아멘 토글 Mutation
  const toggleLikeMutation = useMutation({
    mutationFn: async (postId: string) => {
      return await (apiService as any).toggleCommunityLike(postId)
    },
    onSuccess: (isLiked: boolean, postId: string) => {
      // 나눔 목록 캐시 업데이트
      queryClient.setQueryData<Post[]>(['community-posts'], (old = []) =>
        old.map(post =>
          post.id === postId
            ? {
                ...post,
                isLiked,
                likes: isLiked ? post.likes + 1 : post.likes - 1,
              }
            : post
        )
      )
    },
    onError: (error) => {
      console.error('Failed to toggle like:', error)
    },
  })

  // 댓글 생성 Mutation
  const createCommentMutation = useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      return await (apiService as any).createCommunityComment(postId, content)
    },
    onSuccess: (comment: any, variables: { postId: string; content: string }) => {
      const { postId } = variables
      // 댓글 캐시 업데이트
      queryClient.setQueryData<{ [postId: string]: Comment[] }>(
        ['community-comments', posts.map(p => p.id)],
        (old = {}) => ({
          ...old,
          [postId]: [...(old[postId] || []), {
            ...comment,
            timestamp: new Date(comment.created_at),
          }],
        })
      )
      // 나눔 목록의 댓글 수 업데이트
      queryClient.setQueryData<Post[]>(['community-posts'], (old = []) =>
        old.map(post =>
          post.id === postId
            ? { ...post, comments: post.comments + 1 }
            : post
        )
      )
      setNewComments(prev => ({ ...prev, [postId]: '' }))
    },
    onError: (error) => {
      console.error('Failed to create comment:', error)
      alert('댓글 작성에 실패했습니다.')
    },
  })

  const handleCreatePost = () => {
    if (!newPost.trim() || !user) return
    createPostMutation.mutate({ content: newPost, passage: selectedPassage || null })
  }

  const handleLike = (postId: string) => {
    if (!user) {
      alert('로그인이 필요합니다.')
      return
    }
    toggleLikeMutation.mutate(postId)
  }

  const handleAddComment = (postId: string) => {
    const commentText = newComments[postId]
    if (!commentText?.trim() || !user) return
    createCommentMutation.mutate({ postId, content: commentText })
  }

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (minutes < 1) return '방금 전'
    if (minutes < 60) return `${minutes}분 전`
    if (hours < 24) return `${hours}시간 전`
    if (days < 7) return `${days}일 전`
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
  }

  return (
    <div className={layout.pageContainer}>
      <div className={layout.containerMd}>
        {/* Header */}
        <header className={layout.header}>
          <h1 className={layout.title}>
            성경 읽기 커뮤니티
          </h1>
          <p className={layout.subtitle}>
            다른 성도들과 함께 나누는 성경 읽기 경험
          </p>
        </header>

        {/* Create Post */}
        <div className="mb-8">
          <Card title="새 나눔 작성" icon={<MessageCircle size={24} />}>
            <div className="space-y-4">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="오늘 읽은 성경 구절에 대한 생각을 공유해보세요..."
                className={input.textarea}
                rows={4}
              />
              <input
                type="text"
                value={selectedPassage}
                onChange={(e) => setSelectedPassage(e.target.value)}
                placeholder="관련 성경 구절 (선택사항)"
                className={cn(input.base, 'py-2')}
              />
              <button 
                onClick={handleCreatePost}
                disabled={!newPost.trim() || !user}
                className={cn(button.primary, 'w-full')}
              >
                <Send size={20} />
                나눔 올리기
              </button>
              {!user && (
                <p className={cn(text.small, text.center)}>
                  나눔을 작성하려면 로그인이 필요합니다.
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Community Stats */}
        <div className="mb-8">
          <Card title="커뮤니티 현황">
            <div className={card.grid3}>
              <div className={text.center}>
                <TrendingUp size={32} className="text-primary-600 mx-auto mb-2" />
                <div className={text.large}>{posts.length}</div>
                <div className={text.small}>총 나눔</div>
              </div>
              <div className={text.center}>
                <Heart size={32} className="text-red-500 mx-auto mb-2" />
                <div className={text.large}>
                  {posts.reduce((acc, post) => acc + post.likes, 0)}
                </div>
                <div className={text.small}>총 아멘</div>
              </div>
              <div className={text.center}>
                <MessageCircle size={32} className="text-primary-600 dark:text-primary-400 mx-auto mb-2" />
                <div className={text.large}>
                  {posts.reduce((acc, post) => acc + post.comments, 0)}
                </div>
                <div className={text.small}>총 댓글</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Posts Feed */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">최신 나눔</h2>
          {loading ? (
            <Card>
              <div className={cn(state.loading, 'flex-col py-12')}>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
                <p className={text.secondary}>나눔을 불러오는 중...</p>
              </div>
            </Card>
          ) : posts.length === 0 ? (
            <Card>
              <div className={cn(state.loading, 'flex-col py-12')}>
                <MessageCircle size={64} className="text-gray-400 dark:text-gray-500 mb-4" />
                <h3 className={cn('text-xl font-semibold', text.bold, 'mb-2')}>아직 나눔이 없습니다</h3>
                <p className={text.secondary}>첫 번째 나눔을 작성해보세요!</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <Card key={post.id}>
                  {/* Post Header */}
                  <div className={cn(
                    'flex items-center gap-3 mb-4 pb-4',
                    'border-b border-gray-200 dark:border-gray-700'
                  )}>
                    <div className="text-3xl">{post.author.avatar}</div>
                    <div className="flex-1">
                      <div className={cn('font-semibold', text.bold)}>
                        {post.author.nickname || post.author.name}
                      </div>
                      <div className={cn('text-sm', text.muted)}>
                        {formatTimestamp(post.timestamp)}
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="mb-4">
                    <p className={cn('leading-relaxed mb-3', text.secondary)}>
                      {post.content}
                    </p>
                    {post.passage && (
                      <div className={cn(
                        'inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium',
                        'bg-primary-50 dark:bg-primary-900/30',
                        'border border-primary-200 dark:border-primary-700',
                        'text-primary-700 dark:text-primary-300'
                      )}>
                        <BookOpen size={16} />
                        {post.passage}
                      </div>
                    )}
                  </div>

                  {/* Post Actions */}
                  <div className={cn(
                    'flex items-center gap-4 mb-4 pb-4',
                    'border-b border-gray-200 dark:border-gray-700'
                  )}>
                    <button 
                      onClick={() => handleLike(post.id)}
                      disabled={!user}
                      className={cn(
                        button.icon,
                        'px-4 py-2 rounded-lg font-medium transition-all',
                        post.isLiked 
                          ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50' 
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                        button.disabled
                      )}
                    >
                      <Heart size={18} className={post.isLiked ? 'fill-current' : ''} />
                      아멘 {post.likes}
                    </button>
                    <button className={cn(
                      button.icon,
                      'px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-all'
                    )}>
                      <MessageCircle size={18} />
                      댓글 {post.comments}
                    </button>
                    <button className={cn(
                      button.icon,
                      'px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-all'
                    )}>
                      <Share2 size={18} />
                      공유
                    </button>
                  </div>

                  {/* Comments Section */}
                  <div className="space-y-4">
                    {comments[post.id]?.map((comment) => (
                      <div 
                        key={comment.id} 
                        className={cn(
                          'flex gap-3 p-3 rounded-lg',
                          'bg-gray-50 dark:bg-gray-800'
                        )}
                      >
                        <div className="text-xl">{comment.author.avatar}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={cn('font-semibold text-sm', text.bold)}>
                              {comment.author.nickname || comment.author.name}
                            </span>
                            <span className={cn('text-xs', text.muted)}>
                              {formatTimestamp(comment.timestamp)}
                            </span>
                          </div>
                          <p className={cn('text-sm', text.secondary)}>{comment.content}</p>
                        </div>
                      </div>
                    ))}

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newComments[post.id] || ''}
                        onChange={(e) => setNewComments(prev => ({ 
                          ...prev, 
                          [post.id]: e.target.value 
                        }))}
                        placeholder="댓글을 입력하세요..."
                        disabled={!user}
                        className={cn(
                          input.base,
                          'flex-1 py-2',
                          'disabled:opacity-50'
                        )}
                      />
                      <button 
                        onClick={() => handleAddComment(post.id)}
                        disabled={!newComments[post.id]?.trim() || !user}
                        className={cn(
                          'px-4 py-2 bg-gradient-primary text-white rounded-lg',
                          'hover:shadow-lg transition-all',
                          button.disabled
                        )}
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Community
