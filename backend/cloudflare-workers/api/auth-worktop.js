/**
 * Authentication API (Worktop 버전)
 * JWT 기반 인증 시스템
 */

import { verifyJWT, generateJWT } from '../utils/jwt.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { successResponse, errorResponse, validationErrorResponse, serverErrorResponse } from '../utils/response.js';
import { validate, commonRules } from '../utils/validator.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('Auth');

export async function handleLogin(request, response, env) {
  try {
    logger.request(request);

    // 요청 데이터 파싱
    const body = await request.body.json();

    // 데이터 검증
    const validation = validate(body)
      .required('email', '이메일을 입력해주세요.')
      .email('email', '유효한 이메일 형식이어야 합니다.')
      .required('password', '비밀번호를 입력해주세요.')
      .minLength('password', 1, '비밀번호를 입력해주세요.')
      .validate();

    if (!validation.isValid) {
      const firstError = validation.getFirstError();
      logger.warn('Login validation failed', { errors: validation.getErrors() });
      return validationErrorResponse(response, firstError.message);
    }

    const { email, password } = body;

    // 사용자 조회
    const user = await env.DB.prepare(
      'SELECT id, email, password, name, nickname, is_active FROM users WHERE email = ?'
    ).bind(email).first();

    if (!user || !user.is_active) {
      logger.warn('Login failed: user not found', { email });
      return errorResponse(response, 'USER_NOT_FOUND', '사용자를 찾을 수 없습니다.', 401);
    }

    // 비밀번호 검증
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      logger.warn('Login failed: invalid password', { email, userId: user.id });
      return errorResponse(response, 'INVALID_PASSWORD', '비밀번호가 올바르지 않습니다.', 401);
    }

    // JWT 토큰 생성
    const token = await generateJWT({
      userId: user.id,
      email: user.email,
    }, env.JWT_SECRET);

    logger.info('Login successful', { userId: user.id, email: user.email });
    logger.response(200, { userId: user.id });

    return successResponse(response, {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        nickname: user.nickname,
        isActive: user.is_active,
      },
    }, '로그인 성공');
  } catch (error) {
    logger.errorWithContext('Login error', error, { path: request.url.pathname });
    return serverErrorResponse(response, '로그인 중 오류가 발생했습니다.');
  }
}

export async function handleRegister(request, response, env) {
  try {
    logger.request(request);

    // 요청 데이터 파싱
    const body = await request.body.json();

    // 데이터 검증
    const emailValidation = commonRules.email('email', body);
    if (!emailValidation.isValid) {
      logger.warn('Register validation failed: email', { errors: emailValidation.getErrors() });
      return validationErrorResponse(response, emailValidation.getFirstError().message);
    }

    const passwordValidation = commonRules.password('password', body, 8);
    if (!passwordValidation.isValid) {
      logger.warn('Register validation failed: password', { errors: passwordValidation.getErrors() });
      return validationErrorResponse(response, passwordValidation.getFirstError().message);
    }

    const nicknameValidation = commonRules.nickname('nickname', body, 2, 20);
    if (!nicknameValidation.isValid) {
      logger.warn('Register validation failed: nickname', { errors: nicknameValidation.getErrors() });
      return validationErrorResponse(response, nicknameValidation.getFirstError().message);
    }

    const nameValidation = validate(body)
      .required('name', '이름을 입력해주세요.')
      .minLength('name', 2, '이름은 최소 2자 이상이어야 합니다.')
      .maxLength('name', 50, '이름은 최대 50자까지 가능합니다.')
      .validate();

    if (!nameValidation.isValid) {
      logger.warn('Register validation failed: name', { errors: nameValidation.getErrors() });
      return validationErrorResponse(response, nameValidation.getFirstError().message);
    }

    const { email, password, name, nickname } = body;

    // 이메일 중복 확인
    const existingUser = await env.DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(email).first();

    if (existingUser) {
      logger.warn('Register failed: email already exists', { email });
      return errorResponse(response, 'EMAIL_EXISTS', '이미 사용 중인 이메일입니다.', 409);
    }

    // 비밀번호 해시화
    const hashedPassword = await hashPassword(password);

    // 사용자 생성
    const result = await env.DB.prepare(`
      INSERT INTO users (email, password, name, nickname, is_active, created_at)
      VALUES (?, ?, ?, ?, 1, datetime('now'))
    `).bind(email, hashedPassword, name, nickname).run();

    const userId = result.meta.last_row_id;

    // JWT 토큰 생성
    if (!env.JWT_SECRET) {
      throw new Error('JWT_SECRET이 설정되지 않았습니다.');
    }
    const token = await generateJWT({
      userId,
      email,
    }, env.JWT_SECRET);

    logger.info('Register successful', { userId, email });
    logger.response(201, { userId });

    return successResponse(response, {
      token,
      user: {
        id: userId,
        email,
        name,
        nickname,
        isActive: true,
      },
    }, '회원가입 성공', 201);
  } catch (error) {
    logger.errorWithContext('Register error', error, { path: request.url.pathname });
    return serverErrorResponse(response, '회원가입 중 오류가 발생했습니다.');
  }
}

export async function handleVerify(request, response, env) {
  try {
    logger.request(request);

    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('Verify failed: no token');
      return errorResponse(response, 'NO_TOKEN', '인증 토큰이 필요합니다.', 401);
    }

    const token = authHeader.substring(7);
    const payload = await verifyJWT(token, env.JWT_SECRET);

    if (!payload) {
      logger.warn('Verify failed: invalid token');
      return errorResponse(response, 'INVALID_TOKEN', '유효하지 않은 토큰입니다.', 401);
    }

    logger.info('Token verified', { userId: payload.userId });
    logger.response(200, { userId: payload.userId });

    return successResponse(response, {
      user: {
        id: payload.userId,
        email: payload.email,
      },
    }, '토큰이 유효합니다.');
  } catch (error) {
    logger.errorWithContext('Verify error', error, { path: request.url.pathname });
    return serverErrorResponse(response, '토큰 검증 중 오류가 발생했습니다.');
  }
}

