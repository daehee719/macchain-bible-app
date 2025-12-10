/**
 * Community 페이지 전용 동기화 훅
 * SyncManager를 활용하여 Community 관련 동기화 로직 통합 관리
 */

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../contexts/AuthContext'
import { useSyncManager } from './useSyncManager'
import { supabase } from '../lib/supabase'

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

export function useCommunitySync(posts: Post[]) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const syncManager = useSyncManager()

  // 실시간 구독 설정
  useEffect(() => {
    if (!user) return

    // 나눔 실시간 구독
    const unsubscribePosts = syncManager.subscribe({
      channel: 'community-posts',
      table: 'community_posts',
      event: '*',
      handler: (payload) => {
        console.log('📢 나눔 변경 감지:', payload.eventType, payload.new)

        if (payload.eventType === 'INSERT') {
          queryClient.invalidateQueries({ queryKey: ['community-posts'] })
        } else if (payload.eventType === 'UPDATE') {
          queryClient.invalidateQueries({ queryKey: ['community-posts'] })
        } else if (payload.eventType === 'DELETE') {
          queryClient.setQueryData<Post[]>(['community-posts'], (old = []) =>
            old.filter(post => post.id !== payload.old.id)
          )
        }
      },
    })

    // 댓글 실시간 구독
    const unsubscribeComments = syncManager.subscribe({
      channel: 'community-comments',
      table: 'community_comments',
      event: '*',
      handler: (payload) => {
        console.log('💬 댓글 변경 감지:', payload.eventType, payload.new)

        if (payload.eventType === 'INSERT') {
          const newComment = payload.new as any
          const postId = newComment.post_id

          // 사용자 정보 조회 및 캐시 업데이트
          const updateCommentCache = (userData: any) => {
            queryClient.setQueryData<{ [postId: string]: Comment[] }>(
              ['community-comments', posts.map(p => p.id)],
              (old = {}) => {
                const existingComments = old[postId] || []

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
                        avatar: '👤',
                      },
                      content: newComment.content,
                      timestamp: new Date(newComment.created_at),
                    },
                  ],
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
          const deletedComment = payload.old as any
          queryClient.setQueryData<{ [postId: string]: Comment[] }>(
            ['community-comments', posts.map(p => p.id)],
            (old = {}) => {
              const postId = deletedComment.post_id
              return {
                ...old,
                [postId]: (old[postId] || []).filter(c => c.id !== deletedComment.id),
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
      },
    })

    // 아멘 실시간 구독
    const unsubscribeLikes = syncManager.subscribe({
      channel: 'community-likes',
      table: 'community_likes',
      event: '*',
      handler: async (payload) => {
        try {
          const { data: { user: currentUser } } = await supabase.auth.getUser()
          if (!currentUser) return

          // 다른 사용자의 좋아요 변경만 즉시 반영
          if (payload.eventType === 'INSERT') {
            const newLike = payload.new as any
            queryClient.setQueryData<Post[]>(['community-posts'], (old = []) =>
              old.map(post =>
                post.id === newLike.post_id
                  ? {
                      ...post,
                      likes: post.likes + 1,
                      isLiked: newLike.user_id === currentUser.id ? true : post.isLiked,
                    }
                  : post
              )
            )
          } else if (payload.eventType === 'DELETE') {
            const deletedLike = payload.old as any
            queryClient.setQueryData<Post[]>(['community-posts'], (old = []) =>
              old.map(post =>
                post.id === deletedLike.post_id
                  ? {
                      ...post,
                      likes: Math.max(0, post.likes - 1),
                      isLiked: deletedLike.user_id === currentUser.id ? false : post.isLiked,
                    }
                  : post
              )
            )
          }
        } catch (error) {
          console.error('실시간 좋아요 구독 에러:', error)
        }
      },
    })

    return () => {
      unsubscribePosts()
      unsubscribeComments()
      unsubscribeLikes()
    }
  }, [user, posts, queryClient, syncManager])
}

