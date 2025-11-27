/**
 * Health Check API (Worktop 버전)
 */

export function handleHealth(request, response, env) {
  response.send(200, {
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: env?.ENVIRONMENT || 'production',
  });
}

