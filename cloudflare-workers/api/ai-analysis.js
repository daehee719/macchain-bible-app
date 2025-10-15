/**
 * AI 성경 분석 API
 * Cloudflare AI 모델을 활용한 성경 구절 분석
 */

export async function handleAIAnalysis(request, env, ctx) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  if (request.method === 'POST') {
    try {
      const { passage, analysisType = 'general' } = await request.json();
      
      if (!passage) {
        return new Response(JSON.stringify({
          success: false,
          error: '성경 구절이 필요합니다.'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

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

      // 분석 결과를 데이터베이스에 저장
      const analysisId = Date.now().toString();
      await env.DB.prepare(`
        INSERT INTO ai_analyses (id, passage, analysis_type, analysis_content, created_at)
        VALUES (?, ?, ?, ?, datetime('now'))
      `).bind(analysisId, passage, analysisType, analysis).run();

      return new Response(JSON.stringify({
        success: true,
        data: {
          id: analysisId,
          passage,
          analysisType,
          analysis,
          timestamp: new Date().toISOString()
        }
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });

    } catch (error) {
      console.error('AI Analysis Error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'AI 분석 중 오류가 발생했습니다.',
        details: error.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }

  if (request.method === 'GET') {
    try {
      const url = new URL(request.url);
      const analysisId = url.searchParams.get('id');
      
      if (analysisId) {
        // 특정 분석 결과 조회
        const result = await env.DB.prepare(`
          SELECT * FROM ai_analyses WHERE id = ?
        `).bind(analysisId).first();
        
        if (!result) {
          return new Response(JSON.stringify({
            success: false,
            error: '분석 결과를 찾을 수 없습니다.'
          }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        return new Response(JSON.stringify({
          success: true,
          data: result
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        // 최근 분석 결과 목록 조회
        const results = await env.DB.prepare(`
          SELECT id, passage, analysis_type, created_at 
          FROM ai_analyses 
          ORDER BY created_at DESC 
          LIMIT 20
        `).all();
        
        return new Response(JSON.stringify({
          success: true,
          data: results.results || []
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } catch (error) {
      console.error('Get Analysis Error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: '분석 결과 조회 중 오류가 발생했습니다.'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  return new Response('Method Not Allowed', { status: 405 });
}
