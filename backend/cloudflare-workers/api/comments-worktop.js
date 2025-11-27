/**
 * Comments API (Worktop 버전)
 * 토론 댓글 관리
 */

import { authMiddleware } from '../middleware/auth.js';
import { successResponse, errorResponse, notFoundResponse, serverErrorResponse, validationErrorResponse, forbiddenResponse } from '../utils/response.js';
import { validate } from '../utils/validator.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('Comments');

// ID 생성 헬퍼
function generateId() {
  return `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 댓글 목록 조회
 */
export async function getComments(request, response, env) {
  try {
    logger.request(request);

    const discussionId = request.params.discussionId;
    const auth = await authMiddleware(request, response, env);
    if (!auth) return;

    const userId = auth.userId;

    // 댓글 조회 (계층 구조)
    const comments = await env.DB.prepare(`
      SELECT 
        c.id,
        c.discussion_id,
        c.user_id,
        c.parent_id,
        c.content,
        c.like_count,
        c.created_at,
        c.updated_at,
        u.nickname as author_nickname,
        u.name as author_name
      FROM discussion_comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.discussion_id = ? AND c.is_deleted = 0
      ORDER BY c.created_at ASC
    `).bind(discussionId).all();

    // 좋아요 정보 추가
    const commentIds = comments.results.map(c => c.id);
    if (commentIds.length > 0) {
      const likes = await env.DB.prepare(`
        SELECT comment_id FROM discussion_likes 
        WHERE user_id = ? AND comment_id IN (${commentIds.map(() => '?').join(',')})
      `).bind(userId, ...commentIds).all();

      const likedIds = new Set(likes.results.map(l => l.comment_id));

      comments.results = comments.results.map(c => ({
        ...c,
        is_liked: likedIds.has(c.id),
        is_author: c.user_id === userId,
      }));
    }

    // 계층 구조로 변환
    const commentMap = new Map();
    const rootComments = [];

    // 모든 댓글을 맵에 저장
    comments.results.forEach(comment => {
      comment.replies = [];
      commentMap.set(comment.id, comment);
    });

    // 계층 구조 생성
    comments.results.forEach(comment => {
      if (comment.parent_id) {
        const parent = commentMap.get(comment.parent_id);
        if (parent) {
          parent.replies.push(comment);
        }
      } else {
        rootComments.push(comment);
      }
    });

    logger.info('Comments retrieved', { discussionId, count: rootComments.length });
    logger.response(200);

    return successResponse(response, { comments: rootComments });
  } catch (error) {
    logger.errorWithContext('Get comments error', error, { path: request.url.pathname });
    return serverErrorResponse(response, '댓글 조회 중 오류가 발생했습니다.');
  }
}

/**
 * 댓글 작성
 */
export async function createComment(request, response, env) {
  try {
    logger.request(request);

    const auth = await authMiddleware(request, response, env);
    if (!auth) return;

    const userId = auth.userId;
    const discussionId = request.params.discussionId;
    const body = await request.body.json();

    // 토론 존재 확인
    const discussion = await env.DB.prepare(`
      SELECT id, is_locked FROM discussions WHERE id = ? AND is_deleted = 0
    `).bind(discussionId).first();

    if (!discussion) {
      return notFoundResponse(response, '토론을 찾을 수 없습니다.');
    }

    if (discussion.is_locked) {
      return errorResponse(response, 'LOCKED', '댓글이 잠겨있습니다.', 403);
    }

    // 데이터 검증
    const validation = validate(body)
      .required('content', '댓글 내용을 입력해주세요.')
      .minLength('content', 1, '댓글 내용을 입력해주세요.')
      .maxLength('content', 2000, '댓글은 최대 2000자까지 가능합니다.')
      .validate();

    if (!validation.isValid) {
      logger.warn('Create comment validation failed', { errors: validation.getErrors(), userId, discussionId });
      return validationErrorResponse(response, validation.getFirstError().message);
    }

    const { content, parentId } = body;

    // 대댓글인 경우 부모 댓글 확인
    if (parentId) {
      const parentComment = await env.DB.prepare(`
        SELECT id, discussion_id FROM discussion_comments 
        WHERE id = ? AND discussion_id = ? AND is_deleted = 0
      `).bind(parentId, discussionId).first();

      if (!parentComment) {
        return errorResponse(response, 'INVALID_PARENT', '유효하지 않은 부모 댓글입니다.', 400);
      }
    }

    const commentId = generateId();

    // 댓글 생성
    await env.DB.prepare(`
      INSERT INTO discussion_comments (
        id, discussion_id, user_id, parent_id, content
      ) VALUES (?, ?, ?, ?, ?)
    `).bind(commentId, discussionId, userId, parentId || null, content).run();

    logger.info('Comment created', { commentId, discussionId, userId });
    logger.response(201, { commentId });

    return successResponse(response, {
      id: commentId,
      content,
    }, '댓글이 작성되었습니다.', 201);
  } catch (error) {
    logger.errorWithContext('Create comment error', error, { path: request.url.pathname });
    return serverErrorResponse(response, '댓글 작성 중 오류가 발생했습니다.');
  }
}

/**
 * 댓글 수정
 */
export async function updateComment(request, response, env) {
  try {
    logger.request(request);

    const auth = await authMiddleware(request, response, env);
    if (!auth) return;

    const userId = auth.userId;
    const commentId = request.params.id;
    const body = await request.body.json();

    // 댓글 존재 및 소유권 확인
    const comment = await env.DB.prepare(`
      SELECT user_id FROM discussion_comments WHERE id = ? AND is_deleted = 0
    `).bind(commentId).first();

    if (!comment) {
      return notFoundResponse(response, '댓글을 찾을 수 없습니다.');
    }

    if (comment.user_id !== userId) {
      logger.warn('Update comment unauthorized', { commentId, userId });
      return forbiddenResponse(response, '수정 권한이 없습니다.');
    }

    // 데이터 검증
    const validation = validate(body)
      .required('content', '댓글 내용을 입력해주세요.')
      .minLength('content', 1, '댓글 내용을 입력해주세요.')
      .maxLength('content', 2000, '댓글은 최대 2000자까지 가능합니다.')
      .validate();

    if (!validation.isValid) {
      logger.warn('Update comment validation failed', { errors: validation.getErrors(), userId, commentId });
      return validationErrorResponse(response, validation.getFirstError().message);
    }

    const { content } = body;

    // 댓글 수정
    await env.DB.prepare(`
      UPDATE discussion_comments 
      SET content = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(content, commentId).run();

    logger.info('Comment updated', { commentId, userId });
    logger.response(200);

    return successResponse(response, null, '댓글이 수정되었습니다.');
  } catch (error) {
    logger.errorWithContext('Update comment error', error, { path: request.url.pathname });
    return serverErrorResponse(response, '댓글 수정 중 오류가 발생했습니다.');
  }
}

