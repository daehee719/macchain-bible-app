/**
 * Statistics API (Worktop 버전)
 * 사용자 통계 및 분석 관련 엔드포인트
 */

import { authMiddleware } from '../middleware/auth.js';
import { successResponse, notFoundResponse, serverErrorResponse } from '../utils/response.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('Statistics');

export async function getUserStatistics(request, response, env) {
  try {
    logger.request(request);

    // 인증 미들웨어
    const auth = await authMiddleware(request, response, env);
    if (!auth) return;

    const userId = auth.userId;

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
      logger.warn('User statistics not found', { userId });
      return notFoundResponse(response, '사용자 통계를 찾을 수 없습니다.');
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

    logger.info('User statistics retrieved', { userId });
    logger.response(200, { userId });

    return successResponse(response, {
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
    logger.errorWithContext('Get user statistics error', error, { path: request.url.pathname });
    return serverErrorResponse(response, '통계 조회 중 오류가 발생했습니다.');
  }
}

