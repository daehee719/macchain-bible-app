// Supabase API 서비스
import { supabase } from '../lib/supabase'

// 타입 정의
export interface TodayPlanResponse {
  success: boolean
  date: string
  plan: any | null
}

export interface UserStatistics {
  total_days_read: number
  current_streak: number
  longest_streak: number
  books_completed: number
  last_read_date: string | null
}

export interface CommunityPost {
  id: string
  content: string
  passage: string | null
  created_at: string
  updated_at: string
  author: {
    name: string
    nickname: string
    avatar: string
  }
  likes: number
  comments: number
  isLiked: boolean
}

export interface CommunityComment {
  id: string
  content: string
  created_at: string
  author: {
    name: string
    nickname: string
    avatar: string
  }
}

class ApiService {
  // 오늘의 읽기 계획
  async getTodayPlan(): Promise<TodayPlanResponse> {
    try {
      const today = new Date().toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('macchain_plan')
        .select('*')
        .eq('date', today)
        .maybeSingle()
      
      if (error) {
        console.error('Failed to get today plan:', error)
        return {
          success: false,
          date: today,
          plan: null
        }
      }
      
      if (!data) {
        console.warn('No plan found for today:', today)
        return {
          success: false,
          date: today,
          plan: null
        }
      }
      
      return {
        success: true,
        date: today,
        plan: data
      }
    } catch (error) {
      console.error('Error getting today plan:', error)
      return {
        success: false,
        date: new Date().toISOString().split('T')[0],
        plan: null
      }
    }
  }

  // 특정 날짜의 읽기 계획
  async getPlanByDate(date: string) {
    try {
      const { data, error } = await supabase
        .from('macchain_plan')
        .select('*')
        .eq('date', date)
        .single()
      
      if (error) {
        console.error('Failed to get plan by date:', error)
        return null
      }
      return data
    } catch (error) {
      console.error('Error getting plan by date:', error)
      return null
    }
  }

