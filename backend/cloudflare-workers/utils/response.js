/**
 * 표준화된 응답 래퍼
 * 일관된 API 응답 형식 제공
 */

/**
 * 성공 응답
 */
export function successResponse(response, data, message = 'Success', statusCode = 200) {
  return response.send(statusCode, {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
}

/**
 * 에러 응답
 */
export function errorResponse(response, error, message, statusCode = 400) {
  return response.send(statusCode, {
    success: false,
    error: error || 'ERROR',
    message,
    timestamp: new Date().toISOString(),
  });
}

/**
 * 인증 실패 응답
 */
export function unauthorizedResponse(response, message = '인증이 필요합니다.') {
  return errorResponse(response, 'UNAUTHORIZED', message, 401);
}

/**
 * 권한 없음 응답
 */
export function forbiddenResponse(response, message = '권한이 없습니다.') {
  return errorResponse(response, 'FORBIDDEN', message, 403);
}

/**
 * 리소스 없음 응답
 */
export function notFoundResponse(response, message = '리소스를 찾을 수 없습니다.') {
  return errorResponse(response, 'NOT_FOUND', message, 404);
}

/**
 * 서버 에러 응답
 */
export function serverErrorResponse(response, message = '서버 오류가 발생했습니다.') {
  return errorResponse(response, 'INTERNAL_SERVER_ERROR', message, 500);
}

/**
 * 검증 실패 응답
 */
export function validationErrorResponse(response, message = '입력 데이터가 올바르지 않습니다.') {
  return errorResponse(response, 'VALIDATION_ERROR', message, 400);
}

