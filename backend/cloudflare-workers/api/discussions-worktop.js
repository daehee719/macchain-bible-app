/**
 * Discussions API (Worktop 버전)
 * 토론 게시글 관리
 */

import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.js';
import { successResponse, errorResponse, notFoundResponse, serverErrorResponse, validationErrorResponse, forbiddenResponse } from '../utils/response.js';
import { validate } from '../utils/validator.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('Discussions');

// ID 생성 헬퍼
function generateId() {
  return `disc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 토론 목록 조회
 */
export async function getDiscussions(request, response, env) {
  try {
    logger.request(request);

    // 선택적 인증 (로그인한 사용자는 좋아요/북마크 정보 포함)
    const auth = await optionalAuthMiddleware(request, response, env);
    const userId = auth?.userId || null;

    // 쿼리 파라미터
    const categoryId = request.query.get('categoryId');
    const page = parseInt(request.query.get('page') || '1');
    const limit = parseInt(request.query.get('limit') || '20');
    const sort = request.query.get('sort') || 'latest'; // latest, popular, oldest
    const offset = (page - 1) * limit;

    // 정렬 기준
    let orderBy = 'd.created_at DESC';
    if (sort === 'popular') {
      orderBy = 'd.like_count DESC, d.comment_count DESC, d.created_at DESC';
    } else if (sort === 'oldest') {
      orderBy = 'd.created_at ASC';
    }

    // 쿼리 빌드
    let query = `
      SELECT 
        d.id,
        d.user_id,
        d.title,
        d.content,
        d.passage_reference,
        d.passage_text,
        d.category_id,
        dc.name as category_name,
        dc.icon as category_icon,
        dc.color as category_color,
        d.view_count,
        d.like_count,
        d.comment_count,
        d.is_pinned,
        d.is_locked,
        d.created_at,
        d.updated_at,
        u.nickname as author_nickname,
        u.name as author_name
      FROM discussions d
      LEFT JOIN discussion_categories dc ON d.category_id = dc.id
      LEFT JOIN users u ON d.user_id = u.id
      WHERE d.is_deleted = 0
    `;

    const params = [];

    if (categoryId) {
      query += ' AND d.category_id = ?';
      params.push(categoryId);
    }

    query += ` ORDER BY d.is_pinned DESC, ${orderBy} LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const discussions = await env.DB.prepare(query).bind(...params).all();

    // 총 개수 조회
    let countQuery = 'SELECT COUNT(*) as total FROM discussions WHERE is_deleted = 0';
    const countParams = [];
    if (categoryId) {
      countQuery += ' AND category_id = ?';
      countParams.push(categoryId);
    }
    const countResult = await env.DB.prepare(countQuery).bind(...countParams).first();
    const total = countResult?.total || 0;

    // 사용자별 좋아요/북마크 정보 추가 (로그인한 경우)
    if (userId) {
      const discussionIds = discussions.results.map(d => d.id);
      if (discussionIds.length > 0) {
        const likes = await env.DB.prepare(`
          SELECT discussion_id FROM discussion_likes 
          WHERE user_id = ? AND discussion_id IN (${discussionIds.map(() => '?').join(',')})
        `).bind(userId, ...discussionIds).all();

        const bookmarks = await env.DB.prepare(`
          SELECT discussion_id FROM discussion_bookmarks 
          WHERE user_id = ? AND discussion_id IN (${discussionIds.map(() => '?').join(',')})
        `).bind(userId, ...discussionIds).all();

        const likedIds = new Set(likes.results.map(l => l.discussion_id));
        const bookmarkedIds = new Set(bookmarks.results.map(b => b.discussion_id));

        discussions.results = discussions.results.map(d => ({
          ...d,
          is_liked: likedIds.has(d.id),
          is_bookmarked: bookmarkedIds.has(d.id),
        }));
      }
    }

    logger.info('Discussions retrieved', { count: discussions.results.length, page, categoryId });
    logger.response(200);

    return successResponse(response, {
      discussions: discussions.results,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.errorWithContext('Get discussions error', error, { path: request.url.pathname });
    return serverErrorResponse(response, '토론 목록 조회 중 오류가 발생했습니다.');
  }
}

/**
 * 토론 상세 조회
 */
export async function getDiscussion(request, response, env) {
  try {
    logger.request(request);

    const discussionId = request.params.id;
    const auth = await optionalAuthMiddleware(request, response, env);
    const userId = auth?.userId || null;

    // 조회수 증가 (중복 방지는 프론트엔드에서 처리)
    await env.DB.prepare(`
      UPDATE discussions 
      SET view_count = view_count + 1 
      WHERE id = ?
    `).bind(discussionId).run();

    // 토론 조회
    const discussion = await env.DB.prepare(`
      SELECT 
        d.id,
        d.user_id,
        d.title,
        d.content,
        d.passage_reference,
        d.passage_text,
        d.category_id,
        dc.name as category_name,
        dc.icon as category_icon,
        dc.color as category_color,
        d.view_count,
        d.like_count,
        d.comment_count,
        d.is_pinned,
        d.is_locked,
        d.created_at,
        d.updated_at,
        u.nickname as author_nickname,
        u.name as author_name,
        u.id as author_id
      FROM discussions d
      LEFT JOIN discussion_categories dc ON d.category_id = dc.id
      LEFT JOIN users u ON d.user_id = u.id
      WHERE d.id = ? AND d.is_deleted = 0
    `).bind(discussionId).first();

    if (!discussion) {
      logger.warn('Discussion not found', { discussionId });
      return notFoundResponse(response, '토론을 찾을 수 없습니다.');
    }

    // 사용자별 좋아요/북마크 정보
    if (userId) {
      const like = await env.DB.prepare(`
        SELECT id FROM discussion_likes 
        WHERE user_id = ? AND discussion_id = ?
      `).bind(userId, discussionId).first();

      const bookmark = await env.DB.prepare(`
        SELECT id FROM discussion_bookmarks 
        WHERE user_id = ? AND discussion_id = ?
      `).bind(userId, discussionId).first();

      discussion.is_liked = !!like;
      discussion.is_bookmarked = !!bookmark;
      discussion.is_author = discussion.user_id === userId;
    }

    logger.info('Discussion retrieved', { discussionId });
    logger.response(200);

    return successResponse(response, { discussion });
  } catch (error) {
    logger.errorWithContext('Get discussion error', error, { path: request.url.pathname });
    return serverErrorResponse(response, '토론 조회 중 오류가 발생했습니다.');
  }
}

/**
 * 토론 작성
 */
export async function createDiscussion(request, response, env) {
  try {
    logger.request(request);

    const auth = await authMiddleware(request, response, env);
    if (!auth) return;

    const userId = auth.userId;
    const body = await request.body.json();

    // 데이터 검증
    const validation = validate(body)
      .required('title', '제목을 입력해주세요.')
      .minLength('title', 2, '제목은 최소 2자 이상이어야 합니다.')
      .maxLength('title', 200, '제목은 최대 200자까지 가능합니다.')
      .required('content', '내용을 입력해주세요.')
      .minLength('content', 10, '내용은 최소 10자 이상이어야 합니다.')
      .validate();

    if (!validation.isValid) {
      logger.warn('Create discussion validation failed', { errors: validation.getErrors(), userId });
      return validationErrorResponse(response, validation.getFirstError().message);
    }

    const { title, content, passageReference, passageText, categoryId } = body;

    // 카테고리 확인 (선택적)
    if (categoryId) {
      const category = await env.DB.prepare(`
        SELECT id FROM discussion_categories WHERE id = ? AND is_active = 1
      `).bind(categoryId).first();

      if (!category) {
        return errorResponse(response, 'INVALID_CATEGORY', '유효하지 않은 카테고리입니다.', 400);
      }
    }

    const discussionId = generateId();

    // 토론 생성
    await env.DB.prepare(`
      INSERT INTO discussions (
        id, user_id, title, content, passage_reference, passage_text, category_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(discussionId, userId, title, content, passageReference || null, passageText || null, categoryId || null).run();

    logger.info('Discussion created', { discussionId, userId });
    logger.response(201, { discussionId });

    return successResponse(response, {
      id: discussionId,
      title,
      content,
    }, '토론이 작성되었습니다.', 201);
  } catch (error) {
    logger.errorWithContext('Create discussion error', error, { path: request.url.pathname });
    return serverErrorResponse(response, '토론 작성 중 오류가 발생했습니다.');
  }
}

/**
 * 토론 수정
 */
export async function updateDiscussion(request, response, env) {
  try {
    logger.request(request);

    const auth = await authMiddleware(request, response, env);
    if (!auth) return;

    const userId = auth.userId;
    const discussionId = request.params.id;
    const body = await request.body.json();

    // 토론 존재 및 소유권 확인
    const discussion = await env.DB.prepare(`
      SELECT user_id FROM discussions WHERE id = ? AND is_deleted = 0
    `).bind(discussionId).first();

    if (!discussion) {
      return notFoundResponse(response, '토론을 찾을 수 없습니다.');
    }

    if (discussion.user_id !== userId) {
      logger.warn('Update discussion unauthorized', { discussionId, userId });
      return forbiddenResponse(response, '수정 권한이 없습니다.');
    }

    // 데이터 검증
    const validation = validate(body)
      .required('title', '제목을 입력해주세요.')
      .minLength('title', 2, '제목은 최소 2자 이상이어야 합니다.')
      .maxLength('title', 200, '제목은 최대 200자까지 가능합니다.')
      .required('content', '내용을 입력해주세요.')
      .minLength('content', 10, '내용은 최소 10자 이상이어야 합니다.')
      .validate();

    if (!validation.isValid) {
      logger.warn('Update discussion validation failed', { errors: validation.getErrors(), userId, discussionId });
      return validationErrorResponse(response, validation.getFirstError().message);
    }

    const { title, content, passageReference, passageText, categoryId } = body;

    // 카테고리 확인 (선택적)
    if (categoryId) {
      const category = await env.DB.prepare(`
        SELECT id FROM discussion_categories WHERE id = ? AND is_active = 1
      `).bind(categoryId).first();

      if (!category) {
        return errorResponse(response, 'INVALID_CATEGORY', '유효하지 않은 카테고리입니다.', 400);
      }
    }

    // 토론 수정
    await env.DB.prepare(`
      UPDATE discussions 
      SET 
        title = ?,
        content = ?,
        passage_reference = ?,
        passage_text = ?,
        category_id = ?,
        updated_at = datetime('now')
      WHERE id = ?
    `).bind(title, content, passageReference || null, passageText || null, categoryId || null, discussionId).run();

    logger.info('Discussion updated', { discussionId, userId });
    logger.response(200);

    return successResponse(response, null, '토론이 수정되었습니다.');
  } catch (error) {
    logger.errorWithContext('Update discussion error', error, { path: request.url.pathname });
    return serverErrorResponse(response, '토론 수정 중 오류가 발생했습니다.');
  }
}

/**
 * 토론 삭제
 */
export async function deleteDiscussion(request, response, env) {
  try {
    logger.request(request);

    const auth = await authMiddleware(request, response, env);
    if (!auth) return;

    const userId = auth.userId;
    const discussionId = request.params.id;

    // 토론 존재 및 소유권 확인
    const discussion = await env.DB.prepare(`
      SELECT user_id FROM discussions WHERE id = ? AND is_deleted = 0
    `).bind(discussionId).first();

    if (!discussion) {
      return notFoundResponse(response, '토론을 찾을 수 없습니다.');
    }

    if (discussion.user_id !== userId) {
      logger.warn('Delete discussion unauthorized', { discussionId, userId });
      return forbiddenResponse(response, '삭제 권한이 없습니다.');
    }

    // 소프트 삭제
    await env.DB.prepare(`
      UPDATE discussions 
      SET is_deleted = 1, updated_at = datetime('now')
      WHERE id = ?
    `).bind(discussionId).run();

    logger.info('Discussion deleted', { discussionId, userId });
    logger.response(200);

    return successResponse(response, null, '토론이 삭제되었습니다.');
  } catch (error) {
    logger.errorWithContext('Delete discussion error', error, { path: request.url.pathname });
    return serverErrorResponse(response, '토론 삭제 중 오류가 발생했습니다.');
  }
}

/**
 * 카테고리 목록 조회
 */
export async function getCategories(request, response, env) {
  try {
    logger.request(request);

    const categories = await env.DB.prepare(`
      SELECT id, name, description, icon, color, sort_order
      FROM discussion_categories
      WHERE is_active = 1
      ORDER BY sort_order ASC, name ASC
    `).all();

    logger.info('Categories retrieved', { count: categories.results.length });
    logger.response(200);

    return successResponse(response, { categories: categories.results || [] });
  } catch (error) {
    logger.errorWithContext('Get categories error', error, { path: request.url.pathname });
    return serverErrorResponse(response, '카테고리 조회 중 오류가 발생했습니다.');
  }
}

