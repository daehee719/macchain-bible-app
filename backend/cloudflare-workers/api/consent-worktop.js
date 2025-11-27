/**
 * 사용자 동의 설정 API (Worktop 버전)
 * 개인정보 처리방침, 마케팅 수신, 알림 등 동의 설정 관리
 */

import { authMiddleware } from '../middleware/auth.js';
import { successResponse, serverErrorResponse } from '../utils/response.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('Consent');

export async function getConsent(request, response, env) {
  try {
    logger.request(request);

    // 인증 미들웨어
    const auth = await authMiddleware(request, response, env);
    if (!auth) return;

    const userId = auth.userId;

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

      logger.info('Consent initialized', { userId });
      return successResponse(response, {
        privacyConsent: false,
        marketingConsent: false,
        notificationConsent: false,
        ageConsent: false,
      });
    }

    logger.info('Consent retrieved', { userId });
    logger.response(200, { userId });

    return successResponse(response, {
      privacyConsent: consent.privacy_consent,
      marketingConsent: consent.marketing_consent,
      notificationConsent: consent.notification_consent,
      ageConsent: consent.age_consent,
    });
  } catch (error) {
    logger.errorWithContext('Get consent error', error, { path: request.url.pathname });
    return serverErrorResponse(response, '동의 설정 조회 중 오류가 발생했습니다.');
  }
}

export async function updateConsent(request, response, env) {
  try {
    logger.request(request);

    // 인증 미들웨어
    const auth = await authMiddleware(request, response, env);
    if (!auth) return;

    const userId = auth.userId;
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

    logger.info('Consent updated', { userId, privacyConsent, marketingConsent, notificationConsent, ageConsent });
    logger.response(200, { userId });

    return successResponse(response, null, '동의 설정이 업데이트되었습니다.');
  } catch (error) {
    logger.errorWithContext('Update consent error', error, { path: request.url.pathname });
    return serverErrorResponse(response, '동의 설정 업데이트 중 오류가 발생했습니다.');
  }
}

