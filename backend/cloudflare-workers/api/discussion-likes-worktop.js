/**
 * Discussion Likes API (Worktop 버전)
 * 좋아요 및 북마크 관리
 */

import { authMiddleware } from '../middleware/auth.js';
import { successResponse, errorResponse, notFoundResponse, serverErrorResponse } from '../utils/response.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('DiscussionLikes');

// ID 생성 헬퍼
function generateId() {
  return `like_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 게시글 좋아요 추가/제거
 */
export async function toggleDiscussionLike(request, response, env) {
  try {
    logger.request(request);

    const auth = await authMiddleware(request, response, env);
    if (!auth) return;

    const userId = auth.userId;
    const discussionId = request.params.id;

    // 토론 존재 확인
    const discussion = await env.DB.prepare(`
      SELECT id FROM discussions WHERE id = ? AND is_deleted = 0
    `).bind(discussionId).first();

    if (!discussion) {
      return notFoundResponse(response, '토론을 찾을 수 없습니다.');
    }

    // 기존 좋아요 확인
    const existingLike = await env.DB.prepare(`
      SELECT id FROM discussion_likes 
      WHERE user_id = ? AND discussion_id = ?
    `).bind(userId, discussionId).first();

    if (existingLike) {
      // 좋아요 제거
      await env.DB.prepare(`
        DELETE FROM discussion_likes WHERE id = ?
      `).bind(existingLike.id).run();

      logger.info('Discussion like removed', { discussionId, userId });
      return successResponse(response, { liked: false }, '좋아요가 취소되었습니다.');
    } else {
      // 좋아요 추가
      const likeId = generateId();
      await env.DB.prepare(`
        INSERT INTO discussion_likes (id, user_id, discussion_id)
        VALUES (?, ?, ?)
      `).bind(likeId, userId, discussionId).run();

      logger.info('Discussion like added', { discussionId, userId });
      return successResponse(response, { liked: true }, '좋아요가 추가되었습니다.');
    }
  } catch (error) {
    logger.errorWithContext('Toggle discussion like error', error, { path: request.url.pathname });
    return serverErrorResponse(response, '좋아요 처리 중 오류가 발생했습니다.');
  }
}

/**
 * 댓글 좋아요 추가/제거
 */
export async function toggleCommentLike(request, response, env) {
  try {
    logger.request(request);

    const auth = await authMiddleware(request, response, env);
    if (!auth) return;

    const userId = auth.userId;
    const commentId = request.params.id;

    // 댓글 존재 확인
    const comment = await env.DB.prepare(`
      SELECT id FROM discussion_comments WHERE id = ? AND is_deleted = 0
    `).bind(commentId).first();

    if (!comment) {
      return notFoundResponse(response, '댓글을 찾을 수 없습니다.');
    }

    // 기존 좋아요 확인
    const existingLike = await env.DB.prepare(`
      SELECT id FROM discussion_likes 
      WHERE user_id = ? AND comment_id = ?
    `).bind(userId, commentId).first();

    if (existingLike) {
      // 좋아요 제거
      await env.DB.prepare(`
        DELETE FROM discussion_likes WHERE id = ?
      `).bind(existingLike.id).run();

      logger.info('Comment like removed', { commentId, userId });
      return successResponse(response, { liked: false }, '좋아요가 취소되었습니다.');
    } else {
      // 좋아요 추가
      const likeId = generateId();
      await env.DB.prepare(`
        INSERT INTO discussion_likes (id, user_id, comment_id)
        VALUES (?, ?, ?)
      `).bind(likeId, userId, commentId).run();

      logger.info('Comment like added', { commentId, userId });
      return successResponse(response, { liked: true }, '좋아요가 추가되었습니다.');
    }
  } catch (error) {
    logger.errorWithContext('Toggle comment like error', error, { path: request.url.pathname });
    return serverErrorResponse(response, '좋아요 처리 중 오류가 발생했습니다.');
  }
}

/**
 * 북마크 추가/제거
 */
export async function toggleBookmark(request, response, env) {
  try {
    logger.request(request);

    const auth = await authMiddleware(request, response, env);
    if (!auth) return;

    const userId = auth.userId;
    const discussionId = request.params.id;

    // 토론 존재 확인
    const discussion = await env.DB.prepare(`
      SELECT id FROM discussions WHERE id = ? AND is_deleted = 0
    `).bind(discussionId).first();

    if (!discussion) {
      return notFoundResponse(response, '토론을 찾을 수 없습니다.');
    }

    // 기존 북마크 확인
    const existingBookmark = await env.DB.prepare(`
      SELECT id FROM discussion_bookmarks 
      WHERE user_id = ? AND discussion_id = ?
    `).bind(userId, discussionId).first();

    if (existingBookmark) {
      // 북마크 제거
      await env.DB.prepare(`
        DELETE FROM discussion_bookmarks WHERE id = ?
      `).bind(existingBookmark.id).run();

      logger.info('Bookmark removed', { discussionId, userId });
      return successResponse(response, { bookmarked: false }, '북마크가 취소되었습니다.');
    } else {
      // 북마크 추가
      const bookmarkId = `bookmark_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await env.DB.prepare(`
        INSERT INTO discussion_bookmarks (id, user_id, discussion_id)
        VALUES (?, ?, ?)
      `).bind(bookmarkId, userId, discussionId).run();

      logger.info('Bookmark added', { discussionId, userId });
      return successResponse(response, { bookmarked: true }, '북마크가 추가되었습니다.');
    }
  } catch (error) {
    logger.errorWithContext('Toggle bookmark error', error, { path: request.url.pathname });
    return serverErrorResponse(response, '북마크 처리 중 오류가 발생했습니다.');
  }
}

/**
 * 내 북마크 목록 조회
 */
export async function getMyBookmarks(request, response, env) {
  try {
    logger.request(request);

    const auth = await authMiddleware(request, response, env);
    if (!auth) return;

    const userId = auth.userId;
    const page = parseInt(request.query.get('page') || '1');
    const limit = parseInt(request.query.get('limit') || '20');
    const offset = (page - 1) * limit;

    // 북마크 목록 조회
    const bookmarks = await env.DB.prepare(`
      SELECT 
        d.id,
        d.title,
        d.content,
        d.passage_reference,
        d.view_count,
        d.like_count,
        d.comment_count,
        d.created_at,
        u.nickname as author_nickname,
        dc.name as category_name,
        dc.icon as category_icon,
        dc.color as category_color,
        b.created_at as bookmarked_at
      FROM discussion_bookmarks b
      JOIN discussions d ON b.discussion_id = d.id
      LEFT JOIN users u ON d.user_id = u.id
      LEFT JOIN discussion_categories dc ON d.category_id = dc.id
      WHERE b.user_id = ? AND d.is_deleted = 0
      ORDER BY b.created_at DESC
      LIMIT ? OFFSET ?
    `).bind(userId, limit, offset).all();

    // 총 개수
    const countResult = await env.DB.prepare(`
      SELECT COUNT(*) as total 
      FROM discussion_bookmarks b
      JOIN discussions d ON b.discussion_id = d.id
      WHERE b.user_id = ? AND d.is_deleted = 0
    `).bind(userId).first();
    const total = countResult?.total || 0;

    logger.info('Bookmarks retrieved', { userId, count: bookmarks.results.length });
    logger.response(200);

    return successResponse(response, {
      bookmarks: bookmarks.results || [],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.errorWithContext('Get bookmarks error', error, { path: request.url.pathname });
    return serverErrorResponse(response, '북마크 목록 조회 중 오류가 발생했습니다.');
  }
}

