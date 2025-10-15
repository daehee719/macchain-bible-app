/**
 * 사용자 동의 설정 API
 * 개인정보 처리방침, 마케팅 수신, 알림 등 동의 설정 관리
 */

export async function handleConsent(request, env, ctx) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  if (request.method === 'GET') {
    try {
      const url = new URL(request.url);
      const userId = url.searchParams.get('userId');
      
      if (!userId) {
        return new Response(JSON.stringify({
          success: false,
          error: '사용자 ID가 필요합니다.'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

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

        return new Response(JSON.stringify({
          success: true,
          data: {
            privacyConsent: false,
            marketingConsent: false,
            notificationConsent: false,
            ageConsent: false
          }
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({
        success: true,
        data: {
          privacyConsent: consent.privacy_consent,
          marketingConsent: consent.marketing_consent,
          notificationConsent: consent.notification_consent,
          ageConsent: consent.age_consent
        }
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('Get Consent Error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: '동의 설정 조회 중 오류가 발생했습니다.'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  if (request.method === 'POST' || request.method === 'PUT') {
    try {
      const { userId, privacyConsent, marketingConsent, notificationConsent, ageConsent } = await request.json();
      
      if (!userId) {
        return new Response(JSON.stringify({
          success: false,
          error: '사용자 ID가 필요합니다.'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // 기존 동의 설정 확인
      const existingConsent = await env.DB.prepare(`
        SELECT id FROM user_consents WHERE user_id = ?
      `).bind(userId).first();

      if (existingConsent) {
        // 기존 설정 업데이트
        await env.DB.prepare(`
          UPDATE user_consents 
          SET 
            privacy_consent = ?,
            marketing_consent = ?,
            notification_consent = ?,
            age_consent = ?,
            updated_at = datetime('now')
          WHERE user_id = ?
        `).bind(
          privacyConsent || false,
          marketingConsent || false,
          notificationConsent || false,
          ageConsent || false,
          userId
        ).run();
      } else {
        // 새 동의 설정 생성
        const consentId = `consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await env.DB.prepare(`
          INSERT INTO user_consents (id, user_id, privacy_consent, marketing_consent, notification_consent, age_consent)
          VALUES (?, ?, ?, ?, ?, ?)
        `).bind(
          consentId,
          userId,
          privacyConsent || false,
          marketingConsent || false,
          notificationConsent || false,
          ageConsent || false
        ).run();
      }

      // 마케팅 동의에 따른 알림 설정
      if (marketingConsent) {
        // 마케팅 동의 시 알림도 자동으로 활성화
        await env.DB.prepare(`
          UPDATE user_consents 
          SET notification_consent = 1, updated_at = datetime('now')
          WHERE user_id = ?
        `).bind(userId).run();
      }

      return new Response(JSON.stringify({
        success: true,
        message: '동의 설정이 저장되었습니다.',
        data: {
          privacyConsent: privacyConsent || false,
          marketingConsent: marketingConsent || false,
          notificationConsent: notificationConsent || false,
          ageConsent: ageConsent || false
        }
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('Update Consent Error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: '동의 설정 저장 중 오류가 발생했습니다.',
        details: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  return new Response('Method Not Allowed', { status: 405 });
}