  // 사용자 프로필 조회
  async getUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) {
        console.error('Failed to get user profile:', error)
        return null
      }
      return data
    } catch (error) {
      console.error('Error getting user profile:', error)
      return null
    }
  }

  // 사용자 통계 조회
  async getUserStatistics(userId: string): Promise<UserStatistics | null> {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (error) {
        // 통계가 없으면 기본값 반환
        if ((error as any).code === 'PGRST116') {
          return {
            total_days_read: 0,
            current_streak: 0,
            longest_streak: 0,
            books_completed: 0,
            last_read_date: null
          }
        }
        console.error('Failed to get user statistics:', error)
        return null
      }
      return {
        total_days_read: data.total_days_read || 0,
        current_streak: data.current_streak || 0,
        longest_streak: data.longest_streak || 0,
        books_completed: data.books_completed || 0,
        last_read_date: data.last_read_date
      }
    } catch (error) {
      console.error('Error getting user statistics:', error)
      return null
    }
  }

  // 읽기 진행률 업데이트
  async updateReadingProgress(userId: string, planDate: string, readingId: string, isCompleted: boolean) {
    try {
      const { error } = await supabase
        .from('reading_progress')
        .upsert({
          user_id: userId,
          plan_date: planDate,
          reading_id: readingId,
          is_completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null
        })
      
      if (error) {
        console.error('Failed to update reading progress:', error)
        return false
      }
      return true
    } catch (error) {
      console.error('Error updating reading progress:', error)
      return false
    }
  }

  // 특정 날짜의 읽기 진행률 조회
  async getReadingProgress(userId: string, planDate: string) {
    try {
      const { data, error } = await supabase
        .from('reading_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('plan_date', planDate)
      
      if (error) {
        console.error('Failed to get reading progress:', error)
        return []
      }
      return data || []
    } catch (error) {
      console.error('Error getting reading progress:', error)
      return []
    }
  }

  // AI 분석 결과 저장
  async saveAIAnalysis(userId: string, planDate: string, readingId: string, passage: string, analysisType: string, analysisData: any) {
    try {
      const { error } = await supabase
        .from('ai_analysis')
        .insert({
          user_id: userId,
          plan_date: planDate,
          reading_id: readingId,
          analysis_type: analysisType,
          analysis_data: analysisData
        })
      
      if (error) {
        console.error('Failed to save AI analysis:', error)
        return false
      }
      return true
    } catch (error) {
      console.error('Error saving AI analysis:', error)
      return false
    }
  }

  // AI 분석 결과 조회
  async getAIAnalysis(userId: string, limit: number = 20) {
    try {
      const { data, error } = await supabase
        .from('ai_analysis')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)
      
      if (error) {
        console.error('Failed to get AI analysis:', error)
        return []
      }
      return data || []
    } catch (error) {
      console.error('Error getting AI analysis:', error)
      return []
    }
  }

  // 사용자 설정 조회
  async getUserSettings(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (error) {
        if ((error as any).code === 'PGRST116') {
          // 설정이 없으면 기본값 반환
          return {
            notification_enabled: true,
            reminder_time: '09:00',
            language: 'ko',
            theme: 'light'
          }
        }
        console.error('Failed to get user settings:', error)
        return null
      }
      return data
    } catch (error) {
      console.error('Error getting user settings:', error)
      return null
    }
  }

  // 사용자 설정 업데이트
  async updateUserSettings(userId: string, settings: any) {
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: userId,
          ...settings
        })
      
      if (error) {
        console.error('Failed to update user settings:', error)
        return false
      }
      return true
    } catch (error) {
      console.error('Error updating user settings:', error)
      return false
    }
  }

  // 사용자 동의 설정 조회
  async getUserConsents(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_consents')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (error) {
        if ((error as any).code === 'PGRST116') {
          return {
            privacy_consent: false,
            marketing_consent: false,
            notification_consent: false,
            age_consent: false
          }
        }
        console.error('Failed to get user consents:', error)
        return null
      }
      return data
    } catch (error) {
      console.error('Error getting user consents:', error)
      return null
    }
  }

  // 사용자 동의 설정 업데이트
  async updateUserConsents(userId: string, consents: any) {
    try {
      const { error } = await supabase
        .from('user_consents')
        .upsert({
          user_id: userId,
          ...consents
        })
      
      if (error) {
        console.error('Failed to update user consents:', error)
        return false
      }
      return true
    } catch (error) {
      console.error('Error updating user consents:', error)
      return false
    }
  }

  // 월별 통계 조회
  async getMonthlyStatistics(userId: string, year: number, month: number) {
    try {
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`
      const endDate = `${year}-${String(month).padStart(2, '0')}-31`
      const { data, error } = await supabase
        .from('reading_progress')
        .select('plan_date, is_completed')
        .eq('user_id', userId)
        .eq('is_completed', true)
        .gte('plan_date', startDate)
        .lte('plan_date', endDate)
      
      if (error) {
        console.error('Failed to get monthly statistics:', error)
        return []
      }
      return data || []
    } catch (error) {
      console.error('Error getting monthly statistics:', error)
      return []
    }
  }

  // ===== 커뮤니티 나눔(게시글) 관련 =====
  // 나눔 목록 조회 (뷰 사용)
  async getCommunityPosts(limit: number = 50, offset: number = 0): Promise<CommunityPost[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return []
      }
      
      // 1. 뷰에서 나눔 목록과 통계 조회
      const { data: posts, error: postsError } = await supabase
        .from('community_posts_with_stats')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)
      
      if (postsError) {
        console.error('Failed to get community posts from view:', postsError)
        return []
      }
      
      if (!posts || posts.length === 0) {
        return []
      }
      
      const postIds = posts.map(post => post.id)
      
      // 2. 현재 사용자가 아멘한 나눔 ID 조회 (별도 쿼리)
      const { data: userLikesData, error: userLikesError } = await supabase
        .from('community_likes')
        .select('post_id')
        .eq('user_id', user.id)
        .in('post_id', postIds)
      
      if (userLikesError) {
        console.error('Failed to get user likes:', userLikesError)
      }
      
      const userLikes = new Set((userLikesData || []).map(like => like.post_id))
      
      // 3. 결과 조합
      return posts.map(post => ({
        id: post.id,
        content: post.content,
        passage: post.passage,
        created_at: post.created_at,
        updated_at: post.updated_at,
        author: {
          name: post.author_name || '알 수 없음',
          nickname: post.author_nickname || '',
          avatar: '👤'
        },
        likes: post.likes_count || 0,
        comments: post.comments_count || 0,
        isLiked: userLikes.has(post.id)
      }))
    } catch (error) {
      console.error('Error getting community posts:', error)
      return []
    }
  }

  // 나눔 생성
  async createCommunityPost(content: string, passage: string | null = null) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('로그인이 필요합니다.')
      }
      
      const { data, error } = await supabase
        .from('community_posts')
        .insert({
          user_id: user.id,
          content,
          passage
        })
        .select()
        .single()
      
      if (error) {
        console.error('Failed to create community post:', error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Error creating community post:', error)
      throw error
    }
  }

  // 나눔 삭제
  async deleteCommunityPost(postId: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('로그인이 필요합니다.')
      }
      
      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', user.id)
      
      if (error) {
        console.error('Failed to delete community post:', error)
        throw error
      }
      return true
    } catch (error) {
      console.error('Error deleting community post:', error)
      throw error
    }
  }

  // 댓글 조회
  async getCommunityComments(postId: string): Promise<CommunityComment[]> {
    try {
      const { data, error } = await supabase
        .from('community_comments')
        .select(`
          id,
          content,
          created_at,
          user_id,
          users:user_id (
            name,
            nickname
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true })
      
      if (error) {
        console.error('Failed to get community comments:', error)
        return []
      }
      
      return (data || []).map((comment: any) => ({
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at,
        author: {
          name: comment.users?.name || '알 수 없음',
          nickname: comment.users?.nickname || '',
          avatar: '👤'
        }
      }))
    } catch (error) {
      console.error('Error getting community comments:', error)
      return []
    }
  }

  // 댓글 생성
  async createCommunityComment(postId: string, content: string): Promise<CommunityComment> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('로그인이 필요합니다.')
      }
      
      const { data, error } = await supabase
        .from('community_comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content
        })
        .select(`
          id,
          content,
          created_at,
          user_id,
          users:user_id (
            name,
            nickname
          )
        `)
        .single()
      
      if (error) {
        console.error('Failed to create community comment:', error)
        throw error
      }
      
      return {
        id: data.id,
        content: data.content,
        created_at: data.created_at,
        author: {
          name: data.users?.name || '알 수 없음',
          nickname: data.users?.nickname || '',
          avatar: '👤'
        }
      }
    } catch (error) {
      console.error('Error creating community comment:', error)
      throw error
    }
  }

  // 댓글 삭제
  async deleteCommunityComment(commentId: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('로그인이 필요합니다.')
      }
      
      const { error } = await supabase
        .from('community_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.id)
      
      if (error) {
        console.error('Failed to delete community comment:', error)
        throw error
      }
      return true
    } catch (error) {
      console.error('Error deleting community comment:', error)
      throw error
    }
  }

  // 아멘(좋아요) 토글 - RPC 함수 사용 (최적화된 버전)
  async toggleCommunityLike(postId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('로그인이 필요합니다.')
      }
      
      // PostgreSQL RPC 함수를 사용하여 서버 측에서 원자적으로 처리
      // 한 번의 호출로 SELECT + INSERT/DELETE를 처리
      const { data, error } = await supabase.rpc('toggle_community_like', {
        p_post_id: postId,
        p_user_id: user.id
      })
      
      if (error) {
        console.error('Failed to toggle community like:', error)
        throw error
      }
      
      return data as boolean
    } catch (error) {
      console.error('Error toggling community like:', error)
      throw error
    }
  }
}

export const apiService = new ApiService()

