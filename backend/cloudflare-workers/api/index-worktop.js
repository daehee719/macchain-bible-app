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
import { getDiscussions, getDiscussion, createDiscussion, updateDiscussion, deleteDiscussion, getCategories } from './discussions-worktop.js';
import { getComments, createComment, updateComment, deleteComment } from './comments-worktop.js';
import { toggleDiscussionLike, toggleCommentLike, toggleBookmark, getMyBookmarks } from './discussion-likes-worktop.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('Router');

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

// Discussion Routes
API.add('GET', '/api/discussions', async (request, response) => {
  addCORS(response, request);
  const env = request.env || globalThis.env;
  await getDiscussions(request, response, env);
});

API.add('GET', '/api/discussions/categories', async (request, response) => {
  addCORS(response, request);
  const env = request.env || globalThis.env;
  await getCategories(request, response, env);
});

API.add('POST', '/api/discussions', async (request, response) => {
  addCORS(response, request);
  const env = request.env || globalThis.env;
  await createDiscussion(request, response, env);
});

API.add('GET', '/api/discussions/:id', async (request, response) => {
  addCORS(response, request);
  const env = request.env || globalThis.env;
  await getDiscussion(request, response, env);
});

API.add('PUT', '/api/discussions/:id', async (request, response) => {
  addCORS(response, request);
  const env = request.env || globalThis.env;
  await updateDiscussion(request, response, env);
});

API.add('DELETE', '/api/discussions/:id', async (request, response) => {
  addCORS(response, request);
  const env = request.env || globalThis.env;
  await deleteDiscussion(request, response, env);
});

// Comment Routes
API.add('GET', '/api/discussions/:discussionId/comments', async (request, response) => {
  addCORS(response, request);
  const env = request.env || globalThis.env;
  await getComments(request, response, env);
});

API.add('POST', '/api/discussions/:discussionId/comments', async (request, response) => {
  addCORS(response, request);
  const env = request.env || globalThis.env;
  await createComment(request, response, env);
});

API.add('PUT', '/api/comments/:id', async (request, response) => {
  addCORS(response, request);
  const env = request.env || globalThis.env;
  await updateComment(request, response, env);
});

API.add('DELETE', '/api/comments/:id', async (request, response) => {
  addCORS(response, request);
  const env = request.env || globalThis.env;
  await deleteComment(request, response, env);
});

// Like Routes
API.add('POST', '/api/discussions/:id/like', async (request, response) => {
  addCORS(response, request);
  const env = request.env || globalThis.env;
  await toggleDiscussionLike(request, response, env);
});

API.add('DELETE', '/api/discussions/:id/like', async (request, response) => {
  addCORS(response, request);
  const env = request.env || globalThis.env;
  await toggleDiscussionLike(request, response, env);
});

API.add('POST', '/api/comments/:id/like', async (request, response) => {
  addCORS(response, request);
  const env = request.env || globalThis.env;
  await toggleCommentLike(request, response, env);
});

API.add('DELETE', '/api/comments/:id/like', async (request, response) => {
  addCORS(response, request);
  const env = request.env || globalThis.env;
  await toggleCommentLike(request, response, env);
});

// Bookmark Routes
API.add('POST', '/api/discussions/:id/bookmark', async (request, response) => {
  addCORS(response, request);
  const env = request.env || globalThis.env;
  await toggleBookmark(request, response, env);
});

API.add('DELETE', '/api/discussions/:id/bookmark', async (request, response) => {
  addCORS(response, request);
  const env = request.env || globalThis.env;
  await toggleBookmark(request, response, env);
});

API.add('GET', '/api/users/me/bookmarks', async (request, response) => {
  addCORS(response, request);
  const env = request.env || globalThis.env;
  await getMyBookmarks(request, response, env);
});

// Error Handler
API.onerror = (request, response, error) => {
  logger.errorWithContext('API Error', error, {
    method: request.method,
    path: request.url.pathname,
  });
  addCORS(response, request);
  response.send(500, {
    success: false,
    error: 'INTERNAL_SERVER_ERROR',
    message: error.message,
    timestamp: new Date().toISOString(),
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
      '/api/discussions',
      '/api/discussions/categories',
      '/api/discussions/:id',
      '/api/discussions/:id/comments',
      '/api/comments/:id',
      '/api/discussions/:id/like',
      '/api/comments/:id/like',
      '/api/discussions/:id/bookmark',
      '/api/users/me/bookmarks',
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

