/**
 * Reading Plan API (Worktop 버전)
 * McCheyne 읽기 계획 관련 엔드포인트
 */

import { authMiddleware } from '../middleware/auth.js';
import { successResponse, errorResponse, notFoundResponse, serverErrorResponse } from '../utils/response.js';
import { validate } from '../utils/validator.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('ReadingPlan');

export async function getTodayPlan(request, response, env) {
  try {
    logger.request(request);

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
      logger.info('Today plan retrieved', { date: plan.date });
      logger.response(200);
      return successResponse(response, { date: plan.date, readings });
    } else {
      logger.warn('Today plan not found', { date: today });
      return notFoundResponse(response, '오늘의 읽기 계획을 찾을 수 없습니다.');
    }
  } catch (error) {
    logger.errorWithContext('Error fetching today\'s plan', error, { path: request.url.pathname });
    return serverErrorResponse(response, '서버 오류가 발생했습니다.');
  }
}

export async function getPlanProgress(request, response, env) {
  try {
    logger.request(request);

    // 인증 미들웨어
    const auth = await authMiddleware(request, response, env);
    if (!auth) return;

    const userId = auth.userId;
    const date = request.params.date;

    // 날짜 형식 검증
    const dateValidation = validate({ date })
      .pattern('date', /^\d{4}-\d{2}-\d{2}$/, '날짜 형식이 올바르지 않습니다. (YYYY-MM-DD)')
      .validate();

    if (!dateValidation.isValid) {
      logger.warn('Get plan progress validation failed', { errors: dateValidation.getErrors(), userId, date });
      return errorResponse(response, 'INVALID_DATE', dateValidation.getFirstError().message, 400);
    }

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

    logger.info('Plan progress retrieved', { userId, date });
    logger.response(200, { userId, date });

    return successResponse(response, {
      date,
      progress: progress.results || [],
    });
  } catch (error) {
    logger.errorWithContext('Error fetching plan progress', error, { path: request.url.pathname });
    return serverErrorResponse(response, '진행률 조회 중 오류가 발생했습니다.');
  }
}

export async function updatePlanProgress(request, response, env) {
  try {
    logger.request(request);

    // 인증 미들웨어
    const auth = await authMiddleware(request, response, env);
    if (!auth) return;

    const userId = auth.userId;
    const date = request.params.date;
    const body = await request.body.json();

    // 데이터 검증
    const validation = validate(body)
      .required('readingId', 'readingId가 필요합니다.')
      .range('readingId', 1, 4, 'readingId는 1-4 사이의 값이어야 합니다.')
      .required('isCompleted', 'isCompleted가 필요합니다.')
      .validate();

    if (!validation.isValid) {
      logger.warn('Update plan progress validation failed', { errors: validation.getErrors(), userId, date });
      return errorResponse(response, 'VALIDATION_ERROR', validation.getFirstError().message, 400);
    }

    const { readingId, isCompleted } = body;

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

    logger.info('Plan progress updated', { userId, date, readingId, isCompleted });
    logger.response(200, { userId, date });

    return successResponse(response, null, '진행률이 업데이트되었습니다.');
  } catch (error) {
    logger.errorWithContext('Error updating plan progress', error, { path: request.url.pathname });
    return serverErrorResponse(response, '진행률 업데이트 중 오류가 발생했습니다.');
  }
}

