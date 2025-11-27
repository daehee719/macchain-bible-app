/**
 * Authentication API
 * JWT 기반 인증 시스템
 */

import { verifyJWT, generateJWT } from '../utils/jwt.js';
import { hashPassword, verifyPassword } from '../utils/password.js';

export async function handleAuth(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/api/auth/login' && request.method === 'POST') {
    return await handleLogin(request, env);
  } else if (path === '/api/auth/register' && request.method === 'POST') {
    return await handleRegister(request, env);
  } else if (path === '/api/auth/verify' && request.method === 'POST') {
    return await handleVerify(request, env);
  }

  return new Response('Not Found', { status: 404 });
}

async function handleLogin(request, env) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response(JSON.stringify({
        success: false,
        message: '이메일과 비밀번호를 입력해주세요.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 사용자 조회
    const user = await env.DB.prepare(
      'SELECT id, email, password, name, nickname, is_active FROM users WHERE email = ?'
    ).bind(email).first();

    if (!user || !user.is_active) {
      return new Response(JSON.stringify({
        success: false,
        message: '사용자를 찾을 수 없습니다.'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 비밀번호 검증
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return new Response(JSON.stringify({
        success: false,
        message: '비밀번호가 올바르지 않습니다.'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // JWT 토큰 생성
    const token = await generateJWT({
      userId: user.id,
      email: user.email
    }, env.JWT_SECRET);

    return new Response(JSON.stringify({
      success: true,
      message: '로그인 성공',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        nickname: user.nickname,
        isActive: user.is_active
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: '로그인 중 오류가 발생했습니다.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleRegister(request, env) {
  try {
    const { email, password, name, nickname } = await request.json();

    if (!email || !password || !name || !nickname) {
      return new Response(JSON.stringify({
        success: false,
        message: '모든 필드를 입력해주세요.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 이메일 중복 확인
    const existingUser = await env.DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(email).first();

    if (existingUser) {
      return new Response(JSON.stringify({
        success: false,
        message: '이미 사용 중인 이메일입니다.'
      }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' }
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
      email
    }, env.JWT_SECRET);
    return new Response(JSON.stringify({
      success: true,
      message: '회원가입 성공',
      token,
      user: {
        id: userId,
        email,
        name,
        nickname,
        isActive: true
      }
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Register error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: '회원가입 중 오류가 발생했습니다.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleVerify(request, env) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({
        success: false,
        message: '인증 토큰이 필요합니다.'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.substring(7);
    const payload = await verifyJWT(token, env.JWT_SECRET);

    if (!payload) {
      return new Response(JSON.stringify({
        success: false,
        message: '유효하지 않은 토큰입니다.'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: '토큰이 유효합니다.',
      user: {
        id: payload.userId,
        email: payload.email
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Verify error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: '토큰 검증 중 오류가 발생했습니다.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