/**
 * 댓글 삭제
 */
export async function deleteComment(request, response, env) {
  try {
    logger.request(request);

    const auth = await authMiddleware(request, response, env);
    if (!auth) return;

    const userId = auth.userId;
    const commentId = request.params.id;

    // 댓글 존재 및 소유권 확인
    const comment = await env.DB.prepare(`
      SELECT user_id FROM discussion_comments WHERE id = ? AND is_deleted = 0
    `).bind(commentId).first();

    if (!comment) {
      return notFoundResponse(response, '댓글을 찾을 수 없습니다.');
    }

    if (comment.user_id !== userId) {
      logger.warn('Delete comment unauthorized', { commentId, userId });
      return forbiddenResponse(response, '삭제 권한이 없습니다.');
    }

    // 소프트 삭제
    await env.DB.prepare(`
      UPDATE discussion_comments 
      SET is_deleted = 1, updated_at = datetime('now')
      WHERE id = ?
    `).bind(commentId).run();

    logger.info('Comment deleted', { commentId, userId });
    logger.response(200);

    return successResponse(response, null, '댓글이 삭제되었습니다.');
  } catch (error) {
    logger.errorWithContext('Delete comment error', error, { path: request.url.pathname });
    return serverErrorResponse(response, '댓글 삭제 중 오류가 발생했습니다.');
  }
}

