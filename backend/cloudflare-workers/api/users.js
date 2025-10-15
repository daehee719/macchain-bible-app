/**
 * Users API
 * 사용자 관리 관련 엔드포인트
 */

import { verifyJWT } from '../utils/jwt.js';

export async function handleUsers(request, env) {
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

  if (path === '/api/users/profile' && method === 'GET') {
    return await getUserProfile(userId, env);
  } else if (path === '/api/users/profile' && method === 'PUT') {
    return await updateUserProfile(request, userId, env);
  } else if (path.startsWith('/api/users/') && path.endsWith('/progress') && method === 'GET') {
    const targetUserId = path.split('/')[3];
    return await getUserProgress(targetUserId, env);
  } else if (path.startsWith('/api/users/') && path.endsWith('/progress') && method === 'PUT') {
    const targetUserId = path.split('/')[3];
    return await updateUserProgress(request, targetUserId, env);
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

async function getUserProfile(userId, env) {
  try {
    const user = await env.DB.prepare(`
      SELECT id, email, name, nickname, is_active, created_at, updated_at
      FROM users 
      WHERE id = ?
    `).bind(userId).first();

    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        message: '사용자를 찾을 수 없습니다.'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        nickname: user.nickname,
        isActive: user.is_active,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: '프로필 조회 중 오류가 발생했습니다.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function updateUserProfile(request, userId, env) {
  try {
    const { name, nickname } = await request.json();

    if (!name || !nickname) {
      return new Response(JSON.stringify({
        success: false,
        message: '이름과 닉네임을 입력해주세요.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 닉네임 중복 확인
    const existingUser = await env.DB.prepare(`
      SELECT id FROM users 
      WHERE nickname = ? AND id != ?
    `).bind(nickname, userId).first();

    if (existingUser) {
      return new Response(JSON.stringify({
        success: false,
        message: '이미 사용 중인 닉네임입니다.'
      }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 프로필 업데이트
    await env.DB.prepare(`
      UPDATE users 
      SET name = ?, nickname = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(name, nickname, userId).run();

    return new Response(JSON.stringify({
      success: true,
      message: '프로필이 업데이트되었습니다.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Update user profile error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: '프로필 업데이트 중 오류가 발생했습니다.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function getUserProgress(userId, env) {
  try {
    const progress = await env.DB.prepare(`
      SELECT 
        user_id,
        total_days_read,
        current_streak,
        longest_streak,
        books_completed,
        last_read_date,
        created_at,
        updated_at
      FROM user_progress 
      WHERE user_id = ?
    `).bind(userId).first();

    if (!progress) {
      // 초기 진행률 생성
      await env.DB.prepare(`
        INSERT INTO user_progress (user_id, total_days_read, current_streak, longest_streak, books_completed, last_read_date)
        VALUES (?, 0, 0, 0, 0, NULL)
      `).bind(userId).run();

      return new Response(JSON.stringify({
        success: true,
        progress: {
          userId: userId,
          totalDaysRead: 0,
          currentStreak: 0,
          longestStreak: 0,
          booksCompleted: 0,
          lastReadDate: null
        }
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      progress: {
        userId: progress.user_id,
        totalDaysRead: progress.total_days_read,
        currentStreak: progress.current_streak,
        longestStreak: progress.longest_streak,
        booksCompleted: progress.books_completed,
        lastReadDate: progress.last_read_date
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Get user progress error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: '진행률 조회 중 오류가 발생했습니다.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function updateUserProgress(request, userId, env) {
  try {
    const { totalDaysRead, currentStreak, longestStreak, booksCompleted, lastReadDate } = await request.json();

    await env.DB.prepare(`
      INSERT OR REPLACE INTO user_progress 
      (user_id, total_days_read, current_streak, longest_streak, books_completed, last_read_date, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(
      userId,
      totalDaysRead || 0,
      currentStreak || 0,
      longestStreak || 0,
      booksCompleted || 0,
      lastReadDate || null
    ).run();

    return new Response(JSON.stringify({
      success: true,
      message: '진행률이 업데이트되었습니다.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Update user progress error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: '진행률 업데이트 중 오류가 발생했습니다.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
