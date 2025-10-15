/**
 * JWT 유틸리티 함수들
 * Cloudflare Workers에서 JWT 토큰 생성 및 검증
 */

export async function generateJWT(payload, secret) {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const now = Math.floor(Date.now() / 1000);
  const tokenPayload = {
    ...payload,
    iat: now,
    exp: now + (24 * 60 * 60) // 24시간
  };

  // Base64 URL 인코딩
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(tokenPayload));

  // 서명 생성
  const signature = await hmacSha256(
    `${encodedHeader}.${encodedPayload}`,
    secret
  );

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export async function verifyJWT(token, secret) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const [header, payload, signature] = parts;

    // 서명 검증
    const expectedSignature = await hmacSha256(
      `${header}.${payload}`,
      secret
    );

    if (signature !== expectedSignature) {
      return null;
    }

    // 페이로드 디코딩
    const decodedPayload = JSON.parse(base64UrlDecode(payload));

    // 만료 시간 확인
    if (decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return decodedPayload;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

function base64UrlEncode(str) {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function base64UrlDecode(str) {
  // 패딩 추가
  str += '='.repeat((4 - str.length % 4) % 4);
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  return atob(str);
}

async function hmacSha256(message, secret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(message)
  );

  const hashArray = Array.from(new Uint8Array(signature));
  return base64UrlEncode(String.fromCharCode.apply(null, hashArray));
}
