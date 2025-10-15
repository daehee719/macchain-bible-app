export default {
  async fetch(request, env, ctx) {
    return new Response(JSON.stringify({
      message: 'Test API',
      timestamp: new Date().toISOString(),
      url: request.url
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
