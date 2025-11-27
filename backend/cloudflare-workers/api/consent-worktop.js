/**
 * 사용자 동의 설정 API (Worktop 버전)
 * 개인정보 처리방침, 마케팅 수신, 알림 등 동의 설정 관리
 */

import { verifyJWT } from '../utils/jwt.js';

// 인증 확인 헬퍼
async function checkAuth(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { success: false, message: '인증 토큰이 필요합니다.' };
  }

  const token = authHeader.substring(7);
  const payload = await verifyJWT(token, env.JWT_SECRET);

  if (!payload) {
    return { success: false, message: '유효하지 않은 토큰입니다.' };
  }

  return { success: true, userId: payload.userId };
}

export async function getConsent(request, response, env) {
  try {
    const authResult = await checkAuth(request, env);
    if (!authResult.success) {
      return response.send(401, authResult);
    }

    const userId = authResult.userId;

    // 사용자 동의 설정 조회
    const consent = await env.DB.prepare(`
      SELECT * FROM user_consents 
      WHERE user_id = ?
    `).bind(userId).first();

    if (!consent) {
      // 기본 동의 설정 생성
      const consentId = `consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await env.DB.prepare(`
        INSERT INTO user_consents (id, user_id, privacy_consent, marketing_consent, notification_consent, age_consent)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(consentId, userId, false, false, false, false).run();

      return response.send(200, {
        success: true,
        data: {
          privacyConsent: false,
          marketingConsent: false,
          notificationConsent: false,
          ageConsent: false,
        },
      });
    }

    return response.send(200, {
      success: true,
      data: {
        privacyConsent: consent.privacy_consent,
        marketingConsent: consent.marketing_consent,
        notificationConsent: consent.notification_consent,
        ageConsent: consent.age_consent,
      },
    });
  } catch (error) {
    console.error('Get consent error:', error);
    return response.send(500, {
      success: false,
      error: '동의 설정 조회 중 오류가 발생했습니다.',
    });
  }
}

export async function updateConsent(request, response, env) {
  try {
    const authResult = await checkAuth(request, env);
    if (!authResult.success) {
      return response.send(401, authResult);
    }

    const userId = authResult.userId;
    const body = await request.body.json();
    const { privacyConsent, marketingConsent, notificationConsent, ageConsent } = body;

    // 동의 설정 업데이트 또는 생성
    const consentId = `consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await env.DB.prepare(`
      INSERT OR REPLACE INTO user_consents 
      (id, user_id, privacy_consent, marketing_consent, notification_consent, age_consent, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(
      consentId,
      userId,
      privacyConsent || false,
      marketingConsent || false,
      notificationConsent || false,
      ageConsent || false
    ).run();

    return response.send(200, {
      success: true,
      message: '동의 설정이 업데이트되었습니다.',
    });
  } catch (error) {
    console.error('Update consent error:', error);
    return response.send(500, {
      success: false,
      error: '동의 설정 업데이트 중 오류가 발생했습니다.',
    });
  }
}

