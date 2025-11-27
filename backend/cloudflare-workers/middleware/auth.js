/**
 * 인증 미들웨어
 * JWT 토큰 검증 및 사용자 정보 추출
 */

import { verifyJWT } from '../utils/jwt.js';

/**
 * 인증 미들웨어
 * @param {ServerRequest} request - Worktop request 객체
 * @param {ServerResponse} response - Worktop response 객체
 * @param {Object} env - 환경 변수 (DB, JWT_SECRET 등)
 * @returns {Object|null} - 인증 성공 시 { success: true, userId, email }, 실패 시 null
 */
export async function authMiddleware(request, response, env) {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    response.send(401, {
      success: false,
      error: 'UNAUTHORIZED',
      message: '인증 토큰이 필요합니다.',
    });
    return null;
  }

  const token = authHeader.substring(7);
  const payload = await verifyJWT(token, env.JWT_SECRET);

  if (!payload) {
    response.send(401, {
      success: false,
      error: 'INVALID_TOKEN',
      message: '유효하지 않은 토큰입니다.',
    });
    return null;
  }

  return {
    success: true,
    userId: payload.userId,
    email: payload.email,
  };
}

/**
 * 선택적 인증 미들웨어 (토큰이 있으면 검증, 없으면 통과)
 */
export async function optionalAuthMiddleware(request, response, env) {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { success: false, userId: null, email: null };
  }

  const token = authHeader.substring(7);
  const payload = await verifyJWT(token, env.JWT_SECRET);

  if (!payload) {
    return { success: false, userId: null, email: null };
  }

  return {
    success: true,
    userId: payload.userId,
    email: payload.email,
  };
}

