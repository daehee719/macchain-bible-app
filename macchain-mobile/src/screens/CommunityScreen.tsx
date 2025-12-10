import React, { useState } from 'react'
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../contexts/AuthContext'
import { apiService, CommunityPost, CommunityComment } from '../services/api'
import { useSyncManager } from '../hooks/useSyncManager'
import { useCommunitySync } from '../hooks/useCommunitySync'
import { Ionicons } from '@expo/vector-icons'
import Toast from 'react-native-toast-message'
import { Loading } from '../components/Loading'
import Card from '../components/Card'

export default function CommunityScreen() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const syncManager = useSyncManager()
  const [newPost, setNewPost] = useState('')
  const [selectedPassage, setSelectedPassage] = useState('')
  const [newComments, setNewComments] = useState<{ [postId: string]: string }>({})
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set())
  const [processingPosts, setProcessingPosts] = useState<Set<string>>(new Set())

  // 나눔 목록 조회
  const { data: posts = [], isLoading: loading, refetch: refetchPosts } = useQuery<CommunityPost[]>({
    queryKey: ['community-posts'],
    queryFn: async () => {
      const data = await apiService.getCommunityPosts()
      return data.map((post: any) => ({
        ...post,
        timestamp: new Date(post.created_at),
        created_at: post.created_at
      }))
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!user,
  })

  // 각 나눔의 댓글 조회
  const commentsQueries = useQuery<{ [postId: string]: CommunityComment[] }>({
    queryKey: ['community-comments', posts.map(p => p.id)],
    queryFn: async () => {
      const commentsMap: { [postId: string]: CommunityComment[] } = {}
      await Promise.all(
        posts.map(async (post) => {
          const data = await apiService.getCommunityComments(post.id)
          commentsMap[post.id] = data.map((comment: any) => ({
            ...comment,
            timestamp: new Date(comment.created_at),
            created_at: comment.created_at
          }))
        })
      )
      return commentsMap
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
    enabled: posts.length > 0,
  })

  const comments = commentsQueries.data || {}

  // 실시간 구독 설정 (SyncManager 사용)
  useCommunitySync(posts)

  // 나눔 생성 Mutation (SyncManager 사용)
  const handleCreatePost = async () => {
    if (!newPost.trim() || !user) {
      Toast.show({
        type: 'error',
        text1: '나눔을 작성하려면 로그인이 필요합니다.',
      })
      return
    }

    const postId = `post-${Date.now()}`
    setProcessingPosts(prev => new Set(prev).add(postId))

    try {
      await syncManager.executeMutation(
        ['community-posts'],
        async () => {
          return await apiService.createCommunityPost(newPost, selectedPassage || null)
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['community-posts'] })
            setNewPost('')
            setSelectedPassage('')
            Toast.show({
              type: 'success',
              text1: '나눔이 성공적으로 작성되었습니다.',
            })
          },
          onError: (error) => {
            console.error('Failed to create post:', error)
            Toast.show({
              type: 'error',
              text1: '나눔 작성에 실패했습니다.',
            })
          },
        }
      )
    } finally {
      setProcessingPosts(prev => {
        const next = new Set(prev)
        next.delete(postId)
        return next
      })
    }
  }

  // 아멘 토글 Mutation (SyncManager 사용)
  const handleLike = async (postId: string) => {
    if (!user) {
      Toast.show({
        type: 'error',
        text1: '로그인이 필요합니다.',
      })
      return
    }

    if (processingPosts.has(postId)) return

    const post = posts.find(p => p.id === postId)
    if (!post) return

    setProcessingPosts(prev => new Set(prev).add(postId))

    try {
      await syncManager.executeMutation(
        ['community-posts'],
        async () => {
          return await apiService.toggleCommunityLike(postId)
        },
        {
          optimisticUpdate: (oldData: CommunityPost[] | undefined) => {
            if (!oldData) return oldData
            return oldData.map(p =>
              p.id === postId
                ? {
                    ...p,
                    isLiked: !p.isLiked,
                    likes: p.isLiked ? p.likes - 1 : p.likes + 1,
                  }
                : p
            )
          },
          onSuccess: (isLiked: boolean) => {
            queryClient.setQueryData<CommunityPost[]>(['community-posts'], (old = []) =>
              old.map(p => {
                if (p.id === postId) {
                  const finalLikes = isLiked
                    ? (post.isLiked ? post.likes : post.likes + 1)
                    : (post.isLiked ? post.likes - 1 : post.likes)

                  return {
                    ...p,
                    isLiked,
                    likes: Math.max(0, finalLikes),
                  }
                }
                return p
              })
            )
          },
          onError: (error) => {
            console.error('Failed to toggle like:', error)
            Toast.show({
              type: 'error',
              text1: '아멘 처리 중 오류가 발생했습니다.',
            })
          },
          retryConfig: {
            maxRetries: 2,
            retryDelay: 1000,
          },
        }
      )
    } finally {
      setProcessingPosts(prev => {
        const next = new Set(prev)
        next.delete(postId)
        return next
      })
    }
  }

  // 댓글 생성 Mutation (SyncManager 사용)
  const handleAddComment = async (postId: string) => {
    const commentText = newComments[postId]
    if (!commentText?.trim() || !user) {
      Toast.show({
        type: 'error',
        text1: '댓글을 작성하려면 로그인이 필요합니다.',
      })
      return
    }

    const processingId = `comment-${postId}-${Date.now()}`
    setProcessingPosts(prev => new Set(prev).add(processingId))

    try {
      const commentQueryKey = ['community-comments', posts.map(p => p.id)] as any

      await syncManager.executeMutation(
        commentQueryKey,
        async () => {
          return await apiService.createCommunityComment(postId, commentText)
        },
        {
          optimisticUpdate: (oldData: { [postId: string]: CommunityComment[] } | undefined) => {
            if (!oldData) return oldData
            return {
              ...oldData,
              [postId]: [
                ...(oldData[postId] || []),
                {
                  id: `temp-${Date.now()}`,
                  author: {
                    name: user.name,
                    nickname: user.nickname || '',
                    avatar: '👤',
                  },
                  content: commentText,
                  timestamp: new Date(),
                },
              ],
            }
          },
          onSuccess: (comment: any) => {
            queryClient.setQueryData<{ [postId: string]: CommunityComment[] }>(
              commentQueryKey,
              (old = {}) => ({
                ...old,
                [postId]: [...(old[postId] || []), {
                  ...comment,
                  timestamp: new Date(comment.created_at),
                }],
              })
            )
            queryClient.setQueryData<CommunityPost[]>(['community-posts'], (old = []) =>
              old.map(post =>
                post.id === postId
                  ? { ...post, comments: post.comments + 1 }
                  : post
              )
            )
            setNewComments(prev => ({ ...prev, [postId]: '' }))
            Toast.show({
              type: 'success',
              text1: '댓글이 성공적으로 작성되었습니다.',
            })
          },
          onError: (error) => {
            console.error('Failed to create comment:', error)
            Toast.show({
              type: 'error',
              text1: '댓글 작성에 실패했습니다.',
            })
          },
        }
      )
    } finally {
      setProcessingPosts(prev => {
        const next = new Set(prev)
        next.delete(processingId)
        return next
      })
    }
  }

  const toggleComments = (postId: string) => {
    const newExpanded = new Set(expandedPosts)
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId)
    } else {
      newExpanded.add(postId)
    }
    setExpandedPosts(newExpanded)
  }

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) return '방금 전'
    if (minutes < 60) return `${minutes}분 전`
    if (hours < 24) return `${hours}시간 전`
    if (days < 7) return `${days}일 전`
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
  }

  if (loading) {
    return <Loading fullScreen text="나눔을 불러오는 중..." />
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.loginPrompt}>
          <Text style={styles.loginPromptText}>커뮤니티 기능을 사용하려면 로그인이 필요합니다.</Text>
        </View>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Create Post Section */}
        <Card title="새 나눔 작성" icon={<Ionicons name="create" size={20} color="#8B5CF6" />} style={styles.createCard}>
          <View style={styles.createSection}>
            <TextInput
              value={newPost}
              onChangeText={setNewPost}
              placeholder="나눔할 내용을 입력하세요..."
              style={styles.postInput}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <TouchableOpacity
              onPress={handleCreatePost}
              disabled={!newPost.trim() || processingPosts.size > 0}
              style={[styles.createButton, (!newPost.trim() || processingPosts.size > 0) && styles.createButtonDisabled]}
            >
              <Ionicons name="send" size={18} color="#FFFFFF" />
              <Text style={styles.createButtonText}>나눔하기</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Posts List */}
        <View style={styles.postsContainer}>
          {posts.length > 0 ? (
            posts.map((post) => (
              <Card key={post.id} style={styles.postCard}>
                <View style={styles.postHeader}>
                  <View style={styles.authorInfo}>
                    <Text style={styles.authorName}>
                      {post.author.nickname || post.author.name}
                    </Text>
                    <Text style={styles.postTimestamp}>{formatTimestamp(post.timestamp || new Date(post.created_at || ''))}</Text>
                  </View>
                </View>
                
                {post.passage && (
                  <View style={styles.passageContainer}>
                    <Ionicons name="book" size={16} color="#8B5CF6" />
                    <Text style={styles.passageText}>{post.passage}</Text>
                  </View>
                )}
                
                <Text style={styles.postContent}>{post.content}</Text>
                
                <View style={styles.postActions}>
                  <TouchableOpacity
                    onPress={() => handleLike(post.id)}
                    disabled={processingPosts.has(post.id)}
                    style={[styles.actionButton, processingPosts.has(post.id) && styles.actionButtonDisabled]}
                  >
                    <Ionicons
                      name={post.isLiked ? 'heart' : 'heart-outline'}
                      size={20}
                      color={post.isLiked ? '#EF4444' : '#6B7280'}
                    />
                    <Text style={[styles.actionText, post.isLiked && styles.actionTextLiked]}>
                      아멘 {post.likes}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={() => toggleComments(post.id)}
                    style={styles.actionButton}
                  >
                    <Ionicons name="chatbubble-outline" size={20} color="#6B7280" />
                    <Text style={styles.actionText}>댓글 {post.comments}</Text>
                  </TouchableOpacity>
                </View>

                {/* Comments Section */}
                {expandedPosts.has(post.id) && (
                  <View style={styles.commentsSection}>
                    {(comments[post.id] || []).map((comment) => (
                      <View key={comment.id} style={styles.commentItem}>
                        <Text style={styles.commentAuthor}>
                          {comment.author.nickname || comment.author.name}
                        </Text>
                        <Text style={styles.commentContent}>{comment.content}</Text>
                        <Text style={styles.commentTimestamp}>
                          {formatTimestamp(comment.timestamp || new Date(comment.created_at || ''))}
                        </Text>
                      </View>
                    ))}
                    
                    <View style={styles.commentInputContainer}>
                      <TextInput
                        value={newComments[post.id] || ''}
                        onChangeText={(text) => setNewComments(prev => ({ ...prev, [post.id]: text }))}
                        placeholder="댓글을 입력하세요..."
                        style={styles.commentInput}
                        multiline
                      />
                      <TouchableOpacity
                        onPress={() => handleAddComment(post.id)}
                        disabled={!newComments[post.id]?.trim() || processingPosts.size > 0}
                        style={[styles.commentButton, (!newComments[post.id]?.trim() || processingPosts.size > 0) && styles.commentButtonDisabled]}
                      >
                        <Ionicons name="send" size={16} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </Card>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>아직 나눔이 없습니다.</Text>
              <Text style={styles.emptySubtext}>첫 번째 나눔을 작성해보세요!</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF',
  },
  content: {
    padding: 16,
  },
  loginPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loginPromptText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  createCard: {
    marginBottom: 16,
  },
  createSection: {
    gap: 12,
  },
  postInput: {
    width: '100%',
    minHeight: 100,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#111827',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  postsContainer: {
    gap: 16,
  },
  postCard: {
    marginBottom: 0,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  postTimestamp: {
    fontSize: 12,
    color: '#6B7280',
  },
  passageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#EDE9FE',
    borderRadius: 8,
    marginBottom: 12,
  },
  passageText: {
    flex: 1,
    fontSize: 14,
    color: '#7C3AED',
    fontWeight: '500',
  },
  postContent: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  postActions: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionText: {
    fontSize: 14,
    color: '#6B7280',
  },
  actionTextLiked: {
    color: '#EF4444',
  },
  commentsSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  commentItem: {
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  commentContent: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  commentTimestamp: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  commentInputContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-end',
  },
  commentInput: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    fontSize: 14,
    color: '#111827',
    maxHeight: 100,
  },
  commentButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentButtonDisabled: {
    opacity: 0.5,
  },
  emptyContainer: {
    paddingVertical: 64,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
  },
})

