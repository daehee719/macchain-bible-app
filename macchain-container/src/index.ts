/**
 * MacChain Spring Boot Container Worker
 * This worker acts as a proxy to the Spring Boot container
 */

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    try {
      // Get the container instance
      const container = env.MACCHAIN_BACKEND;
      
      if (!container) {
        return new Response(JSON.stringify({
          error: 'Container not available',
          message: 'Spring Boot container is not running'
        }), {
          status: 503,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }

      // Forward the request to the Spring Boot container
      const containerUrl = new URL(request.url);
      containerUrl.hostname = container.hostname;
      containerUrl.port = container.port || '8080';

      const containerRequest = new Request(containerUrl.toString(), {
        method: request.method,
        headers: request.headers,
        body: request.body,
      });

      const response = await fetch(containerRequest);
      
      // Add CORS headers to the response
      const responseHeaders = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        responseHeaders.set(key, value);
      });

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });

    } catch (error) {
      console.error('Container request failed:', error);
      
      return new Response(JSON.stringify({
        error: 'Internal Server Error',
        message: 'Failed to connect to Spring Boot container',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  },
};

interface Env {
  MACCHAIN_BACKEND: {
    hostname: string;
    port?: string;
  };
  DB: D1Database;
}