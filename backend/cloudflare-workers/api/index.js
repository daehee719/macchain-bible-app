/**
 * MacChain Cloudflare Workers API
 * Spring Boot 백엔드를 Cloudflare Workers로 마이그레이션
 */

import { handleUsers } from './users.js';
import { handleReadingPlan } from './reading-plan.js';
import { handleAuth } from './auth.js';
import { handleStatistics } from './statistics.js';
import { handleHealth } from './health.js';
import { handleConsent } from './consent.js';
import { handleAIAnalysis } from './ai-analysis.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS 헤더 설정
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // OPTIONS 요청 처리 (CORS preflight)
    if (method === 'OPTIONS') {
      return new Response(null, { 
        status: 200, 
        headers: corsHeaders 
      });
    }

    try {
      let response;

      // 라우팅
      if (path === '/' || path === '/api') {
        response = new Response(JSON.stringify({ 
          message: 'MacChain API Server',
          version: '1.0.0',
          status: 'running',
          endpoints: [
            '/api/health',
            '/api/auth/login',
            '/api/auth/register',
            '/api/users/profile',
            '/api/mccheyne/today',
            '/api/mccheyne/{date}/progress',
            '/api/statistics/user',
            '/api/ai/analyze',
            '/api/consent'
          ]
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      } else if (path.startsWith('/api/health')) {
        response = await handleHealth(request, env);
      } else if (path.startsWith('/api/auth')) {
        response = await handleAuth(request, env);
      } else if (path.startsWith('/api/users')) {
        response = await handleUsers(request, env);
      } else if (path.startsWith('/api/mccheyne')) {
        response = await handleReadingPlan(request, env);
      } else if (path.startsWith('/api/statistics')) {
        response = await handleStatistics(request, env);
      } else if (path.startsWith('/api/consent')) {
        response = await handleConsent(request, env);
      } else if (path.startsWith('/api/ai')) {
        response = await handleAIAnalysis(request, env, ctx);
      } else {
        response = new Response(JSON.stringify({ 
          error: 'Not Found',
          message: 'API endpoint not found',
          availableEndpoints: [
            '/api/health',
            '/api/auth/login',
            '/api/auth/register',
            '/api/users/profile',
            '/api/mccheyne/today',
            '/api/mccheyne/{date}/progress',
            '/api/statistics/user',
            '/api/ai/analyze',
            '/api/consent'
          ]
        }), { 
          status: 404,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // CORS 헤더 추가
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      return response;

    } catch (error) {
      console.error('API Error:', error);
      return new Response(JSON.stringify({ 
        error: 'Internal Server Error',
        message: error.message 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  },
};
