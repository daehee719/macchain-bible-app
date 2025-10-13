import React, { useState } from 'react'
import Card from '../components/Card'
import { MessageCircle, Heart, Share2, Send, User, Calendar, TrendingUp } from 'lucide-react'
import './Community.css'

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
    <div className="community">
      <div className="container">
        <header className="page-header">
          <h1>성경 읽기 커뮤니티</h1>
          <p>다른 성도들과 함께 나누는 성경 읽기 경험</p>
        </header>

        <div className="create-post">
          <Card title="새 글 작성" icon={<MessageCircle size={24} />}>
            <div className="post-form">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="오늘 읽은 성경 구절에 대한 생각을 공유해보세요..."
                className="post-input"
                rows={4}
              />
              <input
                type="text"
                value={selectedPassage}
                onChange={(e) => setSelectedPassage(e.target.value)}
                placeholder="관련 성경 구절 (선택사항)"
                className="passage-input"
              />
              <button 
                onClick={handleCreatePost}
                disabled={!newPost.trim()}
                className="create-btn"
              >
                <Send size={16} />
                글 올리기
              </button>
            </div>
          </Card>
        </div>

        <div className="community-stats">
          <Card title="커뮤니티 현황" className="stats-card">
            <div className="stats-grid">
              <div className="stat">
                <TrendingUp size={24} />
                <span className="stat-number">{posts.length}</span>
                <span className="stat-label">총 게시글</span>
              </div>
              <div className="stat">
                <Heart size={24} />
                <span className="stat-number">
                  {posts.reduce((acc, post) => acc + post.likes, 0)}
                </span>
                <span className="stat-label">총 좋아요</span>
              </div>
              <div className="stat">
                <MessageCircle size={24} />
                <span className="stat-number">
                  {posts.reduce((acc, post) => acc + post.comments, 0)}
                </span>
                <span className="stat-label">총 댓글</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="posts-feed">
          <h2>최신 글</h2>
          {posts.length === 0 ? (
            <Card className="empty-state">
              <div className="empty-content">
                <MessageCircle size={48} className="empty-icon" />
                <h3>아직 게시글이 없습니다</h3>
                <p>첫 번째 글을 작성해보세요!</p>
              </div>
            </Card>
          ) : (
            <div className="posts-list">
              {posts.map((post) => (
                <Card key={post.id} className="post-card">
                  <div className="post-header">
                    <div className="author-info">
                      <span className="author-avatar">{post.author.avatar}</span>
                      <div className="author-details">
                        <span className="author-name">{post.author.name}</span>
                        <span className="post-time">{formatTimestamp(post.timestamp)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="post-content">
                    <p>{post.content}</p>
                    {post.passage && (
                      <div className="passage-reference">
                        📖 {post.passage}
                      </div>
                    )}
                  </div>

                  <div className="post-actions">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className={`action-btn like-btn ${post.isLiked ? 'liked' : ''}`}
                    >
                      <Heart size={16} />
                      {post.likes}
                    </button>
                    <button className="action-btn comment-btn">
                      <MessageCircle size={16} />
                      {post.comments}
                    </button>
                    <button className="action-btn share-btn">
                      <Share2 size={16} />
                      공유
                    </button>
                  </div>

                  {/* 댓글 섹션 */}
                  <div className="comments-section">
                    {comments[post.id]?.map((comment) => (
                      <div key={comment.id} className="comment">
                        <div className="comment-author">
                          <span className="comment-avatar">{comment.author.avatar}</span>
                          <span className="comment-name">{comment.author.name}</span>
                          <span className="comment-time">{formatTimestamp(comment.timestamp)}</span>
                        </div>
                        <p className="comment-content">{comment.content}</p>
                      </div>
                    ))}

                    <div className="add-comment">
                      <input
                        type="text"
                        value={newComments[post.id] || ''}
                        onChange={(e) => setNewComments(prev => ({ 
                          ...prev, 
                          [post.id]: e.target.value 
                        }))}
                        placeholder="댓글을 입력하세요..."
                        className="comment-input"
                      />
                      <button 
                        onClick={() => handleAddComment(post.id)}
                        disabled={!newComments[post.id]?.trim()}
                        className="comment-submit"
                      >
                        <Send size={14} />
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
