/**
 * Health Check API (Worktop 버전)
 */

import { successResponse } from '../utils/response.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('Health');

export function handleHealth(request, response, env) {
  logger.request(request);
  logger.response(200);
  
  return successResponse(response, {
    status: 'OK',
    environment: env?.ENVIRONMENT || 'production',
  });
}

