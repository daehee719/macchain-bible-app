/**
 * MacChain Cloudflare Workers API
 * Worktop 프레임워크를 사용한 리팩토링 버전
 */

import { Router } from 'worktop';
import { handleHealth } from './health-worktop.js';
import { handleLogin, handleRegister, handleVerify } from './auth-worktop.js';
import { getUserProfile, updateUserProfile, getUserProgress, updateUserProgress } from './users-worktop.js';
import { getTodayPlan, getPlanProgress, updatePlanProgress } from './reading-plan-worktop.js';
import { getUserStatistics } from './statistics-worktop.js';
import { handleAIAnalysis } from './ai-analysis-worktop.js';
import { getConsent, updateConsent } from './consent-worktop.js';

const API = new Router();

// CORS 헤더 추가 헬퍼
const addCORS = (response, request) => {
  const origin = request.headers.get('Origin');
  response.headers.set('Access-Control-Allow-Origin', origin || '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400');
  return response;
};

// API 정보
API.add('GET', '/', (request, response) => {
  addCORS(response, request);
  response.send(200, {
    message: 'MacChain API Server',
    version: '1.0.0',
    status: 'running',
    framework: 'Worktop',
    endpoints: [
      '/api/health',
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/verify',
      '/api/users/profile',
      '/api/mccheyne/today',
      '/api/mccheyne/:date/progress',
      '/api/statistics/user',
      '/api/ai/analyze',
      '/api/consent',
    ],
  });
});

API.add('GET', '/api', (request, response) => {
  addCORS(response, request);
  response.send(200, {
    message: 'MacChain API Server',
    version: '1.0.0',
    status: 'running',
    framework: 'Worktop',
    endpoints: [
      '/api/health',
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/verify',
      '/api/users/profile',
      '/api/mccheyne/today',
      '/api/mccheyne/:date/progress',
      '/api/statistics/user',
      '/api/ai/analyze',
      '/api/consent',
    ],
  });
});

// Health Check
API.add('GET', '/api/health', (request, response) => {
  addCORS(response, request);
  const env = request.env || globalThis.env;
  handleHealth(request, response, env);
});

// Auth Routes - Worktop의 핸들러는 (request, response)만 받음
// env는 request 객체에 추가되어 전달됨
API.add('POST', '/api/auth/login', async (request, response) => {
  addCORS(response, request);
  // request 객체에서 env 추출 (Worktop이 자동으로 추가)
  const env = request.env || globalThis.env;
  await handleLogin(request, response, env);
});

API.add('POST', '/api/auth/register', async (request, response) => {
  addCORS(response, request);
  const env = request.env || globalThis.env;
  await handleRegister(request, response, env);
});

API.add('POST', '/api/auth/verify', async (request, response) => {
  addCORS(response, request);
  const env = request.env || globalThis.env;
  await handleVerify(request, response, env);
});

// User Routes
API.add('GET', '/api/users/profile', async (request, response) => {
  addCORS(response, request);
  const env = request.env || globalThis.env;
  await getUserProfile(request, response, env);
});

API.add('PUT', '/api/users/profile', async (request, response) => {
  addCORS(response, request);
  const env = request.env || globalThis.env;
  await updateUserProfile(request, response, env);
});

API.add('GET', '/api/users/:userId/progress', async (request, response) => {
  addCORS(response, request);
  const env = request.env || globalThis.env;
  await getUserProgress(request, response, env);
});

API.add('PUT', '/api/users/:userId/progress', async (request, response) => {
  addCORS(response, request);
  const env = request.env || globalThis.env;
  await updateUserProgress(request, response, env);
});

// Reading Plan Routes
API.add('GET', '/api/mccheyne/today', async (request, response) => {
  addCORS(response, request);
  const env = request.env || globalThis.env;
  await getTodayPlan(request, response, env);
});

API.add('GET', '/api/mccheyne/:date/progress', async (request, response) => {
  addCORS(response, request);
  const env = request.env || globalThis.env;
  await getPlanProgress(request, response, env);
});

API.add('PUT', '/api/mccheyne/:date/progress', async (request, response) => {
  addCORS(response, request);
  const env = request.env || globalThis.env;
  await updatePlanProgress(request, response, env);
});

API.add('POST', '/api/mccheyne/:date/progress', async (request, response) => {
  addCORS(response, request);
  const env = request.env || globalThis.env;
  await updatePlanProgress(request, response, env);
});

// Statistics Routes
API.add('GET', '/api/statistics/user', async (request, response) => {
  addCORS(response, request);
  const env = request.env || globalThis.env;
  await getUserStatistics(request, response, env);
});

// AI Analysis Routes
API.add('POST', '/api/ai/analyze', async (request, response) => {
  addCORS(response, request);
  const env = request.env || globalThis.env;
  await handleAIAnalysis(request, response, env);
});

// Consent Routes
API.add('GET', '/api/consent', async (request, response) => {
  addCORS(response, request);
  const env = request.env || globalThis.env;
  await getConsent(request, response, env);
});

API.add('PUT', '/api/consent', async (request, response) => {
  addCORS(response, request);
  const env = request.env || globalThis.env;
  await updateConsent(request, response, env);
});

API.add('POST', '/api/consent', async (request, response) => {
  addCORS(response, request);
  const env = request.env || globalThis.env;
  await updateConsent(request, response, env);
});

// Error Handler
API.onerror = (request, response, error) => {
  console.error('API Error:', error);
  addCORS(response, request);
  response.send(500, {
    error: 'Internal Server Error',
    message: error.message,
  });
};

// 404 Not Found
API.notfound = (request, response) => {
  addCORS(response, request);
  response.send(404, {
    error: 'Not Found',
    message: 'API endpoint not found',
    path: request.url.pathname,
    availableEndpoints: [
      '/api/health',
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/verify',
      '/api/users/profile',
      '/api/mccheyne/today',
      '/api/mccheyne/:date/progress',
      '/api/statistics/user',
      '/api/ai/analyze',
      '/api/consent',
    ],
  });
};

// Cloudflare Workers 진입점으로 변환
// Worktop Router는 FetchEvent를 받지만, Cloudflare Workers는 fetch를 사용
// 따라서 래퍼가 필요함
export default {
  async fetch(request, env, ctx) {
    // globalThis에 env 저장 (Worktop 핸들러에서 접근 가능하도록)
    globalThis.env = env;
    
    // FetchEvent를 시뮬레이션
    const event = {
      request,
      waitUntil: ctx.waitUntil.bind(ctx),
    };
    
    return API.run(event);
  },
};

