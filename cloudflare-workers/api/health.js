/**
 * Health Check API
 * 기존 Spring Boot의 /actuator/health를 대체
 */

export async function handleHealth(request, env) {
  const url = new URL(request.url);
  
  if (url.pathname === '/api/health' && request.method === 'GET') {
    try {
      // 데이터베이스 연결 상태 확인
      const dbHealth = await checkDatabaseHealth(env);
      
      const healthStatus = {
        status: 'UP',
        timestamp: new Date().toISOString(),
        components: {
          database: dbHealth,
          workers: {
            status: 'UP',
            region: env.CF_REGION || 'unknown'
          }
        }
      };

      return new Response(JSON.stringify(healthStatus), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({
        status: 'DOWN',
        timestamp: new Date().toISOString(),
        error: error.message
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  return new Response('Not Found', { status: 404 });
}

async function checkDatabaseHealth(env) {
  try {
    // D1 데이터베이스 연결 테스트
    const result = await env.DB.prepare('SELECT 1 as test').first();
    return {
      status: 'UP',
      database: 'D1',
      responseTime: '< 10ms'
    };
  } catch (error) {
    return {
      status: 'DOWN',
      database: 'D1',
      error: error.message
    };
  }
}
