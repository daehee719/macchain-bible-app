/**
 * 알림 및 큐 시스템 API
 * Cloudflare Queues를 활용한 비동기 알림 처리
 */

export async function handleNotifications(request, env, ctx) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  if (request.method === 'POST') {
    try {
      const { type, userId, data } = await request.json();
      
      if (!type || !userId) {
        return new Response(JSON.stringify({
          success: false,
          error: '알림 타입과 사용자 ID가 필요합니다.'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // 알림 메시지 생성
      const notification = await createNotification(env, type, userId, data);
      
      // 큐에 알림 작업 추가
      await env.NOTIFICATION_QUEUE.send({
        notificationId: notification.id,
        type,
        userId,
        data: notification,
        timestamp: new Date().toISOString()
      });

      return new Response(JSON.stringify({
        success: true,
        data: {
          notificationId: notification.id,
          message: '알림이 큐에 추가되었습니다.'
        }
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('Notification Error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: '알림 처리 중 오류가 발생했습니다.',
        details: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  if (request.method === 'GET') {
    try {
      const url = new URL(request.url);
      const userId = url.searchParams.get('userId');
      const limit = parseInt(url.searchParams.get('limit') || '20');
      
      if (!userId) {
        return new Response(JSON.stringify({
          success: false,
          error: '사용자 ID가 필요합니다.'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // 사용자 알림 조회
      const notifications = await env.DB.prepare(`
        SELECT * FROM notifications 
        WHERE user_id = ? 
        ORDER BY created_at DESC 
        LIMIT ?
      `).bind(userId, limit).all();

      return new Response(JSON.stringify({
        success: true,
        data: notifications.results || []
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('Get Notifications Error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: '알림 조회 중 오류가 발생했습니다.'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  return new Response('Method Not Allowed', { status: 405 });
}

async function createNotification(env, type, userId, data) {
  const notificationId = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  let title, message, priority = 'normal';
  
  switch (type) {
    case 'reading_reminder':
      title = '성경 읽기 시간입니다!';
      message = '오늘의 읽기 계획을 확인해보세요.';
      priority = 'high';
      break;
    case 'streak_milestone':
      title = '연속 읽기 달성!';
      message = `축하합니다! ${data.days}일 연속으로 성경을 읽고 있습니다.`;
      priority = 'high';
      break;
    case 'weekly_summary':
      title = '주간 읽기 요약';
      message = `이번 주에 ${data.completedReadings}개의 읽기 계획을 완료했습니다.`;
      priority = 'normal';
      break;
    case 'ai_analysis_ready':
      title = 'AI 분석 완료';
      message = '요청하신 성경 구절 분석이 완료되었습니다.';
      priority = 'normal';
      break;
    case 'community_interaction':
      title = '커뮤니티 활동';
      message = data.message || '새로운 커뮤니티 활동이 있습니다.';
      priority = 'low';
      break;
    default:
      title = '새로운 알림';
      message = data.message || '새로운 알림이 있습니다.';
  }

  // 데이터베이스에 알림 저장
  await env.DB.prepare(`
    INSERT INTO notifications (id, user_id, type, title, message, data, priority, created_at, read_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), NULL)
  `).bind(
    notificationId,
    userId,
    type,
    title,
    message,
    JSON.stringify(data || {}),
    priority
  ).run();

  return {
    id: notificationId,
    userId,
    type,
    title,
    message,
    data: data || {},
    priority,
    createdAt: new Date().toISOString()
  };
}

// 큐 워커 함수 (별도로 배포)
export async function queueConsumer(batch, env, ctx) {
  for (const message of batch.messages) {
    try {
      const { notificationId, type, userId, data } = message.body;
      
      // 알림 전송 로직 (이메일, 푸시, SMS 등)
      await sendNotification(env, type, userId, data);
      
      // 메시지 처리 완료
      message.ack();
      
    } catch (error) {
      console.error('Queue Consumer Error:', error);
      // 실패한 메시지는 재시도
      message.retry();
    }
  }
}

async function sendNotification(env, type, userId, data) {
  // 실제 알림 전송 로직
  // 여기서는 로그만 남기고, 실제로는 이메일 서비스나 푸시 서비스를 사용
  
  console.log(`Sending notification to user ${userId}:`, {
    type,
    data,
    timestamp: new Date().toISOString()
  });
  
  // 알림 전송 상태 업데이트
  await env.DB.prepare(`
    UPDATE notifications 
    SET sent_at = datetime('now'), status = 'sent'
    WHERE id = ?
  `).bind(data.id).run();
}
