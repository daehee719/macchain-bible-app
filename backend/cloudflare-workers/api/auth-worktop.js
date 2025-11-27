/**
 * Authentication API (Worktop 버전)
 * JWT 기반 인증 시스템
 */

import { verifyJWT, generateJWT } from '../utils/jwt.js';
import { hashPassword, verifyPassword } from '../utils/password.js';

export async function handleLogin(request, response, env) {
  try {
    // Worktop의 request.body.json() 사용
    const body = await request.body.json();
    const { email, password } = body;

    if (!email || !password) {
      return response.send(400, {
        success: false,
        message: '이메일과 비밀번호를 입력해주세요.',
      });
    }

    // 사용자 조회
    const user = await env.DB.prepare(
      'SELECT id, email, password, name, nickname, is_active FROM users WHERE email = ?'
    ).bind(email).first();

    if (!user || !user.is_active) {
      return response.send(401, {
        success: false,
        message: '사용자를 찾을 수 없습니다.',
      });
    }

    // 비밀번호 검증
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return response.send(401, {
        success: false,
        message: '비밀번호가 올바르지 않습니다.',
      });
    }

    // JWT 토큰 생성
    const token = await generateJWT({
      userId: user.id,
      email: user.email,
    }, env.JWT_SECRET);

    return response.send(200, {
      success: true,
      message: '로그인 성공',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        nickname: user.nickname,
        isActive: user.is_active,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return response.send(500, {
      success: false,
      message: '로그인 중 오류가 발생했습니다.',
    });
  }
}

export async function handleRegister(request, response, env) {
  try {
    // Worktop의 request.body.json() 사용
    const body = await request.body.json();
    const { email, password, name, nickname } = body;

    if (!email || !password || !name || !nickname) {
      return response.send(400, {
        success: false,
        message: '모든 필드를 입력해주세요.',
      });
    }

    // 이메일 중복 확인
    const existingUser = await env.DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(email).first();

    if (existingUser) {
      return response.send(409, {
        success: false,
        message: '이미 사용 중인 이메일입니다.',
      });
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

    return response.send(201, {
      success: true,
      message: '회원가입 성공',
      token,
      user: {
        id: userId,
        email,
        name,
        nickname,
        isActive: true,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    return response.send(500, {
      success: false,
      message: '회원가입 중 오류가 발생했습니다.',
      error: error.message, // 개발 중이므로 에러 메시지 포함
    });
  }
}

export async function handleVerify(request, response, env) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return response.send(401, {
        success: false,
        message: '인증 토큰이 필요합니다.',
      });
    }

    const token = authHeader.substring(7);
    const payload = await verifyJWT(token, env.JWT_SECRET);

    if (!payload) {
      return response.send(401, {
        success: false,
        message: '유효하지 않은 토큰입니다.',
      });
    }

    return response.send(200, {
      success: true,
      message: '토큰이 유효합니다.',
      user: {
        id: payload.userId,
        email: payload.email,
      },
    });
  } catch (error) {
    console.error('Verify error:', error);
    return response.send(500, {
      success: false,
      message: '토큰 검증 중 오류가 발생했습니다.',
    });
  }
}

