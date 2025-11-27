import { verifyJWT } from '../utils/jwt.js';

export async function handleReadingPlan(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  if (path === '/api/mccheyne/today' && method === 'GET') {
    return await getTodayPlan(env);
  } else if (path.startsWith('/api/mccheyne/') && path.endsWith('/progress')) {
    const date = path.split('/')[3];
    if (method === 'GET') {
      return await getPlanProgress(request, date, env);
    } else if (method === 'PUT' || method === 'POST') {
      return await updatePlanProgress(request, date, env);
    }
  }

  return new Response('Not Found', { status: 404 });
}

async function getTodayPlan(env) {
  try {
    // 테스트를 위해 2025-01-01로 고정 (실제로는 오늘 날짜 사용)
    const today = '2025-01-01'; // new Date().toISOString().split('T')[0];
    
    // 오늘의 읽기 계획 조회
    const plan = await env.DB.prepare(`
      SELECT 
        id,
        date,
        reading1_book,
        reading1_chapter,
        reading1_verse_start,
        reading1_verse_end,
        reading2_book,
        reading2_chapter,
        reading2_verse_start,
        reading2_verse_end,
        reading3_book,
        reading3_chapter,
        reading3_verse_start,
        reading3_verse_end,
        reading4_book,
        reading4_chapter,
        reading4_verse_start,
        reading4_verse_end
      FROM mccheyne_plan 
      WHERE date = ?
    `).bind(today).first();

    if (plan) {
      const readings = [
        { id: 1, book: plan.reading1_book, chapter: plan.reading1_chapter, verseStart: plan.reading1_verse_start, verseEnd: plan.reading1_verse_end },
        { id: 2, book: plan.reading2_book, chapter: plan.reading2_chapter, verseStart: plan.reading2_verse_start, verseEnd: plan.reading2_verse_end },
        { id: 3, book: plan.reading3_book, chapter: plan.reading3_chapter, verseStart: plan.reading3_verse_start, verseEnd: plan.reading3_verse_end },
        { id: 4, book: plan.reading4_book, chapter: plan.reading4_chapter, verseStart: plan.reading4_verse_start, verseEnd: plan.reading4_verse_end },
      ];
      return new Response(JSON.stringify({ success: true, date: plan.date, readings }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ success: false, message: '오늘의 읽기 계획을 찾을 수 없습니다.' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 404,
      });
    }
  } catch (error) {
    console.error('Error fetching today\'s plan:', error);
    return new Response(JSON.stringify({ success: false, message: '서버 오류가 발생했습니다.' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
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

async function getPlanProgress(request, date, env) {
  try {
    // 인증 확인
    const authResult = await checkAuth(request, env);
    if (!authResult.success) {
      return new Response(JSON.stringify(authResult), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const userId = authResult.userId;

    // 해당 날짜의 읽기 진행률 조회
    const progress = await env.DB.prepare(`
      SELECT 
        plan_date,
        reading_id,
        is_completed,
        completed_at
      FROM reading_progress
      WHERE user_id = ? AND plan_date = ?
      ORDER BY reading_id
    `).bind(userId, date).all();

    return new Response(JSON.stringify({
      success: true,
      date,
      progress: progress.results || []
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching plan progress:', error);
    return new Response(JSON.stringify({
      success: false,
      message: '진행률 조회 중 오류가 발생했습니다.'
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}

async function updatePlanProgress(request, date, env) {
  try {
    // 인증 확인
    const authResult = await checkAuth(request, env);
    if (!authResult.success) {
      return new Response(JSON.stringify(authResult), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const userId = authResult.userId;
    const { readingId, isCompleted } = await request.json();

    if (readingId === undefined || isCompleted === undefined) {
      return new Response(JSON.stringify({
        success: false,
        message: 'readingId와 isCompleted가 필요합니다.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 진행률 업데이트 또는 생성
    await env.DB.prepare(`
      INSERT OR REPLACE INTO reading_progress 
      (user_id, plan_date, reading_id, is_completed, completed_at, updated_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'))
    `).bind(
      userId,
      date,
      readingId,
      isCompleted ? 1 : 0,
      isCompleted ? new Date().toISOString() : null
    ).run();

    // 사용자 진행률 통계 업데이트
    if (isCompleted) {
      await env.DB.prepare(`
        UPDATE user_progress
        SET 
          total_days_read = (
            SELECT COUNT(DISTINCT plan_date)
            FROM reading_progress
            WHERE user_id = ? AND is_completed = 1
          ),
          last_read_date = ?,
          updated_at = datetime('now')
        WHERE user_id = ?
      `).bind(userId, date, userId).run();
    }

    return new Response(JSON.stringify({
      success: true,
      message: '진행률이 업데이트되었습니다.'
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error updating plan progress:', error);
    return new Response(JSON.stringify({
      success: false,
      message: '진행률 업데이트 중 오류가 발생했습니다.'
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}