// Supabase API 서비스
import { supabase } from '../lib/supabase'

export interface ReadingPlan {
  id: string;
  date: string;
  reading1_book: string | null;
  reading1_chapter: number | null;
  reading1_verse_start: number | null;
  reading1_verse_end: number | null;
  reading2_book: string | null;
  reading2_chapter: number | null;
  reading2_verse_start: number | null;
  reading2_verse_end: number | null;
  reading3_book: string | null;
  reading3_chapter: number | null;
  reading3_verse_start: number | null;
  reading3_verse_end: number | null;
  reading4_book: string | null;
  reading4_chapter: number | null;
  reading4_verse_start: number | null;
  reading4_verse_end: number | null;
}

export interface TodayPlanResponse {
  success: boolean;
  date: string;
  plan: ReadingPlan | null;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  nickname: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserStatistics {
  total_days_read: number;
  current_streak: number;
  longest_streak: number;
  books_completed: number;
  last_read_date: string | null;
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
        .single()

      if (error) {
        console.error('Failed to get today plan:', error)
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
  async getPlanByDate(date: string): Promise<ReadingPlan | null> {
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
  async getUserProfile(userId: string): Promise<UserProfile | null> {
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
        if (error.code === 'PGRST116') {
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
  async updateReadingProgress(
    userId: string,
    planDate: string,
    readingId: number,
    isCompleted: boolean
  ): Promise<boolean> {
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
}

export const apiService = new ApiService();
