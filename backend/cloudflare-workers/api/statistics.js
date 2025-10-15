/**
 * Statistics API
 * 사용자 통계 및 분석 관련 엔드포인트
 */

import { verifyJWT } from '../utils/jwt.js';

export async function handleStatistics(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // 인증 확인
  const authResult = await checkAuth(request, env);
  if (!authResult.success) {
    return new Response(JSON.stringify(authResult), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const userId = authResult.userId;

  if (path === '/api/statistics/user' && method === 'GET') {
    return await getUserStatistics(userId, env);
  } else if (path === '/api/statistics/reading' && method === 'GET') {
    return await getReadingStatistics(userId, env);
  } else if (path === '/api/statistics/streak' && method === 'GET') {
    return await getStreakStatistics(userId, env);
  }

  return new Response('Not Found', { status: 404 });
}

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

async function getUserStatistics(userId, env) {
  try {
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
      return new Response(JSON.stringify({
        success: false,
        message: '사용자 통계를 찾을 수 없습니다.'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
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

    return new Response(JSON.stringify({
      success: true,
      statistics: {
        totalDaysRead: userStats.total_days_read,
        currentStreak: userStats.current_streak,
        longestStreak: userStats.longest_streak,
        booksCompleted: userStats.books_completed,
        lastReadDate: userStats.last_read_date,
        memberSince: userStats.member_since,
        monthlyStats: monthlyStats.results || [],
        bookStats: bookStats.results || []
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Get user statistics error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: '통계 조회 중 오류가 발생했습니다.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function getReadingStatistics(userId, env) {
  try {
    const url = new URL(request.url);
    const startDate = url.searchParams.get('start_date');
    const endDate = url.searchParams.get('end_date');

    let query = `
      SELECT 
        rp.plan_date,
        rp.reading_id,
        rp.is_completed,
        rp.completed_at,
        mp.reading1_book,
        mp.reading1_chapter,
        mp.reading2_book,
        mp.reading2_chapter,
        mp.reading3_book,
        mp.reading3_chapter,
        mp.reading4_book,
        mp.reading4_chapter
      FROM reading_progress rp
      JOIN mccheyne_plan mp ON rp.plan_date = mp.date
      WHERE rp.user_id = ?
    `;

    const params = [userId];

    if (startDate) {
      query += ' AND rp.plan_date >= ?';
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND rp.plan_date <= ?';
      params.push(endDate);
    }

    query += ' ORDER BY rp.plan_date DESC';

    const readingStats = await env.DB.prepare(query).bind(...params).all();

    return new Response(JSON.stringify({
      success: true,
      readingStatistics: readingStats.results || []
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Get reading statistics error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: '읽기 통계 조회 중 오류가 발생했습니다.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function getStreakStatistics(userId, env) {
  try {
    // 연속 읽기 일수 계산
    const streakData = await env.DB.prepare(`
      WITH daily_readings AS (
        SELECT 
          plan_date,
          MAX(is_completed) as completed
        FROM reading_progress 
        WHERE user_id = ?
        GROUP BY plan_date
        ORDER BY plan_date DESC
      ),
      streak_groups AS (
        SELECT 
          plan_date,
          completed,
          ROW_NUMBER() OVER (ORDER BY plan_date DESC) - 
          ROW_NUMBER() OVER (PARTITION BY completed ORDER BY plan_date DESC) as streak_group
        FROM daily_readings
      )
      SELECT 
        streak_group,
        COUNT(*) as streak_length,
        MIN(plan_date) as start_date,
        MAX(plan_date) as end_date
      FROM streak_groups 
      WHERE completed = 1
      GROUP BY streak_group
      ORDER BY streak_length DESC
    `).bind(userId).all();

    // 현재 연속 읽기 일수
    const currentStreak = await env.DB.prepare(`
      WITH recent_readings AS (
        SELECT 
          plan_date,
          MAX(is_completed) as completed
        FROM reading_progress 
        WHERE user_id = ? AND plan_date >= date('now', '-30 days')
        GROUP BY plan_date
        ORDER BY plan_date DESC
      )
      SELECT COUNT(*) as current_streak
      FROM recent_readings
      WHERE completed = 1
    `).bind(userId).first();

    return new Response(JSON.stringify({
      success: true,
      streakStatistics: {
        currentStreak: currentStreak?.current_streak || 0,
        allStreaks: streakData.results || []
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Get streak statistics error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: '연속 읽기 통계 조회 중 오류가 발생했습니다.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
