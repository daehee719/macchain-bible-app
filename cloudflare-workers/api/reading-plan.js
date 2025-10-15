import { verifyJWT } from '../utils/jwt.js';

export async function handleReadingPlan(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  if (path === '/api/mccheyne/today' && method === 'GET') {
    return await getTodayPlan(env);
  } else if (path.startsWith('/api/mccheyne/') && path.endsWith('/progress') && method === 'GET') {
    const date = path.split('/')[3];
    return await getPlanProgress(date, env);
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

async function getPlanProgress(date, env) {
  // TODO: 사용자별 읽기 진행률 조회 로직 구현
  return new Response(JSON.stringify({ date, progress: 'Not Implemented' }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  });
}