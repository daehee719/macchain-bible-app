import React, { useState } from 'react'
import { PageHeader } from '../components/ui/PageHeader'
import Card from '../components/Card'
import { TextArea } from '../components/ui/TextArea'
import Button from '../components/ui/Button'
import { MessageCircle, Heart, Image } from 'lucide-react'

const mockPosts = [
  { id: '1', author: '은혜', content: '오늘 아침 말씀 나눕니다. 주님 감사합니다.', likes: 3, time: '1시간 전' },
  { id: '2', author: '요셉', content: '요한복음 묵상 중입니다. 질문 있어요.', likes: 1, time: '2시간 전' }
]

const Community: React.FC = () => {
  const [posts, setPosts] = useState(mockPosts)
  const [text, setText] = useState('')

  const submitPost = () => {
    if (!text.trim()) return
    setPosts(prev => [{ id: Date.now().toString(), author: '나', content: text.trim(), likes: 0, time: '방금' }, ...prev])
    setText('')
  }

  return (
    <div>
      <PageHeader title="커뮤니티" description="성경 읽기 경험을 나누세요" icon={<MessageCircle size={28} />} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="space-y-4">
              <TextArea value={text} onChange={(e) => setText(e.target.value)} placeholder="나눌 말씀이나 묵상을 작성하세요" rows={3} />
              <div className="flex items-center justify-end">
                <Button variant="ghost" className="mr-2"><Image size={16} /></Button>
                <Button variant="primary" onClick={submitPost}>나누기</Button>
              </div>
            </div>
          </Card>

          <div className="space-y-4 mt-4">
            {posts.map(p => (
              <Card key={p.id} className="p-4">
                <div className="flex items-start">
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 dark:text-gray-400">{p.author} • {p.time}</div>
                    <p className="mt-2 text-gray-900 dark:text-white">{p.content}</p>
                    <div className="mt-3 flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-300">
                      <button className="flex items-center space-x-1"><Heart size={14} /> <span>{p.likes}</span></button>
                      <button className="flex items-center space-x-1"><MessageCircle size={14} /> <span>댓글</span></button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <aside>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">커뮤니티 가이드</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">서로를 존중하며 묵상과 기도 제목을 나눠주세요.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Community
