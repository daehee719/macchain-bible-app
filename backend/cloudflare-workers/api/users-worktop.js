/**
 * Users API (Worktop 버전)
 * 사용자 관리 관련 엔드포인트
 */

import { authMiddleware } from '../middleware/auth.js';
import { successResponse, errorResponse, notFoundResponse, serverErrorResponse, validationErrorResponse } from '../utils/response.js';
import { validate } from '../utils/validator.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('Users');

export async function getUserProfile(request, response, env) {
  try {
    logger.request(request);

    // 인증 미들웨어
    const auth = await authMiddleware(request, response, env);
    if (!auth) return; // 미들웨어에서 이미 응답 처리

    const userId = auth.userId;
    const user = await env.DB.prepare(`
      SELECT id, email, name, nickname, is_active, created_at, updated_at
      FROM users 
      WHERE id = ?
    `).bind(userId).first();

    if (!user) {
      logger.warn('User profile not found', { userId });
      return notFoundResponse(response, '사용자를 찾을 수 없습니다.');
    }

    logger.info('User profile retrieved', { userId });
    logger.response(200, { userId });

    return successResponse(response, {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        nickname: user.nickname,
        isActive: user.is_active,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
    });
  } catch (error) {
    logger.errorWithContext('Get user profile error', error, { path: request.url.pathname });
    return serverErrorResponse(response, '프로필 조회 중 오류가 발생했습니다.');
  }
}

export async function updateUserProfile(request, response, env) {
  try {
    logger.request(request);

    // 인증 미들웨어
    const auth = await authMiddleware(request, response, env);
    if (!auth) return;

    const userId = auth.userId;
    const body = await request.body.json();

    // 데이터 검증
    const validation = validate(body)
      .required('name', '이름을 입력해주세요.')
      .minLength('name', 2, '이름은 최소 2자 이상이어야 합니다.')
      .maxLength('name', 50, '이름은 최대 50자까지 가능합니다.')
      .required('nickname', '닉네임을 입력해주세요.')
      .minLength('nickname', 2, '닉네임은 최소 2자 이상이어야 합니다.')
      .maxLength('nickname', 20, '닉네임은 최대 20자까지 가능합니다.')
      .validate();

    if (!validation.isValid) {
      logger.warn('Update profile validation failed', { errors: validation.getErrors(), userId });
      return validationErrorResponse(response, validation.getFirstError().message);
    }

    const { name, nickname } = body;

    // 닉네임 중복 확인
    const existingUser = await env.DB.prepare(`
      SELECT id FROM users 
      WHERE nickname = ? AND id != ?
    `).bind(nickname, userId).first();

    if (existingUser) {
      logger.warn('Update profile failed: nickname exists', { userId, nickname });
      return errorResponse(response, 'NICKNAME_EXISTS', '이미 사용 중인 닉네임입니다.', 409);
    }

    // 프로필 업데이트
    await env.DB.prepare(`
      UPDATE users 
      SET name = ?, nickname = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(name, nickname, userId).run();

    logger.info('User profile updated', { userId });
    logger.response(200, { userId });

    return successResponse(response, null, '프로필이 업데이트되었습니다.');
  } catch (error) {
    logger.errorWithContext('Update user profile error', error, { path: request.url.pathname });
    return serverErrorResponse(response, '프로필 업데이트 중 오류가 발생했습니다.');
  }
}

export async function getUserProgress(request, response, env) {
  try {
    logger.request(request);

    // 인증 미들웨어
    const auth = await authMiddleware(request, response, env);
    if (!auth) return;

    const userId = request.params.userId || auth.userId;
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

      logger.info('User progress initialized', { userId });
      return successResponse(response, {
        progress: {
          userId: userId,
          totalDaysRead: 0,
          currentStreak: 0,
          longestStreak: 0,
          booksCompleted: 0,
          lastReadDate: null,
        },
      });
    }

    logger.info('User progress retrieved', { userId });
    logger.response(200, { userId });

    return successResponse(response, {
      progress: {
        userId: progress.user_id,
        totalDaysRead: progress.total_days_read,
        currentStreak: progress.current_streak,
        longestStreak: progress.longest_streak,
        booksCompleted: progress.books_completed,
        lastReadDate: progress.last_read_date,
      },
    });
  } catch (error) {
    logger.errorWithContext('Get user progress error', error, { path: request.url.pathname });
    return serverErrorResponse(response, '진행률 조회 중 오류가 발생했습니다.');
  }
}

export async function updateUserProgress(request, response, env) {
  try {
    logger.request(request);

    // 인증 미들웨어
    const auth = await authMiddleware(request, response, env);
    if (!auth) return;

    const userId = request.params.userId || auth.userId;
    const body = await request.body.json();
    const { totalDaysRead, currentStreak, longestStreak, booksCompleted, lastReadDate } = body;

    // 데이터 검증
    const validation = validate(body)
      .custom('totalDaysRead', (val) => val === undefined || (Number(val) >= 0 && Number(val) <= 36500), 'totalDaysRead는 0 이상 36500 이하여야 합니다.')
      .custom('currentStreak', (val) => val === undefined || (Number(val) >= 0 && Number(val) <= 3650), 'currentStreak는 0 이상 3650 이하여야 합니다.')
      .custom('longestStreak', (val) => val === undefined || (Number(val) >= 0 && Number(val) <= 3650), 'longestStreak는 0 이상 3650 이하여야 합니다.')
      .custom('booksCompleted', (val) => val === undefined || (Number(val) >= 0 && Number(val) <= 66), 'booksCompleted는 0 이상 66 이하여야 합니다.')
      .validate();

    if (!validation.isValid) {
      logger.warn('Update progress validation failed', { errors: validation.getErrors(), userId });
      return validationErrorResponse(response, validation.getFirstError().message);
    }

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

    logger.info('User progress updated', { userId });
    logger.response(200, { userId });

    return successResponse(response, null, '진행률이 업데이트되었습니다.');
  } catch (error) {
    logger.errorWithContext('Update user progress error', error, { path: request.url.pathname });
    return serverErrorResponse(response, '진행률 업데이트 중 오류가 발생했습니다.');
  }
}

