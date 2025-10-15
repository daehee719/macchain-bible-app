export async function handleHealth(request, env) {
  if (request.method === 'GET') {
    return new Response(JSON.stringify({ 
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: env.ENVIRONMENT || 'production'
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  return new Response('Method Not Allowed', { status: 405 });
}