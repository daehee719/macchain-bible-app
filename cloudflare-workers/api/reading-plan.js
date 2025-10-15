/**
 * Reading Plan API
 * McCheyne 성경 읽기 계획 관련 엔드포인트
 */

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
    const today = new Date().toISOString().split('T')[0];
    
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

    if (!plan) {
      return new Response(JSON.stringify({
        success: false,
        message: '오늘의 읽기 계획을 찾을 수 없습니다.'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 읽기 계획을 구조화된 형태로 변환
    const readings = [
      {
        id: 1,
        book: plan.reading1_book,
        chapter: plan.reading1_chapter,
        verseStart: plan.reading1_verse_start,
        verseEnd: plan.reading1_verse_end
      },
      {
        id: 2,
        book: plan.reading2_book,
        chapter: plan.reading2_chapter,
        verseStart: plan.reading2_verse_start,
        verseEnd: plan.reading2_verse_end
      },
      {
        id: 3,
        book: plan.reading3_book,
        chapter: plan.reading3_chapter,
        verseStart: plan.reading3_verse_start,
        verseEnd: plan.reading3_verse_end
      },
      {
        id: 4,
        book: plan.reading4_book,
        chapter: plan.reading4_chapter,
        verseStart: plan.reading4_verse_start,
        verseEnd: plan.reading4_verse_end
      }
    ].filter(reading => reading.book); // 빈 읽기 제거

    return new Response(JSON.stringify({
      success: true,
      date: plan.date,
      readings: readings
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Get today plan error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: '읽기 계획 조회 중 오류가 발생했습니다.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function getPlanProgress(date, env) {
  try {
    // 특정 날짜의 읽기 계획과 사용자 진행률 조회
    const plan = await env.DB.prepare(`
      SELECT * FROM mccheyne_plan WHERE date = ?
    `).bind(date).first();

    if (!plan) {
      return new Response(JSON.stringify({
        success: false,
        message: '해당 날짜의 읽기 계획을 찾을 수 없습니다.'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 사용자별 읽기 완료 상태 조회
    const userProgress = await env.DB.prepare(`
      SELECT 
        user_id,
        reading_id,
        is_completed,
        completed_at
      FROM reading_progress 
      WHERE plan_date = ?
    `).bind(date).all();

    return new Response(JSON.stringify({
      success: true,
      date: plan.date,
      plan: plan,
      userProgress: userProgress.results || []
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Get plan progress error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: '읽기 진행률 조회 중 오류가 발생했습니다.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
