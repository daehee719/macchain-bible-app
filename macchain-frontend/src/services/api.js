// Supabase API 서비스
import { supabase } from '../lib/supabase';
class ApiService {
    // 오늘의 읽기 계획
    async getTodayPlan() {
        try {
            const today = new Date().toISOString().split('T')[0];
            const { data, error } = await supabase
                .from('macchain_plan')
                .select('*')
                .eq('date', today)
                .maybeSingle();
            if (error) {
                console.error('Failed to get today plan:', error);
                return {
                    success: false,
                    date: today,
                    plan: null
                };
            }
            if (!data) {
                console.warn('No plan found for today:', today);
                return {
                    success: false,
                    date: today,
                    plan: null
                };
            }
            return {
                success: true,
                date: today,
                plan: data
            };
        }
        catch (error) {
            console.error('Error getting today plan:', error);
            return {
                success: false,
                date: new Date().toISOString().split('T')[0],
                plan: null
            };
        }
    }
    // 특정 날짜의 읽기 계획
    async getPlanByDate(date) {
        try {
            const { data, error } = await supabase
                .from('macchain_plan')
                .select('*')
                .eq('date', date)
                .single();
            if (error) {
                console.error('Failed to get plan by date:', error);
                return null;
            }
            return data;
        }
        catch (error) {
            console.error('Error getting plan by date:', error);
            return null;
        }
    }
    // 사용자 프로필 조회
    async getUserProfile(userId) {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();
            if (error) {
                console.error('Failed to get user profile:', error);
                return null;
            }
            return data;
        }
        catch (error) {
            console.error('Error getting user profile:', error);
            return null;
        }
    }
    // 사용자 통계 조회
    async getUserStatistics(userId) {
        try {
            const { data, error } = await supabase
                .from('user_progress')
                .select('*')
                .eq('user_id', userId)
                .single();
            if (error) {
                // 통계가 없으면 기본값 반환
                if (error.code === 'PGRST116') {
                    return {
                        total_days_read: 0,
                        current_streak: 0,
                        longest_streak: 0,
                        books_completed: 0,
                        last_read_date: null
                    };
                }
                console.error('Failed to get user statistics:', error);
                return null;
            }
            return {
                total_days_read: data.total_days_read || 0,
                current_streak: data.current_streak || 0,
                longest_streak: data.longest_streak || 0,
                books_completed: data.books_completed || 0,
                last_read_date: data.last_read_date
            };
        }
        catch (error) {
            console.error('Error getting user statistics:', error);
            return null;
        }
    }
    // 읽기 진행률 업데이트
    async updateReadingProgress(userId, planDate, readingId, isCompleted) {
        try {
            const { error } = await supabase
                .from('reading_progress')
                .upsert({
                user_id: userId,
                plan_date: planDate,
                reading_id: readingId,
                is_completed: isCompleted,
                completed_at: isCompleted ? new Date().toISOString() : null
            });
            if (error) {
                console.error('Failed to update reading progress:', error);
                return false;
            }
            return true;
        }
        catch (error) {
            console.error('Error updating reading progress:', error);
            return false;
        }
    }
    // 특정 날짜의 읽기 진행률 조회
    async getReadingProgress(userId, planDate) {
        try {
            const { data, error } = await supabase
                .from('reading_progress')
                .select('*')
                .eq('user_id', userId)
                .eq('plan_date', planDate);
            if (error) {
                console.error('Failed to get reading progress:', error);
                return [];
            }
            return data || [];
        }
        catch (error) {
            console.error('Error getting reading progress:', error);
            return [];
        }
    }
    // AI 분석 결과 저장
    async saveAIAnalysis(userId, planDate, readingId, passage, analysisType, analysisData) {
        try {
            const { error } = await supabase
                .from('ai_analysis')
                .insert({
                user_id: userId,
                plan_date: planDate,
                reading_id: readingId,
                analysis_type: analysisType,
                analysis_data: analysisData
            });
            if (error) {
                console.error('Failed to save AI analysis:', error);
                return false;
            }
            return true;
        }
        catch (error) {
            console.error('Error saving AI analysis:', error);
            return false;
        }
    }
    // AI 분석 결과 조회
    async getAIAnalysis(userId, limit = 20) {
        try {
            const { data, error } = await supabase
                .from('ai_analysis')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(limit);
            if (error) {
                console.error('Failed to get AI analysis:', error);
                return [];
            }
            return data || [];
        }
        catch (error) {
            console.error('Error getting AI analysis:', error);
            return [];
        }
    }
    // 사용자 설정 조회
    async getUserSettings(userId) {
        try {
            const { data, error } = await supabase
                .from('user_settings')
                .select('*')
                .eq('user_id', userId)
                .single();
            if (error) {
                if (error.code === 'PGRST116') {
                    // 설정이 없으면 기본값 반환
                    return {
                        notification_enabled: true,
                        reminder_time: '09:00',
                        language: 'ko',
                        theme: 'light'
                    };
                }
                console.error('Failed to get user settings:', error);
                return null;
            }
            return data;
        }
        catch (error) {
            console.error('Error getting user settings:', error);
            return null;
        }
    }
    // 사용자 설정 업데이트
    async updateUserSettings(userId, settings) {
        try {
            const { error } = await supabase
                .from('user_settings')
                .upsert({
                user_id: userId,
                ...settings
            });
            if (error) {
                console.error('Failed to update user settings:', error);
                return false;
            }
            return true;
        }
        catch (error) {
            console.error('Error updating user settings:', error);
            return false;
        }
    }
    // 사용자 동의 설정 조회
    async getUserConsents(userId) {
        try {
            const { data, error } = await supabase
                .from('user_consents')
                .select('*')
                .eq('user_id', userId)
                .single();
            if (error) {
                if (error.code === 'PGRST116') {
                    return {
                        privacy_consent: false,
                        marketing_consent: false,
                        notification_consent: false,
                        age_consent: false
                    };
                }
                console.error('Failed to get user consents:', error);
                return null;
            }
            return data;
        }
        catch (error) {
            console.error('Error getting user consents:', error);
            return null;
        }
    }
    // 사용자 동의 설정 업데이트
    async updateUserConsents(userId, consents) {
        try {
            const { error } = await supabase
                .from('user_consents')
                .upsert({
                user_id: userId,
                ...consents
            });
            if (error) {
                console.error('Failed to update user consents:', error);
                return false;
            }
            return true;
        }
        catch (error) {
            console.error('Error updating user consents:', error);
            return false;
        }
    }
    // 월별 통계 조회
    async getMonthlyStatistics(userId, year, month) {
        try {
            const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
            const endDate = `${year}-${String(month).padStart(2, '0')}-31`;
            const { data, error } = await supabase
                .from('reading_progress')
                .select('plan_date, is_completed')
                .eq('user_id', userId)
                .eq('is_completed', true)
                .gte('plan_date', startDate)
                .lte('plan_date', endDate);
            if (error) {
                console.error('Failed to get monthly statistics:', error);
                return [];
            }
            return data || [];
        }
        catch (error) {
            console.error('Error getting monthly statistics:', error);
            return [];
        }
    }
}
export const apiService = new ApiService();
