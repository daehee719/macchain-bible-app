/**
 * Statistics API (Worktop 버전)
 * 사용자 통계 및 분석 관련 엔드포인트
 */

import { verifyJWT } from '../utils/jwt.js';

// 인증 확인 헬퍼
async function checkAuth(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { success: false, message: '인증 토큰이 필요합니다.' };
  }

  const token = authHeader.substring(7);
  const payload = await verifyJWT(token, env.JWT_SECRET);

  if (!payload) {
    return { success: false, message: '유효하지 않은 토큰입니다.' };
  }

  return { success: true, userId: payload.userId };
}

export async function getUserStatistics(request, response, env) {
  try {
    const authResult = await checkAuth(request, env);
    if (!authResult.success) {
      return response.send(401, authResult);
    }

    const userId = authResult.userId;

    // 사용자 기본 통계
    const userStats = await env.DB.prepare(`
      SELECT 
        up.total_days_read,
        up.current_streak,
        up.longest_streak,
        up.books_completed,
        up.last_read_date,
        u.created_at as member_since
      FROM user_progress up
      JOIN users u ON up.user_id = u.id
      WHERE up.user_id = ?
    `).bind(userId).first();

    if (!userStats) {
      return response.send(404, {
        success: false,
        message: '사용자 통계를 찾을 수 없습니다.',
      });
    }

    // 월별 읽기 통계
    const monthlyStats = await env.DB.prepare(`
      SELECT 
        strftime('%Y-%m', completed_at) as month,
        COUNT(*) as days_read
      FROM reading_progress 
      WHERE user_id = ? AND is_completed = 1
      GROUP BY strftime('%Y-%m', completed_at)
      ORDER BY month DESC
      LIMIT 12
    `).bind(userId).all();

    // 성경책별 완료 통계
    const bookStats = await env.DB.prepare(`
      SELECT 
        book,
        COUNT(*) as chapters_completed
      FROM reading_progress rp
      JOIN mccheyne_plan mp ON rp.plan_date = mp.date
      WHERE rp.user_id = ? AND rp.is_completed = 1
      GROUP BY book
      ORDER BY chapters_completed DESC
    `).bind(userId).all();

    return response.send(200, {
      success: true,
      statistics: {
        totalDaysRead: userStats.total_days_read,
        currentStreak: userStats.current_streak,
        longestStreak: userStats.longest_streak,
        booksCompleted: userStats.books_completed,
        lastReadDate: userStats.last_read_date,
        memberSince: userStats.member_since,
        monthlyStats: monthlyStats.results || [],
        bookStats: bookStats.results || [],
      },
    });
  } catch (error) {
    console.error('Get user statistics error:', error);
    return response.send(500, {
      success: false,
      message: '통계 조회 중 오류가 발생했습니다.',
    });
  }
}

