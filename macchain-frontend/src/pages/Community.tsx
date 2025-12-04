import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Card from '../components/Card'
import { MessageCircle, Heart, Share2, Send, User, Calendar, TrendingUp, BookOpen } from 'lucide-react'

interface Post {
  id: string
  author: {
    name: string
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
    avatar: string
  }
  content: string
  timestamp: Date
}

const Community: React.FC = () => {
  const [newPost, setNewPost] = useState('')
  const [selectedPassage, setSelectedPassage] = useState('')
  const [posts, setPosts] = useState<Post[]>([
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
  ])

  const [comments, setComments] = useState<{ [postId: string]: Comment[] }>({
    '1': [
      {
        id: '1-1',
        author: { name: '박믿음', avatar: '👨‍🎨' },
        content: '정말 공감됩니다! 창조의 아름다움이 매번 새롭게 느껴져요.',
        timestamp: new Date('2025-01-06T15:00:00')
      }
    ]
  })

  const [newComments, setNewComments] = useState<{ [postId: string]: string }>({})

  const handleCreatePost = () => {
    if (!newPost.trim()) return

    const post: Post = {
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
    }

    setPosts(prev => [post, ...prev])
    setNewPost('')
    setSelectedPassage('')
  }

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ))
  }

  const handleAddComment = (postId: string) => {
    const commentText = newComments[postId]
    if (!commentText?.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      author: {
        name: '나',
        avatar: '👤'
      },
      content: commentText,
      timestamp: new Date()
    }

    setComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), comment]
    }))

    setNewComments(prev => ({ ...prev, [postId]: '' }))
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, comments: post.comments + 1 }
        : post
    ))
  }

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 1) return '방금 전'
    if (hours < 24) return `${hours}시간 전`
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            성경 읽기 커뮤니티
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            다른 성도들과 함께 나누는 성경 읽기 경험
          </p>
        </header>

        {/* Create Post */}
        <div className="mb-8">
          <Card title="새 글 작성" icon={<MessageCircle size={24} />}>
            <div className="space-y-4">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="오늘 읽은 성경 구절에 대한 생각을 공유해보세요..."
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 outline-none transition-all resize-none"
                rows={4}
              />
              <input
                type="text"
                value={selectedPassage}
                onChange={(e) => setSelectedPassage(e.target.value)}
                placeholder="관련 성경 구절 (선택사항)"
                className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 outline-none transition-all"
              />
              <button 
                onClick={handleCreatePost}
                disabled={!newPost.trim()}
                className="w-full px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send size={20} />
                글 올리기
              </button>
            </div>
          </Card>
        </div>

        {/* Community Stats */}
        <div className="mb-8">
          <Card title="커뮤니티 현황">
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <TrendingUp size={32} className="text-primary-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{posts.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">총 게시글</div>
              </div>
              <div className="text-center">
                <Heart size={32} className="text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {posts.reduce((acc, post) => acc + post.likes, 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">총 좋아요</div>
              </div>
              <div className="text-center">
                <MessageCircle size={32} className="text-primary-600 dark:text-primary-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {posts.reduce((acc, post) => acc + post.comments, 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">총 댓글</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Posts Feed */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">최신 글</h2>
          {posts.length === 0 ? (
            <Card>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageCircle size={64} className="text-gray-400 dark:text-gray-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">아직 게시글이 없습니다</h3>
                <p className="text-gray-600 dark:text-gray-300">첫 번째 글을 작성해보세요!</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <Card key={post.id}>
                  {/* Post Header */}
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                    <div className="text-3xl">{post.author.avatar}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-white">{post.author.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{formatTimestamp(post.timestamp)}</div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="mb-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">{post.content}</p>
                    {post.passage && (
                      <div className="inline-flex items-center gap-2 px-3 py-2 bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-700 rounded-lg text-primary-700 dark:text-primary-300 text-sm font-medium">
                        <BookOpen size={16} />
                        {post.passage}
                      </div>
                    )}
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        post.isLiked 
                          ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50' 
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Heart size={18} className={post.isLiked ? 'fill-current' : ''} />
                      {post.likes}
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                      <MessageCircle size={18} />
                      {post.comments}
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                      <Share2 size={18} />
                      공유
                    </button>
                  </div>

                  {/* Comments Section */}
                  <div className="space-y-4">
                    {comments[post.id]?.map((comment) => (
                      <div key={comment.id} className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-xl">{comment.author.avatar}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900 dark:text-white text-sm">{comment.author.name}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{formatTimestamp(comment.timestamp)}</span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm">{comment.content}</p>
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
                        className="flex-1 px-4 py-2 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 outline-none transition-all"
                      />
                      <button 
                        onClick={() => handleAddComment(post.id)}
                        disabled={!newComments[post.id]?.trim()}
                        className="px-4 py-2 bg-gradient-primary text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
