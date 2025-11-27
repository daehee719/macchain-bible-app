/**
 * AI 성경 분석 API (Worktop 버전)
 * Cloudflare AI 모델을 활용한 성경 구절 분석
 */

import { successResponse, errorResponse, validationErrorResponse, serverErrorResponse } from '../utils/response.js';
import { validate } from '../utils/validator.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('AIAnalysis');

export async function handleAIAnalysis(request, response, env) {
  try {
    logger.request(request);

    const body = await request.body.json();
    
    // 데이터 검증
    const validation = validate(body)
      .required('passage', '성경 구절이 필요합니다.')
      .minLength('passage', 1, '성경 구절을 입력해주세요.')
      .validate();

    if (!validation.isValid) {
      logger.warn('AI analysis validation failed', { errors: validation.getErrors() });
      return validationErrorResponse(response, validation.getFirstError().message);
    }

    const { passage, analysisType = 'general' } = body;

    // AI 모델 선택
    let modelId;
    let prompt;
    
    switch (analysisType) {
      case 'theological':
        modelId = '@cf/meta/llama-3-8b-instruct';
        prompt = `다음 성경 구절을 신학적으로 분석해주세요. 주요 교리, 역사적 배경, 현대적 적용을 포함해주세요:\n\n"${passage}"`;
        break;
      case 'devotional':
        modelId = '@cf/meta/llama-3-8b-instruct';
        prompt = `다음 성경 구절을 묵상용으로 해석해주세요. 개인적 적용과 기도 제안을 포함해주세요:\n\n"${passage}"`;
        break;
      case 'historical':
        modelId = '@cf/meta/llama-3-8b-instruct';
        prompt = `다음 성경 구절의 역사적 배경과 문화적 맥락을 설명해주세요:\n\n"${passage}"`;
        break;
      default:
        modelId = '@cf/meta/llama-3-8b-instruct';
        prompt = `다음 성경 구절을 종합적으로 분석해주세요. 주요 메시지와 현대적 적용을 포함해주세요:\n\n"${passage}"`;
    }

    // Cloudflare AI 모델 호출
    const aiResponse = await env.AI.run(modelId, {
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    const analysis = aiResponse.response || aiResponse;

    logger.info('AI analysis completed', { analysisType, passageLength: passage.length });
    logger.response(200);

    return successResponse(response, {
      passage,
      analysisType,
      analysis,
    });
  } catch (error) {
    logger.errorWithContext('AI Analysis error', error, { path: request.url.pathname });
    return serverErrorResponse(response, 'AI 분석 중 오류가 발생했습니다.');
  }
}

